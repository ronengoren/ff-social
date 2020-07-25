import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StatusBar, StyleSheet, TouchableOpacity} from 'react-native';
import I18n from '../../../infra/localization';
import {View, Text, IconButton} from '../../../components/basicComponents';
import {AwesomeIcon} from '../../../assets/icons';
import {flipFlopColors, uiConstants, commonStyles} from '../../../vars';
import {screenNames} from '../../../vars/enums';
import {navigationService} from '../../../infra/navigation';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: uiConstants.NAVBAR_HEIGHT,
    paddingTop: uiConstants.PHONE_BAR_HEIGHT_TRANSLUCENT,
    backgroundColor: flipFlopColors.white,
    borderBottomWidth: 1,
    borderBottomColor: flipFlopColors.b90,
  },
  fakeSearchWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 45,
    width: '100%',
    marginLeft: 5,
    marginRight: 55,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: flipFlopColors.paleGreyTwo,
  },
  fakeSearch: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 11,
  },
  fakeSearchIcon: {
    marginRight: 7,
  },
  composeButton: {
    position: 'absolute',
    right: 10,
    bottom: 15,
  },
  backButton: {
    marginLeft: 10,
  },
});

class ConversationsListHeader extends Component {
  render() {
    const {disableComposeBtn} = this.props;

    return (
      <View style={[styles.wrapper, commonStyles.tinyShadow]}>
        <StatusBar
          translucent
          barStyle="dark-content"
          backgroundColor="transparent"
        />
        <IconButton
          name="back-arrow"
          style={styles.backButton}
          iconColor="b30"
          iconSize={26}
          onPress={() => navigationService.goBack()}
          hitSlop={uiConstants.BACK_BTN_HITSLOP}
        />
        <TouchableOpacity
          onPress={this.handleFakeSearchPress}
          activeOpacity={0.5}
          style={styles.fakeSearchWrapper}>
          <View style={styles.fakeSearch}>
            <AwesomeIcon
              name="search"
              size={17}
              color={flipFlopColors.b60}
              style={styles.fakeSearchIcon}
              weight="light"
            />
            <Text size={16} lineHeight={19} color={flipFlopColors.b60}>
              {I18n.t('communication_center.conversations.input_placeholder')}
            </Text>
          </View>
        </TouchableOpacity>
        <IconButton
          disabled={disableComposeBtn}
          name="compose"
          style={styles.composeButton}
          iconColor="green"
          iconSize={31}
          onPress={this.navigateToFriendSelector}
          hitSlop={uiConstants.BTN_HITSLOP}
        />
      </View>
    );
  }

  navigateToFriendSelector = () =>
    navigationService.navigate(screenNames.ChatUserSelector, {
      selectFriends: true,
    });

  handleFakeSearchPress = () =>
    navigationService.navigate(screenNames.ChatUserSelector);
}

ConversationsListHeader.propTypes = {
  disableComposeBtn: PropTypes.bool,
};

export default ConversationsListHeader;
