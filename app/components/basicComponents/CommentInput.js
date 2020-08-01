import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Platform, LayoutAnimation, Keyboard} from 'react-native';
import {connect} from 'react-redux';
import I18n from '../../infra/localization';
// import { createComment } from '/redux/comments/actions';
// import { clearMentionsList, addNewMention } from '/redux/mentions/actions';
// import { apiCommand } from '/redux/apiCommands/actions';
import {
  TextForm,
  Form,
  SearchMentionsResultsList,
  mentionUtils,
} from '../../components';
import {
  View,
  KeyboardAvoidingView,
  IconButton,
  TranslatedText,
} from '../../components/basicComponents';
import {ErrorModal} from '../../components/modals';
import {flipFlopColors, uiConstants} from '../../vars';
import {entityTypes} from '../../vars/enums';
import {stylesScheme, searchMentionsScheme} from '../../schemas';
import {navigationService} from '../../infra/navigation';
import {pick} from '../../infra/utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: uiConstants.FOOTER_MARGIN_BOTTOM,
  },
  searchResults: {
    flex: 1,
    backgroundColor: flipFlopColors.white,
  },
  replyHeader: {
    flexDirection: 'row',
    borderTopColor: flipFlopColors.disabledGrey,
    borderTopWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  replyHeaderText: {
    flex: 1,
  },
});

class CommentInput extends React.Component {
  state = {
    replyTo: null,
    contextEntity: this.props.contextEntity,
    topContextEntity: this.props.topContextEntity,
    isInputShown: this.props.isInputPermanent || this.props.showKeyboard,
    isMediaChoosing: false,
  };

  render() {
    const {
      style,
      children,
      buttonText,
      onChange,
      placeHolder,
      showKeyboard,
      keyboardVerticalOffset,
    } = this.props;
    const {replyTo, isInputShown} = this.state;
    const inputPlaceholder =
      placeHolder ||
      I18n.t(
        replyTo ? 'comment.reply_placholder' : 'comment.comment_placholder',
      );
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={[styles.container, style]}>
        {this.shouldShowMentionSearch(this.props.searchMentions)
          ? this.renderSearchResults()
          : children}
        {!!isInputShown && !!replyTo && this.renderReplyHeader()}
        {!!isInputShown && (
          <Form>
            {(form) => (
              <TextForm
                onChange={onChange}
                placeholder={inputPlaceholder}
                btnText={buttonText}
                onPress={this.handleSubmit}
                onMediaChooseStart={() =>
                  this.setState({isMediaChoosing: true})
                }
                onMediaChooseEnd={() => this.setState({isMediaChoosing: false})}
                ref={(node) => {
                  this.textInput = node;
                }}
                form={form}
                withMentions={this.isCurrentPageOnTop()}
                withImage
                autoFocus={showKeyboard}
              />
            )}
          </Form>
        )}
      </KeyboardAvoidingView>
    );
  }

  getInitialState = () => ({
    replyTo: null,
    contextEntity: this.props.contextEntity,
  });

  componentDidMount = async () => {
    const {showKeyboard, isInputPermanent} = this.props;
    if (showKeyboard) {
      this.focusInput();
    }
    !isInputPermanent &&
      Keyboard.addListener('keyboardDidHide', this.handleKeyboardHidden);
  };

  componentDidUpdate(prevProps) {
    const prevShowingSearch = this.shouldShowMentionSearch(
      prevProps.searchMentions,
    );
    const currentlyShowingSearch = this.shouldShowMentionSearch(
      this.props.searchMentions,
    );

    if (prevShowingSearch && !currentlyShowingSearch) {
      this.props.onMentionSearchClosed();
    }
  }

  componentWillUnmount() {
    const {isInputPermanent} = this.props;
    !isInputPermanent &&
      Keyboard.removeListener('keyboardDidHide', this.handleKeyboardHidden);
  }

  renderReplyHeader = () => {
    const {replyTo} = this.state;
    const {isInputPermanent} = this.props;

    return (
      <View style={styles.replyHeader}>
        <TranslatedText
          style={styles.replyHeaderText}
          size={13}
          lineHeight={20}
          color={flipFlopColors.b60}>
          {I18n.t('comment.reply_header', {name: replyTo})}
        </TranslatedText>
        {isInputPermanent && (
          <IconButton
            size="small"
            iconSize={13}
            name="close"
            iconColor="b60"
            onPress={this.handleReplyRemove}
          />
        )}
      </View>
    );
  };

  renderSearchResults = () => (
    <View style={styles.searchResults}>
      <SearchMentionsResultsList />
    </View>
  );

  handleKeyboardHidden = () => {
    const {isMediaChoosing} = this.state;
    !isMediaChoosing && this.setState({isInputShown: false});
  };

  handleReplyRemove = () => {
    LayoutAnimation.easeInEaseOut();
    this.setState(this.getInitialState());
    this.resetInput();
  };

  handleSubmit = async ({text, mediaUrl, publishAs}) => {
    // const { topContextEntity } = this.state;
    // const { user, clearMentionsList, mentionsList, createComment, feedContextId, onCommentCreated } = this.props;
    // const textWithMentions = text ? mentionUtils.getTrimmedTextWithMentionEntities(text, mentionsList) : '';
    // let commenter = {
    //   id: user.id,
    //   name: user.name,
    //   media: user.media,
    //   themeColor: user.themeColor
    // };
    // if (publishAs) {
    //   commenter = pick(publishAs, ['id', 'name', 'media', 'themeColor', 'type']);
    // }
    // try {
    //   await createComment({
    //     actor: commenter,
    //     text: textWithMentions,
    //     mediaUrl,
    //     mentions: mentionsList,
    //     contextEntity: this.state.contextEntity,
    //     topContextEntity,
    //     feedContextId,
    //     publisherId: publishAs ? publishAs.id : null,
    //     publisherType: publishAs ? publishAs.type : null
    //   });
    //   onCommentCreated && onCommentCreated({ topContextEntityId: topContextEntity.id });
    //   this.setState(this.getInitialState());
    //   clearMentionsList();
    // } catch (err) {
    //   ErrorModal.showAlert();
    // }
  };

  handleCommentItemReply = ({comment, contextEntity, topContextEntity}) => {
    // const { addNewMention } = this.props;
    // const isReplyOnReply = contextEntity.type === entityTypes.COMMENT;
    // if (isReplyOnReply) {
    //   addNewMention({
    //     isReplyMention: true,
    //     entity: {
    //       objectID: comment.actor.id,
    //       entityType: comment.actor.type || entityTypes.USER,
    //       name: comment.actor.name
    //     }
    //   });
    // }
    // // Android doesn't work nicely with keyboard changes and layout animations
    // if (Platform.OS === 'ios') {
    //   LayoutAnimation.easeInEaseOut();
    // }
    // this.setState({
    //   contextEntity: { type: entityTypes.COMMENT, id: isReplyOnReply ? contextEntity.id : comment.id },
    //   topContextEntity: topContextEntity || contextEntity,
    //   replyTo: comment.actor.name
    // });
    // this.focusInput();
  };

  handleTopContextChange = ({topContextEntity}) => {
    this.setState({
      topContextEntity,
      contextEntity: topContextEntity,
      replyTo: null,
    });
    this.focusInput();
  };

  focusInput = () => {
    const {isInputShown} = this.state;

    if (isInputShown) {
      this.textInput.focus();
    } else {
      this.setState({isInputShown: true}, () => this.textInput.focus());
    }
  };

  blurInput = () => {
    this.textInput && this.textInput.blur();
  };

  resetInput = () => {
    this.textInput && this.textInput.reset();
  };

  shouldShowMentionSearch = ({results, isSearching}) =>
    !!results && (!!results.length || isSearching);

  isCurrentPageOnTop = () =>
    navigationService.getCurrentRouteName() === this.props.screenName; // TODO: Fix mentions to be local - then we won't need to check active page
}

CommentInput.defaultProps = {
  keyboardVerticalOffset: 0,
};

CommentInput.propTypes = {
  screenName: PropTypes.string,
  onMentionSearchClosed: PropTypes.func,
  children: PropTypes.node,
  buttonText: PropTypes.string,
  user: PropTypes.object,
  showKeyboard: PropTypes.bool,
  searchMentions: searchMentionsScheme,
  mentionsList: PropTypes.array,
  //   clearMentionsList: PropTypes.func,
  //   addNewMention: PropTypes.func,
  style: stylesScheme,
  placeHolder: PropTypes.string,
  onChange: PropTypes.func,
  contextEntity: PropTypes.shape({
    type: PropTypes.oneOf(Object.values(entityTypes)),
    id: PropTypes.string,
  }),
  topContextEntity: PropTypes.shape({
    type: PropTypes.oneOf(Object.values(entityTypes)),
    id: PropTypes.string,
  }),
  feedContextId: PropTypes.string,
  isInputPermanent: PropTypes.bool,
  keyboardVerticalOffset: PropTypes.number,
  //   createComment: PropTypes.func,
  onCommentCreated: PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  searchMentions: state.mentions.searchMentions,
  mentionsList: state.mentions.mentionsList,
});

const mapDispatchToProps = {
  //   apiCommand,
  //   clearMentionsList,
  //   addNewMention,
  //   createComment
};

CommentInput = connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(CommentInput);
export default CommentInput;
