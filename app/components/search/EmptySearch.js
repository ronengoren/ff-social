import React from 'react';
import PropTypes from 'prop-types';
import {View, Text} from '../basicComponents';
import {HomeisIcon} from '../../assets/icons';
import {flipFlopColors} from '../../vars';
import {stylesScheme} from '../../schemas/common';

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 50,
  },
  text: {
    paddingTop: 20,
    color: flipFlopColors.placeholderGrey,
    textAlign: 'center',
  },
};

const EmptySearch = ({text, style}) => (
  <View style={[styles.container, style]}>
    <HomeisIcon name="search-big" size={50} color={flipFlopColors.emptyGrey} />
    <Text medium size={22} lineHeight={30} style={styles.text}>
      {text}
    </Text>
  </View>
);

EmptySearch.propTypes = {
  text: PropTypes.string,
  style: stylesScheme,
};

export default EmptySearch;
