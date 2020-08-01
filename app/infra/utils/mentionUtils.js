import {sortedIndexBy} from 'lodash';
// import { Logger } from '/infra/reporting/index';
import {getFlipFlopWebLink} from './linkingUtils';
import {postTypes} from '../../vars/enums';
import {enrichTextWithLinks} from './stringUtils';

const TYPES = 'user|page|event|group|category|post|list';
const GUID = '[0-9a-fA-F]{24}';

const getUpdatedMentionsListAfterTextChange = ({
  oldText,
  newText,
  selectionBeforeChange,
  selectionAfterChange,
  mentions,
}) => {
  const newMentions = [];
  let removedMentionLength = 0;
  let changedText = newText;

  mentions.forEach((mention) => {
    if (
      !selectionBeforeChange ||
      !selectionAfterChange ||
      !newText ||
      !oldText
    ) {
      Logger.error({
        err:
          'getUpdatedMentionsListAfterTextChange was invoked with null params',
        params: {
          newText,
          selectionBeforeChange,
          selectionAfterChange,
          mentions,
          oldText,
        },
      });
      return;
    }

    const charCountDelta = newText.length - oldText.length;
    const calculatedSelectionBeforeChangeEnd =
      selectionAfterChange.end - charCountDelta;
    const isTextLengthBeforeMentionChanged =
      mention.startIndex >= calculatedSelectionBeforeChangeEnd;
    const isMentionTextChanged =
      selectionAfterChange.start < mention.endIndex ||
      calculatedSelectionBeforeChangeEnd < mention.endIndex;
    const isCharsRemoved =
      selectionAfterChange.start <= calculatedSelectionBeforeChangeEnd;

    if (removedMentionLength > 0) {
      const mentionNewStartIndex = mention.startIndex - removedMentionLength;
      const mentionNewEndIndex = mention.endIndex - removedMentionLength;
      newMentions.push({
        entity: mention.entity,
        startIndex: mentionNewStartIndex,
        endIndex: mentionNewEndIndex,
      });
    } else if (isTextLengthBeforeMentionChanged) {
      const mentionNewStartIndex = mention.startIndex + charCountDelta;
      const mentionNewEndIndex = mention.endIndex + charCountDelta;
      newMentions.push({
        entity: mention.entity,
        startIndex: mentionNewStartIndex,
        endIndex: mentionNewEndIndex,
      });
    } else if (isMentionTextChanged) {
      if (isCharsRemoved) {
        changedText =
          oldText.slice(0, mention.startIndex) +
          oldText.slice(mention.endIndex);
        removedMentionLength = mention.endIndex - mention.startIndex;
      }
    } else {
      newMentions.push(mention);
    }
  });

  return {newMentions, changedText};
};

const getUpdatedMentionListAfterMentionAdd = ({
  mentions,
  text,
  cursorPosition,
  isWithBrackets,
}) => {
  const newMention = mentions[mentions.length - 1];
  const newMentionsList = [];
  let changedText;

  if (newMention.endIndex) {
    // in case the mention has been added already
    return {newMentionsList: mentions, changedText: text};
  }

  const mentionText = isWithBrackets
    ? `[${newMention.entity.name}]`
    : newMention.entity.name;
  if (newMention.isReplyMention) {
    newMentionsList.push({
      startIndex: 1,
      endIndex: mentionText.length + 1,
      entity: newMention.entity,
    });

    changedText = ` ${mentionText} `;
  } else {
    changedText = text.slice(0, cursorPosition);
    const unchangedText = text.slice(cursorPosition);

    let startIndex = changedText.lastIndexOf('@');
    let endIndex = startIndex + mentionText.length;

    const mentionNameWithSpace = `${mentionText} `;
    changedText =
      changedText.replace(/@([^@]+)$/, mentionNameWithSpace) + unchangedText;

    // A hack to fix a bug the makes all new chars bold if the first char is bold
    // So we prefix the string with a space - terrible I know. So maybe in the future
    // we will find a proper fix to it (TODO)
    if (startIndex === 0) {
      changedText = ` ${changedText}`;
      startIndex += 1;
      endIndex += 1;
    }

    newMention.startIndex = startIndex;
    newMention.endIndex = endIndex;

    // Update the rest of the mentions list
    const extraCharsAdded =
      mentionNameWithSpace.length - (cursorPosition - startIndex);
    mentions.slice(0, -1).forEach((mention) => {
      if (mention.startIndex > startIndex) {
        newMentionsList.push({
          entity: mention.entity,
          startIndex: mention.startIndex + extraCharsAdded,
          endIndex: mention.endIndex + extraCharsAdded,
        });
      } else {
        newMentionsList.push(mention);
      }
    });

    newMentionsList.splice(
      sortedIndexBy(newMentionsList, newMention, 'startIndex'),
      0,
      newMention,
    );
  }

  return {newMentionsList, changedText};
};

const getTrimmedTextWithMentionEntities = (text, mentions) => {
  const spacesOnLeftMatch = text.match(/(^\s+)/, '');
  const spacesDelta = spacesOnLeftMatch ? spacesOnLeftMatch[0].length : 0;
  let trimmedTextWithMentions = text.trim();

  // We want to make the changes from the end, so we won't need to deal with index changes
  mentions.reverse().forEach((mention) => {
    const mentionText = `@${mention.entity.entityType}:${
      mention.entity.objectID || mention.entity.id
    }`;
    trimmedTextWithMentions =
      trimmedTextWithMentions.slice(0, mention.startIndex - spacesDelta) +
      mentionText +
      trimmedTextWithMentions.slice(mention.endIndex - spacesDelta);
  });

  return trimmedTextWithMentions;
};

const getTrimmedTextWithMentionLinks = (text, mentions) => {
  const spacesOnLeftMatch = text.match(/(^\s+)/, '');
  const spacesDelta = spacesOnLeftMatch ? spacesOnLeftMatch[0].length : 0;
  let trimmedTextWithMentions = text.trim();

  // We want to make the changes from the end, so we won't need to deal with index changes
  mentions.reverse().forEach((mention) => {
    const {entityType, postType, objectID: entityId} = mention.entity;
    const href = getFlipFlopWebLink({
      entityType: postType === postTypes.GUIDE ? postType : entityType,
      entityId,
    });
    const mentionText = `<b><a href=${href}>${mention.entity.name}</a></b>`;
    trimmedTextWithMentions =
      trimmedTextWithMentions.slice(0, mention.startIndex - spacesDelta) +
      mentionText +
      trimmedTextWithMentions.slice(mention.endIndex - spacesDelta);
  });

  return trimmedTextWithMentions;
};

const enrichText = ({text, mentions, withoutLinks = false}) => {
  let enrichedText = text || '';
  if (mentions && mentions.length) {
    const mentionsRgx = new RegExp(`(@(${TYPES}){1}:(${GUID}))`);

    let mentionIndex = enrichedText.search(mentionsRgx);
    while (mentionIndex > -1) {
      enrichedText = enrichedText.replace(mentionsRgx, (match, p1, p2, p3) => {
        const mention = mentions.find(
          (mention) =>
            mention.entity.id === p3 || mention.entity.objectID === p3,
        );
        if (withoutLinks) {
          return `${mention.entity.name}`;
        } else {
          return `<b><a href=${match.slice(1)}>${mention.entity.name}</a></b>`;
        }
      });

      mentionIndex = enrichedText.search(mentionsRgx);
    }
  }

  enrichedText = enrichTextWithLinks(enrichedText);
  return withoutLinks || enrichedText === text
    ? enrichedText
    : `<p>${enrichedText}</p>`;
};

const removeMentions = ({text}) => {
  const mentionsRgx = new RegExp(`(@(${TYPES}){1}:(${GUID}))`, 'g');
  return text ? text.replace(mentionsRgx, '') : text;
};

const enrichInputTextWithMentionsList = ({text, mentions, isWithBrackets}) => {
  if (!mentions) return {text, mentionsList: []};

  const mentionsRgx = new RegExp(`(@(${TYPES}){1}:(${GUID}))`);

  let enrichedText = text || '';
  const mentionsList = [];
  let mentionIndex = enrichedText.search(mentionsRgx);

  while (mentionIndex > -1) {
    let mentionText;
    let mention;
    enrichedText = enrichedText.replace(mentionsRgx, (match, p1, p2, p3) => {
      mention = mentions.find(
        (mention) => mention.entity.id === p3 || mention.entity.objectID === p3,
      );
      mentionText = mention ? mention.entity.name : 'undefined';
      mentionText = isWithBrackets ? `[${mentionText}]` : mentionText;
      return mentionText;
    });

    if (mention) {
      const newMention = {
        startIndex: mentionIndex,
        endIndex: mentionIndex + mentionText.length,
        entity: {
          ...mention.entity,
          entityType: mention.entity.entityType || mention.entityType,
        },
      };
      mentionsList.splice(
        sortedIndexBy(mentionsList, newMention, 'startIndex'),
        0,
        newMention,
      );
    } else {
      //   Logger.error(`mention entity was not found in ${enrichedText} on index ${mentionIndex}`);
    }

    mentionIndex = enrichedText.search(mentionsRgx);
  }

  return {text: enrichedText, mentionsList};
};

const isCursorOnMention = (selection, mentions) =>
  mentions.some(
    (mention) =>
      (selection.start >= mention.startIndex ||
        selection.end >= mention.startIndex) &&
      (selection.start <= mention.endIndex ||
        selection.start.end <= mention.endIndex),
  );

const getQuillMention = ({id, name, entityType, index = 0}) => {
  const quillMention = `<span class="mention" data-index="${index}" data-denotation-char="@" data-id="${id}" data-value="${name}" data-entity-type="${entityType}">
        <span contenteditable="false">
          <span class="ql-mention-denotation-char">@</span>
          ${name}
        </span>
      </span>`;

  return quillMention;
};

const enrichTextWithQuillMentions = ({text, mentions = []}) => {
  let newText = text;
  mentions.forEach((mention, index) => {
    const {entity, entityType} = mention;
    const {id, name} = entity;
    const quillMention = getQuillMention({id, name, entityType, index});
    const mentionRegex = new RegExp(`@${entityType}:${id}`, 'gi');

    newText = newText.replace(mentionRegex, quillMention);
  });

  return newText;
};

export {
  getUpdatedMentionsListAfterTextChange,
  getUpdatedMentionListAfterMentionAdd,
  getTrimmedTextWithMentionEntities,
  getTrimmedTextWithMentionLinks,
  enrichText,
  enrichInputTextWithMentionsList,
  isCursorOnMention,
  removeMentions,
  enrichTextWithQuillMentions,
};
