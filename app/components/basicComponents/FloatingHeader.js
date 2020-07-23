import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, LayoutAnimation} from 'react-native';
import {View} from '../basicComponents';
import {uiConstants, flipFlopColors} from '../../vars';
import {stylesScheme} from '../../schemas';

const styles = StyleSheet.create({
  floatingHeaderWrapper: {
    backgroundColor: flipFlopColors.white,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomWidth: 1,
    borderBottomColor: flipFlopColors.b90,
  },
  floatingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

class FloatingHeader extends Component {
  static getAdjustedBreakpoint(contentOffsetBreakpoint = 75) {
    return contentOffsetBreakpoint + uiConstants.NAVBAR_TOP_MARGIN;
  }

  // eslint-disable-next-line react/sort-comp
  floatingHeaderAnimation = {
    duration: 400,
    create: {
      type: LayoutAnimation.Types.linear,
      property: LayoutAnimation.Properties.opacity,
    },
    update: {
      type: LayoutAnimation.Types.easeIn,
    },
  };

  render() {
    if (this.props.showFloatingHeader) {
      return this.renderFloatingHeader();
    }

    return null;
  }

  renderFloatingHeader() {
    const {style, children, height, contentStyle} = this.props;
    return (
      <View style={[styles.floatingHeaderWrapper, style]}>
        <View style={[styles.floatingHeader, contentStyle, {height}]}>
          {children}
        </View>
      </View>
    );
  }

  componentDidUpdate(prevProps) {
    const {showFloatingHeader} = this.props;

    if (prevProps.showFloatingHeader !== showFloatingHeader) {
      LayoutAnimation.configureNext(this.floatingHeaderAnimation);
    }
  }
}

FloatingHeader.defaultProps = {
  height: 45 + uiConstants.PHONE_BAR_HEIGHT_TRANSLUCENT,
};

FloatingHeader.propTypes = {
  showFloatingHeader: PropTypes.bool,
  children: PropTypes.node,
  style: stylesScheme,
  height: PropTypes.number,
  contentStyle: stylesScheme,
};

export default FloatingHeader;
