import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {StyleSheet, FlatList} from 'react-native';
import I18n from '../../infra/localization';
import {ItemErrorBoundary, SuggestionItem} from '../../components';
import {EmptyList} from '../../components/emptyState';
import {View, Text, Spinner} from '../../components/basicComponents';
import {flipFlopColors} from '../../vars';
// import GooglePlacesService from '/infra/google/googlePlacesService';
// import searchService from '/infra/search/searchService';
import {get} from '../../infra/utils';

const styles = StyleSheet.create({
  listWrapper: {
    borderTopWidth: 1,
    borderTopColor: flipFlopColors.b90,
  },
  listContent: {
    paddingBottom: 30,
  },
  emptyList: {
    paddingTop: 50,
    backgroundColor: flipFlopColors.white,
  },
  suggestionHeaderText: {
    marginHorizontal: 15,
    marginBottom: 10,
  },
  previewItem: {
    marginTop: 15,
  },
});

class SuggestionsList extends Component {
  state = {
    isSearching: false,
    results: [],
  };

  render() {
    const {results} = this.state;
    const {itemDimension} = SuggestionItem;

    return (
      <FlatList
        testID="listSuggestionItemScrollList"
        style={styles.listWrapper}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        data={results}
        renderItem={this.renderItem}
        keyExtractor={(i) => i.pageId || i.googlePlaceId}
        ListEmptyComponent={this.renderEmptyComponent()}
        ListHeaderComponent={this.renderHeaderComponent()}
        disableVirtualization={false}
        getItemLayout={(data, index) => ({
          length: itemDimension,
          offset: itemDimension * index,
          index,
        })}
      />
    );
  }

  componentDidMount = () => {
    this.searchSuggestedItems();
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.searchText !== this.props.searchText) {
      this.searchSuggestedItems();
    }
  };

  renderItem = ({item}) => {
    // const { itemDimension } = SuggestionItem;
    // const { onSelectionPress } = this.props;
    // let mediaUrl = item.thumbnail;
    // if (!mediaUrl && item.photos && item.photos.length) {
    //   mediaUrl = GooglePlacesService.placePhoto({ photoReference: item.photos[0].photo_reference, maxWidth: itemDimension * 10, maxHeight: itemDimension * 10 });
    // }
    // return (
    //   <ItemErrorBoundary boundaryName="ListItemEntitySuggestedItem">
    //     <SuggestionItem item={{ ...item, mediaUrl }} onPressItem={onSelectionPress} />
    //   </ItemErrorBoundary>
    // );
  };

  renderHeaderComponent = () => {
    const {searchText, onSelectionPress} = this.props;
    return (
      <View>
        {!!searchText && (
          <SuggestionItem
            item={{title: searchText, isNewPage: true}}
            onPressItem={onSelectionPress}
            isCreatableItem
            style={styles.previewItem}
          />
        )}
        <Text
          size={14}
          lineHeight={16}
          color={flipFlopColors.b30}
          style={styles.suggestionHeaderText}>
          {I18n.t('searchable_form.suggestions_header')}
        </Text>
      </View>
    );
  };

  renderEmptyComponent = () => {
    const {isSearching} = this.state;

    return isSearching ? (
      <Spinner color={flipFlopColors.secondaryBlack} />
    ) : (
      <EmptyList
        style={styles.emptyList}
        title={I18n.t('searchable_form.suggestions_empty_title')}
        text={I18n.t('searchable_form.suggestions_empty_text')}
      />
    );
  };

  searchSuggestedItems = async () => {
    // const { searchText, userCommunity, nationalityGroupId } = this.props;
    // const { destinationLocation, destinationCountryCode, id: communityId } = userCommunity;
    // if (searchText.length) {
    //   this.setState({ isSearching: true });
    //   const localResultsPromise = searchService.searchPages({ term: searchText, communityId, nationalityGroupId });
    //   const googleResultsPromise = GooglePlacesService.placeSearch({ query: searchText, region: destinationCountryCode, coordinates: destinationLocation });
    //   const [localResults, googleResults] = await Promise.all([localResultsPromise, googleResultsPromise]);
    //   let normalizedLocalResults = [];
    //   if (localResults && localResults.hits) {
    //     normalizedLocalResults = localResults.hits.map((result) => ({
    //       title: result.name,
    //       thumbnail: result.thumbnail,
    //       pageId: result.objectID,
    //       location: result.address,
    //       googlePlaceId: result.googlePlaceId
    //     }));
    //   }
    //   let normalizedGoogleResults = [];
    //   if (googleResults) {
    //     normalizedGoogleResults = googleResults
    //       .map((result) => ({
    //         title: result.name,
    //         location: result.formatted_address,
    //         googlePlaceId: result.place_id,
    //         phoneNumber: result.formatted_phone_number,
    //         url: result.website,
    //         photos: result.photos,
    //         id: result.id
    //       }))
    //       .filter((result) => !normalizedLocalResults.find((item) => item.googlePlaceId === result.googlePlaceId));
    //   }
    //   const results = [...normalizedLocalResults, ...normalizedGoogleResults];
    //   this.setState({ isSearching: false, results });
    // }
  };
}

SuggestionsList.propTypes = {
  searchText: PropTypes.string.isRequired,
  onSelectionPress: PropTypes.func.isRequired,
  userCommunity: PropTypes.shape({
    id: PropTypes.string,
    destinationLocation: PropTypes.array,
    destinationCountryCode: PropTypes.string,
  }),
  nationalityGroupId: PropTypes.string,
};

const mapStateToProps = (state) => ({
  userCommunity: state.auth.user.community,
  nationalityGroupId: get(state, 'auth.user.nationalityGroup.id'),
});

SuggestionsList = connect(mapStateToProps)(SuggestionsList);

export default SuggestionsList;
