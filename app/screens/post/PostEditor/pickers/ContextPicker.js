import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {StyleSheet} from 'react-native';
import {InfiniteScroll} from '../../../../components';
import {entityTypes, groupType} from '../../../../vars/enums';
import {navigationService} from '../../../../infra/navigation';
import {get} from '../../../../infra/utils';
import ContextPickerItem from './ContextPickerItem';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
  },
});

class ContextPicker extends Component {
  render() {
    const {userId, topics} = this.props;

    return (
      <InfiniteScroll
        addedData={topics}
        apiQuery={{
          domain: 'groups',
          key: 'getMembered',
          params: {userId, groupType: groupType.GROUP},
        }}
        reducerStatePath="groups.memberedInTypeGroup"
        ListItemComponent={ContextPickerItem}
        listItemProps={{onContextChosen: this.handleContextChosen}}
        contentContainerStyle={styles.container}
      />
    );
  }

  handleContextChosen = (context) => {
    const {navigation} = this.props;
    const {onContextChosen} = navigation.state.params;

    onContextChosen({...context, entityType: entityTypes.GROUP});
    navigationService.goBack();
  };
}

const mapStateToProps = (state) => ({
  userId: get(state, 'auth.user.id'),
  topics: get(state, 'auth.appSettings.data.topics', []),
});

ContextPicker.propTypes = {
  userId: PropTypes.string,
  topics: PropTypes.array,
  navigation: PropTypes.object,
};

export default connect(mapStateToProps)(ContextPicker);
