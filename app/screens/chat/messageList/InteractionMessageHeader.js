// TODO: remove usage of immutable after stream-chat-react-native fix for retrying to send a message
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import I18n from '../../../infra/localization';
import {
  View,
  Text,
  Image,
  LoadingBackground,
} from '../../../components/basicComponents';
import {PostContentMeta} from '../../../components/posts';
import {flipFlopColors, commonStyles} from '../../../vars';
import {get, isEmpty} from '../../../infra/utils';

import {isRTL} from '../../../infra/utils/stringUtils';
// import { getPost } from '/redux/postPage/actions';
import {navigationService} from '../../../infra/navigation';
import {
  postTypes,
  screenNames,
  chatInteractioDefinitions,
} from '../../../vars/enums';
import {userScheme} from '../../../schemas';
import images from '../../../assets/images';

const MIN_IMAGE_HEIGHT = 150;
const INTERACTION_IMAGE_HEIGHT = 175;

const styles = StyleSheet.create({
  interactionWrapper: {
    position: 'relative',
    margin: 15,
    borderRadius: 15,
    paddingTop: 130,
    marginBottom: 0,
    paddingBottom: 25,
    backgroundColor: flipFlopColors.white,
  },
  interactionImageStyle: {
    width: '100%',
    height: INTERACTION_IMAGE_HEIGHT,
    position: 'absolute',
    top: 0,
    backgroundColor: flipFlopColors.white,
    borderRadius: 15,
  },
  interactionSubtitle: {
    paddingHorizontal: 15,
    textAlign: 'center',
  },
  boardsInteractionWrapper: {
    position: 'relative',
    margin: 15,
    borderRadius: 15,
    marginBottom: 0,
    minHeight: MIN_IMAGE_HEIGHT + 60,
    justifyContent: 'flex-end',
    backgroundColor: flipFlopColors.white,
  },
  boardsInteractionImageStyle: {
    width: '100%',
    alignSelf: 'center',
    height: MIN_IMAGE_HEIGHT,
    backgroundColor: flipFlopColors.white,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  boardsLoadingInteractionImageStyle: {
    position: 'absolute',
    top: 0,
  },
  boardsInteractionContent: {
    marginHorizontal: 15,
    marginBottom: 10,
  },
});

const LoadingIndicator = ({mediaWidth}) => (
  <View
    style={[
      styles.boardsInteractionImageStyle,
      styles.boardsLoadingInteractionImageStyle,
      {width: mediaWidth, minHeight: MIN_IMAGE_HEIGHT},
    ]}>
    <LoadingBackground backgroundColor={flipFlopColors.transparent} />
  </View>
);

LoadingIndicator.propTypes = {
  mediaWidth: PropTypes.string,
};

const ImageWithLoading = ({
  mediaWidth,
  mediaSource,
  resizeMode,
  isBoardsInteraction,
}) => (
  <React.Fragment>
    <LoadingIndicator mediaWidth={mediaWidth} />
    <Image
      source={mediaSource}
      style={
        isBoardsInteraction
          ? styles.boardsInteractionImageStyle
          : styles.interactionImageStyle
      }
      resizeMode={resizeMode}
    />
  </React.Fragment>
);

ImageWithLoading.propTypes = {
  mediaSource: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  resizeMode: PropTypes.oneOf(['stretch', 'cover', 'contain', 'center']),
  isBoardsInteraction: PropTypes.bool,
  mediaWidth: PropTypes.string,
};

class InteractionMessageHeader extends Component {
  render() {
    const {isBoardsInteraction} = this.props;
    if (isBoardsInteraction) {
      return this.renderBoardsIntraction();
    }

    return this.renderInteraction();
  }

  componentDidMount = async () => {
    // const { entityId, getPost, post, isBoardsInteraction } = this.props;
    // if (isBoardsInteraction && isEmpty(post)) {
    //   await getPost({ postId: entityId });
    // }
  };

  renderInteraction = () => {
    const {interaction, recipient, mediaWidth} = this.props;
    const {type: interactionType} = interaction;

    if (!chatInteractioDefinitions[interactionType]) {
      return false;
    }
    const firstName =
      get(recipient, 'firstName') || get(recipient, 'name', '').split(' ')[0];
    const {titleColor} = chatInteractioDefinitions[interactionType];
    const subtitle = I18n.t(
      `chat.interactions.${interactionType}.chat_message.subtitle`,
      {firstName},
    );
    const isRtl = isRTL(subtitle);

    return (
      <View
        style={[
          styles.interactionWrapper,
          commonStyles.tinyShadow,
          {width: mediaWidth},
        ]}>
        <ImageWithLoading
          mediaSource={images.interactions[interactionType]}
          resizeMode="contain"
          mediaWidth={this.mediaWidth}
        />
        <View>
          <Text
            size={16}
            lineHeight={22}
            color={titleColor}
            bold
            style={styles.interactionSubtitle}
            forceRTL={isRtl}>
            {subtitle}
          </Text>
        </View>
      </View>
    );
  };

  renderBoardsIntraction = () => {
    const {post, mediaWidth} = this.props;
    if (!post) {
      return (
        <View
          style={[
            styles.boardsInteractionWrapper,
            commonStyles.tinyShadow,
            {width: mediaWidth},
          ]}>
          <LoadingIndicator mediaWidth={this.mediaWidth} />
        </View>
      );
    }

    const {payload, tags, context} = post;
    const {title, postType, postSubType, templateData = {}} = payload;
    const {price} = templateData;
    const mediaUrl = get(payload, 'mediaGallery.[0].url');
    const imgSource = !isEmpty(mediaUrl)
      ? {uri: mediaUrl}
      : get(images, `entityImagePlaceholders.${postType}`);

    return (
      <TouchableOpacity
        onPress={this.navigateToPostPage(post.id)}
        activeOpacity={0.9}
        style={[
          styles.boardsInteractionWrapper,
          commonStyles.tinyShadow,
          {width: mediaWidth},
        ]}>
        <ImageWithLoading
          mediaSource={imgSource}
          resizeMode="cover"
          mediaWidth={this.mediaWidth}
          isBoardsInteraction
        />
        <View style={styles.boardsInteractionContent}>
          <PostContentMeta
            isLinkable={false}
            withBorderTop={false}
            tags={tags}
            contentType={postType}
            postSubType={postSubType}
            context={context}
            price={price}
          />
          <Text size={16} lineHeight={22} color={flipFlopColors.b30} bold>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  navigateToPostPage = (entityId) => () => {
    navigationService.navigate(screenNames.PostPage, {
      entityId,
      preventFirstFetchPost: true,
    });
  };
}

InteractionMessageHeader.propTypes = {
  mediaWidth: PropTypes.number,
  recipient: userScheme,
  post: PropTypes.object,
  isBoardsInteraction: PropTypes.bool,
  interaction: PropTypes.object,
  entityId: PropTypes.string,
  //   getPost: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  const entityId = get(ownProps, 'interaction.entityId');
  const interactionType = get(ownProps, 'interaction.type');
  const mapState = {
    isBoardsInteraction: [
      postTypes.GIVE_TAKE,
      postTypes.REAL_ESTATE,
      postTypes.JOB,
    ].includes(interactionType),
  };

  if (entityId) {
    mapState.entityId = entityId;
    mapState.post = get(state, `postPage.${entityId}.post`);
  }

  return mapState;
};

const mapDispatchToProps = {
  //   getPost
};

InteractionMessageHeader = connect(
  mapStateToProps,
  mapDispatchToProps,
)(InteractionMessageHeader);

export default InteractionMessageHeader;
