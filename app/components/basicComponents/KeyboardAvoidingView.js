import React from 'react';
import PropTypes from 'prop-types';
import {
  KeyboardAvoidingView as RnKeyboardAvoidingView,
  NativeModules,
  Platform,
  StatusBarIOS,
} from 'react-native'; // eslint-disable-line react-native/split-platform-components
import {uiConstants} from '../../vars';
import {hasNotch} from '../../infra/utils/deviceUtils';
import {stylesScheme} from '../../schemas';

class KeyboardAvoidingView extends React.PureComponent {
  state = {
    statusBarHeight: 0,
  };

  render() {
    const {
      style,
      behavior,
      keyboardVerticalOffset,
      children,
      contentContainerStyle,
    } = this.props;
    const {statusBarHeight} = this.state;
    let totalKeyboardVerticalOffset = statusBarHeight
      ? statusBarHeight - uiConstants.PHONE_BAR_HEIGHT_TRANSLUCENT
      : 0;
    totalKeyboardVerticalOffset += keyboardVerticalOffset;
    return (
      <RnKeyboardAvoidingView
        style={style}
        behavior={behavior}
        keyboardVerticalOffset={totalKeyboardVerticalOffset}
        contentContainerStyle={contentContainerStyle}>
        {children}
      </RnKeyboardAvoidingView>
    );
  }

  componentDidMount() {
    if (Platform.OS === 'ios' && !hasNotch()) {
      this.setStatusBarHeight();
      this.statusBarChangeListener = StatusBarIOS.addListener(
        'statusBarFrameWillChange',
        this.setStatusBarHeight,
      );
    }
  }

  componentWillUnmount() {
    if (this.statusBarChangeListener) {
      this.statusBarChangeListener.remove();
    }
  }

  setStatusBarHeight = () => {
    const {StatusBarManager} = NativeModules;
    StatusBarManager.getHeight((response) =>
      this.setState({statusBarHeight: response.height}),
    );
  };
}

KeyboardAvoidingView.defaultProps = {
  behavior: Platform.OS === 'ios' ? 'padding' : 'height',
  keyboardVerticalOffset: 0,
};

KeyboardAvoidingView.propTypes = {
  behavior: PropTypes.string,
  keyboardVerticalOffset: PropTypes.number,
  children: PropTypes.node,
  style: stylesScheme,
  contentContainerStyle: stylesScheme,
};

export default KeyboardAvoidingView;
