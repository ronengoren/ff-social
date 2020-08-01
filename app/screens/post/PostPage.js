import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, FlatList} from 'react-native';
import {connect} from 'react-redux';
// import { getPost } from '/redux/postPage/actions';
// import { openActionSheet } from '/redux/general/actions';
// import { deletePost } from '/redux/feed/actions';
// import { clearMentionsList } from '/redux/mentions/actions';
// import { apiCommand } from '/redux/apiCommands/actions';
import {
  Screen,
  Header,
  PostHeader,
  PostContent,
  PostFooter,
  Comment,
  ItemErrorBoundary,
} from '../../components';
import {IntroductionPost} from '../../components/introduction';
import {ActivationPost} from '../../components/activation';
import {JoinedYourCommunityPost} from '../../components/joinedYourCommunity';
import {InstagramPassivePostFooter} from '../../components/instagram';
import {
  View,
  IconButton,
  FloatingHeader,
  CommentInput,
} from '../../components/basicComponents';
import {PollPost} from '../../components/poll';
// import ViewCountsService from '/infra/viewCounts';
import {flipFlopColors, uiConstants, commonStyles} from '../../vars';
import {
  postTypes,
  listViewTypes,
  screenNames,
  entityTypes,
  originTypes,
  passivePostSubTypes,
} from '../../vars/enums';
import {get} from '../../infra/utils';
import {navigationService} from '../../infra/navigation';
import {PostActionSheetButton} from '../../components/posts';

const styles = StyleSheet.create({
  container: {
    backgroundColor: flipFlopColors.white,
  },
  postBody: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  shadowWithMargin: {
    marginBottom: 20,
    ...commonStyles.shadow,
  },
  floatingHeaderWrapper: {
    paddingLeft: 0,
    paddingRight: 0,
    height: 65,
  },
  headerButtons: {
    position: 'absolute',
    top: uiConstants.PHONE_BAR_HEIGHT_TRANSLUCENT,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 45,
    backgroundColor: flipFlopColors.transparent,
    paddingHorizontal: 10,
  },
});

class PostPage extends React.Component {
  state = {
    scrollY: 0,
    throwError: null,
    showFloatingHeader: false,
  };

  render() {
    const {
      postPageData,
      showKeyboard,
      postId,
      navigation: {
        state: {
          params: {placeHolder},
        },
      },
    } = this.props;
    const postType = get(postPageData, 'post.payload.postType');
    const contextEntity = {
      id: postId,
      type: entityTypes.POST,
    };
    const feedContextId = get(postPageData, 'post.context.id');
    const isAlternatePostView = [
      postTypes.REAL_ESTATE,
      postTypes.GIVE_TAKE,
      postTypes.JOB,
      postTypes.GUIDE,
    ].includes(postType);
    return (
      <React.Fragment>
        {!isAlternatePostView && <Header hasBackButton />}
        <CommentInput
          style={styles.container}
          ref={(node) => {
            this.commentInput = node;
          }}
          showKeyboard={showKeyboard}
          screenName={screenNames.PostPage}
          onMentionSearchClosed={this.handleMentionSearchClosed}
          contextEntity={contextEntity}
          topContextEntity={contextEntity}
          placeHolder={placeHolder}
          feedContextId={feedContextId}
          isInputPermanent>
          {this.renderPostBody({isAlternatePostView})}
        </CommentInput>
        {isAlternatePostView && this.renderFloatingHeader()}
      </React.Fragment>
    );
  }

  //   componentDidMount = async () => {
  //     const { getPost, postId, preventFirstFetchPost } = this.props;
  //     if (!preventFirstFetchPost) {
  //       try {
  //         await getPost({ postId });
  //       } catch (err) {
  //         this.setState({ throwError: err }); // eslint-disable-line react/no-did-mount-set-state
  //       }
  //     }
  //   };

  //   componentDidUpdate(prevProps) {
  //     const { postPageData, postId } = this.props;
  //     const prevCommentsCount = get(prevProps, 'postPageData.comments.length', 0);
  //     const commentsCount = get(postPageData, 'comments.length', 0);
  //     const isNewComment = commentsCount > prevCommentsCount;

  //     if (isNewComment) {
  //       this.scroller.scrollToEnd();
  //     }

  //     if (this.state.throwError) {
  //       throw this.state.throwError;
  //     }

  //     if (!get(prevProps, 'postPageData.loaded') && get(postPageData, 'loaded')) {
  //       ViewCountsService.handlePostViewEvent({ id: postId });
  //     }
  //   }

  handleMentionSearchClosed = () => {
    this.scroller.scrollToOffset({offset: this.state.scrollY, animated: false});
  };

  renderPostContent = ({isAlternatePostView}) => {
    const {postPageData, navigation} = this.props;

    const postDataLoaded = postPageData && postPageData.loaded;
    const origin = get(navigation, 'state.params.origin');
    if (!postDataLoaded || !postPageData.post) return null;

    const postType = get(postPageData, 'post.payload.postType');
    const postSubType = get(postPageData, 'post.payload.postSubType');
    const isPollPost =
      get(postPageData.post, 'sharedEntity.entity.viewType') ===
        listViewTypes.POLL &&
      get(postPageData.post, 'sharedEntity.entity.items');
    const isIntroPost = postType === postTypes.INTRODUCTION;
    const isJoinCommunityPost =
      postType === postTypes.PASSIVE_POST &&
      postSubType === passivePostSubTypes.COMMUNITY_JOINED;
    const isActivationPost = postType === postTypes.ACTIVATION;
    const isInstagramPost =
      postType === postTypes.PASSIVE_POST &&
      postSubType === passivePostSubTypes.INSTAGRAM_CONNECT;
    const isWithShareEntityActionButton = [
      postTypes.REAL_ESTATE,
      postTypes.GIVE_TAKE,
      postTypes.JOB,
    ].includes(postType);

    const isGuide = postType === postTypes.GUIDE;
    const isEvent =
      get(postPageData.post, 'sharedEntity.entityType') === entityTypes.EVENT;
    const hideShareFromFooter = isEvent || isGuide;
    const {scheduledDate} = postPageData.post;

    if (isPollPost) {
      return (
        <PollPost
          data={postPageData.post}
          originType={originTypes.POST_PAGE}
          isPostPage
        />
      );
    }
    if (isIntroPost) {
      return <IntroductionPost data={postPageData.post} isPostPage />;
    }
    if (isActivationPost) {
      return <ActivationPost data={postPageData.post} isPostPage />;
    }
    if (isJoinCommunityPost) {
      return <JoinedYourCommunityPost data={postPageData.post} isPostPage />;
    }

    if (isInstagramPost) {
      return (
        <View style={styles.container}>
          <PostHeader post={postPageData.post} isPostPage />
          <PostContent
            post={postPageData.post}
            isPostPage
            originType={originTypes.POST_PAGE}
          />
          <InstagramPassivePostFooter isPostPage data={postPageData.post} />
        </View>
      );
    }

    return (
      <View testID="postPageBody">
        <View style={[styles.postBody, commonStyles.shadow]}>
          {!isAlternatePostView && (
            <PostHeader post={postPageData.post} isPostPage />
          )}
          <PostContent
            post={postPageData.post}
            origin={origin}
            originType={originTypes.POST_PAGE}
            onAnswerPress={this.handleAnswerPress}
            isPostPage
            isAlternatePostView={isAlternatePostView}
            isWithShareEntityActionButton={isWithShareEntityActionButton}
          />
          {isAlternatePostView && this.renderPostHeaderButtons()}
          {!scheduledDate && (
            <PostFooter
              post={postPageData.post}
              isPostPage
              isWithoutShare={
                isWithShareEntityActionButton || hideShareFromFooter
              }
            />
          )}
        </View>
      </View>
    );
  };

  renderPostBody = ({isAlternatePostView}) => {
    const {postPageData, postId, user} = this.props;
    const contextEntity = {
      id: postId,
      type: entityTypes.POST,
      name:
        get(postPageData, 'post.payload.title') ||
        get(postPageData, 'post.payload.text'),
    };
    const feedContextId = get(postPageData, 'post.context.id');

    return (
      <FlatList
        removeClippedSubviews={false}
        onScroll={this.handleScroll}
        scrollEventThrottle={50}
        style={styles.scrollContainer}
        contentContainerStyle={styles.listContent}
        data={postPageData && postPageData.comments}
        keyExtractor={(commentId) => commentId}
        renderItem={({item, index}) => (
          <ItemErrorBoundary boundaryName="commentItem">
            {index === 0 && (
              <View style={[commonStyles.shadow, styles.shadowWithMargin]} />
            )}
            <Comment
              commentId={item}
              contextEntity={contextEntity}
              topContextEntity={contextEntity}
              topEntityOwnership={user.id === postPageData.post.actor.id}
              feedContextId={feedContextId}
              onReplyPress={this.handleReplyPress}
              resetInput={this.resetInput}
            />
          </ItemErrorBoundary>
        )}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        ref={(node) => {
          this.scroller = node;
        }}
        ListHeaderComponent={this.renderPostContent({isAlternatePostView})}
      />
    );
  };

  renderPostHeaderButtons = () => {
    const {postPageData} = this.props;
    return (
      <View style={styles.headerButtons}>
        <IconButton
          name="back-arrow"
          style={styles.removeIcon}
          iconColor="b30"
          iconSize={26}
          onPress={() => navigationService.goBack()}
          hitSlop={uiConstants.BTN_HITSLOP}
        />
        <PostActionSheetButton
          iconColor="b30"
          isPostPage
          post={postPageData.post}
        />
      </View>
    );
  };

  renderFloatingHeader = () => {
    const {postPageData} = this.props;
    const {showFloatingHeader} = this.state;
    return (
      <FloatingHeader
        key="floatingHeader"
        showFloatingHeader={showFloatingHeader}
        style={styles.floatingHeaderWrapper}
        height={uiConstants.NAVBAR_HEIGHT}>
        <Header
          hasBackButton
          titleColor={flipFlopColors.b30}
          buttonColor="b30"
          backgroundColor={flipFlopColors.white}
          rightComponent={
            <PostActionSheetButton
              iconColor="b30"
              isPostPage
              post={postPageData && postPageData.post}
            />
          }
        />
      </FloatingHeader>
    );
  };

  handleReplyPress = ({comment, contextEntity}) =>
    this.commentInput.handleCommentItemReply({comment, contextEntity});

  handleAnswerPress = () => this.commentInput && this.commentInput.focusInput();

  resetInput = () => this.commentInput.resetInput();

  handleScroll = (e) => {
    const breakpoint = FloatingHeader.getAdjustedBreakpoint(60);
    const contentOffset = e.nativeEvent.contentOffset.y;
    const {showFloatingHeader} = this.state;

    if (contentOffset > breakpoint && !showFloatingHeader) {
      this.setState({
        showFloatingHeader: true,
        scrollY: e.nativeEvent.contentOffset.y,
      });
    } else if (contentOffset < breakpoint && showFloatingHeader) {
      this.setState({
        showFloatingHeader: false,
        scrollY: e.nativeEvent.contentOffset.y,
      });
    }
  };
}

PostPage.propTypes = {
  postPageData: PropTypes.object,
  user: PropTypes.object,
  postId: PropTypes.string,
  showKeyboard: PropTypes.bool,
  preventFirstFetchPost: PropTypes.bool,
  navigation: PropTypes.object,
  //   getPost: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  const {
    entityId: postId,
    showKeyboard,
    preventFirstFetchPost,
  } = ownProps.navigation.state.params;
  return {
    user: state.auth.user,
    postPageData: state.postPage[postId],
    postId,
    showKeyboard,
    preventFirstFetchPost,
  };
};

const mapDispatchToProps = {
  //   getPost,
  //   apiCommand,
  //   openActionSheet,
  //   deletePost,
  //   clearMentionsList
};

PostPage = connect(mapStateToProps, mapDispatchToProps)(PostPage);
PostPage = Screen()(PostPage);
export default PostPage;
