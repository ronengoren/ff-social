import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import {flipFlopColors, commonStyles} from '../../vars';

// import { getYearsAgo } from '/infra/utils/dateTimeUtils';
// import { navigationService } from '/infra/navigation';

class UserEntityComponent extends Component {
  render() {
    return (
      <View>
        <Text>UserEntityComponent</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 15,
    marginBottom: 13,
    backgroundColor: flipFlopColors.white,
    borderRadius: 10,
  },
  onboardingWrapper: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: flipFlopColors.b70,
  },
  wrapperWithTopMargin: {
    marginTop: 10,
  },
  detailsWrapper: {
    flexDirection: 'row',
    margin: 15,
  },
  details: {
    marginTop: 5,
    marginLeft: 15,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
  },
  detailsIcon: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: 12,
    marginRight: 8,
  },
  entityAvatarWrapper: {
    width: 100,
    height: 120,
    borderRadius: 10,
    backgroundColor: flipFlopColors.white,
  },
  entityAvatar: {
    width: 100,
    height: 120,
    borderRadius: 10,
  },
  entityItemHeaderTexts: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContainerWithBadge: {
    alignItems: 'flex-start',
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 45,
    backgroundColor: flipFlopColors.paleGreyFour,
    borderRadius: 45,
  },
  obActionButton: {
    backgroundColor: flipFlopColors.white,
    borderColor: flipFlopColors.green,
    borderWidth: 1,
    width: 40,
    height: 40,
  },
  oBInvitedActionButton: {
    backgroundColor: flipFlopColors.green,
  },
  headerDetails: {
    flex: 1,
    textAlign: 'left',
    marginRight: 8,
  },
  username: {
    marginLeft: 15,
    marginBottom: 3,
  },
  badge: {
    height: 25,
    paddingLeft: 16,
    paddingRight: 10,
    marginTop: 8,
    marginBottom: 5,
  },
  dashedBorder: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  interactionBar: {
    marginBottom: 15,
  },
  interactionIconsContainer: {
    marginBottom: 8,
  },
});

export default UserEntityComponent;
