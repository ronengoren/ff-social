class LifecycleEvents {
  constructor({ Crashlytics, Answers }) {
    this.Crashlytics = Crashlytics;
    this.Answers = Answers;
  }

  startSession = ({ userId, userName, communityId, gender }) => {
    this.Crashlytics.setUserName(userName);
    this.Crashlytics.setUserIdentifier(userId);
    this.Crashlytics.setString('communityId', communityId);
    this.Crashlytics.setString('gender', `${gender}`);
  };

  endSession = () => {
    this.Crashlytics.setUserName('');
    this.Crashlytics.setUserIdentifier('');
    this.Crashlytics.setString('communityId', '');
  };
}

export default LifecycleEvents;
