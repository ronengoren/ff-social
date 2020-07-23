import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {
  Image,
  Text,
  View,
  InsiderBadge,
} from '../../components/basicComponents';
import {AwesomeIcon} from '../../assets/icons';
import images from '../../assets/images';
import {flipFlopColors, commonStyles} from '../../vars';
import {
  mediaTypes,
  entityTypes,
  screenNames,
  componentNamesForAnalytics,
} from '../../vars/enums';
import {getTopUserRole} from '../../infra/utils';
import {getYearsAgo} from '../../infra/utils/dateTimeUtils';
import I18n from '../../infra/localization';
// import { NativeMediaPicker } from '/infra/media';
import {navigationService} from '/infra/navigation';
// import ProfileInstagram from './ProfileInstagram';

const PROFILE_IMAGE_WIDTH = 375;
const PROFILE_IMAGE_HEIGHT = 480;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: flipFlopColors.paleGreyTwo,
    height: 480,
    borderColor: flipFlopColors.b90,
    borderBottomWidth: 1,
  },
  content: {
    marginBottom: 15,
  },
  wrapperWithPlaceholder: {
    height: 280,
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  imageMask: {
    position: 'absolute',
    width: '100%',
    height: 240,
    bottom: 0,
  },
  imageCta: {
    margin: 15,
    marginTop: 50,
    flex: 1,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 15,
    borderColor: flipFlopColors.azure,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePLaceholderIcon: {
    marginBottom: 11,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  name: {
    marginHorizontal: 15,
    backgroundColor: flipFlopColors.transparent,
  },
  arriveTime: {
    marginTop: 5,
    flexDirection: 'row',
    marginHorizontal: 15,
    alignItems: 'center',
  },
  plane: {
    marginTop: -1,
    marginRight: 7,
  },
  badge: {
    marginTop: 8,
  },
});

class ProfileHeader extends Component {
  render() {
    const {image, TopComponent, isViewingOwnProfile} = this.props;

    return (
      <View
        style={[
          styles.wrapper,
          !isViewingOwnProfile && !image && styles.wrapperWithPlaceholder,
        ]}>
        {this.renderImage()}
        {TopComponent || <View />}
        {this.renderContent()}
      </View>
    );
  }

  renderImage() {
    // const { isViewingOwnProfile, image, thumbnail } = this.props;
    // if (isViewingOwnProfile && !image && !thumbnail) {
    //   return (
    //     <TouchableOpacity activeOpacity={1} onPress={this.handleAddImage} style={styles.imageCta}>
    //       <AwesomeIcon name="camera" size={30} weight="solid" color={flipFlopColors.azure} style={styles.imagePLaceholderIcon} />
    //       <Text color={flipFlopColors.azure} size={16} lineHeight={19}>
    //         {I18n.t('profile.view.image_placeholder')}
    //       </Text>
    //     </TouchableOpacity>
    //   );
    // }
    // if (!image && !thumbnail) {
    //   return <Image source={images.profile.imagePlaceholder} style={styles.image} resizeMode="cover" key="image" />;
    // }
    // return (
    //   <TouchableOpacity activeOpacity={1} onPress={isViewingOwnProfile ? this.handleAddImage : this.navigateToProfileImageModal} style={styles.image}>
    //     <Image source={{ uri: thumbnail }} style={styles.image} resizeMode="cover" key="thumbnail" />
    //     <Image source={{ uri: image }} style={styles.image} resizeMode="cover" key="image" />
    //     <Image style={styles.imageMask} source={images.profile.imageGradient} resizeMode="stretch" key="mask" />
    //   </TouchableOpacity>
    // );
  }

  renderContent() {
    const {
      name,
      ButtonsComponent,
      isViewingOwnProfile,
      instagramToken,
      isWithoutBackground,
      roles,
      rolePrefix,
    } = this.props;
    const shouldRenderInstagram = !!(isViewingOwnProfile || instagramToken);
    const badgeType = getTopUserRole(roles);

    return (
      <View style={styles.content}>
        <View style={styles.topSection}>
          <View style={commonStyles.flex1}>
            <Text
              bolder
              size={28}
              lineHeight={32}
              color={
                isWithoutBackground ? flipFlopColors.b30 : flipFlopColors.white
              }
              style={[
                !isWithoutBackground && commonStyles.textShadow,
                styles.name,
              ]}
              testID="profileUserName">
              {name}
            </Text>
            {this.renderJourney()}
            {!!badgeType && (
              <InsiderBadge
                type={badgeType}
                rolePrefix={rolePrefix}
                style={styles.badge}
                originEntity={componentNamesForAnalytics.USER_PROFILE}
              />
            )}
          </View>
          {ButtonsComponent}
        </View>
        {shouldRenderInstagram && (
          <ProfileInstagram
            token={instagramToken}
            isDarkPlaceholder={isWithoutBackground}
          />
        )}
      </View>
    );
  }

  renderJourney() {
    const {
      journey,
      isViewingOwnProfile,
      isWithoutBackground,
      navigateToEditProfile,
    } = this.props;
    const hasJourneyDetails = !!(journey && journey.arrivedDate);

    if (!hasJourneyDetails && !isViewingOwnProfile) {
      return null;
    }

    const forceLocale = I18n.getLocale() === 'he' && 'en';
    const text = hasJourneyDetails
      ? I18n.t('profile.view.time_of_arrival', {
          timeSince: getYearsAgo(journey.arrivedDate, forceLocale),
        })
      : I18n.t('profile.edit.my_journey.arrival_picker_header');

    const color =
      hasJourneyDetails && !isWithoutBackground
        ? flipFlopColors.white
        : flipFlopColors.azure;

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={hasJourneyDetails ? null : navigateToEditProfile}
        style={styles.arriveTime}>
        <AwesomeIcon
          name="plane"
          weight="solid"
          color={color}
          size={14}
          style={styles.plane}
        />
        <Text size={16} lineHeight={20} color={color}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  }

  handleAddImage = async () => {
    // const { saveMedia } = this.props;
    // const res = await NativeMediaPicker.show({ mediaType: mediaTypes.IMAGE, withFacebook: true });
    // if (!res) return;
    // const { localUri, remoteUri, fileName } = res;
    // navigationService.navigate(screenNames.ImageUpload, {
    //   localUri,
    //   remoteUri,
    //   fileName,
    //   entityType: entityTypes.PROFILE,
    //   onComplete: saveMedia
    // });
  };

  navigateToProfileImageModal = () => {
    const {image} = this.props;
    image &&
      navigationService.navigate(screenNames.MediaModal, {
        mediaUri: image,
        mediaRatio: PROFILE_IMAGE_WIDTH / PROFILE_IMAGE_HEIGHT,
        mediaType: mediaTypes.IMAGE,
      });
  };
}

ProfileHeader.defaultProps = {
  roles: [],
};

ProfileHeader.propTypes = {
  isWithoutBackground: PropTypes.bool,
  journey: PropTypes.object,
  thumbnail: PropTypes.string,
  image: PropTypes.string,
  name: PropTypes.string,
  ButtonsComponent: PropTypes.node,
  TopComponent: PropTypes.node,
  isViewingOwnProfile: PropTypes.bool,
  instagramToken: PropTypes.string,
  navigateToEditProfile: PropTypes.func,
  saveMedia: PropTypes.func,
  rolePrefix: PropTypes.string,
  roles: PropTypes.arrayOf(PropTypes.string),
};

export default ProfileHeader;
