/* eslint-disable quote-props */
const getDate = () => new Date().toISOString();

class ActionEvents {
  constructor(provider) {
    this.provider = provider;
  }

  signup = ({registrationMethod, channel, campaign, ...restTrackingProps}) => {
    this.provider.trackWithProperties('Sign Up', {
      'Registration Method': registrationMethod,
      channel,
      campaign,
      ...restTrackingProps,
    });
    this.provider.set({channel, campaign});
    this.provider.setOnce({'Date of Account Creation': getDate()});
  };

  signupFailed = ({
    failureReason,
    registrationMethod,
    ...restTrackingProps
  }) => {
    this.provider.trackWithProperties('Signup Failed', {
      'Failure Reason': failureReason,
      'Registration Method': registrationMethod,
      ...restTrackingProps,
    });
  };

  signIn = ({
    success,
    failureReason,
    email,
    name,
    registrationMethod,
    communityId,
    communityName,
  }) => {
    this.provider.trackWithProperties('SignIn', {
      Success: success,
      'Failure Reason': failureReason,
      Email: email,
      Name: name,
      'Registration Method': registrationMethod,
      'Community Id': communityId,
      'Community Name': communityName,
    });

    this.provider.increment('Total Sign Ins', 1);
    this.provider.set({'Date of Last Sign In': getDate()});
  };

  logout = () => {
    this.provider.track('Logout');

    this.provider.set({'Date Of Last Logout': getDate()});
  };

  updateProfilePicture = () => {
    this.provider.trackWithProperties('Update Profile Picture');
    this.provider.set({'Has Profile Picture': true});
  };

  abusiveReportSubmission = ({
    entityType,
    entityId,
    entityName,
    reportType,
    reportTypeName,
    description,
  }) => {
    this.provider.trackWithProperties('Abusive Report Submission', {
      'Entity Type': entityType,
      'Entity Name': entityName,
      'Entity Id': entityId,
      'Report Type': reportType,
      'Report Type Name': reportTypeName,
      Description: description,
    });
  };

  conversationBlockSubmission = ({type, participantId, participantName}) => {
    this.provider.trackWithProperties('Conversation blocked', {
      Type: type,
      'Participant Id': participantId,
      'Participant Name': participantName,
    });
  };

  clickOnBadge = ({badgeType, expertTag, componentName}) => {
    this.provider.trackWithProperties('Click on Badge', {
      'Badge type': badgeType,
      'Expert tag': expertTag,
      'Component Name': componentName,
    });
  };

  clickedOnLearnMore = ({badgeType}) => {
    this.provider.trackWithProperties('Click on "Learn more"', {
      'Badge type': badgeType,
    });
  };

  clickedOnApplyNow = ({badgeType, componentName}) => {
    this.provider.trackWithProperties('Click on "Apply now"', {
      'Badge type': badgeType,
      'Component name': componentName,
    });
  };

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
  }) => {
    const trackProps = {
      Success: success,
      'Failure Reason': failureReason,
      'Post Id': postId,
      'Post Creator Id': postCreatorId,
      'Post Creator Name': postCreatorName,
      'Contains Media': containsMedia,
      'Post Type': postType,
      'Post Sub Type': postSubType,
      'Number of Chars': numberOfChars,
      'Context Id': contextId,
      'Context Type': contextType,
      'Context Name': contextName,
      'Has Mentions': hasMentions,
      'Activation Type': activationType,
      'Activation Sub Type': activationSubType,
      Mentions: mentions,
      'Is Passive': isPassive,
      'List Id': listId,
      'List Name': listName,
      Tags: tags,
    };

    if (activationPostData) {
      trackProps['Activation Question'] = activationPostData.question;
      trackProps['Activation Answer'] = activationPostData.answer;
      trackProps.Origin = activationPostData.origin;
    }

    this.provider.trackWithProperties('Post Creation', trackProps);

    this.provider.increment('Total Posts', 1);
    this.provider.set({'Date of Last Post': getDate()});
  };

  listItemCreation = ({
    isPassive,
    listName,
    listId,
    pageId,
    creatorName,
    creatorId,
    componentName,
  }) => {
    this.provider.trackWithProperties('List Item Creation', {
      'Component name': componentName,
      'Is Passive': isPassive,
      'List Id': listId,
      'List Name': listName,
      'Page Id': pageId,
      'Creator Id': creatorId,
      'Creator Name': creatorName,
    });
  };

  postEdit = ({success, failureReason, postId, delta}) => {
    this.provider.trackWithProperties('Post Edit', {
      Success: success,
      'Failure Reason': failureReason,
      'Post Id': postId,
      Delta: delta,
    });
  };

  groupCreation = ({
    success,
    failureReason,
    groupId,
    groupName,
    totalMembers,
    containsMedia,
    privacyType,
  }) => {
    this.provider.trackWithProperties('Group Creation', {
      Success: success,
      'Failure Reason': failureReason,
      'Group Id': groupId,
      'Group Name': groupName,
      'Total Members': totalMembers,
      'Contains Media': containsMedia,
      'Privacy Type': privacyType,
    });

    this.provider.increment('Total Groups Owned', 1);
    this.provider.increment('Total Groups', 1);
  };

  pageCreation = ({
    success,
    failureReason,
    pageId,
    pageName,
    tags,
    isOwner,
  }) => {
    this.provider.trackWithProperties('Page Creation', {
      Success: success,
      'Failure Reason': failureReason,
      'Page Id': pageId,
      'Page Name': pageName,
      Tags: tags,
      'Is Owner': isOwner,
    });
  };

  friendRequest = ({friendId, friendName, totalMutualFriends}) => {
    this.provider.trackWithProperties('Friend Request', {
      'Friend Id': friendId,
      'Friend Name': friendName,
      'Total Mutual Friends': totalMutualFriends,
    });

    this.provider.increment('Total Friend Requests', 1);
    this.provider.set({'Date of Last Friend Request': getDate()});
  };

  friendRequestResponse = ({requestorId, requestorName, isApproved}) => {
    this.provider.trackWithProperties('Friend Request Response', {
      'Requestor Id': requestorId,
      'Requestor Name ': requestorName,
      'Is Approved ': isApproved,
    });

    this.provider.increment('Total Friend Request Approvals', 1);
  };

  commentLike = ({
    commentId,
    commentCreatorId,
    commentCreatorName,
    numberOfChars,
  }) => {
    this.provider.trackWithProperties('Like', {
      'Comment Id': commentId,
      'Comment Creator Id': commentCreatorId,
      'Comment Creator Name': commentCreatorName,
      'Number of Chars': numberOfChars,
    });

    this.provider.increment('Total Likes', 1);
    this.provider.set({'Date of Last Like': getDate()});
  };

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
  }) => {
    this.provider.trackWithProperties('Save', {
      'Actor Id': actorId,
      'Actor Name': actorName,
      'Screen Collection': screenCollection,
      'Component Name': componentName,
      'Entity Type': entityType,
      'Entity Sub Type': entitySubType,
      'Entity Sub Sub Type': entitySubSubType,
      'Entity Id': entityId,
      'Entity Name': entityName,
      'Creator Name': creatorName,
      'Creator Id': creatorId,
      'Themes Names': themes,
    });

    this.provider.increment('Total Saves', 1);
    this.provider.set({'Date of Last Save': getDate()});
  };

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
  }) => {
    this.provider.trackWithProperties('Unsave', {
      'Actor Id': actorId,
      'Actor Name': actorName,
      'Screen Collection': screenCollection,
      'Component Name': componentName,
      'Entity Type': entityType,
      'Entity Sub Type': entitySubType,
      'Entity Sub Sub Type': entitySubSubType,
      'Entity Id': entityId,
      'Entity Name': entityName,
      'Creator Name': creatorName,
      'Creator Id': creatorId,
    });

    this.provider.increment('Total Saves', -1);
  };

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
  }) => {
    this.provider.trackWithProperties('Clicked on Share', {
      'Actor Id': actorId,
      'Actor Name': actorName,
      'Component Name': componentName,
      'Creator Id': creatorId,
      'Creator Name': creatorName,
      'Entity Id': entityId,
      'Entity Name': entityName,
      'Entity Type': entityType,
      'Entity Sub Type': entitySubType,
      'Screen Collection': screenCollection,
      'Themes Names': themes,
      'Share URL': urlSlug,
    });

    this.provider.increment('Total Share Clicks', 1);
    this.provider.set({'Date of Last Share click': getDate()});
  };

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
  }) => {
    this.provider.trackWithProperties('Share', {
      'Actor Id': actorId,
      'Actor Name': actorName,
      'Component Name': componentName,
      'Creator Id': creatorId,
      'Creator Name': creatorName,
      'Entity Id': entityId,
      'Entity Name': entityName,
      'Entity Type': entityType,
      'Entity Sub Type': entitySubType,
      'Screen Collection': screenCollection,
      'Share type': shareType,
      'Themes Names': themes,
    });

    this.provider.increment('Total Shares', 1);
    this.provider.set({'Date of Last Share': getDate()});
  };

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
  }) => {
    this.provider.trackWithProperties('Thanks', {
      'Actor Id': actorId,
      'Actor Name': actorName,
      'Screen Collection': screenCollection,
      'Component Name': componentName,
      'Entity Type': entityType,
      'Entity Sub Type': entitySubType,
      'Entity Sub Sub Type': entitySubSubType,
      'Entity Id': entityId,
      'Creator Name': creatorName,
      'Creator Id': creatorId,
    });

    this.provider.increment('Total Thanks', 1);
    this.provider.set({'Date of Last Thank': getDate()});
  };

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
  }) => {
    this.provider.trackWithProperties('UnThanks', {
      'Actor Id': actorId,
      'Actor Name': actorName,
      'Screen Collection': screenCollection,
      'Component Name': componentName,
      'Entity Type': entityType,
      'Entity Sub Type': entitySubType,
      'Entity Sub Sub Type': entitySubSubType,
      'Entity Id': entityId,
      'Creator Name': creatorName,
      'Creator Id': creatorId,
    });

    this.provider.increment('Total Thanks', -1);
  };

  voteAction = ({
    actorId,
    actorName,
    screenName,
    listId,
    listItemId,
    listViewType,
  }) => {
    this.provider.trackWithProperties('Vote', {
      'Actor Id': actorId,
      'Actor Name': actorName,
      'Screen Name': screenName,
      'List Id': listId,
      'List Item Id': listItemId,
      'List View Type': listViewType,
    });

    this.provider.increment('Total Votes', 1);
    this.provider.set({'Date of Last Vote': getDate()});
  };

  unVoteAction = ({
    actorId,
    actorName,
    screenName,
    listId,
    listItemId,
    listViewType,
  }) => {
    this.provider.trackWithProperties('UnVote', {
      'Actor Id': actorId,
      'Actor Name': actorName,
      'Screen Name': screenName,
      'List Id': listId,
      'List Item Id': listItemId,
      'List View Type': listViewType,
    });

    this.provider.increment('Total Votes', -1);
  };

  chatMessageAction = ({
    senderId,
    recipientId,
    conversationType,
    pageName,
    pageId,
    isSenderPageOwner,
  }) => {
    this.provider.trackWithProperties('ChatMessage', {
      senderId,
      recipientId,
      'Conversation Type': conversationType,
      'Page Name': pageName,
      'Page ID': pageId,
      'Is Sender Page Owner': isSenderPageOwner,
    });
  };

  clickToMessageAction = ({
    actorId,
    actorName,
    screenCollection,
    componentName,
    entityType,
    entitySubType,
    entitySubSubType,
    entityId,
    recipientId,
    recipientName,
    recipientType,
    interactionType,
  }) => {
    this.provider.trackWithProperties('Click to Message', {
      'Actor Id': actorId,
      'Actor Name': actorName,
      'Screen Collection': screenCollection,
      'Component Name': componentName,
      'Entity Type': entityType,
      'Entity Sub Type': entitySubType,
      'Entity Sub Sub Type': entitySubSubType,
      'Entity Id': entityId,
      'Recipient Id': recipientId,
      'Recipient Name': recipientName,
      'Recepient Type': recipientType,
      'Interaction Type': interactionType,
    });
  };

  clickOnStoryAction = ({actionType, screenName, entityId}) => {
    const params = {
      Action: actionType,
      Screen: screenName,
    };

    if (entityId) {
      params['Entity id'] = entityId;
    }

    this.provider.trackWithProperties('Clicked on a story', params);
  };

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
  }) => {
    this.provider.trackWithProperties('Comment', {
      'Comment Id': commentId,
      'Comment Creator Id': commentCreatorId,
      'Comment Creator Name': commentCreatorName,
      'Comment Number of Chars': commentNumberOfChars,
      'Comment Creator Type': commentCreatorType,
      'Post Id': postId,
      'Post Creator Id': postCreatorId,
      'Post Creator Name': postCreatorName,
      'Post Contains Media': postContainsMedia,
      'Post Type': postType,
      'Post Number of Chars': postNumberOfChars,
      'Post Context Id': postContextId,
      'Post Context Name': postContextName,
      'Has Mentions': hasMentions,
      Mentions: mentions,
    });

    this.provider.increment('Total Comments', 1);
    this.provider.set({'Date of Last Comment': getDate()});
  };

  searchRequest = ({keyword, searchType}) => {
    const trackProps = {
      Keyword: keyword,
    };

    if (searchType) {
      trackProps['Search Type'] = searchType;
    }

    this.provider.trackWithProperties('Search Term', trackProps);
  };

  search = ({
    keyword,
    numberOfResults,
    chosenEntityType,
    chosenEntityName,
    chosenEntityId,
  }) => {
    this.provider.trackWithProperties('Search', {
      Keyword: keyword,
      'Number Of Results': numberOfResults,
      'Chosen Entity Type': chosenEntityType,
      'Chosen Entity Name': chosenEntityName,
      'Chosen Entity Id': chosenEntityId,
    });
  };

  clickOnEnableNotificationsPopup = ({originType}) => {
    this.provider.trackWithProperties('Click on enable notifications popup', {
      'Origin Type': originType,
    });
  };

  listClickViewMore = ({listId, listName}) => {
    this.provider.trackWithProperties('List View More', {
      'List ID': listId,
      'List Name': listName,
    });
  };

  carouselItemClick = ({
    carouselId,
    carouselType,
    entityId,
    entityType,
    index,
    originType,
    extraAnalyticsData = {},
  }) => {
    this.provider.trackWithProperties('Carousel Item Click', {
      'Carousel ID': carouselId,
      'Carousel Type': carouselType,
      'Entity Id': entityId,
      'Entity Type': entityType,
      'Item Index': index,
      'Origin Type': originType,
      ...extraAnalyticsData,
    });
  };

  followPage = ({pageId, pageName, themes, originType}) => {
    this.provider.trackWithProperties('Follows Page', {
      'Page ID': pageId,
      'Page Name': pageName,
      Themes: themes,
      'origin Type': originType,
    });

    this.provider.increment('Total Followed Pages', 1);
    this.provider.set({'Date of Last Page Followed': getDate()});
  };

  unFollowPage = () => {
    this.provider.increment('Total Followed Pages', -1);
  };

  joinedGroup = ({
    groupId,
    groupName,
    totalMembers,
    privacyType,
    originType,
  }) => {
    this.provider.trackWithProperties('Joined Group', {
      'Group ID': groupId,
      'Group Name': groupName,
      'Total Members': totalMembers,
      'Privacy Type': privacyType,
      'origin Type': originType,
    });

    this.provider.increment('Total Groups Following', 1);
    this.provider.set({'Date of Last Group Joined': getDate()});
  };

  unJoinedGroup = () => {
    this.provider.increment('Total Groups Following', -1);
  };

  eventCreation = ({
    eventId,
    eventName,
    tags,
    privacyType,
    date,
    componentName,
  }) => {
    this.provider.trackWithProperties(' Event Creation', {
      'Component name': componentName,
      'Event ID': eventId,
      'Event Name': eventName,
      Tags: tags,
      'Privacy Type': privacyType,
      Date: date,
    });
  };

  onboardingClickedJoinNow = ({origin}) => {
    this.provider.trackWithProperties('OB - Clicked on "Join Now"', {
      Origin: origin,
    });
  };

  onboardingClickedSetNationality = ({
    originCountryName,
    destinationCountryName,
  }) => {
    this.provider.trackWithProperties('OB - Clicked on set nationality', {
      'Origin Country Name': originCountryName,
      'Destination Country Name': destinationCountryName,
    });
  };

  onboardingLanguageChanged = ({from, to}) => {
    this.provider.trackWithProperties('OB - Language changed', {from, to});
  };
  onboardingClickedAlreadyAMember = ({origin}) => {
    this.provider.trackWithProperties('OB - Clicked on "Already a member"', {
      Origin: origin,
    });
  };

  onboardingClickedContinueWithFacebook = ({success, failureReason}) => {
    this.provider.trackWithProperties('OB - Clicked facebook', {
      Success: success,
      'Failure Reason': failureReason,
    });
  };

  onboardingClickedContinueWithApple = ({success, failureReason}) => {
    this.provider.trackWithProperties('OB - Clicked Apple', {
      Success: success,
      'Failure Reason': failureReason,
    });
  };

  onboardingClickedContinueWithEmail = () => {
    this.provider.track('OB - Clicked Email');
  };

  onboardingClickedClickedGetStarted = ({
    email,
    success,
    failureReason = '',
  }) => {
    this.provider.trackWithProperties('OB - Continue with email', {
      Email: email,
      Success: success,
      'Failure Reason': failureReason,
    });
  };

  onboardingClickedUploadPicture = ({source}) => {
    this.provider.trackWithProperties('OB - Clicked on Upload picture', {
      Source: source,
    });
  };

  onboardingUploadPictureSucceeded = () => {
    this.provider.track('OB - Upload picture succeeded');
  };

  onboardingSetCity = ({country, city}) => {
    this.provider.trackWithProperties('OB - Set current city ', {
      Country: country,
      City: city,
    });
  };

  onboardingSetEmail = ({email}) => {
    this.provider.trackWithProperties('OB - Set email', {
      Email: email,
    });
  };

  onboardingSetGender = ({gender}) => {
    this.provider.trackWithProperties('OB - Set gender', {
      Gender: gender,
    });
  };

  onboardingJoinedCommunity = ({
    communityId,
    communityName,
    isOnWaitingList,
    destinationCity,
    channel,
    campaign,
    ...restTrackingProps
  }) => {
    this.provider.trackWithProperties('OB - Joined community', {
      'Community Id': communityId,
      'Community Name': communityName,
      'On waiting list': isOnWaitingList,
      'Destination City': destinationCity,
      channel,
      campaign,
      ...restTrackingProps,
    });
    this.provider.set({channel, campaign, communityId, communityName});
  };

  onboardingMissingCommunity = ({fromCountry, toCountry}) => {
    this.provider.trackWithProperties('OB - Missing Community', {
      'From Country': fromCountry,
      'To Country': toCountry,
    });
  };

  onboardingSetOriginCountry = ({country}) => {
    this.provider.trackWithProperties('OB - Set Origin Country', {
      Country: country,
    });
  };

  onboardingSetDestinationCountry = ({country}) => {
    this.provider.trackWithProperties('OB - Set Destination Country', {
      Country: country,
    });
  };

  onboardingJoinAlternateCommunity = ({from, to}) => {
    this.provider.trackWithProperties('OB - Join alternate', {
      from,
      to,
    });
  };

  onboardingAddFriends = ({addedFriendsCount}) => {
    this.provider.trackWithProperties('OB - Sent friend requests', {
      'Number of Friends Added': addedFriendsCount,
    });
  };

  onboardingEnableNotificationsPopup = ({enabled}) => {
    this.provider.trackWithProperties(
      'OB - Enable notifications popup (Yes,Later)',
      {
        'Enabled Notifications': enabled,
      },
    );
  };

  onboardingEnableNotificationsNative = ({enabled}) => {
    this.provider.trackWithProperties(
      'OB - Enable notifications native (Allow, Don’t allow)',
      {
        'Enabled Notifications': enabled,
      },
    );
  };

  onboardingTooltipView = ({field}) => {
    this.provider.trackWithProperties('OB - Tooltip view', {
      Field: field,
    });
  };

  invitedFriend = ({inviteMethod, origin}) => {
    this.provider.trackWithProperties('Invite', {
      'Invite Method': inviteMethod,
      Origin: origin,
    });
  };

  deleteAccount = () => this.provider.track('Account Deleted');

  changeNotificationsSettings = ({emailEnabled, pushEnabled}) => {
    this.provider.trackWithProperties('Change Notifications Settings', {
      'Email Notifications Enabled': emailEnabled,
      'Push Notifications Enabled': pushEnabled,
    });
    // this.updateUsersPushNotificationStatus({ pushEnabled });
  };

  hideMessage = () => this.provider.track('Hide Message');

  listMapView = ({listName, listId}) =>
    this.provider.trackWithProperties('List Map View', {
      'List Name': listName,
      'List ID': listId,
    });

  // updateUsersPushNotificationStatus = ({ pushEnabled }) => {
  //   this.provider.set({ 'Push Notifications Enabled': pushEnabled });
  // };

  clickedConnectInstagram = () => this.provider.track('Clicked on instagram');

  connectToInstagram = () => this.provider.track('Connected instagram');
}

export default ActionEvents;
