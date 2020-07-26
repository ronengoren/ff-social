import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {StyleSheet} from 'react-native';
import I18n from '../../../infra/localization';
import {navigationService} from '../../../infra/navigation';
// import { analytics } from '/infra/reporting';
import {Text} from '../../../components/basicComponents';
import {flipFlopColors} from '../../../vars';
// import { openActionSheet } from '/redux/general/actions';
// import { storyActionSheetDefinition, storyDeleteActionSheetDefinition } from '/common/actionsheets/storyActionSheetDefinition';
import {
  storyActions,
  storyCreateScreen,
  screenNamesAliases,
  screenNames,
} from '../../../vars/enums';
import {isAppAdmin, unescape} from '../../../infra/utils';
// import { deactivateStory, deleteStory } from '/redux/stories/actions';
import {isHebrewOrArabic, sanitizeText} from '../../../infra/utils/stringUtils';
import StorySkeleton from './StorySkeleton';
import {getStoryEditorParams} from './utils';

const styles = StyleSheet.create({
  hebrewTextMargin: {
    top: 2,
  },
  rtlText: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});

const handlePress = ({actionType, screenName, screenParams}) => () => {
  //   const screen = actionType === storyActions.NAVIGATE ? screenNamesAliases[screenName] || screenName : storyCreateScreen[screenName.toLowerCase()];
  //   analytics.actionEvents
  //     .clickOnStoryAction({
  //       actionType,
  //       screenName,
  //       entityId: screenParams.entityId
  //     })
  //     .dispatch();
  //   navigationService.navigate(screen, screenParams);
};

function Story({data, isAdmin, openActionSheet, deactivateStory, deleteStory}) {
  const isUserRTL = I18n.isRtl();

  const {
    text,
    preText,
    media,
    actionType,
    screenName,
    screenParams = {},
    id: storyId,
  } = data || {};
  const {url: uri} = media || {};

  const sanitizedPreText = unescape(sanitizeText({text: preText}));
  const sanitizedText = unescape(sanitizeText({text}));
  //   const onMenuClick = () => {
  //     const actionSheet = storyActionSheetDefinition({
  //       onDeactivate: () => deactivateStory({ storyId }),
  //       onDelete: () => openActionSheet(storyDeleteActionSheetDefinition({ onDelete: () => deleteStory({ storyId }) })),
  //       onEdit: () => navigationService.navigate(screenNames.PostEditor, getStoryEditorParams(data))
  //     });
  //     openActionSheet(actionSheet);
  //   };

  return (
    <StorySkeleton
      imageSource={uri}
      isAdmin={isAdmin}
      preTextComponent={
        <Text
          size={14}
          color={flipFlopColors.white}
          style={isUserRTL && styles.rtlText}>
          {sanitizedPreText}
        </Text>
      }
      textComponent={
        <Text
          size={16}
          color={flipFlopColors.white}
          bold
          numberOfLines={3}
          style={[
            isUserRTL && styles.rtlText,
            isHebrewOrArabic(text) && styles.hebrewTextMargin,
          ]}>
          {sanitizedText}
        </Text>
      }
      onMenuClick={onMenuClick}
      onPress={handlePress({actionType, screenName, screenParams})}
    />
  );
}

Story.propTypes = {
  //   openActionSheet: PropTypes.func.isRequired,
  //   deactivateStory: PropTypes.func.isRequired,
  //   deleteStory: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    id: PropTypes.string,
    text: PropTypes.string,
    preText: PropTypes.string,
    media: PropTypes.object,
    actionType: PropTypes.string,
    screenName: PropTypes.string,
    screenParams: PropTypes.object,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  isAdmin: isAppAdmin(state.auth.user),
});

const mapDispatchToProps = {
  //   openActionSheet,
  //   deactivateStory,
  //   deleteStory
};

export default connect(mapStateToProps, mapDispatchToProps)(Story);
