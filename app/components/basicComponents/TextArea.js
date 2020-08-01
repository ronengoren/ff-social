import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Text, TextInput, StyleSheet, Platform} from 'react-native';
// import { searchMentions as querySearchMentions, clearSearchMentions, clearMentionsList, updateMentionsList } from '/redux/mentions/actions';
import {mentionUtils} from '../../components';
import {isRTL} from '../../infra/utils/stringUtils';
import {flipFlopColors, flipFlopFontsWeights} from '../../vars';
import {get} from '../../infra/utils';
import {stylesScheme} from '../../schemas';

const isAndroid = Platform.OS === 'android';
const styles = StyleSheet.create({
  input: {
    padding: 10,
    fontSize: 16,
    lineHeight: 16,
    fontWeight: flipFlopFontsWeights.regular,
    color: flipFlopColors.realBlack,
  },
  boldStyle: {
    fontWeight: flipFlopFontsWeights.bold,
  },
  rtlStyle: {
    textAlign: 'right',
  },
});

class TextArea extends React.Component {
  constructor(props) {
    super(props);
    const {
      defaultHeight,
      autoCorrect,
      withMentions,
      clearMentions,
      clearMentionsList,
    } = props;
    this.state = {
      height: defaultHeight,
      cursorPosition: -1,
      newText: null,
      enableAutoCorrect: autoCorrect,
    };

    // if (withMentions && clearMentions) {
    //   clearMentionsList();
    // }
    this.selectionBeforeChange = null;
    this.selectionAfterChange = null;
  }

  render() {
    const {enableAutoCorrect, height} = this.state;
    const {
      value,
      style,
      onContentSizeChange,
      onChange,
      androidAutoExpand,
      defaultHeight,
      maxHeight,
      withMentions,
      mentionsList,
      autoCorrect,
      bold,
      backgroundColor,
      selectionColor,
      placeholder,
      ...props
    } = this.props;

    const isRtl = isRTL(value || placeholder);

    // RN has a bug in Android where having the value as a child slows down typing severly and makes it
    // impossible to type after a few lines
    return (
      <TextInput
        style={[
          styles.input,
          style,
          height && {height},
          bold && styles.boldStyle,
          isRtl && styles.rtlStyle,
          {backgroundColor},
        ]}
        multiline
        onChangeText={this.handleTextChange}
        onSelectionChange={this.handleSelectionChange}
        ref={(node) => {
          this.input = node;
        }}
        textAlignVertical="top"
        placeholder={placeholder}
        placeholderTextColor={flipFlopColors.b60}
        selectionColor={selectionColor}
        underlineColorAndroid={flipFlopColors.transparent}
        onContentSizeChange={this.handleContentSizeChange}
        autoCorrect={!autoCorrect ? false : enableAutoCorrect}
        value={isAndroid ? value : null}
        {...props}>
        {!isAndroid ? this.renderText() : null}
      </TextInput>
    );
  }

  componentDidUpdate(prevProps) {
    // const { mentionsList, onChange, updateMentionsList, withMentions } = this.props;
    // const isNewMentionAdded = mentionsList.length > prevProps.mentionsList.length;
    // // Making sure we have a value here - in case we have multiple TextArea in the dom
    // if (withMentions && isNewMentionAdded) {
    //   const { newMentionsList, changedText } = mentionUtils.getUpdatedMentionListAfterMentionAdd({
    //     mentions: mentionsList,
    //     text: this.props.value,
    //     cursorPosition: this.state.cursorPosition,
    //     isWithBrackets: isAndroid
    //   });
    //   onChange(changedText);
    //   updateMentionsList(newMentionsList);
    // }
  }

  renderText = () => {
    const {value, mentionsList, bold} = this.props;

    let compiledValue = value || '';
    const components = [];
    let indexDelta = 0;
    let componentKey = 0;

    if (mentionsList && mentionsList.length) {
      mentionsList.forEach((mention) => {
        const regularText = compiledValue.slice(
          0,
          mention.startIndex - indexDelta,
        );
        const mentionText = compiledValue.slice(
          mention.startIndex - indexDelta,
          mention.endIndex - indexDelta,
        );

        components.push(
          <Text key={componentKey} style={bold && styles.boldStyle}>
            {regularText}
          </Text>,
        );
        components.push(
          <Text key={componentKey + 1} style={styles.boldStyle}>
            {mentionText}
          </Text>,
        );

        compiledValue = compiledValue.slice(mention.endIndex - indexDelta);
        indexDelta = mention.endIndex;

        componentKey += 2;
      });
    }

    components.push(
      <Text key={componentKey} style={bold && styles.boldStyle}>
        {compiledValue}
      </Text>,
    );
    return components;
  };

  handleSelectionChange = (event) => {
    const {selection} = event.nativeEvent;
    const {enableAutoCorrect, newText} = this.state;
    const {withMentions, autoCorrect, mentionsList} = this.props;

    this.selectionBeforeChange = this.selectionAfterChange;
    this.selectionAfterChange = selection;

    if (Platform.OS !== 'ios' && newText) {
      this.updateTextAndMentionsChange(newText);
      this.setState({newText: null});
    }

    if (!newText) {
      if (
        withMentions &&
        autoCorrect &&
        mentionUtils.isCursorOnMention(this.selectionAfterChange, mentionsList)
      ) {
        enableAutoCorrect && this.setState({enableAutoCorrect: false});
      } else {
        !enableAutoCorrect && this.setState({enableAutoCorrect: true});
      }
    }
  };

  handleTextChange = (text) => {
    this.oldText = this.props.value;
    this.props.onChange(text);
    if (Platform.OS === 'ios') {
      this.updateTextAndMentionsChange(text);
    } else {
      this.setState({newText: text});
    }
  };

  // This is a workaround for the difference in react-native's event handlers order
  // between ios and Android. In ios 'handleSelectionChange' happens first, and in Android
  // 'handleTextChange' happens first.
  updateTextAndMentionsChange = (text) => {
    // let updatedText = text;
    // const { enableAutoCorrect } = this.state;
    // const { withMentions, onChange } = this.props;
    // if (withMentions) {
    //   const { searchMentions, communityId, nationalityGroupId, querySearchMentions, clearSearchMentions, updateMentionsList, mentionsList } = this.props;
    //   if (mentionsList.length) {
    //     const { newMentions, changedText } = mentionUtils.getUpdatedMentionsListAfterTextChange({
    //       oldText: this.oldText,
    //       newText: text,
    //       selectionBeforeChange: this.selectionBeforeChange,
    //       selectionAfterChange: this.selectionAfterChange,
    //       mentions: mentionsList
    //     });
    //     updatedText = changedText;
    //     updateMentionsList(newMentions);
    //   }
    //   const cursorPosition = this.selectionAfterChange ? this.selectionAfterChange.end : -1;
    //   let partialText = text;
    //   if (cursorPosition > 0) {
    //     partialText = text.substring(0, cursorPosition);
    //   }
    //   const mentionText = partialText.match(/@([^@]+)$/);
    //   if (mentionText) {
    //     const isUserRemovingText = !searchMentions.query || mentionText[1].length < searchMentions.query.length;
    //     if (searchMentions.resultsHits !== 0 || isUserRemovingText) {
    //       querySearchMentions(mentionText[1], 0, communityId, nationalityGroupId);
    //       if (withMentions && enableAutoCorrect) {
    //         this.setState({ enableAutoCorrect: false });
    //       }
    //     }
    //   } else if (searchMentions.query) {
    //     // Clear the mentions search only if we had something before
    //     clearSearchMentions();
    //   }
    //   this.setState({ cursorPosition });
    // }
    // onChange(updatedText);
  };

  handleContentSizeChange = (event) => {
    const {maxHeight, defaultHeight, onContentSizeChange, value} = this.props;
    const {height} = event.nativeEvent.contentSize;

    if (!this.input || !this.input.isFocused()) {
      return;
    }

    const textLength = value ? value.length : 0;
    const selection = this.selectionAfterChange;
    const isChangeOnLastLine = selection && selection.end >= textLength;
    onContentSizeChange && onContentSizeChange({height, isChangeOnLastLine});

    if (!defaultHeight) {
      return;
    }

    if (this.state.height !== height) {
      const normalizedHeight = Math.max(defaultHeight, height);
      this.setState({
        height: Math.min(maxHeight, normalizedHeight),
      });
    }
  };

  isOnLastLine = () => {
    const {value} = this.props;

    const textLength = value ? value.length : 0;
    const selection = this.selectionAfterChange;
    return selection && selection.end >= textLength;
  };

  focus() {
    return this.input.focus();
  }

  blur() {
    return this.input.blur();
  }
}

TextArea.defaultProps = {
  autoCorrect: true,
  selectionColor: flipFlopColors.green,
  backgroundColor: flipFlopColors.white,
  clearMentions: true,
};

TextArea.propTypes = {
  value: PropTypes.string,
  style: stylesScheme,
  onChange: PropTypes.func,
  onContentSizeChange: PropTypes.func,
  androidAutoExpand: PropTypes.bool,
  defaultHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  maxHeight: PropTypes.number,
  searchMentions: PropTypes.object,
  mentionsList: PropTypes.array,
  //   clearSearchMentions: PropTypes.func,
  //   clearMentionsList: PropTypes.func,
  //   querySearchMentions: PropTypes.func,
  //   updateMentionsList: PropTypes.func,
  communityId: PropTypes.string,
  withMentions: PropTypes.bool,
  autoCorrect: PropTypes.bool,
  bold: PropTypes.bool,
  selectionColor: PropTypes.string,
  clearMentions: PropTypes.bool,
  placeholder: PropTypes.string,
  backgroundColor: PropTypes.string,
  nationalityGroupId: PropTypes.string,
};

const mapDispatchToProps = {
  //   clearSearchMentions,
  //   clearMentionsList,
  //   querySearchMentions,
  //   updateMentionsList
};

const mapStateToProps = (state) => ({
  // searchMentions: state.mentions.searchMentions,
  // mentionsList: state.mentions.mentionsList,
  // communityId: get(state, 'auth.user.community.id'),
  // nationalityGroupId: get(state, 'auth.user.nationalityGroup.id'),
});

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(TextArea);
