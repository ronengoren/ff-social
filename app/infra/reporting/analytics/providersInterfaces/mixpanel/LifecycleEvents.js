import { Platform } from 'react-native';
import { get } from '/infra/utils';
import { genderType } from '/vars/enums';

class LifecycleEvents {
  constructor(provider) {
    this.provider = provider;
  }

  appInstall = ({ campaign, channel, tags, linkId, thirdParty, ...restBranchProps }) => {
    this.provider.trackWithProperties('Homeis Install', { campaign, channel, tags, linkId, thirdParty, ...restBranchProps });
    this.provider.set({ initialChannel: channel, initialCampaign: campaign, channel, campaign });
  };

  createIdentity = ({
    email,
    userId,
    userName,
    nationalityGroupId,
    nationalityGroupName,
    deviceLanguage,
    deviceLocales,
    contextCountryCode,
    contextCountryName,
    destinationCountryName,
    roles,
    hasProfilePicture
  }) => {
    this.provider.createAlias(userId);
    this.startSession({
      email,
      userId,
      userName,
      nationalityGroupId,
      nationalityGroupName,
      deviceLanguage,
      deviceLocales,
      contextCountryCode,
      contextCountryName,
      destinationCountryName,
      roles,
      hasProfilePicture
    });
  };

  startSession = ({
    email,
    userId,
    userName,
    communityId,
    communityName,
    gender,
    origin,
    currentlyLiveIn,
    nationalityGroupId,
    nationalityGroupName,
    deviceLanguage,
    deviceLocales,
    contextCountryCode,
    contextCountryName,
    destinationCountryName,
    roles,
    hasProfilePicture
  }) => {
    this.provider.identify(userId);
    let resolvedGender = gender;

    Object.keys(genderType).forEach((key) => {
      if (genderType[key] === gender) {
        resolvedGender = key;
      }
    });
    const dataToSet = {
      $email: email,
      $name: userName,
      'User Id': userId,
      'Community Id': communityId,
      'Community Name': communityName,
      'NationalityGroup Id': nationalityGroupId,
      'NationalityGroup Name': nationalityGroupName,
      'Origin Country Code': contextCountryCode,
      'Origin Country Name': contextCountryName,
      'Destination Country Name': destinationCountryName,
      Gender: resolvedGender,
      UserOrigin: origin,
      CurrentlyLiveIn: currentlyLiveIn,
      'User Roles': roles,
      'Has Profile Picture': hasProfilePicture
    };

    if (deviceLanguage) {
      dataToSet['Device Language'] = deviceLanguage;
    }
    if (deviceLocales) {
      dataToSet['Device Locales'] = deviceLocales;
    }

    this.provider.set(dataToSet);
    this.registerUserId(userId);
  };

  endSession = () => {
    this.provider.reset();
  };

  appOpened = () => {
    this.provider.track('App Opened');
  };

  pushNotificationOpened = (pushEventProps) => {
    this.provider.trackWithProperties('App Opened From Push', pushEventProps);
  };

  appClosed = () => {
    this.provider.track('App Closed');
  };

  registerUserId = (userId) => {
    this.provider.registerSuperProperties({
      'User Id': userId
    });
  };

  addPushToken = ({ token }) => {
    Platform.OS === 'ios' ? this.provider.addPushDeviceToken(token) : this.provider.setPushRegistrationId(token);
  };

  universalLinkOpened = ({ url, route }) => {
    this.provider.trackWithProperties('Universal Link Open', { url, screenName: get(route, 'screenName'), entityId: get(route, 'params.entityId') });
  };
}

export default LifecycleEvents;
