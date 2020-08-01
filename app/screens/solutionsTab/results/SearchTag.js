import React from 'react';
import PropTypes from 'prop-types';
import {TouchableHighlight, StyleSheet} from 'react-native';

import {View, Text} from '../../../components/basicComponents';
import {flipFlopColors, commonStyles} from '../../../vars';
import {AwesomeIcon} from '../../../assets/icons';
import {isHebrewOrArabic} from '../../../infra/utils/stringUtils';

const styles = StyleSheet.create({
  box: {
    marginHorizontal: 5,
    flexDirection: 'row',
    ...commonStyles.shadow,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 11,
    borderRadius: 10,
    backgroundColor: flipFlopColors.green,
    borderWidth: 1,
    borderColor: flipFlopColors.green,
    shadowColor: flipFlopColors.green,
    shadowRadius: 3,
    shadowOpacity: 0.2,
    marginBottom: 10,
  },
  chipText: {
    margin: 0,
  },
  chipTextHebrew: {
    marginTop: 2,
  },
  cancelIcon: {
    marginLeft: 8,
  },
});

function SearchTag(props) {
  const isHebrewChip = isHebrewOrArabic(props.text);
  return (
    <TouchableHighlight
      activeOpacity={0.75}
      underlayColor={flipFlopColors.transparent}
      onPress={props.onPressCancel}>
      <View key={props.text} style={[styles.box]}>
        <Text
          size={14}
          color={flipFlopColors.white}
          bold
          style={[styles.chipText, isHebrewChip && styles.chipTextHebrew]}>
          {props.text}
        </Text>
        <AwesomeIcon
          name="times-circle"
          size={14}
          color={flipFlopColors.white}
          weight="solid"
          style={styles.cancelIcon}
        />
      </View>
    </TouchableHighlight>
  );
}

SearchTag.propTypes = {
  text: PropTypes.string,
  onPressCancel: PropTypes.func,
};

export default SearchTag;
