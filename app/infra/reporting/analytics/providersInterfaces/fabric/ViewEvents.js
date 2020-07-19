class ViewEvents {
  constructor({ Crashlytics, Answers }) {
    this.Crashlytics = Crashlytics;
    this.Answers = Answers;
  }

  screenView = ({ screenName, origin }) => {
    this.Answers.logContentView(screenName, null, null, { origin });
  };

  entityView = ({ screenName, origin, entityId, entityName }) => {
    this.Answers.logContentView(screenName, null, null, { origin, entityId, entityName });
  };

  tabView = ({ screenName, origin, subTab }) => {
    this.Answers.logContentView(screenName, null, null, { origin, subTab });
  };
}

export default ViewEvents;
