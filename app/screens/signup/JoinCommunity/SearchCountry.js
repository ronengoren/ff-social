import React, {Component} from 'react';

import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  Keyboard,
  FlatList,
  Platform,
} from 'react-native';
import I18n from '../../../infra/localization';
import {
  EmptySearch,
  ItemErrorBoundary,
  HeaderSearchInput,
  SearchAddressResultRow,
} from '../../../components';
import {Text, Image} from '../../../components/basicComponents';
import {isEmpty, sortBy} from '../../../infra/utils';
import images from '../../../assets/images';
import {flipFlopColors, uiConstants, commonStyles} from '../../../vars';
import {enhanceWithUseKeyboard} from '../../../hooks';

import countries, {getCountryImageByName} from './countries';

const PADDING_FROM_BOTTOM_COUNTRIES_LIST =
  uiConstants.FOOTER_MARGIN_BOTTOM_ONBOARDING + 10;
const RESULT_ROW_HEIGHT = 50;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: flipFlopColors.transparent,
  },
  header: {
    alignItems: 'center',
    backgroundColor: flipFlopColors.transparent,
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  emptyState: {
    justifyContent: 'flex-start',
  },
  suggestedLabel: {
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 5,
  },
  searchResultRow: {
    minHeight: RESULT_ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    paddingRight: 60,
  },
  countryNote: {
    marginHorizontal: 20,
    paddingLeft: 40,
    marginTop: -10,
  },
  countryIcon: {
    marginTop: -2,
    width: 30,
    height: 30,
    borderRadius: 30,
    marginLeft: 5,
    marginRight: 15,
  },
  suggestedCountryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomSpacerWithKeyboard: {
    paddingBottom: 20,
  },
  bottomSpacer: {
    paddingBottom: PADDING_FROM_BOTTOM_COUNTRIES_LIST,
  },
});

const isIOS = Platform.OS === 'ios';

export const getfilteredResults = (items, query) => {
  if (!query) {
    return items;
  }

  const loweredCaseQuery = query.toLowerCase();
  const filteredItems = [];
  items.forEach((item) => {
    const {name, synonyms = [], translations = {}} = item;
    const match = [
      name,
      ...synonyms,
      ...Object.values(translations),
    ].find((term) => term.toLowerCase().includes(loweredCaseQuery));
    if (match) {
      filteredItems.push({...item, adjustedName: match});
    }
  });
  const sortedFilteredItems = sortBy(filteredItems, (item) => {
    const queryIndexInItem = item.name.toLowerCase().indexOf(loweredCaseQuery);
    return queryIndexInItem === -1 ? 1000 : queryIndexInItem;
  });

  return sortedFilteredItems;
};

class SearchCountry extends Component {
  constructor(props) {
    super(props);
    const {customCountryMaping} = props;

    this.initialCountries = countries;
    this.locale = I18n.languageInitials[I18n.getLocale()].toLowerCase();
    if (customCountryMaping) {
      this.initialCountries = customCountryMaping(countries);
    }

    this.state = {
      query: '',
    };
  }

  render() {
    const {
      isKeyboardShown,
      keyboardHeight,
      searchPlaceholder,
      closeButtonPlaceholder,
    } = this.props;
    const {query} = this.state;
    const filteredCountries = getfilteredResults(this.initialCountries, query);
    const spacerHeight = isIOS && isKeyboardShown ? keyboardHeight : 0;

    return (
      <View style={styles.container}>
        <StatusBar
          translucent
          barStyle="dark-content"
          backgroundColor="transparent"
        />
        <View style={styles.header}>
          <HeaderSearchInput
            value={query}
            onChange={(text) => this.setState({query: text})}
            onCancel={this.clearQuery}
            searchMode
            isOnboarding
            searchPlaceholder={searchPlaceholder}
            closeButtonPlaceholder={closeButtonPlaceholder}
            testID="searchCountryInput"
            onPressClose={this.handleClosePress}
          />
        </View>
        <FlatList
          style={commonStyles.flex1}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          data={filteredCountries}
          renderItem={this.renderSearchResultItem({
            filteredCountries,
            isKeyboardShown,
          })}
          ListHeaderComponent={this.renderSuggestedHeader}
          ListEmptyComponent={
            isEmpty(filteredCountries) && (
              <EmptySearch
                text={I18n.t('onboarding.search_country.no_country', {
                  searchTerm: query,
                })}
                style={styles.emptyState}
              />
            )
          }
          keyExtractor={(i) => i.name || i.description}
          getItemLayout={(data, index) => ({
            length: RESULT_ROW_HEIGHT,
            offset: RESULT_ROW_HEIGHT * index,
            index,
          })}
        />
        <View style={[{height: spacerHeight}]} />
      </View>
    );
  }

  renderSuggestedHeader = () => {
    const {suggestedCountries} = this.props;
    const {query} = this.state;
    return (
      <React.Fragment>
        {!query &&
          !isEmpty(suggestedCountries) &&
          this.renderSuggestedCountries(suggestedCountries)}
        {!query && (
          <Text
            bold
            size={16}
            lineHeight={22}
            color={flipFlopColors.green}
            style={styles.suggestedLabel}
            key="results-title">
            {I18n.t('onboarding.search_country.search_query_title')}
          </Text>
        )}
      </React.Fragment>
    );
  };

  renderSuggestedCountries = (suggestedCountries) => (
    <React.Fragment>
      <Text
        bold
        size={16}
        lineHeight={22}
        color={flipFlopColors.green}
        style={styles.suggestedLabel}
        key="title">
        {I18n.t('onboarding.search_country.suggested_title')}
      </Text>
      <View key="countries">
        {suggestedCountries.map(this.renderSuggestedCountry)}
      </View>
    </React.Fragment>
  );

  renderCountryIcon = (country) => {
    const countryName = country.name.toLowerCase();
    const imageUri = getCountryImageByName(countryName) || country.thumbnail;
    return (
      <Image
        style={styles.countryIcon}
        source={
          imageUri ? {uri: imageUri} : images.onboarding[`${countryName}_flag`]
        }
      />
    );
  };

  renderSuggestedCountry = (country, index) => {
    const countryName = country.translations[this.locale] || country.name;
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.searchResultRow}
        key={countryName}
        onPress={() =>
          this.handleResultPress({...country, adjustedName: countryName})
        }
        testID={`suggestedCountryItem-${index}`}>
        <View style={styles.suggestedCountryRow}>
          {this.renderCountryIcon(country)}
          <Text size={16} lineHeight={19} color={flipFlopColors.b30}>
            {countryName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderSearchResultItem = ({filteredCountries, isKeyboardShown}) => ({
    item,
    index,
  }) => {
    const adjustedName =
      item.adjustedName || item.translations[this.locale] || item.name;
    return (
      <ItemErrorBoundary
        key={`render-search-result-row-${item.alpha2}`}
        boundaryName="SearchCountryItem">
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => this.handleResultPress({...item, adjustedName})}>
          <SearchAddressResultRow
            style={styles.searchResultRow}
            renderIcon={() => this.renderCountryIcon(item)}
            searchResult={{description: adjustedName}}
            onPress={() => this.handleResultPress({...item, adjustedName})}
            searchQuery={this.state.query || ''}
            testID={`searchCountryItem-${index}`}
          />

          {this.renderOptionalCountryNote(item)}
        </TouchableOpacity>

        {filteredCountries.length > 1 &&
          index + 1 === filteredCountries.length && (
            <View
              style={[
                isKeyboardShown
                  ? styles.bottomSpacerWithKeyboard
                  : styles.bottomSpacer,
              ]}
            />
          )}
      </ItemErrorBoundary>
    );
  };

  renderOptionalCountryNote = (country) => {
    const {shouldRenderNote} = this.props;
    let note;
    try {
      [country.name, ...(countries.synonyms || [])].forEach((t) => {
        const countryTranslationPath = t.toLowerCase().split(' ').join('_');
        const currentCountryNameNote = I18n.t(
          `onboarding.set_user_nationality.country_selector.${countryTranslationPath}_note`,
          {defaultValue: ''},
        );
        if (currentCountryNameNote) {
          note = currentCountryNameNote;
        }
      });

      if (note && shouldRenderNote(country)) {
        return (
          <Text
            style={styles.countryNote}
            color={flipFlopColors.realBlack40}
            size={14}
            lineHeight={18}>
            {note}
          </Text>
        );
      }
      return null;
    } catch (err) {
      return null;
    }
  };

  clearQuery = () => {
    this.setState({query: ''});
  };

  handleClosePress = () => {
    const {onClose} = this.props;
    this.clearQuery();
    Keyboard.dismiss();
    onClose && onClose();
  };

  handleResultPress = (item) => {
    const {onSelectResult} = this.props;
    Keyboard.dismiss();
    onSelectResult && onSelectResult({country: item});
    this.setState({query: ''});
  };
}

SearchCountry.propTypes = {
  closeButtonPlaceholder: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  customCountryMaping: PropTypes.func,
  isKeyboardShown: PropTypes.bool,
  keyboardHeight: PropTypes.number,
  onSelectResult: PropTypes.func,
  onClose: PropTypes.func,
  suggestedCountries: PropTypes.array,
  shouldRenderNote: PropTypes.func,
};

SearchCountry = enhanceWithUseKeyboard(SearchCountry);
export default React.memo(SearchCountry);
