import React from 'react';
import PropTypes from 'prop-types';
import {Animated, Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import I18n from '../..//infra/localization';
import {connect} from 'react-redux';
// import { editImages } from '/redux/auth/actions';
// import { apiCommand } from '/redux/apiCommands/actions';
// import { analytics } from '/infra/reporting';
import {Image, Text, View, Video} from '../../components/basicComponents';
import {Screen} from '../../components';
import images from '../../assets/images';
import {flipFlopColors, uiConstants} from '../../vars';
import {entityTypes, mediaTypes} from '../../vars/enums';
import {get, random} from '../../infra/utils';
// import { NativeMediaPicker } from '/infra/media';
import {stylesScheme} from '../../schemas';
import videos from '../../assets/videos';

// import { ImageUpload } from '../imageUpload';
import UserAvatarImageSwitcher from './UserAvatarImageSwitcher';

const SWITCHING_IMAGES_ANIMATION_DURATION = 250;
const DELAY_BEFORE_SHOWING_GREETING = 1000;
const DELAY_BEFORE_HIDING_GREETING = 3000;

export const WRAPPER_HEIGHT = 400;
export const SMALLER_WRAPPER_HEIGHT = 260;
export const STRIPE_HEIGHT = 42;
const NUM_OF_GREETING_VIDEOS =
  videos.onboarding.profile_photo_greetings.length - 1;

const BTN_HITSLOP = {left: 10, top: 10, right: 10, bottom: 10};
const {width} = Dimensions.get('screen');

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: flipFlopColors.b97,
    height: WRAPPER_HEIGHT,
  },
  smallerWrapper: {
    height: SMALLER_WRAPPER_HEIGHT,
  },
  profileImageWrapper: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: flipFlopColors.transparent,
  },
  userImage: {
    height: '100%',
    width,
    borderColor: flipFlopColors.white,
  },
  addImageButton: {
    minWidth: 140,
    height: 35,
    borderRadius: 10,
    backgroundColor: flipFlopColors.green,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: 21,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 20,
    right: 15,
    minWidth: 60,
    paddingHorizontal: 8,
    height: 30,
    borderRadius: 10,
    backgroundColor: flipFlopColors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whiteStripe: {
    position: 'absolute',
    bottom: -2,
    width: '100%',
    height: STRIPE_HEIGHT,
  },
  video: {
    width: 180,
    height: 110,
    marginBottom: 15,
    marginTop: -STRIPE_HEIGHT,
    marginLeft: -15,
  },
  greetingVideoWrapper: {
    position: 'absolute',
    right: 0,
    width: 166,
    height: 50,
    bottom: 0,
    transform: [
      {translateX: -(width / 2 - 130)},
      {translateY: 30},
      {rotate: '12deg'},
    ],
    zIndex: 6,
  },
  greetingVideo: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  imageUploadModal: {
    maxHeight: uiConstants.FOOTER_MARGIN_BOTTOM_ONBOARDING + 40,
  },
  imageUploadWrapper: {
    marginHorizontal: 15,
  },
});

class UserProfilePictureHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      greetingVideoOpacity: new Animated.Value(0),
      showGreetingVideo: false,
      // eslint-disable-next-line react/no-unused-state
      isUploadingImage: false,
    };

    this.currentProfileImage = get(this.props, 'user.media.thumbnail', '');
  }

  // eslint-disable-next-line react/sort-comp
  greetingVideo =
    videos.onboarding.profile_photo_greetings[
      random(1, NUM_OF_GREETING_VIDEOS, false)
    ];

  render() {
    const {isSmaller} = this.props;
    return (
      <View style={[styles.wrapper, isSmaller && styles.smallerWrapper]}>
        {this.renderProfileImage()}
      </View>
    );
  }

  renderProfileImage() {
    const {showGreetingVideo, greetingVideoOpacity} = this.state;
    const source = {uri: this.currentProfileImage};

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={this.currentProfileImage ? null : this.handleAddImage}>
        <View style={styles.profileImageWrapper}>
          {this.currentProfileImage ? (
            <UserAvatarImageSwitcher
              source={source}
              style={styles.userImage}
              resizeMode="cover"
              animationDuration={SWITCHING_IMAGES_ANIMATION_DURATION}
            />
          ) : (
            <Video
              style={styles.video}
              source={videos.onboarding.profile_photo_camera}
              rate={1.0}
              volume={0}
              muted
              paused={false}
              resizeMode="cover"
              repeat
              progressUpdateInterval={10000}
              onLoadStart={null}
              onLoad={null}
              onProgress={null}
              onEnd={null}
              onError={null}
            />
          )}
          <Image
            source={images.onboarding.profile_photo_line}
            style={styles.whiteStripe}
            resizeMode="stretch"
          />
          <TouchableOpacity
            activeOpacity={0.75}
            style={[
              this.currentProfileImage
                ? styles.editImageButton
                : styles.addImageButton,
            ]}
            onPress={this.handleAddImage}
            hitSlop={BTN_HITSLOP}>
            <Text size={14} color={flipFlopColors.white} bold center>
              {I18n.t(
                `onboarding.user_profile_header.${
                  this.currentProfileImage ? 'edit' : 'upload'
                }_button`,
              )}
            </Text>
          </TouchableOpacity>
        </View>

        {showGreetingVideo && (
          <Animated.View
            style={[
              styles.greetingVideoWrapper,
              {opacity: greetingVideoOpacity},
            ]}>
            <Video
              style={styles.greetingVideo}
              source={this.greetingVideo}
              rate={1.0}
              volume={0}
              muted
              paused={false}
              resizeMode="cover"
              progressUpdateInterval={10000}
              onLoadStart={null}
              onLoad={null}
              onProgress={null}
              onEnd={null}
              onError={null}
            />
          </Animated.View>
        )}
      </TouchableOpacity>
    );
  }

  showGreetingAnimation = () => {
    setTimeout(() => {
      Animated.timing(this.state.greetingVideoOpacity, {
        toValue: 1,
        duration: 1,
        useNativeDriver: true,
      }).start(() => {
        this.setState({showGreetingVideo: true}, () => {
          Animated.timing(this.state.greetingVideoOpacity, {
            toValue: 0,
            duration: 500,
            delay: DELAY_BEFORE_HIDING_GREETING,
            useNativeDriver: true,
          }).start(() => {
            this.setState({showGreetingVideo: false});
          });
        });
      });
    }, DELAY_BEFORE_SHOWING_GREETING);
  };

  componentDidMount() {
    if (this.currentProfileImage) {
      this.showGreetingAnimation();
    }
  }

  handleAddImage = async () => {
    // const { showModal, hideModal, modalStyle, editImages, apiCommand, user } = this.props;
    // analytics.actionEvents.onboardingClickedUploadPicture({ userId: user.id, source: 'Browser' }).dispatch();
    // const res = await NativeMediaPicker.show({ mediaType: mediaTypes.IMAGE, withFacebook: true });
    // if (!res) return;
    // const { localUri, remoteUri, fileName } = res;
    // this.tempPreviousImage = this.currentProfileImage;
    // if (localUri || remoteUri) {
    //   // Avoid re-render this component.
    //   this.currentProfileImage = localUri || remoteUri;
    //   // we set the state here only to trigger re-render of the component.
    //   // eslint-disable-next-line react/no-unused-state
    //   this.setState({ isUploadingImage: true });
    // }
    // setTimeout(() => {
    //   showModal({
    //     options: {
    //       keepModalOnClickOutside: true
    //     },
    //     content: (
    //       <View style={[modalStyle, styles.imageUploadModal]}>
    //         <View style={styles.imageUploadWrapper}>
    //           <ImageUpload
    //             withCancelIconInline
    //             withHeader={false}
    //             localUri={localUri}
    //             remoteUri={remoteUri}
    //             fileName={fileName}
    //             entityType={entityTypes.PROFILE}
    //             onError={this.onCancelOrError}
    //             onCancel={this.onCancelOrError}
    //             onComplete={async ({ mediaUrl: profileImage }) => {
    //               editImages({ media: { thumbnail: profileImage, profile: profileImage }, newUser: false });
    //               hideModal();
    //               await apiCommand('profile.editImage', { imageUrl: profileImage, userId: user.id });
    //               analytics.actionEvents.updateProfilePicture().dispatch();
    //               this.showGreetingAnimation();
    //             }}
    //           />
    //         </View>
    //       </View>
    //     )
    //   });
    // }, SWITCHING_IMAGES_ANIMATION_DURATION * 1.5);
  };

  onCancelOrError = () => {
    const {hideModal} = this.props;
    hideModal();

    this.currentProfileImage = this.tempPreviousImage;
    this.tempPreviousImage = null;

    // we set the state here only to trigger re-render of the component.
    // eslint-disable-next-line react/no-unused-state
    this.setState({isUploadingImage: false});
  };
}

UserProfilePictureHeader.propTypes = {
  modalStyle: stylesScheme,
  showModal: PropTypes.func,
  hideModal: PropTypes.func,
  user: PropTypes.object,
  isSmaller: PropTypes.bool,
  //   editImages: PropTypes.func,
  //   apiCommand: PropTypes.func
};

const mapStateToProps = (state) => ({
  // user: state.auth.user,
});

const mapDispatchToProps = {
  //   editImages,
  //   apiCommand
};

UserProfilePictureHeader = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserProfilePictureHeader);

export default Screen({modalError: true})(UserProfilePictureHeader);
