import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {connect, useSelector} from 'react-redux';
import {get, isEmpty, canChangeCountryPicker} from '../../infra/utils';
import {getUserUpperLevelCountries} from '../../infra/utils/userUtils';
import I18n from '../../infra/localization';
import {View, Text, Switch} from '../basicComponents';
import {ItemErrorBoundary} from '../../components';
import {flipFlopColors} from '../../vars';
import {AwesomeIcon} from '../../assets/icons';
import {SearchCountry} from '../../screens/signup/JoinCommunity';
import countries from '../../screens/signup/JoinCommunity/countries';
import {isRTL} from '../../infra/utils/stringUtils';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: flipFlopColors.b90,
  },
  rtlWrapper: {
    direction: 'rtl',
    textAlign: 'left',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  groupTypeSelectorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  title: {
    marginBottom: 4,
  },
  selectedCountriesWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 19,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: flipFlopColors.paleGreyTwo,
    borderWidth: 1,
    borderColor: flipFlopColors.b90,
  },
  selectedCountryNames: {
    flexDirection: 'row',
  },
  locationIcon: {
    paddingRight: 10,
    marginTop: 2,
  },
  modalContent: {
    backgroundColor: flipFlopColors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 15,
  },
  searchCountryModalContent: {
    height: '100%',
  },
});

export const CoutrySearchModalContent = (props) => {
  const {onSelectResult, onClose} = props;
  const user = useSelector((state) => get(state, 'auth.user'));

  return (
    <View
      style={[styles.modalContent, styles.searchCountryModalContent]}
      onStartShouldSetResponder={() => true}>
      <SearchCountry
        isOnboarding
        customCountryMaping={() => getUserUpperLevelCountries({user})}
        onClose={onClose}
        closeButtonPlaceholder={I18n.t('header.cancel_button')}
        onSelectResult={(result) => {
          onSelectResult(result);
          onClose();
        }}
      />
    </View>
  );
};

CoutrySearchModalContent.propTypes = {
  onSelectResult: PropTypes.func,
  onClose: PropTypes.func,
};

class CountryPicker extends Component {
  render() {
    const {
      onChange,
      style,
      onPressChangeCountry,
      user,
      contextCountryCode,
      publishAs,
      forceLTR,
    } = this.props;
    const isSelectedCountry = !isEmpty(contextCountryCode);
    const {countryName} = this.state;
    const canChangeCountry = canChangeCountryPicker(user, publishAs);
    const isRtlText = !forceLTR && isRTL(I18n.t('common.country_picker.title'));

    return (
      <ItemErrorBoundary boundaryName="CountryPicker">
        <View style={[styles.container, style]}>
          <View
            style={[
              styles.groupTypeSelectorWrapper,
              isRtlText && styles.rowReverse,
            ]}>
            <View>
              <Text
                size={16}
                lineHeight={19}
                color={flipFlopColors.b60}
                style={[styles.title, isRtlText && styles.rtlWrapper]}>
                {I18n.t('common.country_picker.title')}
              </Text>
              <Text size={13} lineHeight={15} color={flipFlopColors.b60}>
                {I18n.t('common.country_picker.sub_title')}
              </Text>
            </View>
            <Switch
              ref={(node) => {
                this.refSwitch = node;
              }}
              onChange={onChange}
              activeColor={flipFlopColors.green}
              active={isSelectedCountry}
              key={`isSelectedCountry-${isSelectedCountry}`}
              forceRTL={isRtlText}
            />
          </View>
          {isSelectedCountry && (
            <View
              style={[
                styles.selectedCountriesWrapper,
                isRtlText && styles.rowReverse,
              ]}>
              <View style={styles.selectedCountryNames}>
                <AwesomeIcon
                  color={flipFlopColors.b30}
                  weight="solid"
                  size={16}
                  name="location-circle"
                  style={styles.locationIcon}
                />
                <Text size={16} color={flipFlopColors.b30}>
                  {countryName}
                </Text>
              </View>
              {canChangeCountry && (
                <Text
                  size={16}
                  color={flipFlopColors.green}
                  onPress={() =>
                    onPressChangeCountry({
                      onSelectResult: this.onCountrySelection,
                    })
                  }>
                  {I18n.t('post_editor.context_slider.change')}
                </Text>
              )}
            </View>
          )}
        </View>
      </ItemErrorBoundary>
    );
  }

  static getDerivedStateFromProps(props) {
    const {contextCountryCode, userCountryName} = props;

    if (contextCountryCode) {
      const country = countries.find((country) =>
        contextCountryCode.includes(country.countryCode),
      );
      if (country) {
        return {countryName: country.name};
      }
    }
    return {countryName: userCountryName};
  }

  onCountrySelection = ({country}) => {
    const {changeCountryCode} = this.props;
    if (changeCountryCode) {
      changeCountryCode(country.countryCode);
    }
  };
}

CountryPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  user: PropTypes.object,
  style: PropTypes.object,
  publishAs: PropTypes.object,
  forceLTR: PropTypes.bool,
  onPressChangeCountry: PropTypes.func,
  changeCountryCode: PropTypes.func,
  contextCountryCode: PropTypes.arrayOf(PropTypes.number),
};

CountryPicker = connect((state) => ({
  user: get(state, 'auth.user'),
  userCountryName: get(state, 'auth.user.journey.originCountry.name'),
}))(CountryPicker);

export default CountryPicker;
