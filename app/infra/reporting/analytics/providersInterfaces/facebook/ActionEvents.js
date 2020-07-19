class ActionEvents {
  constructor(provider) {
    this.provider = provider;
  }

  signup = () => {
    this.provider.logEvent('signup');
  };

  signupFailed = () => {
    this.provider.logEvent('SignupFailed');
  };

  onboardingJoinedCommunity = ({ communityId, isOnWaitingList }) => {
    const userType = isOnWaitingList ? 'dirty' : 'clean';
    this.provider.logEvent('fb_mobile_complete_registration', 1, { fb_registration_method: userType, communityId });
  };
}

export default ActionEvents;
