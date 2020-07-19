function ActionEvent(name, params) {
  this.name = name;
  this.params = params;
}

class ActionEvents {
  constructor(dispatcher) {
    ActionEvent.prototype.dispatch = function () {
      dispatcher({name: this.name, params: this.params});
    };
  }

  signup = ({registrationMethod, ...restTrackingProps}) =>
    new ActionEvent('signup', {registrationMethod, ...restTrackingProps});

  signupFailed = ({failureReason, registrationMethod, ...restTrackingProps}) =>
    new ActionEvent('signupFailed', {
      failureReason,
      registrationMethod,
      ...restTrackingProps,
    });

  signIn = ({
    success,
    failureReason,
    email,
    name,
    registrationMethod,
    communityId,
    communityName,
  }) =>
    new ActionEvent('signIn', {
      success,
      failureReason,
      email,
      name,
      registrationMethod,
      communityId,
      communityName,
    });

  logout = () => new ActionEvent('logout');

  updateProfilePicture = () => new ActionEvent('updateProfilePicture');

  postCreation = ({
    success,
    failureReason,
    postId,
    postCreatorId,
    postCreatorName,
    containsMedia,
    postType,
    postSubType,
    numberOfChars,
    contextId,
    contextName,
    contextType,
    hasMentions,
    mentions,
    isPassive,
    listId,
    listName,
    activationPostData,
    activationType,
    activationSubType,
    tags,
  }) =>
    new ActionEvent('postCreation', {
      success,
      failureReason,
      postId,
      postCreatorId,
      postCreatorName,
      containsMedia,
      postType,
      postSubType,
      numberOfChars,
      contextId,
      contextName,
      contextType,
      hasMentions,
      mentions,
      isPassive,
      listId,
      listName,
      activationPostData,
      activationType,
      activationSubType,
      tags,
    });

  postEdit = ({success, failureReason, postId, delta}) =>
    new ActionEvent('postEdit', {success, failureReason, postId, delta});

  listItemCreation = ({
    isPassive,
    listName,
    listId,
    pageId,
    creatorName,
    creatorId,
    componentName,
  }) =>
    new ActionEvent('listItemCreation', {
      isPassive,
      listName,
      listId,
      pageId,
      creatorName,
      creatorId,
      componentName,
    });

  groupCreation = ({
    success,
    failureReason,
    groupId,
    groupName,
    totalMembers,
    containsMedia,
    privacyType,
  }) =>
    new ActionEvent('groupCreation', {
      success,
      failureReason,
      groupId,
      groupName,
      totalMembers,
      containsMedia,
      privacyType,
    });

  pageCreation = ({success, failureReason, pageId, pageName, tags, isOwner}) =>
    new ActionEvent('pageCreation', {
      success,
      failureReason,
      pageId,
      pageName,
      tags,
      isOwner,
    });

  friendRequest = ({friendId, friendName, totalMutualFriends}) =>
    new ActionEvent('friendRequest', {
      friendId,
      friendName,
      totalMutualFriends,
    });

  friendRequestResponse = ({requestorId, requestorName, isApproved}) =>
    new ActionEvent('friendRequestResponse', {
      requestorId,
      requestorName,
      isApproved,
    });

  commentLike = ({
    commentId,
    commentCreatorId,
    commentCreatorName,
    numberOfChars,
  }) =>
    new ActionEvent('commentLike', {
      commentId,
      commentCreatorId,
      commentCreatorName,
      numberOfChars,
    });

  saveAction = ({
    actorId,
    actorName,
    screenCollection,
    componentName,
    entityType,
    entitySubType,
    entitySubSubType,
    entityId,
    entityName,
    creatorName,
    creatorId,
    themes,
  }) =>
    new ActionEvent('saveAction', {
      actorId,
      actorName,
      screenCollection,
      componentName,
      entityType,
      entitySubType,
      entitySubSubType,
      entityId,
      entityName,
      creatorName,
      creatorId,
      themes,
    });

  unSaveAction = ({
    actorId,
    actorName,
    screenCollection,
    componentName,
    entityType,
    entitySubType,
    entitySubSubType,
    entityId,
    entityName,
    creatorName,
    creatorId,
    themes,
  }) =>
    new ActionEvent('unSaveAction', {
      actorId,
      actorName,
      screenCollection,
      componentName,
      entityType,
      entitySubType,
      entitySubSubType,
      entityId,
      entityName,
      creatorName,
      creatorId,
      themes,
    });

  clickedShareAction = ({
    actorId,
    actorName,
    screenCollection,
    componentName,
    entityType,
    entitySubType,
    entityId,
    entityName,
    creatorName,
    creatorId,
    themes,
    urlSlug,
  }) =>
    new ActionEvent('clickedShareAction', {
      actorId,
      actorName,
      screenCollection,
      componentName,
      entityType,
      entitySubType,
      entityId,
      entityName,
      creatorName,
      creatorId,
      themes,
      urlSlug,
    });

  shareAction = ({
    actorId,
    actorName,
    screenCollection,
    componentName,
    entityType,
    entitySubType,
    entityId,
    entityName,
    creatorName,
    shareType,
    creatorId,
    themes,
  }) =>
    new ActionEvent('shareAction', {
      actorId,
      actorName,
      screenCollection,
      componentName,
      entityType,
      entitySubType,
      entityId,
      entityName,
      creatorName,
      shareType,
      creatorId,
      themes,
    });

  thanksAction = ({
    actorId,
    actorName,
    screenCollection,
    componentName,
    entityType,
    entitySubType,
    entitySubSubType,
    entityId,
    creatorName,
    creatorId,
  }) =>
    new ActionEvent('thanksAction', {
      actorId,
      actorName,
      screenCollection,
      componentName,
      entityType,
      entitySubType,
      entitySubSubType,
      entityId,
      creatorName,
      creatorId,
    });

  unThanksAction = ({
    actorId,
    actorName,
    screenCollection,
    componentName,
    entityType,
    entitySubType,
    entitySubSubType,
    entityId,
    creatorName,
    creatorId,
  }) =>
    new ActionEvent('unThanksAction', {
      actorId,
      actorName,
      screenCollection,
      componentName,
      entityType,
      entitySubType,
      entitySubSubType,
      entityId,
      creatorName,
      creatorId,
    });

  voteAction = ({
    actorId,
    actorName,
    screenName,
    listId,
    listItemId,
    listViewType,
  }) =>
    new ActionEvent('voteAction', {
      actorId,
      actorName,
      screenName,
      listId,
      listItemId,
      listViewType,
    });

  unVoteAction = ({
    actorId,
    actorName,
    screenName,
    listId,
    listItemId,
    listViewType,
  }) =>
    new ActionEvent('unVoteAction', {
      actorId,
      actorName,
      screenName,
      listId,
      listItemId,
      listViewType,
    });

  clickToMessageAction = ({
    actorId,
    actorName,
    screenCollection,
    componentName,
    entityType,
    entitySubType,
    entityId,
    recipientId,
    recipientName,
    recipientType,
    interactionType,
  }) =>
    new ActionEvent('clickToMessageAction', {
      actorId,
      actorName,
      screenCollection,
      componentName,
      entityType,
      entitySubType,
      entityId,
      recipientId,
      recipientName,
      recipientType,
      interactionType,
    });

  clickOnStoryAction = ({actionType, screenName, entityId}) =>
    new ActionEvent('clickOnStoryAction', {
      actionType,
      screenName,
      entityId,
    });

  chatMessageAction = ({
    senderId,
    recipientId,
    conversationType = 'Private',
    pageName,
    pageId,
    isSenderPageOwner,
  }) =>
    new ActionEvent('chatMessageAction', {
      senderId,
      recipientId,
      conversationType,
      pageName,
      pageId,
      isSenderPageOwner,
    });

  comment = ({
    commentId,
    commentCreatorId,
    commentCreatorName,
    commentCreatorType,
    commentNumberOfChars,
    postId,
    postCreatorId,
    postCreatorName,
    postContainsMedia,
    postType,
    postNumberOfChars,
    postContextId,
    postContextName,
    hasMentions,
    mentions,
  }) =>
    new ActionEvent('comment', {
      commentId,
      commentCreatorId,
      commentCreatorName,
      commentNumberOfChars,
      commentCreatorType,
      postId,
      postCreatorId,
      postCreatorName,
      postContainsMedia,
      postType,
      postNumberOfChars,
      postContextId,
      postContextName,
      hasMentions,
      mentions,
    });

  clickOnEnableNotificationsPopup = ({originType}) =>
    new ActionEvent('clickOnEnableNotificationsPopup', {originType});

  search = ({
    keyword,
    searchType,
    numberOfResults,
    chosenEntityType,
    chosenEntityName,
    chosenEntityId,
  }) =>
    new ActionEvent('search', {
      keyword,
      searchType,
      numberOfResults,
      chosenEntityType,
      chosenEntityName,
      chosenEntityId,
    });

  searchRequest = ({keyword, searchType}) =>
    new ActionEvent('searchRequest', {keyword, searchType});

  listClickViewMore = ({listId, listName}) =>
    new ActionEvent('listClickViewMore', {listId, listName});

  carouselItemClick = ({
    carouselId,
    carouselType,
    entityId: id,
    entityType,
    index,
    originType,
    extraAnalyticsData,
  }) =>
    new ActionEvent('carouselItemClick', {
      carouselId,
      carouselType,
      entityId: id,
      entityType,
      index,
      originType,
      extraAnalyticsData,
    });

  followPage = ({pageId, pageName, themes, originType}) =>
    new ActionEvent('followPage', {pageId, pageName, themes, originType});

  unFollowPage = () => new ActionEvent('unFollowPage', {});

  joinedGroup = ({groupId, groupName, totalMembers, privacyType, originType}) =>
    new ActionEvent('joinedGroup', {
      groupId,
      groupName,
      totalMembers,
      privacyType,
      originType,
    });

  unJoinedGroup = () => new ActionEvent('unJoinedGroup', {});

  eventCreation = ({
    eventId,
    eventName,
    tags,
    privacyType,
    date,
    componentName,
  }) =>
    new ActionEvent('eventCreation', {
      eventId,
      eventName,
      tags,
      privacyType,
      date,
      componentName,
    });

  onboardingClickedJoinNow = ({origin}) =>
    new ActionEvent('onboardingClickedJoinNow', {origin});

  onboardingClickedSetNationality = ({
    originCountryName,
    destinationCountryName,
  }) =>
    new ActionEvent('onboardingClickedSetNationality', {
      originCountryName,
      destinationCountryName,
    });

  onboardingLanguageChanged = ({from, to}) =>
    new ActionEvent('onboardingLanguageChanged', {from, to});

  onboardingClickedAlreadyAMember = ({origin}) =>
    new ActionEvent('onboardingClickedAlreadyAMember', {origin});

  onboardingClickedContinueWithFacebook = ({success, failureReason = ''}) =>
    new ActionEvent('onboardingClickedContinueWithFacebook', {
      success,
      failureReason,
    });

  onboardingClickedContinueWithApple = ({success, failureReason = ''}) =>
    new ActionEvent('onboardingClickedContinueWithApple', {
      success,
      failureReason,
    });

  onboardingClickedContinueWithEmail = () =>
    new ActionEvent('onboardingClickedContinueWithEmail');

  onboardingClickedClickedGetStarted = ({email, success, failureReason = ''}) =>
    new ActionEvent('onboardingClickedClickedGetStarted', {
      email,
      success,
      failureReason,
    });

  onboardingClickedUploadPicture = ({userId, source}) =>
    new ActionEvent('onboardingClickedUploadPicture', {userId, source});

  onboardingUploadPictureSucceeded = ({userId}) =>
    new ActionEvent('onboardingUploadPictureSucceeded', {userId});

  onboardingSetOriginCountry = ({country}) =>
    new ActionEvent('onboardingSetOriginCountry', {country});

  onboardingSetDestinationCountry = ({country}) =>
    new ActionEvent('onboardingSetDestinationCountry', {country});

  onboardingMissingCommunity = ({fromCountry, toCountry}) =>
    new ActionEvent('onboardingMissingCommunity', {fromCountry, toCountry});

  onboardingSetCity = ({userId, country, city}) =>
    new ActionEvent('onboardingSetCity', {userId, country, city});

  onboardingSetEmail = ({userId, email}) =>
    new ActionEvent('onboardingSetEmail', {userId, email});

  onboardingSetGender = ({userId, gender}) =>
    new ActionEvent('onboardingSetGender', {userId, gender});

  onboardingJoinAlternateCommunity = ({from, to}) =>
    new ActionEvent('onboardingJoinAlternateCommunity', {from, to});

  onboardingAddFriends = ({addedFriendsCount}) =>
    new ActionEvent('onboardingAddFriends', {addedFriendsCount});

  onboardingEnableNotificationsPopup = ({userId, enabled}) =>
    new ActionEvent('onboardingEnableNotificationsPopup', {userId, enabled});

  onboardingEnableNotificationsNative = ({userId, enabled}) =>
    new ActionEvent('onboardingEnableNotificationsNative', {userId, enabled});

  onboardingJoinedCommunity = ({
    communityId,
    communityName,
    isOnWaitingList,
    destinationCity,
    ...restTrackingProps
  }) =>
    new ActionEvent('onboardingJoinedCommunity', {
      communityId,
      communityName,
      isOnWaitingList,
      destinationCity,
      ...restTrackingProps,
    });

  onboardingTooltipView = ({field}) =>
    new ActionEvent('onboardingTooltipView', {field});

  invitedFriend = ({userId, inviteMethod, origin}) =>
    new ActionEvent('invitedFriend', {userId, inviteMethod, origin});

  deleteAccount = () => new ActionEvent('deleteAccount');

  changeNotificationsSettings = ({emailEnabled, pushEnabled}) =>
    new ActionEvent('changeNotificationsSettings', {emailEnabled, pushEnabled});

  hideMessage = () => new ActionEvent('hideMessage');

  listMapView = ({listId, listName}) =>
    new ActionEvent('listMapView', {listId, listName});

  abusiveReportSubmission = ({
    entityType,
    entityId,
    entityName,
    reportType,
    reportTypeName,
    description,
  }) =>
    new ActionEvent('abusiveReportSubmission', {
      entityType,
      entityId,
      entityName,
      reportType,
      reportTypeName,
      description,
    });

  conversationBlockSubmission = ({type, participantId, participantName}) =>
    new ActionEvent('conversationBlockSubmission', {
      type,
      participantId,
      participantName,
    });

  clickOnBadge = ({badgeType, expertTag, componentName}) =>
    new ActionEvent('clickOnBadge', {badgeType, expertTag, componentName});

  clickedOnLearnMore = ({badgeType}) =>
    new ActionEvent('clickedOnLearnMore', {badgeType});

  clickedOnApplyNow = ({badgeType, componentName}) =>
    new ActionEvent('clickedOnApplyNow', {badgeType, componentName});

  // updateUsersPushNotificationStatus = ({ pushEnabled }) => new ActionEvent('updateUsersPushNotificationStatus', { pushEnabled });

  clickedConnectInstagram = () => new ActionEvent('clickedConnectInstagram');

  connectToInstagram = () => new ActionEvent('connectToInstagram');
}

export default ActionEvents;
