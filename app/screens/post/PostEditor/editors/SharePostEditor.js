import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import I18n from '../../../../infra/localization';
import {View, TextArea} from '../../../../components/basicComponents';
import {commonStyles} from '../../../../vars';
import {editModes} from '../../../../vars/enums';
import SharedPostPreview from '../commons/SharedPostPreview';

const styles = StyleSheet.create({
  textArea: {
    minHeight: 80,
    marginVertical: 15,
    paddingHorizontal: 15,
  },
});

class SharePostEditor extends Component {
  render() {
    const {
      form,
      // onRegularInputChange,
      sharedEntityType,
      sharedEntity,
      sharedEntity: {sharedOnCreation},
      header,
    } = this.props;
    const isSubmitEnabled = this.isSubmitEnabled();
    return (
      <View style={commonStyles.flex1}>
        {React.cloneElement(header, {isSubmitEnabled})}
        <View style={commonStyles.flex1}>
          <TextArea
            // onChange={onRegularInputChange}
            value={form.text}
            placeholder={
              sharedOnCreation
                ? I18n.t(`post_editor.post_placeholders.${sharedEntityType}`)
                : I18n.t(`post_editor.post_placeholders.${form.postType}`)
            }
            ref={(node) => {
              this.textInput = node;
            }}
            style={styles.textArea}
            withMentions
          />
          <SharedPostPreview
            sharedEntity={sharedEntity}
            sharedEntityType={sharedEntityType}
          />
        </View>
      </View>
    );
  }

  isSubmitEnabled() {
    const {
      postData,
      mode,
      form: {text, scheduledDate},
    } = this.props;

    switch (mode) {
      case editModes.CREATE:
        return true;
      case editModes.EDIT:
        if (scheduledDate !== postData.scheduledDate) {
          return true;
        }
        return text !== postData.text;
      default:
        return false;
    }
  }
}

SharePostEditor.propTypes = {
  form: PropTypes.object,
  // onRegularInputChange: PropTypes.func,
  sharedEntityType: PropTypes.string,
  sharedEntity: PropTypes.object,
  postData: PropTypes.object,
  mode: PropTypes.number,
  header: PropTypes.node,
};

export default SharePostEditor;
