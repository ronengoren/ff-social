import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Animated, StyleSheet, Platform} from 'react-native';
import {View, TextArea} from '../basicComponents';
import {flipFlopColors} from '../../vars';
import {stylesScheme} from '../../schemas';

const LABEL_TOP_NO_VALUE = Platform.select({ios: 30, android: 25});
const LABEL_TOP_WITH_VALUE = Platform.select({ios: 10, android: 5});
const LABEL_FONT_SIZE_NO_VALUE = 16;
const LABEL_FONT_SIZE_WITH_VALUE = 12;

const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
    flexGrow: 1,
  },
  label: {
    position: 'absolute',
    color: flipFlopColors.b60,
    backgroundColor: flipFlopColors.transparent,
  },
  labelWithError: {
    paddingBottom: 0,
    color: flipFlopColors.red,
  },
  textArea: {
    flex: 1,
    height: 100,
    padding: 0,
    backgroundColor: flipFlopColors.transparent,
  },
});

class FormTextArea extends Component {
  state = {
    labelTop: new Animated.Value(
      this.props.value ? LABEL_TOP_WITH_VALUE : LABEL_TOP_NO_VALUE,
    ),
    labelFontSize: new Animated.Value(
      this.props.value ? LABEL_FONT_SIZE_WITH_VALUE : LABEL_FONT_SIZE_NO_VALUE,
    ),
  };

  render() {
    const {labelTop, labelFontSize} = this.state;
    const {errorText, label, value, style, textAreaStyle, testID} = this.props;
    const labelText = errorText || label;

    return (
      <View style={[styles.container, style]}>
        <TextArea
          value={value}
          style={[styles.textArea, textAreaStyle]}
          // onChange={this.handleChange}
          testID={testID}
          ref={(node) => {
            this.input = node;
          }}
        />
        <Animated.Text
          style={[
            styles.label,
            errorText && styles.labelWithError,
            {top: labelTop, fontSize: labelFontSize},
          ]}
          medium={!!errorText || !!value}
          onPress={this.focus}>
          {labelText}
        </Animated.Text>
      </View>
    );
  }

  handleChange = (newValue) => {
    // const {value, onChange} = this.props;
    // if (!value.length && newValue.length) {
    //   Animated.parallel([
    //     this.animateLabel('labelTop', LABEL_TOP_WITH_VALUE),
    //     this.animateLabel('labelFontSize', LABEL_FONT_SIZE_WITH_VALUE),
    //   ]);
    // } else if (value.length && !newValue.length) {
    //   Animated.parallel([
    //     this.animateLabel('labelTop', LABEL_TOP_NO_VALUE),
    //     this.animateLabel('labelFontSize', LABEL_FONT_SIZE_NO_VALUE),
    //   ]);
    // }
    // onChange(newValue);
  };

  animateLabel = (key, to) => {
    Animated.timing(this.state[key], {
      toValue: to,
      duration: 300,
    }).start();
  };

  focus = () => this.input.focus();
}

FormTextArea.propTypes = {
  value: PropTypes.string,
  // onChange: PropTypes.func,
  errorText: PropTypes.string,
  label: PropTypes.string,
  style: stylesScheme,
  textAreaStyle: stylesScheme,
  testID: PropTypes.string,
};

export default FormTextArea;
