import React, {Component} from 'react';
import {denormalize, constructDenormalizedData} from '/redux/normalizer';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {get, isEmpty} from '../../infra/utils';
import I18n from '../../infra/localization';
import {connect} from 'react-redux';
import {PostFooter} from '/components';
// import {EntityAction, EntityRecommendedBy} from '/components/entity';
// import {InHoodLink} from '/components/neighborhoods';
import {
  View,
  Avatar,
  Text,
  DashedBorder,
  Image,
  OverlayText,
  LocalTimeOffsetIndicator,
} from '../basicComponents';
import {AwesomeIcon, HomeisIcon} from '../../assets/icons';
import images from '../../assets/images';
import {flipFlopColors, commonStyles} from '../../vars';
import {
  postTypes,
  postSubTypes,
  entityTypes,
  dateAndTimeFormats,
  screenNamesByEntityType,
  originTypes,
  componentNamesForAnalytics,
  uiColorDefinitions,
  uiDefinitions,
  groupPrivacyType,
  mediaTypes,
  PlaceholderTypes,
  filterByTypes,
  eventHostTypes,
  communityRoleTypes,
} from '../../vars/enums';
import {navigationService} from '../../infra/navigation';
import {toCurrency, isRTL} from '../../infra/utils/stringUtils';
import {
  getFormattedDateAndTime,
  getDayAndMonth,
  getDaysDifference,
} from '../../infra/utils/dateTimeUtils';
import {removeAddressSuffix} from '../../infra/utils/addressUtils';
import {userScheme} from '../../schemas';
// import {
//   getPostTimeText,
//   getPostNationalityName,
//   isBoardPost,
// } from '/components/posts/utils';
// import {isBoundlessEnabled} from '/infra/utils/communitiesNationalitiesUtils';
import {getCountryByCode} from '../../screens/signup/JoinCommunity/countries';

const MEDIA_SIZE = 60;

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 15,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: flipFlopColors.white,
    borderRadius: 15,
    shadowColor: flipFlopColors.boxShadow,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
    elevation: 4,
  },
  wrapperWithTopMargin: {
    marginTop: 15,
  },
  innerWrapper: {
    marginTop: 15,
    paddingHorizontal: 15,
  },
  rtlContainer: {
    flexDirection: 'row-reverse',
  },
  entityItemHeader: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 15,
  },
  entityAvatarRight: {
    marginRight: 15,
  },
  entityAvatarLeft: {
    marginLeft: 15,
  },
  entityItemTitle: {
    textAlign: 'left',
    marginBottom: 5,
  },
  postTimeText: {
    marginBottom: 6,
  },
  entityItemSubHeader: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 2,
  },
  middleSection: {
    marginBottom: 9,
  },
  middleSectionDashedBorder: {
    marginBottom: 7,
  },
  detailsRow: {
    flex: 1,
    flexDirection: 'row',
  },
  detailsRowInSubHeader: {
    marginTop: 5,
  },
  iconCompany: {
    marginRight: 12,
    lineHeight: 26,
  },
  iconNationality: {
    marginLeft: -1,
    marginRight: 8,
    lineHeight: 26,
  },
  iconPrice: {
    marginRight: 10,
    lineHeight: 26,
  },
  iconLocation: {
    marginRight: 8,
    marginLeft: -2,
    lineHeight: 26,
  },
  iconLocationInSubHeader: {
    marginRight: 4,
    lineHeight: 15,
  },
  iconInHoodInSubHeader: {
    fontSize: 11,
    lineHeight: 15,
  },
  iconClock: {
    marginRight: 10,
    lineHeight: 26,
  },
  iconVideo: {
    marginRight: 7,
    lineHeight: 26,
  },
  textWrapper: {
    marginVertical: 6,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  icon: {
    marginRight: 6,
    lineHeight: 20,
    width: 15,
    textAlign: 'center',
  },
  listDetails: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 15,
  },
  videoThumbnailContainer: {
    height: MEDIA_SIZE,
    width: MEDIA_SIZE,
    borderRadius: 10,
  },
  videoThumbnail: {
    height: MEDIA_SIZE,
    width: MEDIA_SIZE,
    borderRadius: 10,
  },
  playVideoBtnWrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: flipFlopColors.transparent,
  },
  playBtnWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    borderRadius: 15,
    zIndex: 10,
    backgroundColor: flipFlopColors.halfRealBlack,
    borderWidth: 1,
    borderColor: flipFlopColors.white80,
  },
  playBtn: {
    marginLeft: 4,
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    height: '100%',
    width: '100%',
    borderRadius: 10,
  },
  overlayText: {
    height: MEDIA_SIZE,
    width: MEDIA_SIZE,
  },
  inHoodTextInSubHeader: {
    fontSize: 13,
    lineHeight: 15,
  },
  iconBasicStyle: {
    lineHeight: 14,
  },
});

class EntityCompactView extends Component {
  constructor(props) {
    super(props);
    const {
      user,
      entityType,
      postType,
      entity: {inHood},
    } = props;

    this.contentType = entityType === entityTypes.POST ? postType : entityType;
    this.state = {
      isInUserHood: EntityCompactView.isInUserHood({inHood, user}),
    };
  }

  static isInUserHood = ({inHood, user}) => {
    const userHoodId = get(user, 'journey.neighborhood.id');
    const userHoodInData =
      inHood && inHood.find((hood) => hood.neighborhoodId === userHoodId);

    return !!userHoodInData && !!userHoodInData.numOfItems;
  };

  render() {
    const {
      entity,
      sharedEntity,
      sharedEntityType,
      sharedEntityId,
      sharedEntityPost,
      entityType,
      originType,
      index,
      testIdPrefix,
      isThemePage,
      context,
      actor,
    } = this.props;
    const data = constructDenormalizedData({
      entity,
      sharedEntity,
      sharedEntityType,
      sharedEntityId,
      sharedEntityPost,
    });
    const {isInUserHood} = this.state;
    const {id, name} = data;
    const isPostType = entityType === entityTypes.POST;
    const testID = `${testIdPrefix}${name || id}`;
    const isActivePost = isPostType && get(data, 'payload.active', true);
    const allowNavigationToEntityAndActions = isActivePost || !isPostType;

    return (
      <TouchableOpacity
        onPress={
          allowNavigationToEntityAndActions ? this.navigateToEntity : null
        }
        style={[styles.wrapper, index === 0 && styles.wrapperWithTopMargin]}
        activeOpacity={1}
        testID={testID}>
        {this.renderContent()}
        {allowNavigationToEntityAndActions &&
          {
            /* <EntityAction
            data={data}
            actor={actor}
            context={context || {id}}
            contextPost={context || {id}}
            isSharedPostEntity={!isPostType}
            contentType={this.contentType}
            entityType={entityType}
            size={EntityAction.sizes.BIG}
            originType={originType}
            componentName={componentNamesForAnalytics.FEED_ITEM}
            isThemePage={isThemePage}
            isInUserHood={isInUserHood}
          /> */
          }}
        {isPostType && <PostFooter post={data} />}
      </TouchableOpacity>
    );
  }

  static getDerivedStateFromProps(props, state) {
    if (state.inHood !== props.entity.inHood) {
      return {
        inHood: props.entity.inHood,
        isInUserHood: EntityCompactView.isInUserHood({
          inHood: props.entity.inHood,
          user: props.user,
        }),
      };
    }
    return null;
  }

  renderContent = () => {
    // const { entityType, postType, entity, context, isWithActorBar, alignLocale, actor, user, isBoundlessMode } = this.props;
    // const { id, name, payload, eventTime, startTime, address, hostType } = entity;
    // let postSubType;
    // let templateData = {};
    // let title;
    // let location;
    // let media;
    // let totalMediaItems;
    // if (payload) {
    //   ({ title, media, templateData, postSubType, location, totalMediaItems } = payload);
    //   templateData = templateData || {};
    //   if ([postTypes.GIVE_TAKE, postTypes.REAL_ESTATE, postTypes.JOB].includes(postType) && !media.thumbnail && !media.url) {
    //     ({ media } = actor);
    //   }
    // } else {
    //   title = name;
    //   ({ media } = entity);
    //   location = entityType === entityTypes.PAGE ? address : entity.location;
    // }
    // const isShowNationalityGroup = isBoundlessMode && isBoardPost({ entityType, postType });
    // const { price, company, size, rooms, startDate, endDate } = templateData;
    // const companyName = postSubType === postSubTypes.OFFERING && company;
    // const hasMiddleSection =
    //   isShowNationalityGroup ||
    //   (entityType !== entityTypes.PAGE && !!(startTime || price || companyName || size || rooms || (location && (location.placeName || location.fullAddress))));
    // const isPost = entityType === entityTypes.POST;
    // const isEvent = entityType === entityTypes.EVENT;
    // const avatarType = isPost ? entityTypes.USER : entityType;
    // const titleFontSize = title && isRTL(title) ? 18 : 16;
    // const postTimeText = isPost && getPostTimeText({ eventTime, user });
    // const isHeaderRtl = alignLocale && title && isRTL(title);
    // const { nationalityGroup } = user;
    // if (entityType === entityTypes.LIST) {
    //   const { nationalityGroupId, filtersBy } = entity;
    //   const { community } = user;
    //   let name = community.cityName;
    //   if (nationalityGroupId) {
    //     const isLocationFilterEnabled = (filtersBy || []).includes(filterByTypes.LOCATION);
    //     const nationalityName = nationalityGroup.destinationCountryName;
    //     if (!isLocationFilterEnabled) {
    //       name = nationalityName;
    //     }
    //   }
    //   title = title.replace(`{{${PlaceholderTypes.POLYGON}}}`, name);
    // }
    // return (
    //   <View style={styles.innerWrapper}>
    //     <View style={[styles.entityItemHeader, isHeaderRtl && styles.rtlContainer]}>
    //       <View style={[isHeaderRtl ? styles.entityAvatarLeft : styles.entityAvatarRight]}>
    //         {this.renderMedia({ id, media, actor, avatarType })}
    //         {totalMediaItems > 1 && <OverlayText text={`+ ${totalMediaItems - 1}`} borderRadius={7} style={styles.overlayText} />}
    //       </View>
    //       <View style={commonStyles.flex1}>
    //         {isWithActorBar ? (
    //           <React.Fragment>
    //             <Text size={titleFontSize} lineHeight={26} color={flipFlopColors.b30} bold numberOfLines={1} alignLocale={alignLocale} forceLTR>
    //               {!!title && title.trim()}
    //             </Text>
    //             <ActorBar post={entity} actor={actor} alignLocale={isHeaderRtl} />
    //           </React.Fragment>
    //         ) : (
    //           <React.Fragment>
    //             <Text size={titleFontSize} lineHeight={21} color={flipFlopColors.b30} bold numberOfLines={2} style={styles.entityItemTitle}>
    //               {!!title && title.trim()}
    //             </Text>
    //             {!!postTimeText && (
    //               <Text size={13} lineHeight={15} color={flipFlopColors.b60} style={styles.postTimeText}>
    //                 {postTimeText}
    //               </Text>
    //             )}
    //             {this.renderSubHeader({ location })}
    //           </React.Fragment>
    //         )}
    //       </View>
    //     </View>
    //     {hasMiddleSection && (
    //       <View style={styles.middleSection}>
    //         <DashedBorder style={styles.middleSectionDashedBorder} />
    //         {!!price && this.renderPrice({ price })}
    //         {!!startDate && !!endDate && this.renderDates({ startDate, endDate })}
    //         {!!location && this.renderLocation({ location, title })}
    //         {this.renderIsInHood({})}
    //         {!!companyName && this.renderCompanyName({ companyName })}
    //         {!!isShowNationalityGroup && this.renderNationalityName()}
    //         {!!(size || rooms) && this.renderSizeAndRooms({ size, rooms })}
    //         {!!startTime && this.renderDateAndLocation({ startTime, address, title })}
    //         {isEvent && hostType && hostType === eventHostTypes.ONLINE && this.renderOnlineEventIndicator({ hostType })}
    //       </View>
    //     )}
    //     {context && context.entity ? this.renderContext() : this.renderText()}
    //   </View>
    // );
  };

  renderContext = () => [
    <DashedBorder key="entityTextTopBorder" />,
    // <EntityRecommendedBy data={this.props.context} key="EntityRecommendedBy" />,
  ];

  renderText = () => {
    let text;
    const {entity} = this.props;
    const mentions =
      get(entity, 'payload.mentions') || get(entity, 'mentions') || [];

    const {payload} = entity;

    if (payload) {
      ({text} = payload);
    }
    const {description, about} = entity;
    const entityText = about || description || text;

    if (entityText) {
      return [
        <DashedBorder key="entityTextTopBorder" />,
        // <HtmlTextWithLinks
        //   text={entityText}
        //   showExpand={false}
        //   ctaText={I18n.t('posts.cta_button')}
        //   selectable
        //   mentions={mentions}
        //   wrapperStyle={styles.textWrapper}
        //   textStyle={styles.text}
        //   lineHeight={Platform.select({ ios: 22, android: 20 })}
        //   numberOfLines={3}
        //   onPress={this.navigateToEntity}
        //   key="entityText"
        // />
      ];
    }

    return null;
  };

  renderMedia = ({id, media, actor, avatarType}) => {
    const {type, url, thumbnail} = media;
    const avatarSize =
      avatarType === entityTypes.GROUP ? 'bigRounded' : 'large';

    if (type === mediaTypes.VIDEO) {
      return (
        <View style={styles.videoThumbnailContainer}>
          <Image
            resizeMode="cover"
            style={styles.videoThumbnail}
            source={{uri: thumbnail}}
          />
          <View style={styles.playVideoBtnWrapper}>
            <View style={styles.playBtnWrapper}>
              <AwesomeIcon
                name="play"
                size={10}
                color={flipFlopColors.white}
                weight="solid"
                style={styles.playBtn}
              />
            </View>
            <Image
              style={styles.gradient}
              source={images.common.gradientDownTop}
              resizeMode="stretch"
            />
          </View>
        </View>
      );
    }

    return (
      <Avatar
        size={avatarSize}
        entityId={id}
        entityType={avatarType}
        thumbnail={url || thumbnail || get(actor, 'media.thumbnail')}
        linkable={false}
        name={actor && actor.name}
        themeColor={actor && actor.themeColor}
      />
    );
  };

  renderSubHeader = ({location}) => {
    // const {
    //   entityType,
    //   postType,
    //   entity,
    //   testIdPrefix,
    //   user,
    //   originType,
    // } = this.props;
    // const {
    //   privacyType,
    //   hosts,
    //   actor,
    //   creator,
    //   totalItems,
    //   nationalityGroupId,
    //   contextCountryCode = [],
    // } = entity;
    // const color = uiColorDefinitions[this.contentType];
    // const {
    //   isHomeisIcon,
    //   name,
    //   breadcrumbIconSize,
    //   breadcrumbLineHeight,
    // } = uiDefinitions[this.contentType];
    // const IconComponent = isHomeisIcon ? HomeisIcon : AwesomeIcon;
    // const iconTestID = `${testIdPrefix}${name}_icon`;
    // let shouldRenderLocation = false;
    // let isShowHoodItemsNumber = false;
    // let textComponent;
    // let customIconComponent;
    // switch (entityType) {
    //   case entityTypes.GROUP: {
    //     const {community, nationalityGroup} = user;
    //     const isBoundlessMode = isBoundlessEnabled(nationalityGroup);
    //     let location;
    //     const locationRowStyle = {flex: 0};
    //     if (nationalityGroupId) {
    //       location = nationalityGroup.destinationCountryName
    //         ? I18n.t('posts.group.nationality.all', {
    //             nationality: nationalityGroup.destinationCountryName,
    //           })
    //         : nationalityGroup.name;
    //     } else {
    //       location = community.cityName;
    //     }
    //     let groupType =
    //       privacyType === groupPrivacyType.PRIVATE
    //         ? I18n.t('posts.group.private_group')
    //         : I18n.t('posts.group.public_group');
    //     const groupIcon =
    //       privacyType === groupPrivacyType.PRIVATE ? 'lock-alt' : 'users';
    //     if (isBoundlessMode) {
    //       groupType = contextCountryCode.length
    //         ? I18n.t('posts.group.nationality.specific_country', {
    //             country: get(
    //               getCountryByCode(contextCountryCode[0]),
    //               'nationality',
    //             ),
    //           })
    //         : I18n.t('posts.group.nationality.all', {
    //             nationality: nationalityGroup.originNativesName,
    //           });
    //     }
    //     textComponent = (
    //       <View style={locationRowStyle}>
    //         {location && (
    //           <View style={styles.entityItemSubHeader} key="subHeaderLine1">
    //             <AwesomeIcon
    //               size={13}
    //               weight="solid"
    //               name="map-marker-alt"
    //               color={flipFlopColors.b70}
    //               style={[styles.icon]}
    //             />
    //             <Text size={13} lineHeight={20} color={flipFlopColors.azure}>
    //               {location}
    //             </Text>
    //           </View>
    //         )}
    //         <View style={styles.entityItemSubHeader} key="subHeaderLine1">
    //           <AwesomeIcon
    //             size={12}
    //             weight="solid"
    //             name={groupIcon}
    //             color={flipFlopColors.b70}
    //             style={[styles.icon]}
    //           />
    //           <Text size={13} lineHeight={20} color={flipFlopColors.b70}>
    //             {groupType}
    //           </Text>
    //         </View>
    //       </View>
    //     );
    //     break;
    //   }
    //   case entityTypes.EVENT: {
    //     textComponent = (
    //       <Text size={13} lineHeight={15} color={flipFlopColors.b60}>
    //         <Text size={13} lineHeight={15} color={color}>
    //           {I18n.t('carousels.entity_type_names.event')}
    //         </Text>
    //         {' · '}
    //         {I18n.t('feed.suggested_post.by')} {hosts[0].name}
    //       </Text>
    //     );
    //     break;
    //   }
    //   case entityTypes.LIST: {
    //     isShowHoodItemsNumber = true;
    //     textComponent = (
    //       <View style={styles.listDetails}>
    //         <Text size={13} lineHeight={15} color={color}>
    //           {I18n.t('carousels.entity_type_names.list')}
    //         </Text>
    //         <Text
    //           size={13}
    //           lineHeight={15}
    //           color={flipFlopColors.b30}
    //           numberOfLines={1}>
    //           {' · '}
    //           {I18n.p(totalItems, 'search.result.num_of_items')}
    //           {' · '}
    //           {I18n.t('feed.suggested_post.by')} {creator.name}
    //         </Text>
    //       </View>
    //     );
    //     break;
    //   }
    //   case entityTypes.POST: {
    //     textComponent = (
    //       <Text
    //         size={13}
    //         lineHeight={15}
    //         color={flipFlopColors.b60}
    //         numberOfLines={1}
    //         style={commonStyles.flex1}>
    //         <Text size={13} lineHeight={15} color={color}>
    //           {I18n.t(`carousels.post_type_names.${postType}`)}
    //         </Text>
    //         <Text size={13} lineHeight={15} color={flipFlopColors.b30}>
    //           {' · '}
    //           {I18n.t('feed.suggested_post.by')} {actor.name}
    //         </Text>
    //       </Text>
    //     );
    //     break;
    //   }
    //   case entityTypes.PAGE:
    //     if (
    //       !isEmpty(entity.roles) &&
    //       originType === originTypes.EXPERTS_LOBBY
    //     ) {
    //       const role = get(entity, 'roles[0]');
    //       if (role === communityRoleTypes.EXPERT) {
    //         const tag = get(entity, 'tags[0]');
    //         textComponent = (
    //           <Text size={13} lineHeight={15} color={flipFlopColors.lightIndigo}>
    //             {I18n.t('badges.expert.title', {
    //               tag: I18n.t(`shared.tags.${tag}`),
    //             })}
    //           </Text>
    //         );
    //       }
    //       customIconComponent = (
    //         <IconComponent
    //           name="badge-check"
    //           testID={iconTestID}
    //           color={flipFlopColors.lightIndigo}
    //           size={breadcrumbIconSize || 12}
    //           weight="solid"
    //           style={[
    //             styles.icon,
    //             breadcrumbLineHeight
    //               ? {lineHeight: breadcrumbLineHeight}
    //               : styles.iconBasicStyle,
    //           ]}
    //         />
    //       );
    //     } else {
    //       textComponent = (
    //         <Text size={13} lineHeight={15} color={color}>
    //           {I18n.t('carousels.post_type_names.page')}
    //         </Text>
    //       );
    //       shouldRenderLocation = !!location;
    //     }
    //     break;
    //   default:
    //     break;
    // }
    // return [
    //   entityType === entityTypes.GROUP ? (
    //     textComponent
    //   ) : (
    //     <View style={styles.entityItemSubHeader} key="subHeaderLine1">
    //       {customIconComponent || (
    //         <IconComponent
    //           name={name}
    //           testID={iconTestID}
    //           color={color}
    //           size={breadcrumbIconSize || 12}
    //           weight="solid"
    //           style={[
    //             styles.icon,
    //             breadcrumbLineHeight
    //               ? {lineHeight: breadcrumbLineHeight}
    //               : styles.iconBasicStyle,
    //           ]}
    //         />
    //       )}
    //       {textComponent}
    //     </View>
    //   ),
    //   shouldRenderLocation &&
    //     this.renderLocation({location, inSubHeader: true}),
    //   this.renderIsInHood({inSubHeader: true, isShowHoodItemsNumber}),
    // ];
  };

  renderPrice = ({price}) => (
    <View style={styles.detailsRow}>
      <AwesomeIcon
        name="coins"
        style={styles.iconPrice}
        color={flipFlopColors.b70}
        size={13}
        weight="solid"
      />
      <Text
        size={16}
        lineHeight={26}
        color={flipFlopColors.b30}
        numberOfLines={1}
        forceLTR>
        {toCurrency(price, this.props.currency)}
      </Text>
    </View>
  );

  renderDates = ({startDate, endDate}) => (
    <View style={styles.detailsRow}>
      <AwesomeIcon
        name="calendar-check"
        style={styles.iconPrice}
        color={flipFlopColors.b70}
        size={14}
        weight="solid"
      />
      <Text
        size={16}
        lineHeight={26}
        color={flipFlopColors.b30}
        numberOfLines={1}
        forceLTR>
        {getDayAndMonth(startDate)} - {getDayAndMonth(endDate)} (
        {I18n.t('posts.real_estate.number_of_nights', {
          nights: getDaysDifference(startDate, endDate),
        })}
        )
      </Text>
    </View>
  );

  renderLocation = ({location, title, inSubHeader = false}) => {
    const {placeName, fullAddress, coordinates} = location;
    if (!placeName && !fullAddress) {
      return null;
    } else {
      const shortAddress = fullAddress && removeAddressSuffix(fullAddress);
      return (
        <TouchableOpacity
          onPress={
            coordinates && coordinates.length === 2
              ? () => navigationService.navigateToMap({location, title})
              : null
          }
          style={[
            styles.detailsRow,
            inSubHeader && styles.detailsRowInSubHeader,
          ]}
          activeOpacity={1}
          key="location">
          <HomeisIcon
            name="location"
            style={[
              styles.iconLocation,
              inSubHeader && styles.iconLocationInSubHeader,
            ]}
            color={flipFlopColors.b70}
            size={16}
          />
          <Text
            size={inSubHeader ? 13 : 16}
            lineHeight={inSubHeader ? 15 : 26}
            color={flipFlopColors.b30}
            numberOfLines={1}
            forceLTR
            style={commonStyles.flex1}>
            {shortAddress || placeName}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  renderIsInHood = ({inSubHeader = false, isShowHoodItemsNumber}) => {
    // const {hoodContext, entity, user, shouldShowInYourHood} = this.props;
    // const {isInUserHood} = this.state;
    // const entityInHoodContext =
    //   hoodContext &&
    //   get(entity, 'inHood', []).find(
    //     (hood) => hood.neighborhoodId === hoodContext.id,
    //   );
    // const isInHoodContext = !!entityInHoodContext;
    // const showItemsInOtherHood = isInHoodContext && isShowHoodItemsNumber;
    // if (shouldShowInYourHood && (isInUserHood || showItemsInOtherHood)) {
    //   const hood = hoodContext || get(user, 'journey.neighborhood');
    //   const numberOfItems =
    //     isShowHoodItemsNumber && isInHoodContext
    //       ? entityInHoodContext.numOfItems
    //       : 0;
    //   const hoodName = isInUserHood ? null : hood.name;
    //   if (inSubHeader) {
    //     return (
    //       <InHoodLink
    //         key="InHoodLink"
    //         containerStyle={styles.detailsRowInSubHeader}
    //         iconStyle={styles.iconInHoodInSubHeader}
    //         textStyle={styles.inHoodTextInSubHeader}
    //         numberOfItems={numberOfItems}
    //         hoodName={hoodName}
    //       />
    //     );
    //   }
    //   return (
    //     <InHoodLink
    //       key="InHoodLink"
    //       numberOfItems={numberOfItems}
    //       hoodName={hoodName}
    //     />
    //   );
    // }
    // return null;
  };

  renderNationalityName = () => {
    const {originNativesName, contextCountryCode} = this.props;

    return (
      <View style={styles.detailsRow}>
        <AwesomeIcon
          name="user-friends"
          style={styles.iconNationality}
          color={flipFlopColors.b70}
          size={12}
          weight="light"
        />
        <Text
          size={16}
          lineHeight={26}
          color={flipFlopColors.b30}
          numberOfLines={1}
          forceLTR
          style={styles.detailsRowText}>
          {/* {getPostNationalityName({originNativesName, contextCountryCode})} */}
        </Text>
      </View>
    );
  };

  renderCompanyName = ({companyName}) => (
    <View style={styles.detailsRow}>
      <AwesomeIcon
        name="building"
        style={styles.iconCompany}
        color={flipFlopColors.b70}
        size={12}
        weight="solid"
      />
      <Text
        size={16}
        lineHeight={26}
        color={flipFlopColors.b30}
        numberOfLines={1}
        forceLTR
        style={commonStyles.flex1}>
        {companyName}
      </Text>
    </View>
  );

  renderSizeAndRooms = ({size, rooms}) => (
    <View style={styles.detailsRow}>
      <AwesomeIcon
        name="building"
        style={styles.iconCompany}
        color={flipFlopColors.b70}
        size={12}
        weight="solid"
      />
      <Text size={16} lineHeight={26} numberOfLines={1} forceLTR>
        {!!size && (
          <Text size={16} lineHeight={26} color={flipFlopColors.b30}>
            {I18n.t('posts.real_estate.size', {size})}
          </Text>
        )}
        {!!(size && rooms) && (
          <Text size={16} lineHeight={26} color={flipFlopColors.b30}>
            {' · '}
          </Text>
        )}
        {!!rooms && (
          <Text size={16} lineHeight={26} color={flipFlopColors.b30}>
            {I18n.p(rooms, 'posts.real_estate.rooms')}
          </Text>
        )}
      </Text>
    </View>
  );

  renderDateAndLocation = ({startTime, address, title}) => [
    <View style={styles.detailsRow} key="startTime">
      <AwesomeIcon
        name="clock"
        style={styles.iconClock}
        color={flipFlopColors.b70}
        size={12}
        weight="solid"
      />
      <Text size={16} lineHeight={26} color={flipFlopColors.b30}>
        {getFormattedDateAndTime(
          startTime,
          dateAndTimeFormats.eventDayMonthTime,
        )}
      </Text>
      <LocalTimeOffsetIndicator />
    </View>,
    address && this.renderLocation({location: address, title}),
  ];

  renderOnlineEventIndicator = ({hostType}) => (
    <View style={styles.detailsRow} key="hostType">
      <AwesomeIcon
        name="video"
        style={styles.iconVideo}
        color={flipFlopColors.b70}
        size={12}
        weight="solid"
      />
      <Text size={16} lineHeight={26} color={flipFlopColors.b30}>
        {I18n.t(`events.view.hostTypes.${hostType}`)}
      </Text>
    </View>
  );

  navigateToEntity = () => {
    const {
      entity: {id, groupType},
      entityType,
    } = this.props;
    navigationService.navigate(screenNamesByEntityType[entityType], {
      entityId: id,
      groupType,
    });
  };
}

EntityCompactView.defaultProps = {
  testIdPrefix: 'entityCompactView_',
  alignLocale: false,
  shouldShowInYourHood: false,
};

EntityCompactView.propTypes = {
  alignLocale: PropTypes.bool,
  isWithActorBar: PropTypes.bool,
  entity: PropTypes.object,
  actor: PropTypes.object,
  sharedEntity: PropTypes.object,
  sharedEntityType: PropTypes.string,
  sharedEntityId: PropTypes.string,
  sharedEntityPost: PropTypes.object,
  entityType: PropTypes.oneOf(Object.values(entityTypes)),
  postType: PropTypes.oneOf(Object.values(postTypes)),
  context: PropTypes.shape({
    entityId: PropTypes.string,
    entityType: PropTypes.oneOf([entityTypes.POST, entityTypes.LIST_ITEM]),
    entity: PropTypes.object,
  }),
  index: PropTypes.number,
  originType: PropTypes.oneOf(Object.values(originTypes)),
  testIdPrefix: PropTypes.string,
  isThemePage: PropTypes.bool,
  shouldShowInYourHood: PropTypes.bool,
  hoodContext: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
  }),
  user: userScheme,
  currency: PropTypes.string,
  originNativesName: PropTypes.string,
  contextCountryCode: PropTypes.number,
  isBoundlessMode: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => {
  const {
    entity,
    sharedEntity,
    sharedEntityType,
    sharedEntityId,
    sharedEntityPost,
  } = denormalize({dataProp: ownProps.data, state});

  return {
    user: state.auth.user,
    entity,
    actor:
      ownProps.entityType === entityTypes.EVENT
        ? entity.hosts[0]
        : entity.actor,
    sharedEntity,
    sharedEntityType,
    sharedEntityId,
    sharedEntityPost,
    currency: get(state, 'auth.user.community.destinationPricing.currencyCode'),
    originNativesName: get(
      state,
      'auth.user.nationalityGroup.originNativesName',
      '',
    ),
    contextCountryCode: get(entity, 'contextCountryCode[0]'),
    isBoundlessMode: isBoundlessEnabled(
      get(state, 'auth.user.nationalityGroup'),
    ),
  };
};

EntityCompactView = connect(mapStateToProps)(EntityCompactView);
export default EntityCompactView;
