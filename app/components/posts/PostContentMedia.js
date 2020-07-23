import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {StyleSheet, TouchableOpacity, Linking, Dimensions} from 'react-native';
// import { apiQuery } from '/redux/apiQuery/actions';
import {
  View,
  Text,
  Image,
  OverlayText,
  LoadingBackground,
} from '../basicComponents';
// import { VideoThumbnail, MediaErrorMessage } from '/components/media';
import {EntityImagePlaceholder} from '../entity';
import images from '../../assets/images';
import {get} from '../../infra/utils';
import {flipFlopColors} from '../../vars';
import {
  screenNames,
  postTypes,
  entityTypes,
  mediaTypes,
  videoStatus,
} from '../../vars/enums';
import {isIosAndItunesLink} from '../../infra/utils/linkingUtils';
import {navigationService} from '../../infra/navigation';
import {mediaScheme, linkScheme} from '../../schemas/common';

const MAX_THUMBNAILS_TO_SHOW = 3;
const IMAGE_PADDING = 3;
const MAX_IMAGE_HEIGHT = 400;
const MIN_IMAGE_HEIGHT = 100;
export const IMAGE_HEIGHT = 220;
const POST_PAGE_PLACEHOLDER_IMAGE_HEIGHT = 280;
const SMALL_TOP_IMAGE_HEIGHT = 109;
const SMALL_BOTTOM_IMAGE_HEIGHT =
  IMAGE_HEIGHT - SMALL_TOP_IMAGE_HEIGHT - IMAGE_PADDING;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  leftAlignedText: {
    textAlign: 'left',
  },
  linkDetails: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    backgroundColor: flipFlopColors.transparent,
  },
  linkDetailsInner: {
    paddingTop: 5,
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  gradient1: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    height: '125%',
    width: '100%',
  },
  linkDetailsNoImage: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: flipFlopColors.b90,
    backgroundColor: flipFlopColors.white,
  },
  defaultPlaceholderImage: {
    width: '100%',
    height: IMAGE_HEIGHT,
    backgroundColor: flipFlopColors.white,
  },
});

const POST_CONTAINER_MARGINS = 20;
const SHARED_POST_MARGINS = 20;
const TOTAL_BORDER_WIDTH = 2;

class PostContentMedia extends React.Component {
  state = {
    medias: this.props.mediaGallery,
  };

  render() {
    const {
      link,
      contentType,
      isSharedPostEntity,
      isPostPage,
      isWithDefaultPlaceholderImage,
    } = this.props;
    const {medias} = this.state;

    const {width} = Dimensions.get('window');
    const mediaWidth = this.calculateMediaWidth({
      screenWidth: width,
      isSharedPostEntity,
      isPostPage,
    });

    if (medias.length) {
      if (
        [
          entityTypes.EVENT,
          entityTypes.PAGE,
          entityTypes.GROUP,
          entityTypes.LIST_ITEM,
        ].includes(contentType)
      ) {
        const imageHeight = this.calculateImageHeight({
          mediaWidth,
          image: medias[0],
        });
        return (
          <Image
            resizeMode="cover"
            style={{width: mediaWidth, height: imageHeight}}
            source={{uri: medias[0].url}}
          />
        );
      }
      return this.renderMediaGallery({mediaWidth});
    }

    if (link) {
      return this.renderLink({mediaWidth});
    }

    if (isWithDefaultPlaceholderImage) {
      return (
        <EntityImagePlaceholder
          containerStyle={[
            styles.defaultPlaceholderImage,
            isPostPage && {height: POST_PAGE_PLACEHOLDER_IMAGE_HEIGHT},
          ]}
          size={EntityImagePlaceholder.sizes.BIG}
          resizeMode="contain"
          postType={contentType}
        />
      );
    }

    return null;
  }

  static getDerivedStateFromProps(props, state) {
    if (props.mediaGallery !== state.medias) {
      return {
        medias: props.mediaGallery,
      };
    }
    return null;
  }

  renderMediaGallery = ({mediaWidth}) => {
    const {medias} = this.state;
    const {totalMediaItems} = this.props;
    switch (medias.length) {
      case 1: {
        const imageHeight = this.calculateImageHeight({
          mediaWidth,
          image: medias[0],
        });
        return this.renderMedia({
          media: medias[0],
          width: mediaWidth,
          height: imageHeight,
          index: 0,
        });
      }
      case 2: {
        const width = (mediaWidth - IMAGE_PADDING) / 2;
        return (
          <View style={styles.container}>
            {this.renderMedia({
              media: medias[0],
              height: IMAGE_HEIGHT,
              width,
              marginRight: IMAGE_PADDING,
              onPress: () => {},
              index: 0,
            })}
            {this.renderMedia({
              media: medias[1],
              height: IMAGE_HEIGHT,
              width,
              onPress: () => {},
              index: 1,
            })}
          </View>
        );
      }
      default: {
        const bigImageWidth = Math.round((mediaWidth - IMAGE_PADDING) * 0.65);
        const smallImageWidth = mediaWidth - IMAGE_PADDING - bigImageWidth;

        return (
          <View style={styles.container}>
            {this.renderMedia({
              media: medias[0],
              height: IMAGE_HEIGHT,
              width: bigImageWidth,
              marginRight: IMAGE_PADDING,
              onPress: () => {},
              index: 0,
            })}
            <View>
              {this.renderMedia({
                media: medias[1],
                height: SMALL_TOP_IMAGE_HEIGHT,
                width: smallImageWidth,
                marginBottom: IMAGE_PADDING,
                onPress: () => {},
                index: 1,
              })}
              {this.renderMedia({
                openInMediasPage: totalMediaItems > MAX_THUMBNAILS_TO_SHOW,
                media: medias[2],
                height: SMALL_BOTTOM_IMAGE_HEIGHT,
                width: smallImageWidth,
                onPress: () => {},
                index: 2,
              })}
            </View>
          </View>
        );
      }
    }
  };

  renderMedia = ({
    openInMediasPage,
    media,
    width,
    height,
    marginRight,
    marginBottom,
    onPress,
    index,
  }) => {
    const {totalMediaItems} = this.props;
    const hasUrlOrThumbnail =
      (media && media.url && media.url.length) ||
      media.thumbnail ||
      media.thumbnail.length;
    const hasError = media && media.err;
    const isEncoding =
      media && media.videoStatus !== videoStatus.ENCODING_COMPLETE;

    if (!hasError && !hasUrlOrThumbnail && !isEncoding) {
      return null;
    }

    return (
      <TouchableOpacity
        onPress={() => this.navigateToMediasPage({openInMediasPage, index})}
        activeOpacity={1}>
        <View style={{width, height, marginRight, marginBottom}}>
          <LoadingBackground />
          {media &&
            media.err &&
            this.renderMessageError({media, width, height, index})}
          {media &&
            !media.err &&
            media.type === mediaTypes.IMAGE &&
            this.renderImage({media, width, height})}
          {media &&
            !media.err &&
            media.type === mediaTypes.VIDEO &&
            this.renderVideo({media, width, height, onPress, index})}
          {totalMediaItems > 3 && index === 2 && (
            <OverlayText text={`+ ${totalMediaItems - 3}`} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  renderMessageError({media, width, height, index}) {
    // const { medias } = this.state;
    // let size;
    // if (medias.length === 1) {
    //   size = MediaErrorMessage.sizes.BIG;
    // } else if (medias.length === 2 || index === 0) {
    //   size = MediaErrorMessage.sizes.MEDIUM;
    // } else {
    //   size = MediaErrorMessage.sizes.SMALL;
    // }
    // return <MediaErrorMessage type={media.type} size={size} width={width} height={height} />;
  }

  renderImage = ({media, width, height}) => (
    <Image
      resizeMode="cover"
      style={{width, height}}
      source={{uri: media.thumbnail || media.url}}
      onError={() => this.handleMediaError({media})}
    />
  );

  renderVideo = ({media, width, height, index}) => {
    // const { medias } = this.state;
    // const handlePress = medias.length > 1 ? () => this.navigateToMediasPage({ index }) : null;
    // let size;
    // if (medias.length === 1) {
    //   size = VideoThumbnail.sizes.BIG;
    // } else if (index === 0 || medias.length === 2) {
    //   size = VideoThumbnail.sizes.MEDIUM;
    // } else {
    //   size = VideoThumbnail.sizes.SMALL;
    // }
    // return <VideoThumbnail media={media} onPress={handlePress} width={width} maxHeight={height} size={size} shouldStretch />;
  };

  renderLink = ({mediaWidth}) => {
    const {link = {}} = this.props;
    const {info = {}} = link;
    const {media, image} = info;
    const hasImage = !!image || !!media;
    const imageUrl = media ? media.url : image;
    if (!hasImage) {
      return this.renderLinkDetails({
        style: styles.linkDetailsNoImage,
        link,
        textColor1: flipFlopColors.b60,
        textColor2: flipFlopColors.b30,
      });
    }

    const imageHeight = this.calculateImageHeight({
      mediaWidth,
      image: link.info,
    });
    return (
      <TouchableOpacity onPress={this.handleLinkPress} activeOpacity={1}>
        <Image
          resizeMode="cover"
          style={{width: mediaWidth, height: imageHeight}}
          source={{uri: imageUrl}}
        />
        <View style={styles.linkDetails}>
          <Image
            style={styles.gradient1}
            source={images.common.gradientDownTop}
            resizeMode="stretch"
          />
          {this.renderLinkDetails({
            style: styles.linkDetailsInner,
            link,
            textColor1: flipFlopColors.white,
            textColor2: flipFlopColors.white,
          })}
        </View>
      </TouchableOpacity>
    );
  };

  renderLinkDetails = ({style, link, textColor1, textColor2}) => (
    <View style={style}>
      {!!link.host && (
        <Text size={13} lineHeight={20} color={textColor1} numberOfLines={1}>
          {link.host}
        </Text>
      )}
      {link.info && (
        <Text
          size={13}
          lineHeight={18}
          color={textColor2}
          bold
          numberOfLines={3}
          style={styles.leftAlignedText}>
          {link.info && link.info.title}
        </Text>
      )}
    </View>
  );

  handleLinkPress = () => {
    const {link} = this.props;
    if (isIosAndItunesLink(link.url)) {
      Linking.openURL(link.url);
    } else {
      navigationService.navigate(screenNames.WebView, {
        url: link.url,
        title: link.info.title,
        subtitle: link.host,
        disableLiveMetadataDetection: true,
      });
    }
  };

  navigateToMediasPage = async ({openInMediasPage, index}) => {
    // const { medias } = this.state;
    // const { apiQuery, totalMediaItems, postId } = this.props;
    // if (openInMediasPage) {
    //   navigationService.navigate(screenNames.Medias, { medias, totalMediaItems, postId });
    // } else {
    //   let mediaGallery = medias;
    //   if (totalMediaItems !== medias.length && totalMediaItems > MAX_THUMBNAILS_TO_SHOW) {
    //     const res = await apiQuery({ query: { domain: 'posts', key: 'getPost', params: { postId } } });
    //     mediaGallery = get(res, 'data.data.post.payload.mediaGallery', []);
    //   }
    //   navigationService.navigate(screenNames.MediaGalleryModal, {
    //     medias: mediaGallery,
    //     initialSlide: index,
    //     transition: {
    //       fade: true
    //     }
    //   });
    // }
  };

  calculateMediaWidth = ({screenWidth, isSharedPostEntity, isPostPage}) => {
    let containerWidth = screenWidth - POST_CONTAINER_MARGINS;
    if (isSharedPostEntity) {
      containerWidth -= SHARED_POST_MARGINS + TOTAL_BORDER_WIDTH;
    }
    if (isPostPage) {
      containerWidth += POST_CONTAINER_MARGINS;
    }
    return containerWidth;
  };

  handleMediaError = ({media}) => {
    const {medias} = this.state;
    const index = medias.findIndex((m) => m.url === media.url);

    if (index > -1) {
      this.setState(({medias: updatedMedias}) => ({
        medias: [
          ...updatedMedias.slice(0, index),
          {...updatedMedias[index], err: 'woot'},
          ...updatedMedias.slice(index + 1),
        ],
      }));
    }
  };

  calculateImageHeight = ({mediaWidth, image}) => {
    const fullImageHeight = mediaWidth / image.ratio;
    if (fullImageHeight > MAX_IMAGE_HEIGHT) {
      return MAX_IMAGE_HEIGHT;
    } else if (fullImageHeight < MIN_IMAGE_HEIGHT) {
      return MIN_IMAGE_HEIGHT;
    }
    return fullImageHeight;
  };
}

PostContentMedia.defaultProps = {
  mediaGallery: [],
  isWithDefaultPlaceholderImage: false,
};

PostContentMedia.propTypes = {
  contentType: PropTypes.oneOf([
    ...Object.values(postTypes),
    ...Object.values(entityTypes),
  ]),
  mediaGallery: PropTypes.arrayOf(mediaScheme),
  totalMediaItems: PropTypes.number,
  link: linkScheme,
  isSharedPostEntity: PropTypes.bool,
  isPostPage: PropTypes.bool,
  isWithDefaultPlaceholderImage: PropTypes.bool,
  postId: PropTypes.string,
  // apiQuery: PropTypes.func,
};

const mapDispatchToProps = {
  // apiQuery
};
export default connect(null, mapDispatchToProps)(PostContentMedia);
