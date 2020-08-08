import {flipFlopColors} from './colors';

const userTypes = {
  USER: 0,
  ADMIN: 1,
  SUPER_ADMIN: 2,
};

const userRoleTypes = {
  REGIONAL_MANAGER: 'regionalManager',
  NATIONAL_MANAGER: 'nationalManager',
};

const communityTypes = {
  EXPATS: 'expats',
  ORIGIN_COUNTRY: 'originCountry',
};

const postTypes = {
  STATUS_UPDATE: 'statusUpdate',
  TIP_REQUEST: 'tipRequest',
  RECOMMENDATION: 'recommendation',
  MEETING: 'meeting',
  HOME_NOSTALGIC: 'homeNostalgic',
  PACKAGE: 'package',
  GUIDE: 'guide',
  SHARE: 'entityShare',
  PROMOTION: 'promotion',
  JOB: 'job',
  REAL_ESTATE: 'realEstate',
  GIVE_TAKE: 'giveAndTake',
  GROUP_ANNOUNCEMENT: 'groupAnnouncement',
  PASSIVE_POST: 'passive',
  INTRODUCTION: 'introduction',
  ACTIVATION: 'activation',
};

const shareTypes = {
  FLIPFLOP: 'flipFlop',
  WHATSAPP: 'whatsApp',
  EMAIL: 'email',
  LINK: 'copy link',
  SMS: 'sms',
  FACEBOOK: 'facebook',
  MORE: 'more',
};

const PlaceholderTypes = {
  POLYGON: 'polygon',
};

const activationSubTypes = {
  REAL_ESTATE_LOOKING_SUBLET: 'realEstateLookingSublet',
  REAL_ESTATE_OFFERING_SUBLET: 'realEstateOfferingSublet',
  REAL_ESTATE_LOOKING_RENT: 'realEstateLookingRent',
  REAL_ESTATE_OFFERING_RENT: 'realEstateOfferingRent',
  REAL_ESTATE_LOOKING_ROOMMATES: 'realEstateLookingRoommates',
  REAL_ESTATE_OFFERING_ROOMMATES: 'realEstateOfferingRoommates',
  SELL: 'sell',
  BUY: 'buy',
  JOB_LOOKING: 'jobLooking',
  JOB_OFFERING: 'jobOffering',
  LIST_ITEM: 'listItem',
  LIST: 'list',
  INVITE_FRIENDS: 'inviteFriends',
  PROMOTION: 'promotion',
  GROUP: 'group',
  GUIDE: 'guide',
  RECOMMENDATION: 'recommendation',
  EVENT: 'event',
};

const activationTypes = {
  QUESTION: 'activation_question',
  ACTION: 'activation_action',
  LIST: 'activation_list',
};

const userPermissions = {
  EDIT: 'edit',
  DELETE: 'delete',
  PIN_POST: 'pin_post',
  HIGHLIGHT: 'highlight_post',
};

const entityTypes = {
  USER: 'user',
  PAGE: 'page',
  POST: 'post',
  GROUP: 'group',
  CATEGORY: 'category',
  EVENT: 'event',
  PROFILE: 'profile',
  LIST: 'list',
  LIST_ITEM: 'listitem',
  COMMENT: 'comment',
  NEIGHBORHOOD: 'neighborhood',
  CHAT_MESSAGE: 'chatMessage',
  ACTIVATION: 'activation',
  SCHEDULED_POST: 'scheduledPost',
  COMMUNITY: 'community',
  NATIONALITY_GROUP: 'nationalityGroup',
};

const iconMaskTypes = {
  DEFAULT: 'default',
  DOUBLE: 'double',
  AVATAR: 'avatar',
};

const checkboxStyles = {
  CIRCLE: 'circle',
  RECTANGLE: 'rectangle',
};

const uiColorDefinitions = {
  [postTypes.STATUS_UPDATE]: flipFlopColors.aquaMarineTwo,
  [postTypes.TIP_REQUEST]: flipFlopColors.seafoamBlue,
  [postTypes.RECOMMENDATION]: flipFlopColors.cerise,
  [postTypes.MEETING]: flipFlopColors.green,
  [postTypes.HOME_NOSTALGIC]: flipFlopColors.green,
  [postTypes.PACKAGE]: flipFlopColors.golden,
  [postTypes.GUIDE]: flipFlopColors.redOrange,
  [postTypes.SHARE]: flipFlopColors.green,
  [postTypes.PROMOTION]: flipFlopColors.blueGrey,
  [postTypes.JOB]: flipFlopColors.azureTwo,
  [postTypes.REAL_ESTATE]: flipFlopColors.pinkRed,
  [postTypes.GIVE_TAKE]: flipFlopColors.aquaBlue,
  [postTypes.GROUP_ANNOUNCEMENT]: flipFlopColors.green,
  [entityTypes.EVENT]: flipFlopColors.marigold,
  [entityTypes.LIST]: flipFlopColors.shamrock,
  [entityTypes.LIST_ITEM]: flipFlopColors.shamrock,
  [entityTypes.PAGE]: flipFlopColors.blueberry,
  [entityTypes.GROUP]: flipFlopColors.golden,
};

const postUiDefinitions = {
  children: {
    name: 'newspaper',
    color: '#60878b',
  },
  [postTypes.TIP_REQUEST]: {
    name: 'lightbulb',
    color: uiColorDefinitions[postTypes.TIP_REQUEST],
  },
  [postTypes.RECOMMENDATION]: {
    name: 'star',
    color: uiColorDefinitions[postTypes.RECOMMENDATION],
  },
  [entityTypes.LIST]: {
    name: 'list-ul',
    color: uiColorDefinitions[entityTypes.LIST],
  },
  [postTypes.GUIDE]: {
    name: 'book',
    color: uiColorDefinitions[postTypes.GUIDE],
  },
  [entityTypes.EVENT]: {
    name: 'calendar-star',
    color: uiColorDefinitions[entityTypes.EVENT],
  },
  [postTypes.JOB]: {
    name: 'id-card',
    color: uiColorDefinitions[postTypes.JOB],
  },
  [postTypes.GIVE_TAKE]: {
    name: 'box-full',
    color: uiColorDefinitions[postTypes.GIVE_TAKE],
  },
  [postTypes.REAL_ESTATE]: {
    name: 'home-lg-alt',
    color: uiColorDefinitions[postTypes.REAL_ESTATE],
  },
  [postTypes.PROMOTION]: {
    name: 'gift',
    color: uiColorDefinitions[postTypes.PROMOTION],
  },
};

const uiDefinitions = {
  [postTypes.ACTIVATION]: {
    iconSize: 29,
    headerIconSize: 20,
    name: 'comment-alt',
  },
  [postTypes.STATUS_UPDATE]: {
    iconSize: 29,
    headerIconSize: 20,
    name: 'comment-alt',
  },
  [postTypes.TIP_REQUEST]: {
    iconSize: 31,
    headerIconSize: 20,
    name: 'lightbulb',
    disclaimerIcon: 'eye',
  },
  [postTypes.RECOMMENDATION]: {
    iconSize: 29,
    headerIconSize: 20,
    name: 'star',
  },
  [postTypes.MEETING]: {
    iconSize: 31,
    headerIconSize: 20,
    name: 'hand-paper',
  },
  [postTypes.GUIDE]: {
    iconSize: 29,
    headerIconSize: 20,
    name: 'book',
  },
  [postTypes.HOME_NOSTALGIC]: {
    iconSize: 31,
    headerIconSize: 20,
    name: 'frown',
  },
  [postTypes.PACKAGE]: {
    iconSize: 29,
    headerIconSize: 20,
    name: 'archive',
    disclaimerIcon: 'eye',
  },
  [postTypes.SHARE]: {
    iconSize: 29,
    headerIconSize: 20,
    name: 'comment-alt',
  },
  [postTypes.PROMOTION]: {
    iconSize: 29,
    headerIconSize: 20,
    name: 'gift',
  },
  [postTypes.JOB]: {
    iconSize: 30,
    headerIconSize: 20,
    name: 'briefcase',
  },
  [postTypes.REAL_ESTATE]: {
    iconSize: 29,
    headerIconSize: 20,
    postBreadcrumbIconLineHeight: 12,
    name: 'home',
  },
  [postTypes.GIVE_TAKE]: {
    iconSize: 30,
    headerIconSize: 20,
    breadcrumbLineHeight: 15,
    postBreadcrumbIconLineHeight: 13,
    name: 'handshake',
    disclaimerIcon: 'eye',
  },
  [postTypes.GROUP_ANNOUNCEMENT]: {
    iconSize: 26,
    headerIconSize: 20,
    breadcrumbIconSize: 16,
    breadcrumbLineHeight: 15,
    name: 'page-post',
    isHomeisIcon: true,
    disclaimerIcon: 'info-circle',
  },
  [entityTypes.EVENT]: {
    iconSize: 29,
    breadcrumbLineHeight: 14,
    name: 'calendar',
  },
  [entityTypes.LIST]: {
    iconSize: 29,
    headerIconSize: 20,
    breadcrumbLineHeight: 15,
    name: 'list-ul',
  },
  [entityTypes.LIST_ITEM]: {
    iconSize: 29,
    headerIconSize: 20,
    name: 'list-ul',
  },
  [entityTypes.GROUP]: {
    iconSize: 29,
    headerIconSize: 20,
    breadcrumbIconSize: 11,
    breadcrumbLineHeight: 14,
    postBreadcrumbIconSize: 10,
    postBreadcrumbIconLineHeight: 13,
    isHomeisIcon: true,
    name: 'groups-fill',
  },
  [entityTypes.PAGE]: {
    breadcrumbIconSize: 12,
    postBreadcrumbIconLineHeight: 13,
    name: 'globe',
  },
  [entityTypes.SCHEDULED_POST]: {
    iconSize: 29,
    headerIconSize: 20,
    name: 'clock',
  },
  theme: {
    name: 'user-astronaut',
  },
};

const suggestedSolutionsTypes = {
  SUGGESTED_LISTS: 'suggestedLists',
  SUGGESTED_EXPERTS: 'suggestedExperts',
  SUGGESTED_GUIDES: 'suggestedGuides',
  SUGGESTED_GROUPS: 'suggestedGroups',
  SUGGESTED_COMMUNITY_POSTS: 'suggestedCommunityPosts',
};

const suggestedItemTypes = {
  SUGGESTED_PAGES: 'suggestedPages',
  SUGGESTED_POSTS: 'suggestedPosts',
  SUGGESTED_GROUPS: 'suggestedGroups',
  SUGGESTED_EVENTS: 'suggestedEvents',
  SUGGESTED_LISTS: 'suggestedLists',
  SUGGESTED_MIXED: 'suggestedMixed',
  SUGGESTED_THEMES: 'suggestedThemes',
};

const postSubTypes = {
  OFFERING: 'offering',
  SEEKING: 'seeking',
};

const screenStateTypes = {
  COMPOSE: 'compose',
  UPLOAD: 'upload',
  SUBMIT_PENDING: 'submitPending',
  SUBMITTING: 'submitting',
};

const mediaTypes = {
  IMAGE: 'image',
  VIDEO: 'video',
};

const fetchTypes = {
  UPLOAD: 'upload',
  DOWNLOAD: 'download',
};

const uploadStateTypes = {
  UPLOADING: 'uploading',
  SUCCEED: 'succeed',
  CANCEL_SIGNALED: 'cancelSignaled',
  CANCELLED: 'cancelled',
  FAILED: 'failed',
};

const reportTypes = {
  SPAM: 0,
  OFFENSIVE: 1,
  SCAM: 2,
  DUPLICATE: 3,
  NOT_RELEVANT: 4,
  I_AM_THE_OWNER: 5,
  BAD_CONTENT: 6,
};

const groupRoleTypes = {
  OWNER: '0',
  MODERATOR: '1',
  MEMBER: '2',
  PENDING: '3',
  NOT_MEMBER: '4',
  INVITED: '5',
  IN_THE_GROUP: '6',
};

const groupPrivacyType = {
  PUBLIC: '0',
  PRIVATE: '1',
};

const signInMethodTypes = {
  EMAIL: 'email',
  FACEBOOK: 'facebook',
  APPLE: 'apple',
};

const signUpMethodTypes = {
  EMAIL: 'email',
  FACEBOOK: 'facebook',
  APPLE: 'apple',
};

const friendshipStatusType = {
  NOT_FRIENDS: 0,
  FRIENDS: 1,
  REQUEST_SENT: 2,
  REQUEST_RECEIVED: 3,
  REJECTED: 4,
};

const genderType = {
  MALE: 0,
  FEMALE: 1,
  OTHER: 2,
  UNKNOWN: 3,
};

const relationshipType = {
  SINGLE: 0,
  IN_RELATIONSHIP: 1,
  ENGAGED: 2,
  MARRIED: 3,
  DIVORCED: 4,
  WIDOWED: 5,
  ITS_COMPLICATED: 6,
  UNKNOWN: 7,
};

const eventPrivacyTypes = {
  PUBLIC: '0',
  PRIVATE: '1',
};

const userRolesPerEventFilter = {
  ANY: 0,
  HOST: 1,
  INVITEE: 2,
  INVITEE_INVITED: 3,
  INVITEE_YES: 4,
  INVITEE_NO: 5,
  INVITEE_MAYBE: 6,
  ATTENDEE: 7,
  MY_EVENTS: 8,
};

const rsvpStatuses = {
  INVITED: 0,
  YES: 1,
  NO: 2,
  MAYBE: 3,
  NO_RSVP: 4,
};

const inviteesListTypes = {
  GOING: 'going',
  INTERESTED: 'interested',
  INVITED: 'invited',
  CANT_GO: 'cantGo',
};

const deviceTypes = {
  // synced with database enum
  IOS: 'iOS',
  ANDROID: 'android',
  UNKNOWN: 'unknown',
};

const realEstateTypes = {
  RENT: 'rent',
  SUBLET: 'sublet',
  ROOMMATES: 'roommates',
  SWAP: 'swap',
  BUY_SELL: 'buy/sell',
  COMMERCIAL: 'commercial',
};

const jobTypes = {
  TECH: 'tech',
  FOOD: 'food',
  BABYSITTER: 'babysitter',
  REAL_ESTATE: 'realEstate',
  FINANCE: 'finance',
  SALES: 'sales',
  PRODUCTION: 'production',
  ADMINISTRATION: 'administration',
  EDUCATION: 'education',
  SERVICES: 'services',
  OTHER: 'other',
};

const giveTakeTypes = {
  FREE: 'free',
  PRICE: 'for sale',
};

const passivePostSubTypes = {
  LIST_ITEM_CREATED: 'itemCreated',
  INSTAGRAM_CONNECT: 'instagramConnect',
  COMMUNITY_JOINED: 'communityJoined',
};

const screenNames = {
  Welcome: 'Welcome',
  SignIn: 'SignIn',
  ForgotPassword: 'ForgotPassword',
  EmailSent: 'EmailSent',
  ChangePassword: 'ChangePassword',
  SignUp: 'SignUp',
  SetUserNationality: 'SetUserNationality',
  ContinueWithNationality: 'ContinueWithNationality',
  SetUserGender: 'SetUserGender',
  SearchCountry: 'SearchCountry',
  OnBoardingAddFriends: 'OnBoardingAddFriends',
  OnBoardingDiscover: 'OnBoardingDiscover',
  AllowNotifications: 'AllowNotifications',
  HomeTab: 'Home',
  PeopleTab: 'Discover',
  InviteFriends: 'InviteFriends',
  GroupsTab: 'Groups',
  SolutionsHome: 'Solutions',
  SolutionsResults: 'SolutionsResults',
  CreateGroup: 'CreateGroup',
  GroupView: 'GroupView',
  GroupRules: 'GroupRules',
  GroupEdit: 'GroupEdit',
  ManageGroupMembers: 'ManageGroupMembers',
  InviteMembers: 'InviteMembers',
  Events: 'Events',
  CreateEvent: 'CreateEvent',
  EventEdit: 'EventEdit',
  EventView: 'EventView',
  EventDateAndTime: 'EventDateAndTime',
  DatesPicker: 'DatesPicker',
  HookedEntitiesList: 'HookedEntitiesList',
  SearchAddress: 'SearchAddress',
  EventInviteGuests: 'EventInviteGuests',
  EventInviteesList: 'EventInviteesList',
  CityTab: 'CityGuide',
  CityResults: 'CityResults',
  Pages: 'Pages',
  CreatePage: 'CreatePage',
  AddPageDetails: 'AddPageDetails',
  AddDescription: 'AddDescription',
  ContextPicker: 'ContextPicker',
  OpeningHoursSelector: 'OpeningHours',
  PageView: 'PageView',
  SaversAndFollowers: 'SaversAndFollowers',
  PageEdit: 'PageEdit',
  InviteFollowers: 'PageInviteFollowers',
  Chat: 'Chat',
  ChatInteraction: 'ChatInteraction',
  ChatUserSelector: 'ChatUserSelector',
  ConversationsList: 'ConversationsList',
  Notifications: 'Notifications',
  ChatLobby: 'ChatLobby',
  ImageUpload: 'ImageUpload',
  MediaGalleryModal: 'MediaGalleryModal',
  PostVideoModal: 'PostVideoModal',
  PostEditor: 'PostEditor',
  CategoryPicker: 'CategoryPicker',
  PostPage: 'Post',
  Profile: 'Profile',
  ConnectedUsersList: 'ConnectedUsersList',
  OthersFriendsList: 'ViewerFriendsList',
  ProfileGroupsList: 'ProfileGroupsList',
  ProfilePagesList: 'ProfilePagesList',
  EditProfile: 'EditProfile',
  EditProfileRelationship: 'EditProfileRelationship',
  EditProfileGender: 'EditProfileGender',
  EditProfileDate: 'EditProfileDate',
  Settings: 'Settings',
  WebView: 'WebView',
  ViewOnlyMembersList: 'ViewOnlyMembersList',
  EntitiesList: 'EntitiesList',
  MediaModal: 'MediaModal',
  Search: 'Search',
  EntitiesInLocation: 'EntitiesInLocation',
  CommentEditor: 'CommentEditor',
  AbusiveReportForm: 'AbusiveReportForm',
  AddListItem: 'AddListItem',
  ListOfLists: 'ListOfLists',
  ListView: 'ListView',
  Medias: 'Medias',
  PostListsView: 'PostListsView',
  MyThemeView: 'MyThemeView',
  MyNeighborhoodView: 'MyNeighborhoodView',
  OthersThemeView: 'OthersThemeView',
  ChangeEmail: 'ChangeEmail',
  ReferralProgramStatus: 'ReferralProgramStatus',
  ReferralRedeemed: 'ReferralRedeemed',
  SetUserDetails: 'SetUserDetails',
  NoNationality: 'NoNationality',
  IntroductionPostEditorScreen: 'IntroductionPostEditorScreen',
  MapScreen: 'MapScreen',
  DeleteAccount: 'DeleteAccount',
  DeleteAccountConfirmation: 'DeleteAccountConfirmation',
  SignUpMethods: 'SignUpMethods',
  RichTextEditor: 'RichTextEditor',
  SavedItemsView: 'SavedItemsView',
};

const screenGroupNames = {
  AUTHENTICATION: 'authentication',
  SIGN_UP_WIZARD: 'SignUpWizard',
  SIGNED_IN: 'SignedIn',
  TABS: 'Tabs',
  HOME_TAB: 'HomeTab',
  PEOPLE_TAB: 'PeopleTab',
  GROUPS_TAB: 'Groups',
  CITY_TAB: 'CityTab',
  POST: 'Post',
  CREATE_PAGE_MODAL: 'CreatePageModal',
  CREATE_GROUP_MODAL: 'CreateGroupModal',
  CREATE_EVENT_MODAL: 'CreateEventModal',
  CREATE_POST_MODAL: screenNames.PostEditor,
  NOTIFICATIONS: 'Notifications',
  SOLUTIONS: 'Solutions',
  CHAT_LOBBY: 'ChatLobby',
  MY_CITY: 'MyCity',
};

const screenNamesAliases = {
  Page: screenNames.PageView,
  Event: screenNames.EventView,
  Group: screenNames.GroupView,
  List: screenNames.ListView,
};

export const webDomainRoutes = {
  POSTS: 'posts',
  GUIDES: 'guides',
  LISTS: 'lists',
  PAGES: 'pages',
  FRIEND_REQUESTS: 'friendRequests',
  RECOMMENDED_USERS: 'recommendedUsers',
  GROUPS: 'groups',
  CHANNELS: 'channels',
  EVENTS: 'events',
  JOBS: 'jobs',
  REAL_ESTATE: 'real-estate',
  GIVE_TAKE: 'give-and-take',
  TIP_REQUEST: 'questions',
  CHAT: 'chat',
};

const screenNamesByUniversalLinks = {
  [entityTypes.PROFILE]: screenNames.Profile,
  [webDomainRoutes.LISTS]: screenNamesAliases.List,
  [webDomainRoutes.PAGES]: screenNamesAliases.Page,
  [webDomainRoutes.GROUPS]: screenNamesAliases.Group,
  [webDomainRoutes.EVENTS]: screenNamesAliases.Event,
  [webDomainRoutes.POSTS]: screenGroupNames.POST,
  [webDomainRoutes.GIVE_TAKE]: screenGroupNames.POST,
  [webDomainRoutes.REAL_ESTATE]: screenGroupNames.POST,
  [webDomainRoutes.JOBS]: screenGroupNames.POST,
  [webDomainRoutes.TIP_REQUEST]: screenGroupNames.POST,
  [webDomainRoutes.GUIDES]: screenGroupNames.POST,
  [webDomainRoutes.CHANNELS]: screenNamesAliases.Group,
  [webDomainRoutes.CHAT]: screenNames.CHAT,
  [postTypes.ACTIVATION]: screenGroupNames.POST,
};

const screenNamesWithTabNavigation = {
  GroupView: screenGroupNames.GROUPS_TAB,
};

const screensWithoutFooter = {
  PageView: true,
  PostEditor: true,
  Post: true,
  PostVideoModal: true,
  CreateGroupModal: true,
  CreateGroup: true,
  GroupEdit: true,
  ManageGroupMembers: true,
  InviteMembers: true,
  PageInviteFollowers: true,
  CreateEventModal: true,
  CreateEvent: true,
  CategoryPicker: true,
  SearchAddress: true,
  EventInviteGuests: true,
  EventEdit: true,
  EventDateAndTime: true,
  HookedEntitiesList: true,
  EventInviteesList: true,
  CreatePageModal: true,
  OpeningHours: true,
  PageEdit: true,
  WebView: true,
  Search: true,
  EntitiesInLocation: true,
  MediaModal: true,
  ImageUpload: true,
  Chat: true,
  EditProfile: true,
  EditProfileRelationship: true,
  EditProfileGender: true,
  EditProfileDate: true,
  Settings: true,
  InviteFriends: true,
  CommentEditor: true,
  Listitem: true,
  AddDescription: true,
  ContextPicker: true,
  ChangeEmail: true,
  ReferralProgramStatus: true,
  ReferralRedeemed: true,
  IntroductionPostEditorScreen: true,
  ChatUserSelector: true,
  ChatInteraction: true,
  MapScreen: true,
  DeleteAccount: true,
  DeleteAccountConfirmation: true,
};

const screenNamesByEntityType = {
  [entityTypes.PAGE]: screenNames.PageView,
  [entityTypes.POST]: screenNames.PostPage,
  [entityTypes.EVENT]: screenNames.EventView,
  [entityTypes.USER]: screenNames.Profile,
  [entityTypes.GROUP]: screenNames.GroupView,
  [entityTypes.LIST]: screenNames.ListView,
};

const screenNamesTabByEntityType = {
  [entityTypes.EVENT]: screenNames.Events,
  [entityTypes.USER]: screenNames.PeopleTab,
  [entityTypes.GROUP]: screenNames.GroupsTab,
  [entityTypes.POST]: screenNames.CityResults,
};

const entityTypeBySlug = {
  'real-estate': entityTypes.POST,
  'give-and-take': entityTypes.POST,
  jobs: entityTypes.POST,
  guides: entityTypes.POST,
  channels: entityTypes.GROUP,
  profile: entityTypes.USER,
  people: entityTypes.USER,
};

const postTypeBySlug = {
  posts: postTypes.GUIDE,
  'real-estate': postTypes.REAL_ESTATE,
  'give-and-take': postTypes.GIVE_TAKE,
  jobs: postTypes.JOB,
};

const entityIconAndColorByEntityType = {
  [entityTypes.USER]: {
    entityIcon: 'discover',
    entityColor: flipFlopColors.pink,
  },
  [entityTypes.GROUP]: {
    entityIcon: 'groups-fill',
    entityColor: flipFlopColors.golden,
  },
  [entityTypes.POST]: {entityIcon: 'guide', entityColor: flipFlopColors.orange},
  [entityTypes.CATEGORY]: {
    entityIcon: 'directory-small',
    entityColor: flipFlopColors.blueberry,
  },
  [entityTypes.PAGE]: {
    entityIcon: 'globe',
    isAwesomeIcon: true,
    entityColor: flipFlopColors.blueberry,
  },
  [entityTypes.EVENT]: {
    entityIcon: 'events',
    entityColor: flipFlopColors.darkCoral,
  },
  [entityTypes.LIST]: {
    entityIcon: 'list-ul',
    entityColor: flipFlopColors.pinkishRed,
    isAwesomeIcon: true,
  },
  [entityTypes.NEIGHBORHOOD]: {
    entityIcon: 'location',
    entityColor: flipFlopColors.skyBlue,
  },
};

const interactionTypes = {
  DRINK: 'drink',
  COFFEE: 'coffee',
  BUSINESS: 'business',
  GENERAL: 'general',
  [postTypes.REAL_ESTATE]: postTypes.REAL_ESTATE,
  [postTypes.GIVE_TAKE]: postTypes.GIVE_TAKE,
  [postTypes.JOB]: postTypes.JOB,
};

const chatInteractioDefinitions = {
  [interactionTypes.DRINK]: {
    name: 'drink',
    iconName: 'glass-cheers',
    iconColor: 'rgba(240,217,255,1)',
    titleColor: 'rgba(176,133,204,1)',
    iconSize: 15,
  },
  [interactionTypes.COFFEE]: {
    name: 'coffee',
    iconName: 'coffee',
    iconColor: 'rgba(255,233,217,1)',
    titleColor: 'rgba(217,160,119,1)',
    iconSize: 15,
  },
  [interactionTypes.BUSINESS]: {
    name: 'business',
    iconName: 'briefcase',
    iconColor: 'rgba(255,217,217,1)',
    titleColor: 'rgba(204,133,133,1)',
    iconSize: 15,
  },
  [interactionTypes.GENERAL]: {
    name: 'general',
    iconName: 'comment',
    iconColor: flipFlopColors.veryLightBlueTwo,
    titleColor: flipFlopColors.veryLightBlueTwo,
    iconSize: 15,
  },
  [postTypes.GIVE_TAKE]: {
    name: 'giveAndTake',
    iconName: 'giveAndTake',
    isBoardsInteraction: true,
    iconSize: 32,
  },
  [postTypes.REAL_ESTATE]: {
    name: 'realEstate',
    iconName: 'realEstate',
    isBoardsInteraction: true,
    iconSize: 32,
  },
  [postTypes.JOB]: {
    name: 'job',
    iconName: 'job',
    isBoardsInteraction: true,
    iconSize: 32,
  },
};

const editModes = {
  CREATE: 0,
  EDIT: 1,
};

const dateAndTimeFormats = {
  dateTime: 'dddd, MMMM Do [at] h:mm A',
  dateTimeWithYear: 'dddd, MMMM Do YYYY [at] h:mm A',
  isoDateOnly: 'YYYY-MM-DD',
  isoTimeOnly: 'HH:mm',
  eventDatePicker: 'ddd MMM DD',
  eventDateInput: 'dddd - MMM DD, YYYY - h:mm A',
  eventShortDate: 'dddd, MMMM Do',
  eventStartTime: 'DD-MMM-hh:mm A',
  eventEndTime: 'hh:mm A',
  eventDayMonthTime: 'DD MMM, YYYY · HH:mm',
  eventDayTime: 'DD MMM · HH:mm',
};

const avatarBadgePosition = {
  TOP: 'top',
  BOTTOM: 'bottom',
};

const authErrors = {
  0: {
    message: 'Make sure you have network connection',
    header: 'No network connection',
    button: 'Try again',
  },
  1: {
    signIn: {
      message: 'Sorry! We could not sign you in',
      header: 'Couldn’t Sign In',
      button: 'Try again',
    },
    signUp: {
      message: 'Sorry! We could not sign you up',
      header: 'Couldn’t Sign Up',
      button: 'Try again',
    },
  },
  2: {message: 'Unauthenticated. you must log-in to access this endpoint'},
  3: {
    message:
      'Unauthorized. You do not have sufficient permissions to access this endpoint',
  },
  4: {message: 'Unauthorized command.'},
  5: {message: 'Token is invalid'},
  6: {message: 'Validation error occurred.'},
  7: {message: 'Endpoint not found'},
  8: {message: 'Not Found'},
  9: {
    signIn: {
      message:
        'The password or email you entered are incorrect. Please try again',
      header: 'Incorrect Email or Password',
      button: 'Try again',
    },
    changePassword: {
      message: 'That reset link has expired or isn’t valid.',
      header: 'Error',
      button: 'Dismiss',
    },
  },
  10: {
    signIn: {
      message:
        'The password or email you entered are incorrect. Please try again',
      header: 'Incorrect Email or Password',
      button: 'Try again',
    },
  },
  11: {message: 'Registration Failed'},
  12: {message: 'This email address is already taken.', field: 'email'},
  13: {
    signUp: {
      message: 'Something went wrong',
      header: 'Couldn’t Sign Up',
      button: 'Try again',
    },
  },
  14: {message: ''},
  15: {
    signIn: {
      message:
        'Make sure you’ve allowed FlipFlop to use Facebook and try again',
      header: 'Couldn’t Sign In',
      button: 'Try again',
    },
    signUp: {
      message:
        'Make sure you’ve allowed FlipFlop to use Facebook and try again',
      header: 'Couldn’t Sign Up',
      button: 'Try again',
    },
  },
};

const boundaryNames = {
  FEED: 'feed',
  SCREEN: 'Screen',
  MODAL: 'Modal',
};

const locationTypes = {
  ORIGIN: 'origin',
  LIVE_IN: 'liveIn',
};

const environmentTypes = {
  PRODUCTION: 'production',
  STAGING: 'staging',
  DEVELOPMENT: 'development',
};

const eventTimeSelectorModes = {
  startTime: 'startTime',
  endTime: 'endTime',
};

const dateTimeSelectorModes = {
  startDate: 'startDate',
  endDate: 'endDate',
};

const downloadLinks = {
  sms: 'https://ronengoren.com',
  email: 'https://ronengoren.com',
  whatsapp: 'https://ronengoren.com',
  messenger: 'https://ronengoren.com',
  download: 'https://ronengoren.com',
};

const userInviteMethods = {
  MESSENGER: 'messenger',
  WHATSAPP: 'whatsapp',
  EMAIL: 'email',
  SMS: 'text',
};

const originTypes = {
  CITY: 'city',
  DISCOVER: 'discover',
  VIEW: 'view',
  HOME_FEED: 'Home Feed',
  PROFILE_FEED: 'Profile Feed',
  GROUP_FEED: 'Group Feed',
  PAGE_FEED: 'Page Feed',
  EVENT_FEED: 'Event Feed',
  NEIGHBORHOOD_FEED: 'Neighborhood Feed',
  POST_PAGE: 'Post Page',
  LIST_PAGE: 'List Page',
  LIST_ITEM_PAGE: 'List Item Page',
  POST_RESULT: 'Post Result List',
  CITY_SAVED: 'City Saved Items',
  SUGGESTED: 'suggested',
  MEDIA: 'media',
  ONBOARDING: 'onboarding',
  NOTIFICATIONS_CENTER: 'Notifications Center',
  CHAT_LOBBY: 'Chat Lobby',
  CHAT_CONVERSATION: 'Chat Conversation',
  HOME_TAB: 'Home',
  SOLUTIONS_TAB: 'Solutions',
  MY_PROFILE: 'My Profile',
  USER_PROFILE: 'User Profile',
  SAVED_THEME: 'Saved Theme',
  PAGE_VIEW: 'Page View',
  THEME_VIEW: 'Theme View',
  PROFILE_PAGES: 'Profile Pages',
  JOB_VIEW: 'Job View',
  REAL_ESTATE_VIEW: 'Real Estate View',
  GIVE_TAKE_VIEW: 'Give and Take View',
  EXPERTS_LOBBY: 'Experts Lobby',
};

const chatTabTypes = {
  INBOX: 'inbox',
  REQUESTS: 'requests',
  BLOCKED: 'blocked',
  PAGES: 'pages',
};

const chatStatuses = {
  UNKNOWN: -1,
  NOT_BLOCKED: 0,
  BLOCKED: 1,
  BLOCKER: 2,
  BLOCKED_AND_BLOCKER: 3,
};

const chatMessageStatuses = {
  SENDING: 'sending',
  FAILED: 'failed',
};

const feedEventTypes = {
  POST: 'post',
  ACTIVATION: 'activation_v2',
  ACTION_ACTIVATION: 'activation_action',
};

const listPermissions = {
  ADD: 'add_list_item',
  EDIT: 'edit',
  DELETE: 'delete',
};

const listItemPermissions = {
  EDIT: 'edit',
  DELETE: 'delete',
};

const myCityTabs = {
  PAGES: 'pages',
  LISTS: 'lists',
  ITEMS: 'items',
  POSTS: 'posts',
};

const videoStatus = {
  UPLOADED: 0,
  ENCODING_STARTED: 1,
  ENCODING_PROGRESS: 2,
  ENCODING_COMPLETED: 3,
  ENCODING_ERROR: 4,
};

const componentNamesForAnalytics = {
  CAROUSEL: 'carousel',
  FEED_ITEM: 'feed item',
  HIGHLIGHT: 'highlight',
  POST: 'post',
  LIST: 'list',
  LIST_ITEM: 'list item',
  PAGE: 'page',
  GROUP: 'group',
  COMMENT: 'comment',
  USER_PROFILE: 'user profile',
  PEOPLE_TAB: 'people tab',
};

const filterByTypes = {
  LOCATION: 'location',
};

const referrerStatus = {
  ELIGIBLE: 'eligble',
  NOT_ELIGIBLE: 'not_eligble',
  REDEEMED: 'redeemed',
  REDEEM_IN_PROGRESS: 'redeem_in_progress',
};

const filterTypes = {
  PRICE: 'price',
  DATES: 'dates',
  ROOMS: 'rooms',
  HOODS: 'neighborhoodsIds',
  COMMUNITY: 'community',
  RELATIONSHIP_STATUS: 'relationshipStatuses',
  GENDER: 'genders',
  AGE: 'age',
  FRIENDSHIP_STATUS: 'friendshipStatuses',
  INSIDERS: 'roles',
  LISTING_TYPE: 'tags',
  RECENTLY_JOINED: 'recentlyJoined',
  PEOPLE_SEARCH: 'peopleSearch',
  COUNTRY: 'contextCountryCode',
  ORIGIN_COUNTRY: 'originCountry',
  POST_SUB_TYPE: 'postSubType',
};

const allPlaceholderFilterType = {id: 'All', name: 'All', cityName: 'All'};

const filtersUiDefinitions = {
  [filterTypes.COUNTRY]: {
    iconName: 'globe',
  },
  [filterTypes.PEOPLE_SEARCH]: {
    iconName: 'search',
  },
  [filterTypes.GENDER]: {
    iconName: 'venus-mars',
  },
  [filterTypes.AGE]: {
    iconName: 'birthday-cake',
  },
  [filterTypes.RELATIONSHIP_STATUS]: {
    iconName: 'heart-circle',
  },
  [filterTypes.COMMUNITY]: {
    iconName: 'map-marker-alt',
  },
  [filterTypes.HOODS]: {
    iconName: 'map-signs',
  },
  [filterTypes.FRIENDSHIP_STATUS]: {
    iconName: 'user-check',
  },
  [filterTypes.INSIDERS]: {
    iconName: 'crown',
    iconColor: flipFlopColors.orange,
    hideMask: true,
    withShadow: true,
  },
  [filterTypes.PRICE]: {
    iconName: 'badge-dollar',
  },
  [filterTypes.ROOMS]: {
    iconName: 'door-closed',
  },
  [filterTypes.POST_SUB_TYPE]: {
    iconName: 'list-alt',
  },
  [filterTypes.DATES]: {
    iconName: 'calendar-alt',
  },
  [filterTypes.LISTING_TYPE]: {
    [postTypes.JOB]: {
      iconName: 'briefcase',
    },
    [postTypes.REAL_ESTATE]: {
      iconName: 'home',
    },
    [postTypes.GIVE_TAKE]: {
      iconName: 'box-check',
    },
    [entityTypes.EVENT]: {
      iconName: 'glass-cheers',
    },
  },
};

const destinationPartitionLevel = {
  CITY: 'city',
  NEIGHBOURHOOD: 'neighbourhood',
};

const groupType = {
  GROUP: '0',
  TOPIC: '1',
};

const searchTypes = {
  GENERAL: 'general',
  PEOPLE: 'people',
  CHAT: 'chat',
  COMMUNITIES: 'communities',
};

const editorFeaturesTypes = {
  IMAGES: 'images',
  VIDEOS: 'videos',
  TEXT: 'text',
};
const orientationTypes = {
  LANDSCAPE: 'LANDSCAPE',
  PORTRAIT_UPSIDE_DOWN: 'PORTRAITUPSIDEDOWN',
  PORTRAIT: 'PORTRAIT',
};

const itemsSortTypes = {
  VOTERS: '0',
  DISTANCE: '1',
};

const listViewTypes = {
  DEFAULT: 'default',
  POLL: 'poll',
};

const shareableTypes = [
  postTypes.STATUS_UPDATE,
  postTypes.TIP_REQUEST,
  postTypes.RECOMMENDATION,
  postTypes.PROMOTION,
  postTypes.GROUP_ANNOUNCEMENT,
  postTypes.GUIDE,
  postTypes.REAL_ESTATE,
  postTypes.JOB,
  postTypes.GIVE_TAKE,
  entityTypes.LIST,
  entityTypes.LIST_ITEM,
  entityTypes.EVENT,
  entityTypes.PAGE,
  entityTypes.POST,
  entityTypes.GROUP,
];

const snackbarTypes = {
  CONNECTION: 'connection',
  SETTINGS: 'settings',
  CHAT: 'chat',
};

const solutionTypes = {
  ENTITY: 'entity',
  TREE: 'tree',
  TAG: 'tag',
};

const campaignTypes = {
  in_usa: 'Indians USA',
  il_usa: 'Israelis USA',
  mx_usa: 'Mexicans USA',
  fr_usa: 'French USA',
  fr_il: 'French IL',
  'FR Africans USA': 'FR Africans USA',
  'French Speaking USA': 'French Speaking USA',
  'Latinos USA': 'Latinos USA',
  'Colombians USA': 'Colombians USA',
};

const pageRoleTypes = {
  EXPERT: 'expert',
};

const communityRoleTypes = {
  EXPERT: 'expert',
  INSIDER: 'insiders',
};

const rolesApplyOriginTypes = {
  BANNER: 'banner',
  POPUP: 'popup',
};

const featuredTypes = {
  CAROUSELS: 'carousels',
  TOPICS: 'topics',
  SOLUTIONS: 'solutions',
  ENTITY_LOBBY: 'entityLobby',
};

const eventHostTypes = {
  PHYSICAL: 'physical',
  ONLINE: 'online',
};

const storyActions = {
  NAVIGATE: 'navigate',
  CREATE: 'create',
};

const storyCreateScreen = {
  [entityTypes.POST]: screenGroupNames.CREATE_POST_MODAL,
  [entityTypes.PAGE]: screenGroupNames.CREATE_PAGE_MODAL,
  [entityTypes.GROUP]: screenGroupNames.CREATE_GROUP_MODAL,
  [entityTypes.EVENT]: screenGroupNames.CREATE_EVENT_MODAL,
};

const internalConversationTypes = {
  PAGE: 'page',
};

export {
  eventHostTypes,
  suggestedSolutionsTypes,
  campaignTypes,
  userTypes,
  userRoleTypes,
  postTypes,
  shareTypes,
  listViewTypes,
  shareableTypes,
  activationTypes,
  itemsSortTypes,
  uiColorDefinitions,
  uiDefinitions,
  postUiDefinitions,
  mediaTypes,
  fetchTypes,
  uploadStateTypes,
  entityTypes,
  reportTypes,
  groupRoleTypes,
  groupPrivacyType,
  signInMethodTypes,
  signUpMethodTypes,
  screenNames,
  screenNamesAliases,
  screenNamesByUniversalLinks,
  screenGroupNames,
  screenNamesWithTabNavigation,
  screensWithoutFooter,
  editModes,
  friendshipStatusType,
  genderType,
  relationshipType,
  screenNamesByEntityType,
  entityIconAndColorByEntityType,
  dateAndTimeFormats,
  eventPrivacyTypes,
  postSubTypes,
  userRolesPerEventFilter,
  rsvpStatuses,
  inviteesListTypes,
  realEstateTypes,
  jobTypes,
  giveTakeTypes,
  avatarBadgePosition,
  authErrors,
  deviceTypes,
  boundaryNames,
  locationTypes,
  environmentTypes,
  eventTimeSelectorModes,
  dateTimeSelectorModes,
  downloadLinks,
  userInviteMethods,
  screenStateTypes,
  suggestedItemTypes,
  originTypes,
  userPermissions,
  chatTabTypes,
  chatStatuses,
  chatMessageStatuses,
  feedEventTypes,
  listPermissions,
  listItemPermissions,
  myCityTabs,
  videoStatus,
  passivePostSubTypes,
  componentNamesForAnalytics,
  referrerStatus,
  filterTypes,
  destinationPartitionLevel,
  communityTypes,
  groupType,
  searchTypes,
  editorFeaturesTypes,
  orientationTypes,
  screenNamesTabByEntityType,
  entityTypeBySlug,
  postTypeBySlug,
  filtersUiDefinitions,
  iconMaskTypes,
  checkboxStyles,
  interactionTypes,
  chatInteractioDefinitions,
  snackbarTypes,
  filterByTypes,
  PlaceholderTypes,
  allPlaceholderFilterType,
  pageRoleTypes,
  communityRoleTypes,
  rolesApplyOriginTypes,
  solutionTypes,
  featuredTypes,
  activationSubTypes,
  storyActions,
  storyCreateScreen,
  internalConversationTypes,
};
