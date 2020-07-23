import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {View, Separator} from '../basicComponents';
import {
  SearchMentionsResultsList,
  SearchResultRowHeight,
} from '../../components';
import {flipFlopColors} from '../../vars';

const styles = StyleSheet.create({
  searchResults: {
    flex: 0,
    backgroundColor: flipFlopColors.white,
  },
  separator: {
    borderTopWidth: 0,
    height: 0,
  },
  searchResultsWrapper: {
    flex: 0,
  },
});

class SearchMentionsResults extends Component {
  render() {
    const {onSelect} = this.props;
    const maxHeight = SearchResultRowHeight * 3;
    return (
      <View style={[styles.searchResultsWrapper, {maxHeight}]}>
        <Separator
          color={flipFlopColors.disabledGrey}
          style={styles.separator}
          key="seperator"
        />
        <View style={styles.searchResults} key="searchResults">
          <SearchMentionsResultsList
            emptyComponentStyle={{height: maxHeight}}
            onSelect={onSelect}
          />
        </View>
      </View>
    );
  }
}

SearchMentionsResults.propTypes = {
  onSelect: PropTypes.func,
};

export default SearchMentionsResults;
