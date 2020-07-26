import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Dimensions} from 'react-native';
import I18n from '../../infra/localization';
import {connect} from 'react-redux';
// import { upload, cancelUpload } from '/redux/uploads/actions';
import {Screen, Header} from '../../components';
import {View, Text, Image, ProgressBar} from '../../components/basicComponents';
import {getFilePathFromLocalUri} from '../../infra/utils';
import {navigationService} from '../../infra/navigation';
import {flipFlopColors} from '../../vars';
import {AwesomeIcon} from '../../assets/icons';
import {delegateNavigationStateParamsToProps} from '../../infra/navigation/utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    backgroundColor: flipFlopColors.white,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 15,
  },
  progressText: {
    fontSize: 13,
    marginRight: 15,
  },
  progressBar: {
    flex: 1,
  },
  image: {
    height: '100%',
  },
  headerBtn: {
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  inlineCancelButton: {
    paddingVertical: 5,
    paddingLeft: 10,
    paddingRight: 5,
  },
});

class ImageUpload extends Component {
  state = {
    activeUploadId: null,
    screenStateUploading: true,
  };

  render() {
    const {activeUploadId, screenStateUploading} = this.state;
    const {localUri, remoteUri, uploads, withHeader} = this.props;
    const {width} = Dimensions.get('window');
    // const upload = uploads[activeUploadId];

    return (
      <View style={styles.container}>
        {withHeader && (
          <Header
            title={I18n.t('image_upload.header')}
            hasBackButton
            backAction={this.cancelUploading}
            rightComponent={this.renderHeaderBtn()}
          />
        )}
        <View style={styles.innerContainer}>
          <Image
            source={{uri: remoteUri || localUri}}
            style={[styles.image, {width}]}
            resizeMode="contain"
          />
          {/* {upload &&
            screenStateUploading &&
            this.renderProgress({progress: upload.progress})} */}
        </View>
      </View>
    );
  }

  //   componentDidMount() {
  //     const { onError } = this.props;
  //     try {
  //       this.upload();
  //     } catch (err) {
  //       onError && onError(err);
  //     }
  //   }

  //   componentWillUnmount() {
  //     const { cancelUpload, onCancel } = this.props;
  //     const { activeUploadId } = this.state;

  //     if (activeUploadId) {
  //       cancelUpload({ uploadId: activeUploadId });

  //       if (onCancel) {
  //         onCancel(activeUploadId);
  //       }
  //     }
  //   }

  renderProgress({progress}) {
    const {withCancelIconInline} = this.props;
    return (
      <View style={styles.progressContainer}>
        <Text style={styles.progressText} medium>
          {I18n.t('image_upload.uploading')}
        </Text>
        <ProgressBar progress={progress} style={styles.progressBar} />
        {withCancelIconInline && (
          <AwesomeIcon
            name="times-circle"
            weight="solid"
            size={20}
            color={flipFlopColors.azure}
            onPress={this.handleHeaderBtnClick}
            style={styles.inlineCancelButton}
          />
        )}
      </View>
    );
  }

  renderHeaderBtn = () => {
    const btnText = this.state.screenStateUploading
      ? I18n.t('image_upload.cancel_button')
      : I18n.t('image_upload.save_button');
    return (
      <Text
        medium
        color={flipFlopColors.azure}
        onPress={this.handleHeaderBtnClick}
        style={styles.headerBtn}>
        {btnText}
      </Text>
    );
  };

  upload = async () => {
    // const {upload, localUri, remoteUri, fileName, entityType} = this.props;
    // let mediaUrl = remoteUri;
    // if (localUri) {
    //   const {url} = await upload({
    //     entityType,
    //     fileName,
    //     filePath: getFilePathFromLocalUri(localUri),
    //     onStart: (id) => this.setState({activeUploadId: id}),
    //     onFinish: () => this.setState({activeUploadId: null}),
    //   });
    //   mediaUrl = url;
    // }
    // if (mediaUrl) {
    //   this.setState({mediaUrl}, () => {
    //     if (this.state.screenStateUploading) {
    //       this.saveFile();
    //     }
    //   });
    // }
  };

  handleHeaderBtnClick = () => {
    this.state.screenStateUploading ? this.cancelUploading() : this.saveFile();
  };

  async saveFile() {
    const {activeUploadId, mediaUrl} = this.state;
    const {onComplete, isScreen} = this.props;

    if (activeUploadId) {
      this.setState({screenStateUploading: true});
    } else {
      await onComplete({mediaUrl});
      if (isScreen) {
        navigationService.goBack();
      }
    }
  }

  cancelUploading = () => {
    // const { activeUploadId } = this.state;
    // const { cancelUpload, onCancel, isScreen } = this.props;
    // if (activeUploadId) {
    //   cancelUpload({ uploadId: activeUploadId });
    // }
    // if (onCancel) {
    //   onCancel(activeUploadId);
    // }
    // if (isScreen) {
    //   navigationService.goBack();
    // }
  };
}

ImageUpload.defaultProps = {
  withHeader: true,
  withCancelIconInline: false,
};

ImageUpload.propTypes = {
  withCancelIconInline: PropTypes.bool,
  withHeader: PropTypes.func,
  onError: PropTypes.func,
  onCancel: PropTypes.func,
  onComplete: PropTypes.func,
  cancelUpload: PropTypes.func,
  uploads: PropTypes.object,
  localUri: PropTypes.string,
  remoteUri: PropTypes.string,
  fileName: PropTypes.string,
  entityType: PropTypes.string,
  isScreen: PropTypes.bool,
  // upload: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  // ...delegateNavigationStateParamsToProps(ownProps),
  uploads: state.uploads,
});

const mapDispatchToProps = {};

ImageUpload = connect(mapStateToProps, mapDispatchToProps)(ImageUpload);
ImageUpload = Screen({modalError: true})(ImageUpload);

export default ImageUpload;
