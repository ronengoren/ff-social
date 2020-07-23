import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import I18n from '../../infra/localization';
import PropTypes from 'prop-types';
import {Text, View, MultiSlider} from '../basicComponents';
import {flipFlopColors} from '../../vars';

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

class AgeFilter extends Component {
  static values = {
    min: 14,
    max: 80,
  };

  render() {
    const {minAge, maxAge, onAgeChanged} = this.props;
    const {min, max} = AgeFilter.values;

    return (
      <View>
        <View style={styles.header}>
          <Text size={16} lineHeight={19} color={flipFlopColors.b30}>
            {I18n.t('filters.age.header')}
          </Text>
          <Text size={16} lineHeight={19} color={flipFlopColors.b30}>
            {minAge || min} - {maxAge || max}
          </Text>
        </View>
        <View style={styles.sliderWrapper}>
          <MultiSlider
            color={flipFlopColors.green}
            screenPadding={FILTERS_SCREEN_PADDING}
            onValuesChange={onAgeChanged}
            min={min}
            max={max}
            currentMin={minAge || min}
            currentMax={maxAge || max}
          />
        </View>
      </View>
    );
  }
}

AgeFilter.propTypes = {
  minAge: PropTypes.number,
  maxAge: PropTypes.number,
  onAgeChanged: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  currency: state.auth.user.community.destinationPricing.currencyCode,
});

AgeFilter = connect(mapStateToProps)(AgeFilter);
export default AgeFilter;
