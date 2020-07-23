import React, {Component} from 'react';
import {StyleSheet, FlatList} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import I18n from '../../infra/localization';
import {get, uniq, isEqual, isEmpty} from '../../infra/utils';
import {getUserUpperLevelCountries} from '../../infra/utils/userUtils';
import {View, TextInput, QueryCancelIcon} from '../basicComponents';
import {flipFlopColors, commonStyles} from '../../vars';
import {userScheme} from '../../schemas';
// import { getfilteredResults } from '/screens/signup/JoinCommunity/SearchCountry';
import FilterRow from './FilterRow';
import {ItemErrorBoundary} from '../errorBoundaries';
import {SearchAddressResultRow} from '../search';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 25,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 60,
    width: '100%',
    paddingVertical: 10,
    backgroundColor: flipFlopColors.white,
    borderBottomWidth: 1,
    borderBottomColor: flipFlopColors.b90,
  },
  inputContainer: {
    width: '100%',
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: flipFlopColors.transparent,
    backgroundColor: flipFlopColors.veryLightPink,
  },
  inputContainerFocused: {
    backgroundColor: flipFlopColors.white,
    borderColor: flipFlopColors.green,
  },
  input: {
    fontSize: 16,
    color: flipFlopColors.b30,
    padding: 0,
    paddingLeft: 10,
    paddingRight: 25,
  },
  cancelIcon: {
    position: 'absolute',
    top: 23,
    right: 10,
  },
  allFilterRow: {
    borderBottomWidth: 1,
    borderBottomColor: flipFlopColors.b90,
  },
});

class CountriesFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      countries: this.userFilteredInitailCountries,
      searchTerm: '',
      isInputFocused: false,
    };
  }

  // eslint-disable-next-line react/sort-comp
  userFilteredInitailCountries = getUserUpperLevelCountries({
    user: this.props.user,
  });

  render() {
    const {hasAll} = this.props;
    const {searchTerm, isInputFocused, countries} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.searchInputContainer}>
          <TextInput
            onChange={(val) => this.setState({searchTerm: val})}
            onChangeDebounced={this.handleQueryChange}
            debounceTime={100}
            containerStyle={[
              styles.inputContainer,
              isInputFocused && styles.inputContainerFocused,
            ]}
            autoCapitalize="none"
            value={searchTerm}
            placeholder={I18n.t('filters.contextCountryCode.search')}
            placeholderTextColor={flipFlopColors.b60}
            inputStyle={styles.input}
            height={38}
            onFocus={this.handleInputFocus}
            onBlur={this.handleInputBlur}
          />
          {!!searchTerm && (
            <QueryCancelIcon
              onPress={this.clearSearch}
              iconColor={flipFlopColors.b70}
              style={styles.cancelIcon}
            />
          )}
        </View>

        {hasAll && this.renderAllFilter()}
        <FlatList
          contentContainerStyle={!countries.length && commonStyles.flex1}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          data={countries}
          renderItem={this.renderSearchResultItem}
          getItemLayout={(data, index) => ({
            length: SearchAddressResultRow.ITEM_HEIGHT,
            offset: SearchAddressResultRow.ITEM_HEIGHT * index,
            index,
          })}
        />
      </View>
    );
  }

  renderSearchResultItem = ({item, index}) => {
    const {contextCountryCode, hasAll} = this.props;
    const isActive =
      contextCountryCode.includes(item.countryCode) ||
      (hasAll && isEmpty(contextCountryCode));
    return (
      <ItemErrorBoundary boundaryName="SearchAddressItem">
        <FilterRow
          key={item.name}
          action={this.handlePressed(item)}
          index={index}
          isActive={isActive}
          text={`${item.name}`}
        />
      </ItemErrorBoundary>
    );
  };

  handleInputFocus = () => {
    const {isInputFocused} = this.state;
    !isInputFocused && this.setState({isInputFocused: true});
  };

  handleInputBlur = () => {
    const {isInputFocused} = this.state;
    isInputFocused && this.setState({isInputFocused: false});
  };

  handleQueryChange = (query) => {
    if (query) {
      const trimmedSearchQuery = query.trim();
      this.searchCountries(trimmedSearchQuery);
    } else {
      this.searchCountries();
    }
  };

  searchCountries = (query) => {
    // const { countries } = this.state;
    // const filteredCountries = getfilteredResults(countries, query);
    // if (filteredCountries.length) {
    //   this.setState({ countries: filteredCountries });
    // } else {
    //   this.setState({ countries: this.userFilteredInitailCountries });
    // }
  };

  clearSearch = () => {
    this.setState({
      searchTerm: '',
      countries: this.userFilteredInitailCountries,
    });
  };

  renderAllFilter = () => {
    const {onCountriesChange, contextCountryCode} = this.props;
    return (
      <View style={styles.allFilterRow}>
        <FilterRow
          action={() => onCountriesChange([])}
          isActive={isEmpty(contextCountryCode)}
          text={'All'}
        />
      </View>
    );
  };

  handlePressed = (country) => () => {
    const {onCountriesChange, contextCountryCode, isSingleChoice} = this.props;
    const {countryCode} = country;
    const allCountriesCodes = this.userFilteredInitailCountries.map(
      (country) => country.countryCode,
    );

    let newCountries;
    const countryIndex = contextCountryCode.findIndex(
      (item) => item === countryCode,
    );
    if (countryIndex > -1) {
      newCountries = [
        ...contextCountryCode.slice(0, countryIndex),
        ...contextCountryCode.slice(countryIndex + 1),
      ];
    } else {
      newCountries = isSingleChoice
        ? [countryCode]
        : [...contextCountryCode, countryCode];
    }

    const isAllCountiesSelected = isEqual(
      newCountries.sort(),
      allCountriesCodes.sort(),
    );
    if (isAllCountiesSelected) {
      onCountriesChange([]);
    } else {
      onCountriesChange(uniq(newCountries));
    }
  };
}

CountriesFilter.propTypes = {
  user: userScheme,
  contextCountryCode: PropTypes.array,
  onCountriesChange: PropTypes.func.isRequired,
  isSingleChoice: PropTypes.bool,
  hasAll: PropTypes.bool,
};

CountriesFilter.defaultProps = {
  hasAll: true,
};

const mapStateToProps = (state) => ({
  user: get(state, 'auth.user'),
});

CountriesFilter = connect(mapStateToProps)(CountriesFilter);
export default CountriesFilter;
