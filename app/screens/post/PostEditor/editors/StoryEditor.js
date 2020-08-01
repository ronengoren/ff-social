import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {StyleSheet, Keyboard, LayoutAnimation} from 'react-native';
import {
  Text,
  TextArea,
  View,
  TextInput,
  SwitchWithText,
  ScrollView,
} from '../../../../components/basicComponents';
import I18n from '../../../../infra/localization';
import {
  flipFlopColors,
  commonStyles,
  POST_EDITOR_FIELD_HEIGHT,
  postEditorCommonStyles,
} from '../../../../vars';
import {
  editModes,
  uploadStateTypes,
  screenNamesByEntityType,
  entityTypes,
  mediaTypes,
} from '../../../../vars/enums';
import {
  get,
  unescape,
  arrayToStringByKey,
  capitalize,
} from '../../../../infra/utils';
// import { createStory, editStory } from '/redux/stories/actions';
// import { Logger } from '/infra/reporting';
// import PreviewSection from '../../../../screens/post/PostEditor/commons/PreviewSection';
// import {editorMediaScheme} from '../../../../screens/post/PostEditor/editors/schemas';
// import {ErrorModal} from '../../../../components/modals';
// import {navigationService} from '../../../../infra/navigation';
// import {isRTL, sanitizeText} from '../../../../infra/utils/stringUtils';
// import {nationalityPostIn} from '../commons/postInItems';

const TEXT_AREA_LINE_HEIGHT = 30;
const MAX_TITLE_CHARS = 45;
const MAX_PRE_TEXT_CHARS = 15;

const styles = StyleSheet.create({
  scrollViewContentContainer: {
    flexGrow: 1,
  },
  textArea: {
    flex: 1,
    paddingTop: 0,
    padding: 0,
    paddingLeft: 0,
    paddingRight: 50,
    fontSize: 20,
    lineHeight: TEXT_AREA_LINE_HEIGHT,
  },
  textAreaRtl: {
    paddingLeft: 50,
    paddingRight: 0,
  },
  maxCharsIndicator: {
    position: 'absolute',
    top: 16,
  },
  rankContainer: {
    paddingTop: 15,
  },
  rankPlaceholder: {
    position: 'absolute',
    start: 0,
    top: 10,
  },
  maxCharsIndicatorBottom: {
    position: 'absolute',
    bottom: 16,
  },
  rtlMaxCharsIndicatorPosition: {
    start: 0,
  },
  maxCharsIndicatorPosition: {
    end: 0,
  },
  rtlStyle: {
    textAlign: 'right',
  },
});

const SNAP_TO_INTERVAL = 200;
class StoryEditor extends Component {
  render() {
    const {
      attachedMedia,
      form,
      onAddMedia,
      onRemoveMedia,
      header,
      isShowCountryPicker,
      CountryPickerComponent,
      updateForm,
      isUploading,
      uploadIds,
      uploads,
      postData,
      publishIn,
    } = this.props;
    return (
      <View style={commonStyles.flex1}>
        <Text>StoryEditor</Text>
      </View>
    );
  }
}

export default StoryEditor;
