import React from 'react';
import PropTypes from 'prop-types';
import {StatusBar, StyleSheet} from 'react-native';
import I18n from '../../infra/localization';
import {View, Text, IconButton} from '../basicComponents';
import {navigationService} from '../../infra/navigation';
import {flipFlopColors} from '../../vars';
import {uiConstants} from '../../vars/uiConstants';
import {debounce} from '../../infra/utils';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: uiConstants.NAVBAR_HEIGHT,
    paddingTop: uiConstants.PHONE_BAR_HEIGHT_TRANSLUCENT,
    paddingHorizontal: 15,
    backgroundColor: flipFlopColors.paleGreyTwo,
    borderBottomWidth: 1,
    borderBottomColor: flipFlopColors.b90,
  },
  rtlContainer: {
    direction: 'rtl',
  },
  cancelButton: {
    position: 'absolute',
    left: 15,
    bottom: 12,
    zIndex: 1,
  },
  textWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 55,
  },
  title: {
    textAlign: 'center',
    marginTop: 5,
  },
  subTitle: {
    flex: 1,
    marginTop: 5,
    textAlign: 'center',
  },
  doneBtn: {
    position: 'absolute',
    right: 15,
    bottom: 12,
    zIndex: 1,
  },
  backBtn: {
    position: 'absolute',
    left: 15,
    bottom: 12,
    zIndex: 1,
  },
  backBtnRTL: {
    bottom: 15,
    transform: [{rotate: '180deg'}],
  },
});

class SimpleHeader extends React.Component {
  render() {
    const {
      showLeftButton,
      hasBackBtn,
      cancelAction,
      cancelText,
      title,
      subTitle,
      forceRTL,
    } = this.props;
    const adjustedCancelText = cancelText || I18n.t('header.cancel_button');

    return (
      <View style={[styles.container, forceRTL && styles.rtlContainer]}>
        <StatusBar
          translucent
          barStyle="dark-content"
          backgroundColor="transparent"
        />
        {showLeftButton &&
          (hasBackBtn ? (
            this.renderBackButton({forceRTL})
          ) : (
            <Text
              size={16}
              lineHeight={30}
              color={flipFlopColors.green}
              onPress={cancelAction}
              style={styles.cancelButton}
              testID="headerCancelBtn">
              {adjustedCancelText}
            </Text>
          ))}
        <View style={styles.textWrapper}>
          <Text
            size={16}
            lineHeight={30}
            color={flipFlopColors.b30}
            style={styles.title}
            bold>
            {title}
          </Text>
          {!!subTitle && (
            <Text
              size={13}
              lineHeight={15}
              color={flipFlopColors.b60}
              style={styles.subTitle}>
              {subTitle}
            </Text>
          )}
        </View>
        {this.renderDoneButton()}
      </View>
    );
  }

  renderDoneButton = () => {
    const {doneAction, doneText, isDoneBtnActive = true, testID} = this.props;
    const adjustedDoneText = doneText || I18n.t('header.update_button');
    if (!doneAction) {
      return null;
    }

    return (
      <Text
        size={16}
        lineHeight={30}
        color={isDoneBtnActive ? flipFlopColors.green : flipFlopColors.b70}
        onPress={
          isDoneBtnActive
            ? debounce(doneAction, 400, {leading: true, trailing: false})
            : () => {}
        }
        bold
        testID={testID}
        style={styles.doneBtn}>
        {adjustedDoneText}
      </Text>
    );
  };

  renderBackButton = ({forceRTL}) => (
    <IconButton
      name="back-arrow"
      iconColor="b30"
      iconSize={26}
      onPress={navigationService.goBack}
      hitSlop={uiConstants.BTN_HITSLOP}
      style={[styles.backBtn, forceRTL && styles.backBtnRTL]}
    />
  );
}

SimpleHeader.defaultProps = {
  showLeftButton: true,
  hasBackBtn: false,
  isDoneBtnActive: true,
};

SimpleHeader.propTypes = {
  forceRTL: PropTypes.bool,
  showLeftButton: PropTypes.bool,
  hasBackBtn: PropTypes.bool,
  cancelAction: PropTypes.func,
  doneAction: PropTypes.func,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  cancelText: PropTypes.string,
  doneText: PropTypes.string,
  isDoneBtnActive: PropTypes.bool,
  testID: PropTypes.string,
};

export default SimpleHeader;
