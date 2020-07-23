import React, {Component} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import PropTypes from 'prop-types';
import RNMultiSlider from '@ptomasroos/react-native-multi-slider';
import {flipFlopColors} from '../../vars';

const SLIDER_MARKER_OVERFLOW = 15;

const styles = StyleSheet.create({
  sliderMarker: {
    height: 30,
    width: 30,
    borderRadius: 30,
    borderWidth: 0,
    shadowColor: flipFlopColors.boxShadow,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
  sliderTrack: {
    height: 5,
    backgroundColor: flipFlopColors.b90,
  },
  sliderUnselected: {
    backgroundColor: flipFlopColors.b90,
  },
});

class MultiSlider extends Component {
  render() {
    const {
      screenPadding,
      min,
      max,
      currentMin,
      currentMax,
      onValuesChange,
      color,
    } = this.props;

    const sliderWidth =
      Dimensions.get('window').width -
      (SLIDER_MARKER_OVERFLOW + screenPadding) * 2;
    const markerStyle = [
      styles.sliderMarker,
      {
        backgroundColor: color,
        borderColor: color,
        marginTop: 3,
      },
    ];

    return (
      <RNMultiSlider
        sliderLength={sliderWidth}
        values={[currentMin, currentMax]}
        onValuesChange={onValuesChange}
        min={min}
        max={max}
        step={1}
        snapped
        selectedStyle={{
          backgroundColor: color,
        }}
        unselectedStyle={styles.sliderUnselected}
        trackStyle={styles.sliderTrack}
        pressedMarkerStyle={markerStyle}
        markerStyle={markerStyle}
      />
    );
  }
}

MultiSlider.propTypes = {
  color: PropTypes.string,
  onValuesChange: PropTypes.func.isRequired,
  currentMin: PropTypes.number,
  currentMax: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  screenPadding: PropTypes.number,
};

export default MultiSlider;
