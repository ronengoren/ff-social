import I18n from '../../../infra/localization';
import {
  storyActions,
  storyCreateScreen,
  screenNamesAliases,
  screenNames,
  editModes,
  entityTypes,
} from '../../../vars/enums';
import {navigationService} from '../../../infra/navigation';
import {compact, get, invert, isEmpty} from '../../../infra/utils';

export const getStoryEntityTypeByAction = (story) => {
  const {actionType, screenName} = story;
  const screenGroupNamesByActionType = {
    [storyActions.NAVIGATE]: invert(screenNamesAliases),
    [storyActions.CREATE]: invert(storyCreateScreen),
  };
  const storyEntityType = get(
    screenGroupNamesByActionType,
    `${actionType}.${screenName}`,
  );
  return storyEntityType || screenName;
};

const isGalleryEmpty = (data, path) =>
  ['media', 'mediaGallery'].includes(path) &&
  isEmpty(get(data, `${path}.url`)) &&
  isEmpty(get(data, `${path}.0.url`));

export const getFromDataPayloadOrSharedEntity = (data, path) => {
  const fromData = get(data, path);
  if (!isEmpty(fromData) && !isGalleryEmpty(data, path)) {
    return fromData;
  }

  const fromPayloadData = get(data, `payload.${path}`);

  if (!isEmpty(fromPayloadData) && !isGalleryEmpty(data.payload, path)) {
    return fromPayloadData;
  }

  const fromSharedEntity =
    get(data, `sharedEntity.entity.post`) || get(data, `sharedEntity.entity`);
  if (!isEmpty(fromSharedEntity)) {
    return (
      get(fromSharedEntity, path) || get(fromSharedEntity, `payload.${path}`)
    );
  }

  return null;
};

export const getStoryEditorParams = (data) => {
  const {isCreation, storyEntityType, id: storyId} = data;
  const contextCountryCode =
    getFromDataPayloadOrSharedEntity(data, 'contextCountryCode') || [];
  const nationalityGroupId = getFromDataPayloadOrSharedEntity(
    data,
    'nationalityGroupId',
  );
  const communityId = getFromDataPayloadOrSharedEntity(data, 'communityId');
  const title =
    getFromDataPayloadOrSharedEntity(data, 'preText') ||
    getFromDataPayloadOrSharedEntity(data, 'title') ||
    getFromDataPayloadOrSharedEntity(data, 'name');
  const text =
    getFromDataPayloadOrSharedEntity(data, 'text') ||
    getFromDataPayloadOrSharedEntity(data, 'about') ||
    getFromDataPayloadOrSharedEntity(data, 'description');
  const media = getFromDataPayloadOrSharedEntity(data, 'media');
  const linkImage = getFromDataPayloadOrSharedEntity(data, 'link.info.image');

  const mediaGalleryArray = getFromDataPayloadOrSharedEntity(
    data,
    'mediaGallery',
  );
  const rank = getFromDataPayloadOrSharedEntity(data, 'rank');
  let mediaGallery = mediaGalleryArray || compact([media]);
  if (storyEntityType === entityTypes.USER) {
    mediaGallery = mediaGallery.map((media) => ({
      ...media,
      url: media.profile,
    }));
  }

  if (isEmpty(mediaGallery) && !isEmpty(linkImage)) {
    mediaGallery = [{url: linkImage}];
  }

  const payload = {
    title,
    text,
    mediaGallery,
    rank,
  };

  const postData = {
    isStory: true,
    id: storyId,
    contextCountryCode,
    storyEntityType: storyEntityType || getStoryEntityTypeByAction(data),
    communityId,
    nationalityGroupId,
    payload,
  };

  return {
    mode: isCreation ? editModes.CREATE : editModes.EDIT,
    postData,
    type: storyEntityType,
    isPickerHidden: true,
  };
};

export const getAddStoryDefinition = ({data, entityType}) => ({
  id: 'story',
  text: I18n.t('stories.action_sheets.add'),
  awesomeIconName: 'stars',
  shouldClose: true,
  action: () =>
    navigationService.navigate(
      screenNames.PostEditor,
      getStoryEditorParams({
        ...data,
        storyEntityType: entityType,
        isCreation: true,
      }),
    ),
});
