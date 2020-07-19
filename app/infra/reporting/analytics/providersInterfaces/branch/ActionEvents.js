class ActionEvents {
  constructor(provider) {
    this.provider = provider;
  }

  signup = () => {
    new this.provider.BranchEvent('signup').logEvent();
  };

  signupFailed = () => {
    new this.provider.BranchEvent('signupFailed').logEvent();
  };

  onboardingJoinedCommunity = () => {
    new this.provider.BranchEvent('COMPLETE_REGISTRATION').logEvent();
  };
}

export default ActionEvents;
