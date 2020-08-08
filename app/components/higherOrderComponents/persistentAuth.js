import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import hoistStatics from 'hoist-non-react-statics';
import {Spinner} from '../basicComponents';
import {
  refreshUserData,
  setUser,
  getNationalities,
  getNationalityGroups,
} from '../../redux/auth/actions';
// import {updateAnnotations} from '/redux/general/actions';
import {
  user as userLocalStorage,
  misc as miscLocalStorage,
} from '../../infra/localStorage';
// import { Logger } from '/infra/reporting';
import {navigationService} from '../../infra/navigation';
import {get} from '../../infra/utils';
import {screenGroupNames, screenNames} from '../../vars/enums';

const persistentAuth = (WrappedComponent) => {
  class persistentAuth extends React.Component {
    state = {
      loaded: false,
    };

    render() {
      return this.state.loaded ? (
        <WrappedComponent {...this.props} />
      ) : (
        <Spinner center />
      );
    }

    componentDidMount() {
      this.updateAuthState();
    }

    async updateAuthState() {
      const {setUser, refreshUserData} = this.props;
      try {
        const [user, misc] = await Promise.all([
          userLocalStorage.get(),
          miscLocalStorage.get(),
        ]);
        if (
          (user && get(misc, 'isNewUser')) ||
          (!user && get(misc, 'nationalityChoices'))
        ) {
          user && setUser(user);
          this.persistOnboardingStep({misc, user});
        } else if (user) {
          //   updateAnnotations(misc.annotations);
          setUser(user);
          await refreshUserData();
          // resetting navigation to avoid navigating back to Signin or Signup
          navigationService.navigate(
            screenGroupNames.SIGNED_IN,
            {},
            {noPush: true},
          );
          navigationService.conditionallyNavigateToDeferred();
        } else {
          this.setState({loaded: true});
        }
      } catch (err) {
        console.error(`userLocalStorage failed: ${err}`);
        this.setState({loaded: true});
      }
    }

    async persistOnboardingStep({misc, user}) {
      const {refreshUserData} = this.props;
      const {onboardingPersistentScreen, nationalityChoices} = misc || {};
      const hasOriginAndDestination = !!(
        get(user, 'journey.originCountry.countryCode') &&
        get(user, 'journey.destinationCountry.countryCode')
      );
      if (onboardingPersistentScreen && hasOriginAndDestination) {
        if (
          [
            screenNames.OnBoardingAddFriends,
            screenNames.OnBoardingDiscover,
          ].includes(onboardingPersistentScreen)
        ) {
          await Promise.all([refreshUserData()]);
        }
        navigationService.navigate(
          screenGroupNames.SIGN_UP_WIZARD,
          {},
          {initialScreen: onboardingPersistentScreen},
        );
      } else {
        navigationService.navigate(
          screenGroupNames.SIGN_UP_WIZARD,
          nationalityChoices,
          {initialScreen: screenNames.SetUserNationality},
        );
      }
    }
  }

  persistentAuth.propTypes = {
    setUser: PropTypes.func,
    refreshUserData: PropTypes.func,
    getNationalities: PropTypes.func,
    getNationalityGroups: PropTypes.func,
    // updateAnnotations: PropTypes.func
  };

  const mapDispatchToProps = {
    setUser,
    refreshUserData,
    getNationalities,
    getNationalityGroups,
    // updateAnnotations
  };

  return connect(
    null,
    mapDispatchToProps,
  )(hoistStatics(persistentAuth, WrappedComponent));
};

export default persistentAuth;
