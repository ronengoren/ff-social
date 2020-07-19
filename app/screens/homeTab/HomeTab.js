import React from 'react';
import PropTypes from 'prop-types';
import {ScrollView, StyleSheet} from 'react-native';
import {View, Text, Avatar} from '../../components/basicComponents';

import {withNavigationFocus} from 'react-navigation';
import I18n from '../../infra/localization';
import {connect} from 'react-redux';
import {Header, Feed} from '../../components';
import CardButton from './CardButton';
import {flipFlopColors, commonStyles} from '../../vars';
import SavedItemsIndicator from './SavedItemsIndicator';
import HeaderIndicator from './HeaderIndicator';
import ChatHeaderIndicator from './ChatHeaderIndicator';

const styles = StyleSheet.create({
  header: {
    backgroundColor: flipFlopColors.white,
    paddingHorizontal: 15,
  },
  feedHeaderWrapper: {
    flex: 1,
  },
  headerUpperSection: {
    flex: 1,
    backgroundColor: flipFlopColors.white,
    borderBottomStartRadius: 15,
    borderBottomEndRadius: 15,
    marginBottom: 20,
    ...commonStyles.newSmallShadow,
  },
  indicatorsRow: {
    flexDirection: 'row',
    marginStart: 10,
    marginEnd: 5,
  },
  indicatorsRowRtl: {
    flexDirection: 'row-reverse',
  },
  headerIndicatorsDivider: {
    width: 25,
  },
  userName: {
    flex: 1,
    paddingHorizontal: 15,
    marginBottom: 4,
    marginTop: 15,
    textAlign: 'left',
  },
  userNameRTL: {
    textAlign: 'right',
  },
  greetingTime: {
    flex: 1,
    paddingHorizontal: 15,
  },
  greetingTimeRTL: {
    textAlign: 'right',
  },
  postButtonWrapper: {
    flex: 1,
    marginHorizontal: 15,
    marginBottom: 15,
    ...commonStyles.greenBtnShadow,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: flipFlopColors.b95,
  },
});
class HomeTab extends React.Component {
  render() {
    return (
      <View testID="homeTab" style={commonStyles.flex1}>
        {this.renderHeader()}
        <Feed />
      </View>
    );
  }
  renderHeader() {
    const {
      user,
      selectedCommunity,
      selectedContextCountryCode,
      isRtlDesign,
    } = this.props;
    const UserProfileIconComponent = (
      <Avatar
        // onPress={this.navigateToProfile}
        // onLongPress={this.navigateToConnectedAccounts}
        imageStyle={styles.userAvatar}
        // entityId={userId}
        // entityType="user"
        // themeColor={themeColor}
        // thumbnail={userThumbnail}
        // name={name}
        // testID="cityTabBtn"
      />
    );
    const HeaderIndicators = (
      <View
        style={[styles.indicatorsRow, isRtlDesign && styles.indicatorsRowRtl]}>
        <SavedItemsIndicator />

        <View style={styles.headerIndicatorsDivider} />
        <ChatHeaderIndicator />
      </View>
    );

    return (
      <Header
        style={styles.header}
        withHorizontalPadding={false}
        withShadow={true}
        withBorderBottom={false}
        rightComponent={
          isRtlDesign ? UserProfileIconComponent : HeaderIndicators
        }
        leftComponent={
          isRtlDesign ? HeaderIndicators : UserProfileIconComponent
        }
      />
    );
  }
}

export default HomeTab;
