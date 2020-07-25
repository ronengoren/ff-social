import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {View, Text} from '../basicComponents';
import {flipFlopColors} from '../../vars';
import {stylesScheme} from '../../schemas/common';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    flex: 1,
    flexDirection: 'row',
    height: 1,
  },
  text: {
    marginHorizontal: 10,
  },
});

class TextInLine extends Component {
  render() {
    const {style, children, textColor, textSize, lineColor} = this.props;

    return (
      <View style={[styles.container, style]}>
        <View style={[styles.line, {backgroundColor: lineColor}]} />
        <Text
          style={styles.text}
          size={textSize}
          lineHeight={21}
          color={textColor}>
          {children}
        </Text>
        <View style={[styles.line, {backgroundColor: lineColor}]} />
      </View>
    );
  }
}

Text.defaultProps = {
  textColor: flipFlopColors.b70,
  textSize: 14,
  lineColor: flipFlopColors.veryLightPink,
};

TextInLine.propTypes = {
  children: PropTypes.string,
  style: stylesScheme,
  textColor: PropTypes.string,
  textSize: PropTypes.number,
  lineColor: PropTypes.string,
};

export default TextInLine;
