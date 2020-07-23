import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity, LayoutAnimation} from 'react-native';
import {View, Text} from '../basicComponents';
import {flipFlopColors} from '../../vars';
import {dropTestIdFromChildren} from '../../infra/utils/';

const styles = StyleSheet.create({
  expandableWrapper: {
    overflow: 'hidden',
  },
  expandableInnerWrapper: {
    overflow: 'hidden',
  },
  expandableDemiWrapper: {
    position: 'absolute',
    top: 200000,
    left: 0,
    right: 0,
    zIndex: -10,
    flex: 1,
  },
  button: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: flipFlopColors.white,
    color: flipFlopColors.placeholderGrey,
    zIndex: 10,
  },
  buttonOnLeft: {
    left: 0,
  },
  buttonOnRight: {
    right: 0,
  },
  rtl: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});

class ExpandableText extends Component {
  state = {
    isOverflowed: false,
    expanded: !!this.props.showFullText,
    showMoreBtn: false,
    numberOfLines: this.props.showFullText ? 0 : this.props.numberOfLines,
  };

  render() {
    const {showMoreBtn, isCalculating, numberOfLines} = this.state;
    const {
      showFullText,
      children,
      style,
      textStyle,
      ctaTextStyle,
      ctaText,
      isRightToLeft,
      onPress,
      testID,
      showExpand,
      selectable,
    } = this.props;

    if (showFullText) {
      return (
        <View style={style} testID={testID} selectable={selectable}>
          {children}
        </View>
      );
    }

    if (!showExpand) {
      return (
        <Text
          numberOfLines={numberOfLines}
          testID={testID}
          selectable={selectable}>
          {children}
        </Text>
      );
    }

    return (
      <TouchableOpacity
        onLongPress={() => {}}
        onPress={onPress || this.handlePress}
        activeOpacity={1}>
        {isCalculating && children && (
          <View style={styles.expandableDemiWrapper}>
            <View
              style={[styles.expandableInnerWrapper, style]}
              onLayout={this.onLayout}>
              {dropTestIdFromChildren(children)}
            </View>
          </View>
        )}
        <View style={style}>
          <View>
            <Text
              numberOfLines={numberOfLines}
              style={[
                styles.expandableWrapper,
                textStyle,
                isRightToLeft && styles.rtl,
              ]}
              testID={testID}
              selectable={selectable}>
              {children}
            </Text>
            {showMoreBtn &&
              this.getSeeMoreButton(
                ctaText,
                textStyle,
                ctaTextStyle,
                isRightToLeft,
              )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  static getDerivedStateFromProps(props, state) {
    if (state.children !== props.children) {
      return {
        isCalculating: true,
        children: props.children,
      };
    }
    return null;
  }

  onLayout = ({nativeEvent}) => {
    const {lineHeight, numberOfLines} = this.props;
    const {expanded} = this.state;
    const realHeight = nativeEvent.layout.height;
    const maxHeight = lineHeight * numberOfLines;
    const isOverflowed = realHeight > maxHeight;

    this.setState({
      showMoreBtn: !expanded && isOverflowed,
      isOverflowed,
      isCalculating: false,
    });
  };

  handlePress = () => {
    const {isOverflowed, expanded} = this.state;
    const {numberOfLines} = this.props;
    if (isOverflowed) {
      const expandComponent = !expanded;
      LayoutAnimation.easeInEaseOut();
      this.setState({
        showMoreBtn: !expandComponent,
        expanded: expandComponent,
        numberOfLines: expandComponent ? 0 : numberOfLines,
      });
    }
  };

  getSeeMoreButton = (ctaText, textStyle, ctaTextStyle, isRightToLeft) => {
    if (isRightToLeft) {
      return (
        <Text style={[styles.button, styles.buttonOnLeft, ctaTextStyle]}>
          {`${ctaText} `}
          <Text style={textStyle}>...</Text>
        </Text>
      );
    }
    return (
      <Text style={[styles.button, styles.buttonOnRight, ctaTextStyle]}>
        <Text style={textStyle}>...</Text>
        {` ${ctaText}`}
      </Text>
    );
  };
}
ExpandableText.defaultProps = {
  showExpand: true,
};

ExpandableText.propTypes = {
  selectable: PropTypes.bool,
  showExpand: PropTypes.bool,
  showFullText: PropTypes.bool,
  children: PropTypes.node,
  lineHeight: PropTypes.number,
  numberOfLines: PropTypes.number,
  style: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
  textStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
  ctaText: PropTypes.string,
  ctaTextStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
  isRightToLeft: PropTypes.bool,
  onPress: PropTypes.func,
  testID: PropTypes.string,
};

export default ExpandableText;
