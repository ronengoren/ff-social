class ActionEvents {
  constructor({ Crashlytics, Answers }) {
    this.Crashlytics = Crashlytics;
    this.Answers = Answers;
  }

  signup = (params) => {
    this.Answers.logCustom('signup', null, null, params);
  };

  signupFailed = (params) => {
    this.Answers.logCustom('signupFailed', null, null, params);
  };

  signIn = (params) => {
    this.Answers.logCustom('signIn', null, null, params);
  };

  logout = () => {
    this.Answers.logCustom('logout', null, null, null);
  };

  search = (params) => {
    this.Answers.logCustom('search', null, null, params);
  };

  searchRequest = (params) => {
    this.Answers.logCustom('searchRequest', null, null, params);
  };

  postCreation = (params) => {
    this.Answers.logCustom('postCreation', null, null, params);
  };

  postEdit = (params) => {
    this.Answers.logCustom('postEdit', null, null, params);
  };

  listItemCreation = (params) => {
    this.Answers.logCustom('listItemCreation', null, null, params);
  };

  groupCreation = (params) => {
    this.Answers.logCustom('groupCreation', null, null, params);
  };

  pageCreation = (params) => {
    this.Answers.logCustom('pageCreation', null, null, params);
  };

  friendRequest = (params) => {
    this.Answers.logCustom('friendRequest', null, null, params);
  };

  friendRequestResponse = (params) => {
    this.Answers.logCustom('friendRequestResponse', null, null, params);
  };

  commentLike = (params) => {
    this.Answers.logCustom('commentLike', null, null, params);
  };

  thanksAction = (params) => {
    this.Answers.logCustom('Thanks', null, null, params);
  };

  unThanksAction = () => (params) => {
    this.Answers.logCustom('UnThanks', null, null, params);
  };

  voteAction = () => (params) => {
    this.Answers.logCustom('vote', null, null, params);
  };

  unVoteAction = () => (params) => {
    this.Answers.logCustom('unVote', null, null, params);
  };

  saveAction = (params) => {
    this.Answers.logCustom('Save', null, null, params);
  };

  unSaveAction = () => (params) => {
    this.Answers.logCustom('UnSave', null, null, params);
  };

  clickToMessageAction = () => (params) => {
    this.Answers.logCustom('Click to Message', null, null, params);
  };

  comment = (params) => {
    this.Answers.logCustom('comment', null, null, params);
  };

  listClickViewMore = (params) => {
    this.Answers.logCustom('listClickViewMore', null, null, params);
  };

  carouselItemClick = (params) => {
    this.Answers.logCustom('carouselItemClick', null, null, params);
  };

  followPage = (params) => {
    this.Answers.logCustom('followPage', null, null, params);
  };

  unFollowPage = (params) => {
    this.Answers.logCustom('unFollowPage', null, null, params);
  };

  joinedGroup = (params) => {
    this.Answers.logCustom('joinedGroup', null, null, params);
  };

  unJoinedGroup = (params) => {
    this.Answers.logCustom('unJoinedGroup', null, null, params);
  };

  eventCreation = (params) => {
    this.Answers.logCustom('eventCreation', null, null, params);
  };

  onboardingClickedJoinNow = (params) => {
    this.Answers.logCustom('OB - Clicked on "Join Now"', null, null, params);
  };

  onboardingClickedAlreadyAMember = (params) => {
    this.Answers.logCustom('OB - Clicked on "Already a member"', null, null, params);
  };

  onboardingClickedContinueWithFacebook = (params) => {
    this.Answers.logCustom('OB - Clicked facebook', null, null, params);
  };

  onboardingClickedClickedGetStarted = (params) => {
    this.Answers.logCustom('OB - Clicked Get started', null, null, params);
  };

  onboardingClickedUploadPicture = (params) => {
    this.Answers.logCustom('OB - Clicked on Upload picture', null, null, params);
  };

  onboardingUploadPictureSucceeded = (params) => {
    this.Answers.logCustom('OB - Upload picture succeeded', null, null, params);
  };

  onboardingSetOriginCountry = (params) => {
    this.Answers.logCustom('OB - Set origin country', null, null, params);
  };

  onboardingSetDestinationCountry = (params) => {
    this.Answers.logCustom('OB - Set destination country', null, null, params);
  };

  onboardingMissingCommunity = (params) => {
    this.Answers.logCustom('OB - Missing Community', null, null, params);
  };

  onboardingJoinAlternateCommunity = (params) => {
    this.Answers.logCustom('OB - Join alternate community', null, null, params);
  };

  onboardingSetCity = (params) => {
    this.Answers.logCustom('OB - Set a city', null, null, params);
  };

  onboardingSetEmail = (params) => {
    this.Answers.logCustom('OB - Set email', null, null, params);
  };

  onboardingSetGender = (params) => {
    this.Answers.logCustom('OB - Set gender', null, null, params);
  };

  onboardingJoinedCommunity = (params) => {
    this.Answers.logCustom('OB - Joined community', null, null, params);
  };

  onboardingAddFriends = (params) => {
    this.Answers.logCustom('OB - Sent friend requests', null, null, params);
  };

  onboardingEnableNotificationsPopup = (params) => {
    this.Answers.logCustom('OB - Enable notifications popup (Yes,Later)', null, null, params);
  };

  onboardingEnableNotificationsNative = (params) => {
    this.Answers.logCustom('OB - Enable notifications native (Allow, Don’t allow)', null, null, params);
  };

  invitedFriend = (params) => {
    this.Answers.logCustom('Invite)', null, null, params);
  };
}

export default ActionEvents;
