import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from '../../../components/basicComponents';
import {flipFlopColors} from '../../../vars';
import {solutionScheme} from '../../../schemas/common';

const styles = StyleSheet.create({
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 10,
    backgroundColor: flipFlopColors.white,
    marginRight: 10,
    marginBottom: 10,
    borderColor: flipFlopColors.b90,
    borderWidth: 1,
  },
});

function TagView({item, onPress}) {
  const {name, tagName} = item;

  return (
    <TouchableOpacity style={[styles.box]} onPress={onPress}>
      <Text size={14} color={flipFlopColors.b30} center>
        {name || tagName}
      </Text>
    </TouchableOpacity>
  );
}

TagView.propTypes = {
  onPress: PropTypes.func,
  item: solutionScheme,
};

export default TagView;
