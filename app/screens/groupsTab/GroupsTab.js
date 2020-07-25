import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import {StyleSheet, View} from 'react-native';
import I18n from '../../infra/localization';
import {connect} from 'react-redux';
import {Screen, EntityListsView, OptionsSelector} from '../../components';
import {GenericListEmptyState} from '../../components/emptyState';
import {CarouselItem} from '../../components/entityCarousel';
import {EntityCompactView, EntitiesLoadingState} from '../../components/entity';
import {flipFlopColors} from '../../vars';
import {
  screenGroupNames,
  entityTypes,
  originTypes,
  componentNamesForAnalytics,
  featuredTypes,
} from '../../vars/enums';
import {get, isEmpty} from '../../infra/utils';

import {addSpaceOnCapitalsAndCapitalize} from '../../infra/utils/stringUtils';
import {navigationService} from '../../infra/navigation';
import {userScheme} from '../../schemas';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: flipFlopColors.paleGreyTwo,
  },
});
class GroupsTab extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = props;
    const tags = get(navigation, 'state.params.tags', []);

    this.state = {
      suggestedGroupsProps: {
        normalizedSchema: 'GROUPS',
        reducerStatePath: 'groups.suggestedGroups',
        apiQuery: {
          domain: 'groups',
          key: 'getSuggested',
          params: {
            theme: tags[0],
            filter: null,
            featuredIn: isEmpty(tags) && featuredTypes.ENTITY_LOBBY,
          },
        },
        ListItemComponent: EntityCompactView,
        listItemProps: {entityType: entityTypes.GROUP},
        listEmptyState: (
          <GenericListEmptyState
            type={entityTypes.GROUP}
            headerText={I18n.t(`empty_states.${entityTypes.GROUP}.header`)}
            bodyText={I18n.t(`empty_states.${entityTypes.GROUP}.body`)}
          />
        ),
        listLoadingComponent: (
          <EntitiesLoadingState
            type={EntitiesLoadingState.COMPONENT_TYPE.COMPACT}
          />
        ),
      },
    };
    this.myGroupsProps = {
      normalizedSchema: 'GROUPS',
      reducerStatePath: 'groups.myGroups',
      apiQuery: {
        domain: 'groups',
        key: 'getManagedAndRecent',
        params: {userId: ''},
      },
      EntityComponent: this.renderMyGroupComponent(),
    };
    this.createEntityButton = {
      text: I18n.t('groups.create_button'),
      action: () =>
        navigationService.navigate(screenGroupNames.CREATE_GROUP_MODAL),
      testID: 'createGroupBtn',
    };
    this.topSectionSubHeaderProps = {
      leftText: I18n.t('groups.sub_tabs.sub_tab_2'),
    };
    this.bottomSectionSubHeaderProps = {
      leftText: I18n.t('groups.sub_tabs.sub_tab_1'),
    };
  }
  render() {
    const {suggestedGroupsProps} = this.state;

    return (
      <View style={styles.container}>
        <EntityListsView
          createEntityButton={this.createEntityButton}
          topSectionSubHeaderProps={this.topSectionSubHeaderProps}
          bottomSectionSubHeaderProps={this.bottomSectionSubHeaderProps}
          bottomSectionListProps={suggestedGroupsProps}
          topSectionListProps={this.myGroupsProps}
          componentColor={flipFlopColors.golden}
          optionsSelectorProps={{
            // selectedOptionIndex: translatedThemes.findIndex((theme) => theme === this.initialSelectedOptionTag),
            // options: translatedThemes,
            updateParentSelectedOption: this.changeTheme,
            showOptionAll: true,
            optionAllCustomName: I18n.t('themes.suggested'),
          }}
        />
      </View>
    );
  }
  renderMyGroupComponent = () => ({data, index}) => (
    <CarouselItem
      size={CarouselItem.sizes.SMALL_ACTIONLESS}
      // itemNumber={index}
      // item={data}
      // key={data.id}
      entityType={entityTypes.GROUP}
      // originType={originTypes.VIEW}
      componentName={componentNamesForAnalytics.FEED_ITEM}
      testID={`groupDisplayComponent${data.name}`}
    />
  );
}

export default GroupsTab;
