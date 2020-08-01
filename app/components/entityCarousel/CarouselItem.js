import React, {Component} from 'react';
// import { denormalize, constructDenormalizedData } from '/redux/normalizer';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import I18n from '../../infra/localization';
import {StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {AwesomeIcon, FlipFlopIcon} from '../../assets/icons';
// import { HtmlTextWithLinks } from '/components';
import {View, Text, Image, BreadCrumbs} from '../basicComponents';
import {EntityImagePlaceholder} from '../../components/entity';
import {flipFlopColors, flipFlopFontsWeights} from '../../vars';
import {
  entityTypes,
  originTypes,
  screenNamesByEntityType,
  dateAndTimeFormats,
  postTypes,
  mediaTypes,
  componentNamesForAnalytics,
} from '../../vars/enums';
import {stylesScheme, userScheme} from '../../schemas';
import {get} from '../../infra/utils';
import {getFormattedDateAndTime} from '../../infra/utils/dateTimeUtils';
import {toCurrency} from '../../infra/utils/stringUtils';
import {navigationService} from '../../infra/navigation';
import {analytics} from '/infra/reporting';
import ActivationCarouselItem from './ActivationCarouselItem';

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 15,
    marginRight: 10,
    marginLeft: 5,
    backgroundColor: flipFlopColors.white,
    shadowColor: flipFlopColors.boxShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
    elevation: 5,
  },
  firstSlide: {
    marginLeft: 10,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  smallContainer: {
    height: 215,
    width: 140,
    borderRadius: 10,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  smallActionlessContainer: {
    height: 160,
    width: 140,
    borderRadius: 10,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  smallUnifiedLookContainer: {
    height: 160,
    width: 140,
    borderRadius: 10,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  mediumContainer: {
    height: 270,
    width: 210,
    borderRadius: 10,
  },
  mediaWrapper: {
    width: '100%',
    overflow: 'hidden',
  },
  // eslint-disable-next-line react-native/no-unused-styles
  smallMediaWrapper: {
    height: 90,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  smallActionlessMediaWrapper: {
    height: 90,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  smallUnifiedLookMediaWrapper: {
    height: 110,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  mediumMediaWrapper: {
    height: 134,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  videoIconWrapper: {
    position: 'absolute',
    top: 10,
    left: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: flipFlopColors.halfRealBlack,
  },
  imageAction: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  mediaBanner: {
    height: 30,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: flipFlopColors.halfRealBlack,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  mediaBannerIcon: {
    marginRight: 7,
    lineHeight: 18,
  },
  content: {
    paddingHorizontal: 10,
    paddingBottom: 6,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  smallContent: {
    height: 65,
    paddingTop: 8,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  smallActionlessContent: {
    height: 60,
    paddingTop: 8,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  mediumContent: {
    height: 76,
    paddingTop: 10,
  },
  breadCrumbsWrapper: {
    marginBottom: 2,
  },
  breadCrumbs: {
    color: flipFlopColors.b60,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  smallBreadCrumbs: {
    fontSize: 12,
    lineHeight: 18,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  smallActionlessBreadCrumbs: {
    fontSize: 12,
    lineHeight: 18,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  smallTitle: {
    marginTop: 2,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  smallActionlessTitle: {
    marginTop: 2,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  mediumTitle: {
    marginTop: 3,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  smallUnifiedLookTitle: {
    marginTop: 6,
  },
  footer: {
    overflow: 'hidden',
  },
  // eslint-disable-next-line react-native/no-unused-styles
  smallFooter: {
    height: 55,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: flipFlopColors.white,
    paddingBottom: 5,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  mediumFooter: {
    height: 60,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: flipFlopColors.white,
    paddingBottom: 10,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: flipFlopColors.b30,
    fontWeight: flipFlopFontsWeights.bold,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  mediumText: {
    fontSize: 16,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  smallUnifiedLookText: {
    color: flipFlopColors.b30,
    fontSize: 13,
  },
  badgeOuter: {
    position: 'absolute',
    top: 8,
    left: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: flipFlopColors.white,
  },
  badgeInner: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: flipFlopColors.pinkishRed,
  },
  badgeIcon: {
    lineHeight: 15,
    marginLeft: Platform.select({ios: 1, android: 0}),
  },
});

class CarouselItem extends Component {
  static sizes = {
    SMALL: 'small',
    SMALL_ACTIONLESS: 'smallActionless',
    SMALL_UNIFIED_LOOK: 'smallUnifiedLook',
    MEDIUM: 'medium',
  };

  imageSizeMap = {
    [CarouselItem.sizes.SMALL]: EntityImagePlaceholder.sizes.SMALL,
    [CarouselItem.sizes.MEDIUM]: EntityImagePlaceholder.sizes.MEDIUM,
    [CarouselItem.sizes.SMALL_ACTIONLESS]: EntityImagePlaceholder.sizes.BIG,
    [CarouselItem.sizes.SMALL_UNIFIED_LOOK]:
      EntityImagePlaceholder.sizes.MEDIUM,
  };

  static renderImage({
    uri,
    isVideo,
    entityType,
    size,
    postType,
    showBadge,
    imageSizeMap,
  }) {
    if (!uri) {
      return (
        <EntityImagePlaceholder
          entityType={entityType}
          postType={postType}
          size={imageSizeMap[size]}
          showBadge={showBadge}
        />
      );
    }

    return (
      <View>
        <Image
          source={{uri}}
          style={[styles.mediaWrapper, styles[`${size}MediaWrapper`]]}
        />
        {isVideo && (
          <View style={styles.videoIconWrapper} key="entityVideoPlayButton">
            <AwesomeIcon
              name="video"
              size={12}
              color={flipFlopColors.white}
              weight="solid"
            />
          </View>
        )}
        {showBadge && (
          <View style={styles.badgeOuter}>
            <View style={styles.badgeInner}>
              <FlipFlopIcon
                name="star"
                size={16}
                color={flipFlopColors.white}
                style={styles.badgeIcon}
              />
            </View>
          </View>
        )}
      </View>
    );
  }

  render() {
    const {
      entity,
      item,
      size,
      entityType,
      itemNumber,
      style,
      renderComponent,
      testID,
      shouldRenderActions,
      shouldRenderBreadcrumbs,
    } = this.props;
    const itemData = this.getItemData();

    if (!itemData) {
      return null;
    }

    const {
      mediaUrl,
      isVideo,
      mediaBanner,
      entityText,
      postType,
      title,
      mentions,
      showBadge,
    } = itemData;

    if (postType === postTypes.ACTIVATION) {
      return (
        <ActivationCarouselItem
          data={entity}
          itemNumber={itemNumber}
          onPress={this.navigateToEntityPage}
        />
      );
    }

    const includeAction =
      shouldRenderActions &&
      ![
        CarouselItem.sizes.SMALL_ACTIONLESS,
        CarouselItem.sizes.SMALL_UNIFIED_LOOK,
      ].includes(size);
    const includeBreadcrumbs =
      shouldRenderBreadcrumbs &&
      ![CarouselItem.sizes.SMALL_UNIFIED_LOOK].includes(size);
    const actionOnImage = [CarouselItem.sizes.SMALL_UNIFIED_LOOK].includes(
      size,
    );

    return (
      <TouchableOpacity
        style={[
          styles.container,
          !itemNumber && styles.firstSlide,
          styles[`${size}Container`],
          style,
        ]}
        onPress={this.navigateToEntityPage}
        activeOpacity={1}
        testID={testID}
        key={item.id || item}>
        <View style={[styles.mediaWrapper, styles[`${size}MediaWrapper`]]}>
          {CarouselItem.renderImage({
            uri: mediaUrl,
            isVideo,
            entityType,
            size,
            postType,
            showBadge,
            imageSizeMap: this.imageSizeMap,
          })}
          {!!mediaBanner && (
            <View style={styles.mediaBanner}>{mediaBanner}</View>
          )}
          {actionOnImage && (
            <View style={styles.imageAction}>{this.renderEntityAction()}</View>
          )}
        </View>
        <View style={[styles.content, styles[`${size}Content`]]}>
          {includeBreadcrumbs && (
            <View style={styles.breadCrumbsWrapper}>
              <BreadCrumbs
                entityType={entityType !== entityTypes.POST ? entityType : null}
                postType={postType}
                mainTag={entityText}
                style={[styles.breadCrumbs, styles[`${size}BreadCrumbs`]]}
                isArrowShown={false}
                mediumText={false}
              />
            </View>
          )}
          {/* <HtmlTextWithLinks
            wrapperStyle={styles[`${size}Title`]}
            showExpand={false}
            disableRtl
            textStyle={[styles.text, styles[`${size}Text`]]}
            lineHeight={[CarouselItem.sizes.MEDIUM, CarouselItem.sizes.SMALL_UNIFIED_LOOK].includes(size) ? 22 : 17}
            numberOfLines={2}
            text={title}
            showTranslateButton={false}
            mentions={mentions}
          /> */}
        </View>
        {includeAction && (
          <View style={[styles.footer, styles[`${size}Footer`]]}>
            {this.renderEntityAction()}
          </View>
        )}
        {!!renderComponent && renderComponent}
      </TouchableOpacity>
    );
  }

  renderEntityAction = () => {
    // const { entity, sharedEntity, sharedEntityType, sharedEntityId, sharedEntityPost, size, entityType, context, originType, componentName } = this.props;
    // const data = constructDenormalizedData({ entity, sharedEntity, sharedEntityType, sharedEntityId, sharedEntityPost });
    // const itemData = this.getItemData();
    // const { postType } = itemData;
    // return (
    //   <EntityAction
    //     size={size === CarouselItem.sizes.SMALL_UNIFIED_LOOK ? 'tiny' : 'medium'}
    //     contentType={postType || entityType}
    //     entityType={entityType}
    //     data={data}
    //     actor={data.actor}
    //     context={context || data.context}
    //     contextPost={data}
    //     isAvatarsShown={false}
    //     originType={originType}
    //     componentName={componentName}
    //   />
    // );
  };

  getItemData = () => {
    // const {
    //   currency,
    //   entity,
    //   entityType,
    //   size,
    //   user: {id},
    // } = this.props;
    // let mediaUrl;
    // let isVideo;
    // let mediaBanner;
    // let entityText;
    // let postType;
    // let title;
    // let mentions;
    // let showBadge;
    // switch (entityType) {
    //   case entityTypes.POST: {
    //     const {
    //       actor,
    //       payload: {
    //         mediaGallery,
    //         title: itemTitle,
    //         text,
    //         postType: itemPostType,
    //         templateData,
    //       },
    //       mentions: itemMentions,
    //     } = entity;
    //     mediaUrl =
    //       get(mediaGallery, '[0].thumbnail') ||
    //       get(mediaGallery, '[0].url') ||
    //       get(actor, 'media.thumbnail');
    //     isVideo = get(mediaGallery, '[0].type') === mediaTypes.VIDEO;
    //     postType = itemPostType;
    //     entityText = I18n.t(`carousels.post_type_names.${postType}`);
    //     title = itemTitle || text;
    //     mentions = itemMentions;
    //     if (postType === postTypes.REAL_ESTATE) {
    //       mediaBanner = templateData &&
    //         templateData.price && [
    //           <AwesomeIcon
    //             name="coins"
    //             style={styles.mediaBannerIcon}
    //             color={flipFlopColors.white}
    //             size={13}
    //             weight="solid"
    //             key={1}
    //           />,
    //           <Text
    //             medium
    //             size={12}
    //             lineHeight={18}
    //             color={flipFlopColors.white}
    //             numberOfLines={1}
    //             forceLTR
    //             key={2}>
    //             {toCurrency(templateData.price, currency)}
    //           </Text>,
    //         ];
    //     }
    //     break;
    //   }
    //   case entityTypes.LIST:
    //   case entityTypes.PAGE:
    //   case entityTypes.GROUP: {
    //     const {media, name, manager, isOwner} = entity;
    //     mediaUrl = get(media, 'thumbnail') || get(media, 'url');
    //     isVideo = get(media, 'type') === mediaTypes.VIDEO;
    //     entityText = I18n.t(`carousels.entity_type_names.${entityType}`);
    //     title = name;
    //     if (entityType === entityTypes.GROUP) {
    //       showBadge =
    //         manager && manager.findIndex((admin) => admin.id === id) !== -1;
    //     } else if (entityType === entityTypes.PAGE) {
    //       showBadge = !!isOwner;
    //     }
    //     break;
    //   }
    //   case entityTypes.EVENT: {
    //     if (typeof entity === 'string') {
    //       // the event was deleted
    //       return null;
    //     }
    //     const {media, name, startTime, hosts} = entity;
    //     mediaUrl = media.thumbnail || media.url;
    //     isVideo = media.type === mediaTypes.VIDEO;
    //     entityText = I18n.t(`carousels.entity_type_names.${entityType}`);
    //     title = name;
    //     showBadge = hosts && hosts.findIndex((host) => host.id === id) !== -1;
    //     const dateTimeFormat = [
    //       CarouselItem.sizes.SMALL,
    //       CarouselItem.sizes.SMALL_ACTIONLESS,
    //     ].includes(size)
    //       ? dateAndTimeFormats.eventDayTime
    //       : dateAndTimeFormats.eventDayMonthTime;
    //     mediaBanner = !!startTime && [
    //       <AwesomeIcon
    //         name="clock"
    //         style={styles.mediaBannerIcon}
    //         color={flipFlopColors.white}
    //         size={12}
    //         weight="solid"
    //         key={1}
    //       />,
    //       <Text
    //         medium
    //         size={12}
    //         lineHeight={18}
    //         color={flipFlopColors.white}
    //         numberOfLines={1}
    //         key={2}>
    //         {getFormattedDateAndTime(startTime, dateTimeFormat)}
    //       </Text>,
    //     ];
    //     break;
    //   }
    //   default:
    //     return null;
    // }
    // return {
    //   mediaUrl,
    //   isVideo,
    //   mediaBanner,
    //   entityText,
    //   postType,
    //   title,
    //   mentions,
    //   showBadge,
    // };
  };

  navigateToEntityPage = ({showKeyboard = false} = {}) => {
    //     const {
    //       carouselId,
    //       carouselType,
    //       fireAnalyticsEvents,
    //       itemNumber,
    //       entityType,
    //       entity: { id, groupType },
    //       originType,
    //       extraAnalyticsData
    //     } = this.props;
    //     const screenName = screenNamesByEntityType[entityType];
    //     if (fireAnalyticsEvents) {
    //       const trackProps = {
    //         carouselId,
    //         carouselType,
    //         entityId: id,
    //         entityType,
    //         index: itemNumber + 1,
    //         originType,
    //         extraAnalyticsData
    //       };
    //       analytics.actionEvents.carouselItemClick(trackProps).dispatch();
    //     }
    //     navigationService.navigate(screenName, { entityId: id, originType: originTypes.SUGGESTED, groupType, showKeyboard, extraData: extraAnalyticsData });
  };
}

CarouselItem.defaultProps = {
  size: CarouselItem.sizes.MEDIUM,
  shouldRenderActions: true,
  shouldRenderBreadcrumbs: true,
};

CarouselItem.propTypes = {
  item: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  size: PropTypes.oneOf(Object.values(CarouselItem.sizes)),
  entityType: PropTypes.oneOf(Object.values(entityTypes)),
  style: stylesScheme,
  entity: PropTypes.object,
  sharedEntity: PropTypes.object,
  sharedEntityType: PropTypes.string,
  sharedEntityId: PropTypes.string,
  sharedEntityPost: PropTypes.object,
  originType: PropTypes.oneOf(Object.values(originTypes)),
  componentName: PropTypes.oneOf(Object.values(componentNamesForAnalytics)),
  renderComponent: PropTypes.object,
  context: PropTypes.object,
  user: userScheme,
  itemNumber: PropTypes.number,
  testID: PropTypes.string,
  currency: PropTypes.string,
  carouselType: PropTypes.string,
  carouselId: PropTypes.string,
  fireAnalyticsEvents: PropTypes.bool,
  extraAnalyticsData: PropTypes.object,
  shouldRenderActions: PropTypes.bool,
  shouldRenderBreadcrumbs: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => {
  const {
    entity,
    sharedEntity,
    sharedEntityType,
    sharedEntityId,
    sharedEntityPost,
  } = denormalize({dataProp: ownProps.item, state});

  return {
    user: state.auth.user,
    entity,
    sharedEntity,
    sharedEntityType,
    sharedEntityId,
    sharedEntityPost,
    currency: state.auth.user.community.destinationPricing.currencyCode,
  };
};

export default connect(mapStateToProps)(CarouselItem);
