import React from 'react';
import PropTypes from 'prop-types';
import {Picker as RnPicker} from 'react-native';

const Picker = ({selectedValue, data, onChange, style}) => (
  <RnPicker
    selectedValue={selectedValue}
    onValueChange={(value) => onChange(value)}
    style={style}>
    {data.map((item) => (
      <RnPicker.Item key={item.label} label={item.label} value={item.value} />
    ))}
  </RnPicker>
);

Picker.propTypes = {
  selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ),
  onChange: PropTypes.func.isRequired,
  style: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
};

export default Picker;
