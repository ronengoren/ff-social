import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {TouchableOpacity, StyleSheet} from 'react-native';
// import { apiCommand } from '/redux/apiCommands/actions';
// import { upload } from '/redux/uploads/actions';
import {AwesomeIcon} from '../../../assets/icons';
import {flipFlopColors} from '../../../vars';
// import { NativeMediaPicker } from '/infra/media';
import {uniqueId, getFilePathFromLocalUri} from '../../../infra/utils';
import {
  keepDeviceAwake,
  allowDeviceToSleep,
} from '../../../infra/utils/deviceUtils';
import {entityTypes, mediaTypes} from '../../../vars/enums';

const styles = StyleSheet.create({
  uploadImageBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 50,
    borderColor: flipFlopColors.b90,
    borderWidth: 1,
  },
});

class ChatAttachmentsButtons extends React.Component {
  render() {
    const {containerStyle} = this.props;
    return (
      <React.Fragment>
        <TouchableOpacity
          onPress={this.openImagePicker}
          activeOpacity={0.5}
          style={[styles.uploadImageBtn, containerStyle]}>
          <AwesomeIcon
            name="image"
            style={styles.iconPrice}
            color={flipFlopColors.b30}
            size={21}
            weight="solid"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.openCameraPicker}
          activeOpacity={0.5}
          style={[styles.uploadImageBtn, containerStyle]}>
          <AwesomeIcon
            name="camera"
            style={styles.iconPrice}
            color={flipFlopColors.b30}
            size={19}
            weight="solid"
          />
        </TouchableOpacity>
      </React.Fragment>
    );
  }

  openImagePicker = async () => {
    // const chosenMedias = await NativeMediaPicker.openPicker({ mediaType: mediaTypes.IMAGE, options: { multiple: true } });
    // if (chosenMedias) {
    //   const medias = chosenMedias.map((media) => ({ localUri: media.localUri, fileName: media.fileName, uploadId: uniqueId() }));
    //   medias.forEach(this.addSingleMedia);
    // }
  };

  openCameraPicker = async () => {
    const res = await NativeMediaPicker.openCamera({
      mediaType: mediaTypes.IMAGE,
    });
    if (res) {
      const {localUri, fileName} = res;
      this.addSingleMedia({localUri, fileName, uploadId: uniqueId()});
    }
  };

  addSingleMedia = async ({localUri, fileName, uploadId}) => {
    // const { upload, apiCommand, onChangeUploadsState } = this.props;
    // const filePath = getFilePathFromLocalUri(localUri);
    // const { url, err } = await upload({
    //   entityType: entityTypes.CHAT_MESSAGE,
    //   fileName,
    //   filePath,
    //   uploadId,
    //   onStart: () => this.handleUploadStart({ uploadId }),
    //   onFinish: () => this.handleUploadEnd({ uploadId })
    // });
    // if (err) {
    //   this.handleUploadEnd({ uploadId });
    //   onChangeUploadsState({ isUploadingMedia: false });
    // }
    // if (url) {
    //   const res = await apiCommand('uploads.getImageObject', { mediaUrl: url });
    //   this.sendImageMessage({ media: res.data.data.media });
    // }
  };

  handleUploadStart = ({uploadId}) => {
    const {uploadIdsStatus, onChangeUploadsState} = this.props;
    const hasActiveUploads = Object.values(uploadIdsStatus).length > 1;
    if (hasActiveUploads) {
      keepDeviceAwake();
    }

    onChangeUploadsState({
      uploadIdsStatus: {...uploadIdsStatus, [uploadId]: true},
      isUploadingMedia: true,
    });
  };

  handleUploadEnd = ({uploadId}) => {
    const {uploadIdsStatus, onChangeUploadsState} = this.props;
    const hasNoActiveUploads = Object.values(uploadIdsStatus).length <= 1;
    if (hasNoActiveUploads) {
      allowDeviceToSleep();
    }
    const updateUploadIdsStatus = {...uploadIdsStatus};
    delete updateUploadIdsStatus[uploadId];

    onChangeUploadsState({uploadIdsStatus: updateUploadIdsStatus});
  };

  sendImageMessage = async ({media}) => {
    const {url: image_url, type, ratio} = media; // eslint-disable-line camelcase
    const {
      sendMessage,
      onMessageSent,
      onChangeUploadsState,
      uploadIdsStatus,
    } = this.props;
    await sendMessage({attachments: [{image_url, type, ratio}]});
    onMessageSent && onMessageSent();
    onChangeUploadsState({uploadIdsStatus, isUploadingMedia: false});
  };
}

ChatAttachmentsButtons.propTypes = {
  uploadIdsStatus: PropTypes.object,
  onChangeUploadsState: PropTypes.func,
  onMessageSent: PropTypes.func,
  sendMessage: PropTypes.func,
  containerStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.array,
    PropTypes.object,
  ]),
  upload: PropTypes.func,
  //   apiCommand: PropTypes.func
};

const mapDispatchToProps = {
  //   upload,
  //   apiCommand
};

ChatAttachmentsButtons = connect(
  null,
  mapDispatchToProps,
)(ChatAttachmentsButtons);

export default ChatAttachmentsButtons;
