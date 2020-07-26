import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, StatusBar, BackHandler} from 'react-native';
import I18n from '../../../infra/localization';
import {connect} from 'react-redux';
// import { apiCommand } from '/redux/apiCommands/actions';
// import { finishedOnBoarding } from '/redux/auth/actions';
// import { apiQuery } from '/redux/apiQuery/actions';
// import { register } from '/infra/pushNotifications';
import {Screen} from '../../../components';
import {
  UserEntityComponent,
  UserEntityLoadingState,
} from '../../../components/entity';
import {View, Text, ScrollView} from '../../../components/basicComponents';
import {SubmitButton} from '../../../components/onboarding';
// import { analytics, Logger } from '/infra/reporting';
import {navigationService} from '../../../infra/navigation';
import {misc as miscLocalStorage} from '../../../infra/localStorage';
import {flipFlopColors, uiConstants} from '/vars';
import {screenNames} from '../../../vars/enums';
import {get} from '../../../infra/utils';
import {isRTL} from '../../../infra/utils/stringUtils';
import {getDisplayedUsersCount} from '../../../infra/utils/onboardingUtils';
import {isAndroid} from '../../../infra/utils/deviceUtils';
import {Wrapper, OnBoardingProgressBar} from '../components';

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: uiConstants.PHONE_BAR_HEIGHT_TRANSLUCENT + 10,
  },
  header: {
    width: '100%',
    height: 30,
    marginBottom: 14,
  },
  rtlText: {
    textAlign: 'right',
  },
  headerText: {
    fontSize: 32,
    lineHeight: 32,
    paddingHorizontal: 15,
    color: flipFlopColors.b30,
  },
  listTitle: {
    fontSize: 18,
    lineHeight: 22,
    color: flipFlopColors.b30,
    marginBottom: 24,
    paddingHorizontal: 15,
  },
  scroll: {
    flex: 1,
    backgroundColor: flipFlopColors.white,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  moreUsersLink: {
    marginHorizontal: 15,
  },
  bottomWrapper: {
    marginHorizontal: 15,
  },
});

class OnBoardingAddFriends extends React.Component {
  state = {
    selected: new Map(),
    isSubmitting: false,
  };

  render() {
    const {isSubmitting} = this.state;
    const text = I18n.t('onboarding.add_friends.page_header');
    const isRtl = isRTL(text);

    return (
      <Wrapper style={styles.wrapper}>
        <StatusBar translucent barStyle="dark-content" />
        <OnBoardingProgressBar step={3} />
        <View style={styles.header}>
          <Text style={[styles.headerText, isRtl && styles.rtlText]} bold>
            {text}
          </Text>
        </View>
        <Text style={[styles.listTitle, isRtl && styles.rtlText]}>
          {I18n.t('onboarding.add_friends.title')}
        </Text>
        {this.renderSuggestedFriends()}
        <View style={styles.bottomWrapper}>
          <SubmitButton
            withTopGradient
            onPress={this.onNextButtonPress}
            testID="addFriendsSubmitButton"
            label={I18n.t('onboarding.add_friends.submit_button')}
            busy={isSubmitting}
          />
        </View>
      </Wrapper>
    );
  }

  componentDidMount() {
    this.fetchSuggestedFriends();
    miscLocalStorage.update({
      onboardingPersistentScreen: screenNames.OnBoardingAddFriends,
    });
    if (isAndroid) {
      BackHandler.addEventListener(
        'hardwareBackPress',
        this.androidBackButtonListener,
      );
    }
  }

  componentWillUnmount() {
    if (isAndroid) {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.androidBackButtonListener,
      );
    }
  }

  androidBackButtonListener = () => this.props.navigation.isFocused();

  renderSuggestedFriends() {
    const {suggestedFriends, user} = this.props;
    if (!suggestedFriends) {
      return <UserEntityLoadingState />;
    }

    const totalUsers = get(user, 'nationalityGroup.totals.users', 0);
    const displayedUsersCount = getDisplayedUsersCount(totalUsers);

    return (
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}>
        {suggestedFriends.map((data) => (
          <UserEntityComponent
            key={data.id}
            toggleInvite={this.toggleUserSelection}
            disableNavigation
            isOnboarding
            data={data}
          />
        ))}
        <Text
          style={styles.moreUsersLink}
          bold
          color={flipFlopColors.green}
          size={15}
          lineHeight={22}
          onPress={this.onNextButtonPress}>
          {I18n.t('onboarding.add_friends.more_users_link', {
            count: displayedUsersCount,
          })}
        </Text>
      </ScrollView>
    );
  }

  fetchSuggestedFriends() {
    // const { apiQuery } = this.props;
    // apiQuery({ reducerStatePath: 'friendships.recommended', query: { domain: 'friendships', key: 'recommended', params: { page: 1, perPage: 24 } } });
  }

  onNextButtonPress = async () => {
    // const { selected } = this.state;
    // const { apiCommand, user, finishedOnBoarding } = this.props;
    // try {
    //   this.setState({ isSubmitting: true });
    //   analytics.actionEvents.onboardingAddFriends({ addedFriendsCount: this.state.selected.size }).dispatch();
    //   await miscLocalStorage.update({ onboardingPersistentScreen: null, isNewUser: false, nationalityChoices: null, language: null });
    //   if (selected.size > 0) {
    //     apiCommand('friendships.invite', { toIds: Array.from(selected.keys()) }).then(() => {
    //       this.setState({ selected: new Map() });
    //       this.fetchSuggestedFriends();
    //     });
    //   }
    //   if (isAndroid) {
    //     // android requests for permission on app install so this code is important cause it does actual registration to pushwoosh
    //     analytics.actionEvents.onboardingEnableNotificationsPopup({ userId: user.id, enabled: true }).dispatch();
    //     register(user.id);
    //     finishedOnBoarding();
    //   } else {
    //     navigationService.navigate(screenNames.AllowNotifications);
    //   }
    // } catch (err) {
    //   Logger.error({ message: 'failed to submit add friends form', err, selected });
    // }
    // this.setState({ isSubmitting: false });
  };

  isSelected = ({userId}) => {
    const {selected} = this.state;
    return !!selected.get(userId);
  };

  toggleUserSelection = ({user}) => {
    const {selected} = this.state;
    const newSelectedMap = new Map(selected);
    if (this.isSelected({userId: user.id})) {
      newSelectedMap.delete(user.id);
    } else {
      newSelectedMap.set(user.id, true);
    }
    this.setState({selected: newSelectedMap});
  };
}

OnBoardingAddFriends.propTypes = {
  user: PropTypes.object,
  //   apiCommand: PropTypes.func,
  //   finishedOnBoarding: PropTypes.func,
  //   apiQuery: PropTypes.func,
  suggestedFriends: PropTypes.array,
  navigation: PropTypes.object,
};

const mapStateToProps = (state) => ({
  //   user: state.auth.user,
  suggestedFriends: get(state, 'friendships.recommended.data'),
});

const mapDispatchToProps = {
  //   apiCommand,
  //   apiQuery,
  //   finishedOnBoarding
};

OnBoardingAddFriends = connect(
  mapStateToProps,
  mapDispatchToProps,
)(OnBoardingAddFriends);
export default Screen({modalError: true})(OnBoardingAddFriends);
