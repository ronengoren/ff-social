import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, StyleSheet} from 'react-native';

import {get} from '../../infra/utils';
import {getCommunityTranslationByOriginAndDestination} from '../../infra/utils/communitiesNationalitiesUtils';
import {Text, ScrollView} from '../../components/basicComponents';
import {flipFlopColors} from '../../vars';
import {CountriesIcons} from '../../components/onboarding';
import {getCountryByCode} from './JoinCommunity/countries';

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 5,
  },
  suggestedNationality: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 10,
    borderColor: flipFlopColors.b30,
    borderWidth: 1,
  },
  suggestedNationalityText: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: -32,
  },
  countryIcons: {
    borderRadius: 25,
  },
  selectedCountryIcon: {
    borderColor: flipFlopColors.white,
    borderWidth: 1,
  },
});

const SuggestedNationality = (props) => {
  const {
    originCountry,
    destinationCountry,
    isSelected,
    onPressSuggestion,
  } = props;
  const nationalityTranslation = getCommunityTranslationByOriginAndDestination({
    originCountry,
    destinationCountry,
  });
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => onPressSuggestion(props)}
      style={[
        styles.suggestedNationality,
        isSelected && {
          backgroundColor: flipFlopColors.green,
          borderColor: flipFlopColors.transparent,
        },
      ]}>
      <CountriesIcons
        iconStyle={[
          styles.countryIcons,
          isSelected && styles.selectedCountryIcon,
        ]}
        originCountry={originCountry}
        destinationCountry={destinationCountry}
        size={25}
      />
      <Text
        style={styles.suggestedNationalityText}
        size={18}
        lineHeight={22}
        center
        color={isSelected ? flipFlopColors.white : flipFlopColors.b30}
        testID={`suggestedNationality-${originCountry.name.toLowerCase()}`}>
        {nationalityTranslation}
      </Text>
    </TouchableOpacity>
  );
};

SuggestedNationality.propTypes = {
  originCountry: PropTypes.object,
  destinationCountry: PropTypes.object,
  isSelected: PropTypes.bool,
  onPressSuggestion: PropTypes.func,
};

const SuggestedNationalities = (props) => {
  const {data, onSelectedSuggested} = props;
  const [selectedSuggestion, onPressSuggestion] = useState({});

  const filterNationalitiesWithDataMissings = (nationality) =>
    nationality.originNumericCountryCodes &&
    Array.isArray(nationality.originNumericCountryCodes) &&
    nationality.destinationNumericCountryCode;
  return (
    <ScrollView style={styles.wrapper}>
      {data.filter(filterNationalitiesWithDataMissings).map((nationality) => {
        const originCountry = getCountryByCode(
          get(nationality, 'originNumericCountryCodes.0'),
        );
        const destinationCountry = getCountryByCode(
          nationality.destinationNumericCountryCode,
        );
        const selection = {
          originCountry,
          destinationCountry,
          id: nationality.id,
        };
        return (
          <SuggestedNationality
            originCountry={originCountry}
            destinationCountry={destinationCountry}
            id={nationality.id}
            key={nationality.id}
            isSelected={selectedSuggestion.id === nationality.id}
            onPressSuggestion={() => {
              onPressSuggestion(selection);
              onSelectedSuggested && onSelectedSuggested(nationality);
            }}
          />
        );
      })}
    </ScrollView>
  );
};

SuggestedNationalities.propTypes = {
  data: PropTypes.array,
  onSelectedSuggested: PropTypes.func,
};

export default SuggestedNationalities;
