import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
// import { NativeMediaPicker } from '/infra/media';
import {navigationService} from '../../infra/navigation';
import {AwesomeIcon} from '../../assets/icons';
import {commonStyles, flipFlopColors} from '../../vars';
import {screenNames, mediaTypes, entityTypes} from '../../vars/enums';
import {stylesScheme} from '../../schemas';

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});

class UploadImageButton extends React.Component {
  render() {
    const {hasImage, style} = this.props;
    const backgroundColor = hasImage
      ? flipFlopColors.halfRealBlack
      : flipFlopColors.white;
    const iconColor = hasImage ? flipFlopColors.white : flipFlopColors.green;
    return (
      <TouchableOpacity
        onPress={this.handleAddMedia}
        activeOpacity={0.5}
        style={[styles.wrapper, commonStyles.shadow, {backgroundColor}, style]}>
        <AwesomeIcon name="camera" size={24} weight="solid" color={iconColor} />
      </TouchableOpacity>
    );
  }

  handleAddMedia = async () => {
    // const { entityType } = this.props;
    // const res = await NativeMediaPicker.show({ mediaType: mediaTypes.IMAGE });
    // if (res) {
    //   const { localUri, fileName } = res;
    //   navigationService.navigate(screenNames.ImageUpload, { localUri, fileName, entityType, onComplete: this.saveMediaWrapper });
    // }
  };

  saveMediaWrapper = ({mediaUrl}) => {
    const {saveMedia} = this.props;
    saveMedia({mediaUrl});
  };
}

UploadImageButton.defaultProps = {
  hasImage: false,
};

UploadImageButton.propTypes = {
  saveMedia: PropTypes.func.isRequired,
  entityType: PropTypes.oneOf(Object.values(entityTypes)),
  hasImage: PropTypes.bool,
  style: stylesScheme,
};

export default UploadImageButton;
