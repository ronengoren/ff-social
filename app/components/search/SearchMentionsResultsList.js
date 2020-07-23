import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
// import { searchMentions as querySearchMentions, clearSearchMentions, addNewMention } from '/redux/mentions/actions';
import {SearchResultsList} from '../../components';
import {get} from '../../infra/utils';
import {searchMentionsScheme} from '../../schemas';

class SearchMentionsResultsList extends Component {
  render = () => {
    const {
      results,
      query,
      resultsNumberPages,
      isSearching,
    } = this.props.searchMentions;
    const {emptyComponentStyle} = this.props;

    return (
      <SearchResultsList
        results={results}
        query={query}
        resultsNumberPages={resultsNumberPages}
        querySearch={this.querySearch}
        onSearchResultPress={this.handleSearchResultPress}
        isSearching={isSearching}
        dismissOnScroll={false}
        emptyComponentStyle={emptyComponentStyle}
      />
    );
  };

  querySearch = (query, page) => {
    const {communityId, nationalityGroupId, querySearchMentions} = this.props;

    querySearchMentions(query, page, communityId, nationalityGroupId);
  };

  handleSearchResultPress = (result, index) => {
    const {
      addNewMention,
      clearSearchMentions,
      onSelect = addNewMention,
    } = this.props;

    // We're only adding the new mention entity - without indexes at this point
    onSelect({entity: result, index});
    clearSearchMentions();
  };
}

SearchMentionsResultsList.propTypes = {
  communityId: PropTypes.string,
  nationalityGroupId: PropTypes.string,
  searchMentions: searchMentionsScheme,
  addNewMention: PropTypes.func,
  onSelect: PropTypes.func,
  clearSearchMentions: PropTypes.func,
  querySearchMentions: PropTypes.func,
  emptyComponentStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
};

const mapStateToProps = (state) => ({
  searchMentions: state.mentions.searchMentions,
  communityId: get(state, 'auth.user.community.id'),
  nationalityGroupId: get(state, 'auth.user.nationalityGroup.id'),
});

const mapDispatchToProps = {
  // querySearchMentions,
  // clearSearchMentions,
  // addNewMention
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchMentionsResultsList);
