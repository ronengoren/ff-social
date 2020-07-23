import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import I18n from '../../infra/localization';
import PropTypes from 'prop-types';
import {Text, View, MultiSlider} from '../basicComponents';
import {flipFlopColors} from '../../vars';
import {toCurrency} from '../../infra/utils/stringUtils';

const FILTERS_SCREEN_PADDING = 15;

const styles = StyleSheet.create({
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 15,
  },
  sliderWrapper: {
    marginBottom: 75,
    paddingHorizontal: FILTERS_SCREEN_PADDING,
  },
});

class PriceFilter extends Component {
  render() {
    const {
      minValue,
      maxValue,
      currentMin,
      currentMax,
      onPriceChanged,
    } = this.props;
    const showPlusSign = currentMax === maxValue;
    return (
      <View>
        <View style={styles.header}>
          <Text size={16} lineHeight={19} color={flipFlopColors.b30}>
            {I18n.t('filters.price.header')}
          </Text>
          <Text size={16} lineHeight={19} color={flipFlopColors.b30}>
            {this.getFormattedCurrency(currentMin)} -{' '}
            {this.getFormattedCurrency(currentMax)}
            {showPlusSign ? '+' : ''}
          </Text>
        </View>
        <View style={styles.sliderWrapper}>
          <MultiSlider
            color={flipFlopColors.green}
            currentMin={currentMin}
            currentMax={currentMax}
            onValuesChange={onPriceChanged}
            min={minValue}
            max={maxValue}
            screenPadding={FILTERS_SCREEN_PADDING}
          />
        </View>
      </View>
    );
  }

  getFormattedCurrency(number) {
    const {currency} = this.props;
    return toCurrency(number, currency);
  }
}

PriceFilter.propTypes = {
  currency: PropTypes.string,
  onPriceChanged: PropTypes.func.isRequired,
  currentMin: PropTypes.number,
  currentMax: PropTypes.number,
  minValue: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  currency: state.auth.user.community.destinationPricing.currencyCode,
});

PriceFilter = connect(mapStateToProps)(PriceFilter);
export default PriceFilter;
