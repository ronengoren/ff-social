import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import I18n from '../../infra/localization';
import {connect} from 'react-redux';
// import { PostHeader, ListSummary, ActorBar } from '/components';
// import { PostShareButtons } from '/components/posts';
// import { EntityAction } from '/components/entity';
import {
  View,
  Text,
  LoadingBackground,
  DashedBorder,
  MapImage,
  LocalTimeOffsetIndicator,
} from '../basicComponents';
// import { InHoodLink } from '/components/neighborhoods';
import {AwesomeIcon} from '../../assets/icons';
import {flipFlopColors} from '../../vars';
import {
  postTypes,
  postSubTypes,
  entityTypes,
  dateAndTimeFormats,
  screenNamesByEntityType,
  screenNames,
  originTypes,
  componentNamesForAnalytics,
  passivePostSubTypes,
  eventHostTypes,
} from '../../vars/enums';
import {get} from '../../infra/utils';
import {isRTL, sanitizeRichText} from '../../infra/utils/stringUtils';
import {
  getFormattedDateAndTime,
  getDayAndMonth,
  getDaysDifference,
} from '../../infra/utils/dateTimeUtils';
import {navigationService} from '../../infra/navigation';
// import { InstagramProvider } from '/components/instagram';
// import { isBoundlessEnabled } from '/infra/utils/communitiesNationalitiesUtils';
// import { getPostNationalityName, isBoardPost } from '/components/posts/utils';

import PostContentMedia, {IMAGE_HEIGHT} from './PostContentMedia';
import PostContentMeta from './PostContentMeta';
import PostContentText from './PostContentText';
import PostContentMapMeta from './PostContentMapMeta';
import PostContentLocation from './PostContentLocation';
import PostContentLinkRow from './PostContentLinkRow';

const TEXT_NUMBER_OF_LINES_WITHOUT_MEDIA = 7;
const MIN_CHARS_TO_SHOW_BOTTOM_SHARE = 1050;
const styles = StyleSheet.create({
  scheduledPostBorder: {
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  outerWrapper: {
    backgroundColor: flipFlopColors.white,
  },
  sharedEntityOuterWrapper: {
    borderRadius: 15,
  },
  alternatePostViewWrapper: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  contentContainer: {
    paddingHorizontal: 15,
  },
  shareContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
  },
  shareContainerInPostPage: {
    paddingVertical: 20,
  },
  unavailableShare: {
    padding: 15,
  },
  listSummary: {
    margin: 0,
  },
  marginTop3: {
    marginTop: 3,
  },
  titleMargin: {
    marginBottom: 3,
  },
  detailsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsRowText: {
    flex: 1,
  },
  iconVideo: {
    marginLeft: 1,
    marginRight: 6,
    lineHeight: 28,
  },
  iconCompany: {
    marginLeft: 1,
    marginRight: 9,
    lineHeight: 28,
  },
  iconNationality: {
    marginLeft: -1,
    marginRight: 6,
    lineHeight: 28,
  },
  icon: {
    marginRight: 9,
    lineHeight: 28,
  },
  iconClock: {
    marginRight: 8,
    lineHeight: 28,
  },
  sharedPost: {
    backgroundColor: flipFlopColors.white,
  },
  sharedPostText: {
    paddingTop: 5,
    paddingHorizontal: 15,
  },
  sharedContainer: {
    marginHorizontal: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: flipFlopColors.b90,
  },
  mediasWrapperWithBorderRadius: {
    overflow: 'hidden',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  marginBottom5: {
    marginBottom: 5,
  },
  marginBottom10: {
    marginBottom: 10,
  },
  paddedBorderContainer: {
    paddingHorizontal: 10,
  },
  dashedBorder: {
    marginTop: 10,
    marginBottom: 10,
  },
  actorBarWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});

class PostContent extends Component {
  static entityActionPosition = {
    TOP: 'top',
    BOTTOM: 'bottom',
  };

  static renderPostText = ({
    id,
    text,
    mentions,
    isPostPage,
    contentType,
    context,
    isWithMarginBottom,
    numberOfLines,
    onPress,
    hasMedia,
  }) => (
    <React.Fragment>
      <PostContentText
        id={id}
        text={text}
        mentions={mentions}
        isPostPage={isPostPage}
        contentType={contentType}
        context={context}
        isWithMarginBottom={isWithMarginBottom}
        numberOfLines={
          hasMedia
            ? numberOfLines
            : numberOfLines || TEXT_NUMBER_OF_LINES_WITHOUT_MEDIA
        }
        onPress={onPress}
      />
    </React.Fragment>
  );

  render() {
    const {
      post: {payload},
    } = this.props;

    if (payload.postType === postTypes.SHARE) {
      return this.renderSharedContent();
    } else {
      return this.renderContent({isSharedContent: false});
    }
  }

  renderSharedContent = () => {
    // const {
    //   post,
    //   post: { payload, sharedEntity, scheduledDate },
    //   isPostPage,
    //   originType
    // } = this.props;
    // const { entity, entityType, entityId } = sharedEntity;
    // const isSharedPostWithoutSharedActorHeader = get(entity, 'post.payload.postType') === postTypes.GUIDE;
    // if (!entity) {
    //   return (
    //     <View style={styles.unavailableShare}>
    //       <Text bold style={styles.marginBottom5}>
    //         {I18n.t('posts.content.not_available_share.header')}
    //       </Text>
    //       <Text>{I18n.t('posts.content.not_available_share.text')}</Text>
    //     </View>
    //   );
    // }
    // let sharedComponent;
    // if (entityType === entityTypes.LIST) {
    //   sharedComponent = <ListSummary style={styles.listSummary} data={entity.id} isShared renderSavers={!scheduledDate} originType={originType} />;
    // } else {
    //   sharedComponent = this.renderContent({ isSharedContent: true, isSharedPostWithoutSharedActorHeader });
    // }
    // return (
    //   <View style={styles.sharedPost}>
    //     {!!payload.text && (
    //       <View style={styles.sharedPostText}>
    //         {PostContent.renderPostText({
    //           id: post.id,
    //           text: post.payload.text,
    //           mentions: post.mentions,
    //           contentType: postTypes.SHARE,
    //           isPostPage,
    //           isWithTopBorder: true,
    //           isWithMarginBottom: true,
    //           isSharedPostEntity: true
    //         })}
    //       </View>
    //     )}
    //     <TouchableOpacity
    //       onPress={() => this.navigateToEntityInPost({ contentType: entityType, entityId })}
    //       style={entityType === entityTypes.POST && !isSharedPostWithoutSharedActorHeader && styles.sharedContainer}
    //       activeOpacity={1}
    //     >
    //       {entityType === entityTypes.POST && !isSharedPostWithoutSharedActorHeader && <PostHeader post={entity.post} showMenuBtn={false} isPostPage={isPostPage} />}
    //       {sharedComponent}
    //     </TouchableOpacity>
    //   </View>
    // );
  };

  renderContent = ({isSharedContent, isSharedPostWithoutSharedActorHeader}) => {
    // const { post, isPostPage, isAlternatePostView, isWithShareEntityActionButton, origin, originType, usersHoodId, onAnswerPress, alignLocale, isBoundlessMode } = this.props;
    // const { context, sharedEntity } = post;
    // let data;
    // let { link } = post;
    // let mediaGallery = [];
    // let totalMediaItems;
    // let contentType;
    // let entityType;
    // let postSubType;
    // let tags = [];
    // let templateData = {};
    // let text;
    // let title;
    // let actor;
    // let url;
    // let mentions;
    // let location;
    // let page;
    // let isSharedPostEntity = false;
    // let postType;
    // if (!isSharedContent || (isSharedContent && sharedEntity.entityType === entityTypes.POST)) {
    //   data = get(sharedEntity, 'entity.post') || post;
    //   postType = get(data, 'payload.postType');
    //   if ([postTypes.PASSIVE_POST, postTypes.RECOMMENDATION].includes(postType)) {
    //     url = get(data, 'link.url');
    //   }
    //   if (postType === postTypes.PASSIVE_POST) {
    //     const templateData = get(data, 'payload.templateData');
    //     contentType = get(templateData, 'entityType');
    //     postSubType = get(data, 'payload.postSubType');
    //     if (!contentType && !entityType) {
    //       contentType = postTypes.PASSIVE_POST;
    //       entityType = entityTypes.POST;
    //     }
    //     if (templateData) {
    //       data = {
    //         ...templateData.entity,
    //         mapUrl: data.mapUrl
    //       };
    //     }
    //     ({ media: mediaGallery = [], title, location, page } = data);
    //     totalMediaItems = 1;
    //   } else {
    //     ({ mentions, tags, actor, link } = data);
    //     ({ mediaGallery, totalMediaItems, postSubType, title, text, postType: contentType, location, page } = data.payload);
    //     entityType = entityTypes.POST;
    //     templateData = data.payload.templateData || {};
    //   }
    //   isSharedPostEntity = isSharedContent;
    // } else if (isSharedContent) {
    //   data = {
    //     ...(sharedEntity.entity[sharedEntity.entityType] || sharedEntity.entity),
    //     scheduledDate: post.scheduledDate
    //   };
    //   mediaGallery = [data.media];
    //   totalMediaItems = mediaGallery.length;
    //   ({ location, page } = data);
    //   contentType = sharedEntity.entityType;
    //   if (sharedEntity.entityType === entityTypes.PAGE) {
    //     data = { ...data, follows: sharedEntity.entity.follows };
    //     title = sharedEntity.entity.page.name;
    //   }
    //   if (sharedEntity.entityType === entityTypes.GROUP) {
    //     title = sharedEntity.entity.name;
    //   }
    //   if (sharedEntity.entityType === entityTypes.EVENT) {
    //     title = sharedEntity.entity.name;
    //   }
    //   ({ tags } = data);
    // }
    // entityType = entityType || contentType;
    // if (contentType === entityTypes.PAGE) {
    //   location = get(data, 'address');
    //   url = get(data, 'website');
    // }
    // const { id, description, about, privacyType, startTime, address, mapUrl, scheduledDate, hostType } = data;
    // const hasMedia = !!((mediaGallery.length && !!get(mediaGallery, '0.url')) || link);
    // const { price, company, size, rooms, startDate, endDate } = templateData;
    // const companyName = postSubType === postSubTypes.OFFERING && company;
    // const postText = about || description || text;
    // const active = get(data, 'payload.active', true);
    // const isShowNationalityGroup = isBoundlessMode && isBoardPost({ entityType, postType });
    // const showContentMeta = ![entityType.EVENT].includes(contentType);
    // const showMapWithMeta =
    //   ![passivePostSubTypes.INSTAGRAM_CONNECT].includes(postSubType) && [entityTypes.LIST_ITEM, postTypes.PASSIVE_POST, postTypes.RECOMMENDATION].includes(postType);
    // const isWithMapImage = !!mapUrl && isPostPage && [postTypes.REAL_ESTATE].includes(contentType);
    // const isWithAnyMeta =
    //   !!startDate ||
    //   !!endDate ||
    //   (!!location && (location.fullAddress || location.placeName)) ||
    //   !!isInUserHood ||
    //   !!url ||
    //   !!companyName ||
    //   !!isShowNationalityGroup ||
    //   !!(size && rooms) ||
    //   ((!!address && (address.fullAddress || address.placeName)) || hostType === eventHostTypes.ONLINE);
    // const isPassivePost = postType === postTypes.PASSIVE_POST;
    // const isWithTopBorder = !isPassivePost && ![postTypes.PROMOTION, postTypes.TIP_REQUEST, postTypes.RECOMMENDATION].includes(contentType);
    // const isInUserHood =
    //   (!!usersHoodId && !!(page && page.inHood && page.inHood.find((hood) => hood.neighborhoodId === usersHoodId))) ||
    //   !!(data.inHood && data.inHood.find((hood) => hood.neighborhoodId === usersHoodId));
    // const isClickable = !isPostPage && !scheduledDate && active;
    // const isInstagramConnected = postType === postTypes.PASSIVE_POST && postSubType === passivePostSubTypes.INSTAGRAM_CONNECT;
    // const isPostWithTitle = ![postTypes.STATUS_UPDATE, postTypes.TIP_REQUEST].includes(contentType);
    // const isPostWithInlineShare = [postTypes.GUIDE, entityTypes.EVENT].includes(contentType);
    // const isTextWithMarginBottom = hasMedia && [postTypes.STATUS_UPDATE].includes(contentType);
    // const isMediasWithMarginBottom = [entityTypes.EVENT].includes(contentType);
    // const isRecommandationWithMap = showMapWithMeta && contentType === postTypes.RECOMMENDATION;
    // const isGuide = contentType === postTypes.GUIDE;
    // const isPostWithoutTextPreview =
    //   contentType === entityTypes.EVENT || (!isPostPage && !isSharedContent && [entityTypes.EVENT, postTypes.REAL_ESTATE, postTypes.GIVE_TAKE].includes(contentType));
    // const isWithDefaultPlaceholderImage =
    //   [postTypes.REAL_ESTATE].includes(postType) ||
    //   ((isPostPage || [originTypes.POST_RESULT].includes(originType)) && [postTypes.GIVE_TAKE, postTypes.JOB, postTypes.GUIDE].includes(postType));
    // const isActivePost = !scheduledDate && !!active;
    // const isRtl = alignLocale && isRTL(title);
    // const textComponent =
    //   postText && !isPostWithoutTextPreview
    //     ? PostContent.renderPostText({
    //         id: data.id,
    //         text: postText,
    //         mentions,
    //         isPostPage,
    //         contentType,
    //         context,
    //         isWithTopBorder: !!isWithTopBorder,
    //         isWithMarginBottom: !isActivePost || isTextWithMarginBottom || isWithMapImage,
    //         isSharedPostEntity,
    //         hasMedia
    //       })
    //     : null;
    // const isPostWithMinCharsToShowShareFooter = !!postText && sanitizeRichText({ text: postText, shouldStripRichtext: true }).length > MIN_CHARS_TO_SHOW_BOTTOM_SHARE;
    // const entityActionPosition =
    //   isPostPage && [postTypes.JOB, postTypes.REAL_ESTATE, postTypes.GIVE_TAKE].includes(contentType)
    //     ? PostContent.entityActionPosition.TOP
    //     : PostContent.entityActionPosition.BOTTOM;
    // const PostContentMediasComponent = isInstagramConnected ? (
    //   <InstagramProvider postId={post.id} token={data.instagramV2Token} LoadingComponent={<LoadingBackground backgroundColor={flipFlopColors.white} height={IMAGE_HEIGHT} />}>
    //     {({ gallery }) => <PostContentMedia mediaGallery={gallery} totalMediaItems={get(gallery, 'length')} contentType={contentType} isPostPage={isPostPage} />}
    //   </InstagramProvider>
    // ) : (
    //   <View style={[isAlternatePostView && !isPostPage && styles.mediasWrapperWithBorderRadius, isMediasWithMarginBottom && styles.marginBottom10]}>
    //     <PostContentMedia
    //       isWithDefaultPlaceholderImage={isWithDefaultPlaceholderImage}
    //       mediaGallery={mediaGallery}
    //       totalMediaItems={totalMediaItems}
    //       link={link}
    //       contentType={contentType}
    //       isSharedPostEntity={isSharedPostEntity && !isSharedPostWithoutSharedActorHeader}
    //       isPostPage={isPostPage}
    //       postId={id}
    //     />
    //   </View>
    // );
    // const EntityActionComponent = isActivePost && (
    //   <EntityAction
    //     data={data}
    //     actor={actor}
    //     context={context}
    //     contextPost={post}
    //     isSharedPostEntity={isSharedPostEntity && !isSharedPostWithoutSharedActorHeader}
    //     isPostPage={isPostPage}
    //     contentType={contentType}
    //     entityType={entityType}
    //     size={EntityAction.sizes.BIG}
    //     originType={originType}
    //     componentName={componentNamesForAnalytics.FEED_ITEM}
    //     isInUserHood={isInUserHood}
    //     onAnswerPress={onAnswerPress}
    //     isWithShareEntityActionButton={isWithShareEntityActionButton}
    //   />
    // );
    // return (
    //   <TouchableOpacity onPress={isClickable ? () => this.navigateToEntityInPost({ contentType, entityId: id }) : null} activeOpacity={1}>
    //     <View
    //       style={[
    //         styles.outerWrapper,
    //         isSharedPostEntity && styles.sharedEntityOuterWrapper,
    //         isAlternatePostView && styles.alternatePostViewWrapper,
    //         !!scheduledDate && styles.scheduledPostBorder
    //       ]}
    //     >
    //       {contentType === postTypes.STATUS_UPDATE && <View style={styles.contentContainer}>{textComponent}</View>}
    //       {PostContentMediasComponent}
    //       <View>
    //         {showContentMeta && (
    //           <View style={[styles.contentContainer, isRecommandationWithMap && styles.marginBottom5]}>
    //             <PostContentMeta
    //               isRtl={isRtl}
    //               tags={tags}
    //               isPostPage={isPostPage}
    //               contentType={contentType}
    //               postSubType={postSubType}
    //               context={context}
    //               privacyType={privacyType}
    //               origin={origin}
    //               originType={originType}
    //               price={price}
    //             />
    //           </View>
    //         )}
    //         {showMapWithMeta ? (
    //           <View style={!!textComponent && styles.marginBottom10}>
    //             <PostContentMapMeta
    //               url={url}
    //               title={title}
    //               TitleComponent={this.renderTitle({ title, isPostPage, isRtl: false })}
    //               location={location}
    //               mapUrl={mapUrl}
    //               isPostPage={isPostPage}
    //               contentType={contentType}
    //             />
    //           </View>
    //         ) : (
    //           <View>
    //             {isPostWithTitle && this.renderPostTitle({ title, isAlternatePostView, isPostPage, post, isRtl })}
    //             {isPostWithInlineShare && this.renderShareActionButtons({ post, originType, isPostPage })}
    //             {entityActionPosition === PostContent.entityActionPosition.TOP &&
    //               this.renderEntityAction({ EntityActionComponent, isPostPage, isWithShareEntityActionButton, isActivePost })}
    //             {(isWithAnyMeta || isGuide) && (
    //               <View style={styles.paddedBorderContainer}>
    //                 <DashedBorder style={styles.dashedBorder} />
    //               </View>
    //             )}
    //             {this.renderPostContentDetails(
    //               { startDate, endDate, location, title, isInUserHood, url, companyName, size, rooms, startTime, address, hostType },
    //               isWithAnyMeta,
    //               isShowNationalityGroup
    //             )}
    //           </View>
    //         )}
    //         {contentType !== postTypes.STATUS_UPDATE && <View style={styles.contentContainer}>{textComponent}</View>}
    //       </View>
    //       {isPostWithInlineShare && isPostWithMinCharsToShowShareFooter && isPostPage && this.renderShareActionButtons({ post, originType, isPostPage })}
    //       {entityActionPosition === PostContent.entityActionPosition.BOTTOM &&
    //         this.renderEntityAction({ EntityActionComponent, isPostPage, isWithShareEntityActionButton, isActivePost })}
    //       {isWithMapImage && <MapImage mapUrl={mapUrl} location={address || location} title={title} />}
    //     </View>
    //   </TouchableOpacity>
    // );
  };

  renderShareActionButtons = ({post, originType, isPostPage}) => (
    <View
      style={[
        styles.shareContainer,
        isPostPage && styles.shareContainerInPostPage,
      ]}>
      {/* <PostShareButtons entity={post} originType={originType} /> */}
    </View>
  );

  // renderPostTitle = ({  }) => (
  // <View style={styles.contentContainer}>
  //   {!!title && this.renderTitle({ title, isPostPage, isRtl })}
  //   {isAlternatePostView && (
  //     <View style={[styles.marginTop3, styles.actorBarWrapper]}>
  //       <ActorBar post={post} alignLocale />
  //     </View>
  //   )}
  // </View>
  // );

  renderEntityAction = ({
    EntityActionComponent,
    isPostPage,
    isWithShareEntityActionButton,
    isActivePost,
  }) => (
    <React.Fragment>
      {isPostPage && isWithShareEntityActionButton && isActivePost && (
        <View style={styles.contentContainer}>
          <DashedBorder style={styles.dashedBorder} />
        </View>
      )}
      {EntityActionComponent}
    </React.Fragment>
  );

  renderTitle = ({title, isPostPage, isRtl}) => (
    <Text
      size={isPostPage ? 22 : 20}
      lineHeight={28}
      color={flipFlopColors.b30}
      style={[isPostPage && styles.titleMargin]}
      bold
      numberOfLines={isPostPage ? 0 : 2}
      alignLocale={isRtl}
      forceLTR
      testID={title}>
      {title}
    </Text>
  );

  renderPostContentDetails = (postDetails, isShowNationalityGroup) => {
    // const { shouldShowInYourHood } = this.props;
    // const { startDate, endDate, location, title, isInUserHood, url, companyName, size, rooms, startTime, address, hostType } = postDetails;
    // return (
    //   <View style={styles.contentContainer}>
    //     {!!startDate && !!endDate && this.renderDates({ startDate, endDate })}
    //     {shouldShowInYourHood && isInUserHood && <InHoodLink />}
    //     {!!location && this.renderLocation({ location, title })}
    //     {!!url && this.renderUrl({ url })}
    //     {!!companyName && this.renderCompanyName({ companyName })}
    //     {!!isShowNationalityGroup && this.renderNationalityName()}
    //     {!!(size || rooms) && this.renderSizeAndRooms({ size, rooms })}
    //     {!!startTime && this.renderDateAndLocation({ startTime, address })}
    //     {!!hostType && hostType === eventHostTypes.ONLINE && this.renderOnlineEventIndicator({ hostType })}
    //   </View>
    // );
  };

  renderDates = ({startDate, endDate}) => (
    <View style={styles.detailsRow}>
      <AwesomeIcon
        name="calendar-check"
        style={styles.icon}
        color={flipFlopColors.b70}
        size={12}
        weight="solid"
      />
      <Text
        size={16}
        lineHeight={28}
        color={flipFlopColors.b30}
        numberOfLines={1}
        forceLTR>
        {getDayAndMonth(startDate)} - {getDayAndMonth(endDate)}{' '}
        <Text
          size={16}
          lineHeight={28}
          color={flipFlopColors.b60}
          numberOfLines={1}
          forceLTR>
          (
          {I18n.t('posts.real_estate.number_of_nights', {
            nights: getDaysDifference(startDate, endDate),
          })}
          )
        </Text>
      </Text>
    </View>
  );

  renderLocation = ({location, title}) => (
    <PostContentLocation location={location} title={title} />
  );

  renderOnlineEventIndicator = ({hostType}) => (
    <View style={styles.detailsRow} key="hostType">
      <AwesomeIcon
        name="video"
        style={styles.iconVideo}
        color={flipFlopColors.b70}
        size={12}
        weight="solid"
      />
      <Text size={16} lineHeight={28} color={flipFlopColors.b30}>
        {I18n.t(`events.view.hostTypes.${hostType}`)}
      </Text>
    </View>
  );

  renderUrl = ({url}) => <PostContentLinkRow url={url} />;

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
        lineHeight={28}
        color={flipFlopColors.b30}
        numberOfLines={1}
        forceLTR
        style={styles.detailsRowText}>
        {companyName}
      </Text>
    </View>
  );

  renderNationalityName = () => {
    // const { originNativesName, contextCountryCode } = this.props;
    // return (
    //   <View style={styles.detailsRow}>
    //     <AwesomeIcon name="user-friends" style={styles.iconNationality} color={flipFlopColors.b70} size={12} weight="light" />
    //     <Text size={16} lineHeight={28} color={flipFlopColors.b30} numberOfLines={1} forceLTR style={styles.detailsRowText}>
    //       {getPostNationalityName({ originNativesName, contextCountryCode })}
    //     </Text>
    //   </View>
    // );
  };

  renderSizeAndRooms = ({size, rooms}) => (
    <View style={styles.detailsRow}>
      <AwesomeIcon
        name="building"
        style={styles.iconCompany}
        color={flipFlopColors.b70}
        size={12}
        weight="solid"
      />
      <Text size={16} lineHeight={28} numberOfLines={1} forceLTR>
        {!!size && (
          <Text size={16} lineHeight={28} color={flipFlopColors.b30}>
            {I18n.t('posts.real_estate.size', {size})}
          </Text>
        )}
        {!!(size && rooms) && (
          <Text size={16} lineHeight={28} color={flipFlopColors.b30}>
            {' · '}
          </Text>
        )}
        {!!rooms && (
          <Text size={16} lineHeight={28} color={flipFlopColors.b30}>
            {I18n.p(rooms, 'posts.real_estate.rooms')}
          </Text>
        )}
      </Text>
    </View>
  );

  renderDateAndLocation = ({startTime, address}) => (
    <View>
      <View style={styles.detailsRow}>
        <AwesomeIcon
          name="clock"
          style={styles.iconClock}
          color={flipFlopColors.b70}
          size={12}
          weight="solid"
        />
        <Text size={16} lineHeight={28} color={flipFlopColors.b30}>
          {getFormattedDateAndTime(
            startTime,
            dateAndTimeFormats.eventDayMonthTime,
          )}
        </Text>
        <LocalTimeOffsetIndicator />
      </View>
      {address && this.renderLocation({location: address})}
    </View>
  );

  navigateToEntityInPost = ({contentType, entityId}) => {
    const {
      post: {
        payload: {pageId},
      },
    } = this.props;
    const entityType = Object.values(entityTypes).includes(contentType)
      ? contentType
      : entityTypes.POST;
    if (pageId) {
      navigationService.navigate(screenNames.PageView, {
        entityId: pageId,
        reviewId: entityId,
      });
    } else {
      navigationService.navigate(screenNamesByEntityType[entityType], {
        entityId,
      });
    }
  };
}

PostContent.defaultProps = {
  shouldShowInYourHood: false,
};

PostContent.propTypes = {
  post: PropTypes.object,
  shouldShowInYourHood: PropTypes.bool,
  isWithShareEntityActionButton: PropTypes.bool,
  isAlternatePostView: PropTypes.bool,
  isPostPage: PropTypes.bool,
  alignLocale: PropTypes.bool,
  origin: PropTypes.string,
  originType: PropTypes.oneOf(Object.values(originTypes)),
  onAnswerPress: PropTypes.func,
  usersHoodId: PropTypes.string,
  originNativesName: PropTypes.string,
  contextCountryCode: PropTypes.number,
  isBoundlessMode: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  usersHoodId: get(state, 'auth.user.journey.neighborhood.id', ''),
  originNativesName: get(
    state,
    'auth.user.nationalityGroup.originNativesName',
    '',
  ),
  contextCountryCode: get(ownProps, 'post.contextCountryCode[0]'),
  //   isBoundlessMode: isBoundlessEnabled(get(state, 'auth.user.nationalityGroup'))
});

PostContent = connect(mapStateToProps)(PostContent);
export default PostContent;
