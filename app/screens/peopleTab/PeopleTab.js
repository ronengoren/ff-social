import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {flipFlopColors} from '../../vars';
import {connect} from 'react-redux';

import {FriendsList} from '../../components/people';
import {
  FloatingHeader,
  View,
  NewTextButton,
} from '../../components/basicComponents';
import {Screen, Header} from '../../components';
import {FiltersExpandable} from '../../components/filters';

import I18n from '../../infra/localization';
import {EntityMediaHeader} from '../../components/entityListsView';
import {get, isEqual, isNil} from '../../infra/utils';
import {navigationService} from '../../infra/navigation';
import {
  screenNames,
  entityTypes,
  filterTypes,
  communityRoleTypes,
  userRoleTypes,
} from '../../vars/enums';
import images from '../../assets/images';
import {userScheme} from '../../schemas';
// import { CommunityRoleBanner } from '/screens/pages';
import {
  hasActiveFilters,
  getFiltersScrollYOffset,
  shouldShowFloatingHeader,
} from '../../components/filters/utils';

const styles = StyleSheet.create({
  header: {
    marginTop: 0,
  },
  floatingHeader: {
    borderBottomWidth: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 10,
  },
  inviteButtonText: {
    fontWeight: 'bold',
    color: flipFlopColors.white,
    fontSize: 15,
  },
  inviteButtonIcon: {
    color: flipFlopColors.white,
  },
  inviteButton: {
    marginHorizontal: 15,
    borderRadius: 10,
    height: 45,
  },
});
const FILTERS = [
  filterTypes.PEOPLE_SEARCH,
  filterTypes.COUNTRY,
  filterTypes.COMMUNITY,
  filterTypes.HOODS,
  filterTypes.GENDER,
  filterTypes.RELATIONSHIP_STATUS,
  filterTypes.AGE,
  filterTypes.FRIENDSHIP_STATUS,
  // filterTypes.INSIDERS
];
class PeopleTab extends React.Component {
  constructor(props) {
    super(props);
    const {nationalityGroup} = props;
    const {params = {}} = props.navigation.state;
    const {initialFilters} = params;

    this.state = {
      filters: {...initialFilters},
      showFloatingHeader: false,
    };
    this.contentYOffset = 0;
    let filteredFilters = FILTERS;
  }
  render() {
    const {filters, showFloatingHeader} = this.state;
    const isFiltersActive = hasActiveFilters({filters});
    const shouldDisplayInsidersBanner = !!get(
      filters,
      `${filterTypes.INSIDERS}[0]`,
    );

    return (
      <FriendsList
        ref={(node) => {
          this.friendsList = node;
        }}
        additionalHeaderComponent={this.renderHeader()}
        headerStyle={styles.header}
        filters={filters}
        floatingHeader={
          <FloatingHeader
            style={[styles.floatingHeader]}
            showFloatingHeader={showFloatingHeader}>
            <Header title={I18n.t('tab_names.people')} />
          </FloatingHeader>
        }
        onScroll={this.handleScroll}
        hideTopSection={isFiltersActive}
        additionalBottomComponent={
          shouldDisplayInsidersBanner && (
            <CommunityRoleBanner
              type={communityRoleTypes.INSIDER}
              badgeOriginalType={userRoleTypes.REGIONAL_MANAGER}
            />
          )
        }
      />
    );
  }
  renderHeader() {
    const {
      resetUsersResults,
      navigation: {
        state: {params = {}},
      },
    } = this.props;
    const {filters} = this.state;
    const isFiltersActive = hasActiveFilters({filters});
    const {initialFilters} = params;

    return (
      <React.Fragment>
        <EntityMediaHeader
          title={I18n.t('tab_names.people')}
          image={images.people.main}
        />
        <View onLayout={this.handleFiltersLayout}>
          <FiltersExpandable
            filterDefinitions={this.filterDefinitions}
            // hoodsParams={{
            //   reducerStatePath: 'users.hoods',
            //   apiQuery: {domain: 'users', key: 'getHoodsByUsers'},
            // }}
            // entityType={entityTypes.USER}
            // applyAction={this.handleFiltersChange}
            // resetAction={resetUsersResults}
            initialFilters={initialFilters}
          />
        </View>
        {isFiltersActive && (
          <NewTextButton
            style={styles.inviteButton}
            iconWeight="solid"
            iconName="smile-plus"
            onPress={this.navigateToInviteFriends}
            customColor={flipFlopColors.green}
            textStyle={styles.inviteButtonText}
            iconStyle={styles.inviteButtonIcon}>
            {I18n.t('people.invite_friends_button')}
          </NewTextButton>
        )}
      </React.Fragment>
    );
  }
  handleFiltersChange = (filters) => {
    const {filters: prevFilters} = this.state;

    if (!isEqual(prevFilters, filters)) {
      const shouldScrollToFilters =
        this.filtersScrollYOffset &&
        this.contentYOffset < this.filtersScrollYOffset;
      if (shouldScrollToFilters) {
        this.friendsList &&
          this.friendsList.scrollToOffset({
            offset: this.filtersScrollYOffset,
            force: true,
          });
      }

      LayoutAnimation.easeInEaseOut();
      this.setState({filters});
    }
  };
  handleFiltersLayout = (event) => {
    this.filtersScrollYOffset = getFiltersScrollYOffset(event);
  };
  handleScroll = (event) => {
    const {y: contentYOffset} = event.nativeEvent.contentOffset;
    const showFloatingHeader = shouldShowFloatingHeader({
      contentYOffset,
      prevShowFloatingHeader: this.state.showFloatingHeader,
    });
    this.contentYOffset = contentYOffset;
    if (!isNil(showFloatingHeader)) {
      this.setState({showFloatingHeader});
    }
  };
}

PeopleTab.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        filters: PropTypes.object,
      }),
    }),
  }),
  user: userScheme,
  nationalityGroup: PropTypes.object,
  // resetUsersResults: PropTypes.func,
};

const mapStateToProps = (state) => ({
  // nationalityGroup: get(state, 'auth.user.nationalityGroup', {}),
  // user: state.auth.user,
  // featureFlags: state.auth.featureFlags,
  // refProgram: get(state, 'auth.user.community.refProgram', {})
});
const mapDispatchToProps = {
  // resetUsersResults
};

// PeopleTab = connect(mapStateToProps, mapDispatchToProps)(PeopleTab);
// PeopleTab = Screen()(PeopleTab);
export default PeopleTab;
