import React, {Component, Children, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Animated, StyleSheet, Text} from 'react-native';
import {flipFlopColors} from '../../../vars';

const styles = StyleSheet.create({
  hidden: {
    color: flipFlopColors.transparent,
  },
});

const DIRECTIONS = [-1, 0, 1];
const MAX_DELAY = 100;
const BLINKING_INTERVAL = 500;
export default class TypeWriter extends Component {
  static hideSubstring(component, fixed, start, end) {
    let index = 0;
    let endIndex;
    let startIndex;

    if (start > end) {
      endIndex = start;
      startIndex = end;
    } else {
      endIndex = end;
      startIndex = start || 0;
    }

    function cloneWithHiddenSubstrings(element) {
      const {children} = element.props;

      /* eslint-disable-next-line no-use-before-define */
      return React.cloneElement(element, {}, Children.map(children, hide));
    }

    function hide(child) {
      if (typeof child !== 'string') {
        return cloneWithHiddenSubstrings(child);
      }

      const strEnd = child.length + index;
      let newChild = null;

      if (strEnd > startIndex && (!endIndex || index < endIndex)) {
        const relStartIndex = startIndex - index;
        const relEndIndex = endIndex ? endIndex - index : strEnd;
        const leftString = child.substring(0, relStartIndex);
        const rightString = child.substring(relEndIndex, strEnd);

        if (!fixed) {
          newChild = [leftString, rightString];
        } else {
          const {TextComponent} = this.props;
          const styledString = (
            <TextComponent style={styles.hidden}>
              {child.substring(relStartIndex, relEndIndex)}
            </TextComponent>
          );
          newChild = [leftString, styledString, rightString];
        }
      }

      index = strEnd;

      return newChild || child;
    }

    return cloneWithHiddenSubstrings(component);
  }
  static getTokenAt(component, index) {
    if (index < 0) {
      return undefined;
    }

    let innerIndex = index;

    function findToken(element) {
      const children = Children.toArray(element.props.children);
      const {length} = children;
      let childIndex = 0;
      let child;
      let token;

      while (!token && childIndex < length) {
        child = children[childIndex];

        if (typeof child !== 'string') {
          token = findToken(child);
        } else if (innerIndex - child.length < 0) {
          token = child.charAt(innerIndex);
        } else {
          innerIndex -= child.length;
        }

        childIndex += 1;
      }

      return token;
    }

    return findToken(component);
  }

  static getDerivedStateFromProps(props, state) {
    const {typing} = props;
    const {direction, visibleChars} = state;

    if (typing !== direction) {
      return {direction: typing, visibleChars: visibleChars + typing};
    }

    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      direction: props.typing,
      visibleChars: 0,
      blinkingComponentVisibility: new Animated.Value(
        props.BlinkingCharComponent ? 1 : 0,
      ),
    };

    this.typeNextChar = this.typeNextChar.bind(this);
  }

  render() {
    const {
      TextComponent,
      children,
      delayMap,
      fixed,
      initialDelay,
      maxDelay,
      minDelay,
      onTyped,
      onTypingEnd,
      typing,
      BlinkingCharComponent,
      ...rest
    } = this.props;
    const {visibleChars, blinkingComponentVisibility} = this.state;
    const component = <TextComponent {...rest}>{children}</TextComponent>;

    return (
      <React.Fragment>
        {TypeWriter.hideSubstring(component, fixed, visibleChars)}
        {!!BlinkingCharComponent && (
          <Animated.View style={{opacity: blinkingComponentVisibility}}>
            {BlinkingCharComponent}
          </Animated.View>
        )}
      </React.Fragment>
    );
  }

  componentDidMount() {
    const {initialDelay, BlinkingCharComponent} = this.props;
    this.startTyping(initialDelay);
    if (BlinkingCharComponent) {
      this.blink();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {children, typing} = this.props;

    this.clearTimeout();

    if (typing === 0) return;

    if (children !== prevProps.children) {
      this.reset();
      return;
    }

    const {delayMap, onTyped, onTypingEnd} = this.props;
    const {visibleChars} = this.state;
    const currentToken = TypeWriter.getTokenAt(this, prevState.visibleChars);
    const nextToken = TypeWriter.getTokenAt(this, visibleChars);

    if (currentToken) {
      onTyped(currentToken, visibleChars);
    }

    if (nextToken) {
      let timeout = this.getRandomTimeout();

      if (delayMap) {
        delayMap.forEach(({at, delay}) => {
          if (at === visibleChars || currentToken.match(at)) {
            timeout += delay;
          }
        });
      }

      this.startTyping(timeout);
    }

    if (!nextToken) {
      onTypingEnd();
    }
  }

  componentWillUnmount() {
    this.clearTimeout();
  }

  getRandomTimeout() {
    const {exactDelay, maxDelay, minDelay} = this.props;

    return (
      exactDelay || Math.round(Math.random() * (maxDelay - minDelay) + minDelay)
    );
  }

  clearTimeout() {
    if (this.timeoutId != null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  reset() {
    const {initialDelay} = this.props;

    this.setState({visibleChars: 0}, () => this.startTyping(initialDelay));
  }

  blink = () => {
    const {blinkingComponentVisibility} = this.state;
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkingComponentVisibility, {
          toValue: 1,
          duration: BLINKING_INTERVAL / 2,
          useNativeDriver: true,
        }),
        Animated.timing(blinkingComponentVisibility, {
          toValue: 0,
          duration: BLINKING_INTERVAL / 2,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };
  startTyping(delay) {
    this.timeoutId = setTimeout(this.typeNextChar, delay);
  }

  typeNextChar() {
    this.setState(({direction, visibleChars}) => ({
      visibleChars: visibleChars + direction,
    }));
  }
}

TypeWriter.propTypes = {
  BlinkingCharComponent: PropTypes.element,
  TextComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  children: PropTypes.node.isRequired,
  delayMap: PropTypes.arrayOf(
    PropTypes.shape({
      at: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.instanceOf(RegExp),
      ]),
      delay: PropTypes.number,
    }),
  ),
  fixed: PropTypes.bool,
  initialDelay: PropTypes.number,
  exactDelay: PropTypes.number,
  maxDelay: PropTypes.number,
  minDelay: PropTypes.number,
  onTyped: PropTypes.func,
  onTypingEnd: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  typing: PropTypes.oneOf(DIRECTIONS),
};

TypeWriter.defaultProps = {
  TextComponent: Text,
  fixed: false,
  initialDelay: MAX_DELAY * 2,
  maxDelay: MAX_DELAY,
  minDelay: MAX_DELAY / 5,
  onTyped() {},
  onTypingEnd() {},
  style: {},
  typing: 0,
};

const TYPING_ANIMATION_DELAY = 800;
const TYPEWRITING_REPEATS = 1;
let TYPING_COUNT = 0;
export const useTyping = ({
  textDefinitions = [],
  repeats = TYPEWRITING_REPEATS,
}) => {
  useEffect(() => {
    TYPING_COUNT = 0;
  }, []);
  const [typingState, handleTypeEnd] = useState(1);
  const [currentTypingIndex, changeTypingIndex] = useState(0);
  const currentTypingText = textDefinitions[currentTypingIndex];
  const handleTypings = () => {
    if (TYPING_COUNT >= textDefinitions.length * repeats) {
      handleTypeEnd(0);
    } else if (typingState === -1) {
      handleTypeEnd(1);
      changeTypingIndex(
        currentTypingIndex >= textDefinitions.length - 1
          ? 0
          : currentTypingIndex + 1,
      );
      TYPING_COUNT += 1;
    } else if (typingState === 1) {
      setTimeout(() => {
        handleTypeEnd(-1);
      }, TYPING_ANIMATION_DELAY);
    }
  };
  return {typingState, currentTypingText, handleTypings};
};
