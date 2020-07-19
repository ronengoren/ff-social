function LifecycleEvent(name, params) {
  this.name = name;
  this.params = params;
}

class LifecycleEvents {
  constructor(dispatcher) {
    LifecycleEvent.prototype.dispatch = function() {
      dispatcher({ name: this.name, params: this.params });
    };
  }

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
  }) =>
    new LifecycleEvent('createIdentity', {
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

  startSession = ({
    email,
    userId,
    userName,
    communityId,
    communityName,
    nationalityGroupId,
    nationalityGroupName,
    gender,
    origin,
    currentlyLiveIn,
    contextCountryCode,
    contextCountryName,
    destinationCountryName,
    roles,
    hasProfilePicture
  }) =>
    new LifecycleEvent('startSession', {
      email,
      userId,
      userName,
      communityId,
      communityName,
      nationalityGroupId,
      nationalityGroupName,
      gender,
      origin,
      currentlyLiveIn,
      contextCountryCode,
      contextCountryName,
      destinationCountryName,
      roles,
      hasProfilePicture
    });

  endSession = () => new LifecycleEvent('endSession');

  appOpened = () => new LifecycleEvent('appOpened');

  pushNotificationOpened = (pushEventProps) => new LifecycleEvent('pushNotificationOpened', pushEventProps);

  appClosed = () => new LifecycleEvent('appClosed');

  appInstall = ({ campaign, channel, tags, linkId, thirdParty, ...restBranchProps }) =>
    new LifecycleEvent('appInstall', { campaign, channel, tags, linkId, thirdParty, ...restBranchProps });

  addPushToken = ({ token }) => new LifecycleEvent('addPushToken', { token });

  universalLinkOpened = ({ url, route }) => new LifecycleEvent('universalLinkOpened', { url, route });
}

export default LifecycleEvents;
