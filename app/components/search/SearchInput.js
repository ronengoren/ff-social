import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {View, TextInput, Text, QueryCancelIcon} from '../basicComponents';
import {AwesomeIcon} from '../../assets/icons';
import {isRTL} from '../../infra/utils/stringUtils';
import {flipFlopColors} from '../../vars';

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: '100%',
    padding: 0,
    paddingRight: 20,
    paddingLeft: 15,
    fontSize: 16,
    lineHeight: 19,
    color: flipFlopColors.b30,
    borderRadius: 10,
    textAlign: 'left',
  },
  cancelIcon: {
    top: 15,
    right: 10,
  },
  placeholderWrapper: {
    position: 'absolute',
    left: 15,
    flexDirection: 'row',
  },
  placeholderWrapperRTL: {
    position: 'absolute',
    right: 15,
    flexDirection: 'row-reverse',
  },
  searchIcon: {
    lineHeight: 40,
    marginRight: 10,
  },
  searchIconRTL: {
    lineHeight: 40,
    marginLeft: 10,
  },
  inputPlaceholder: {
    lineHeight: 40,
  },
  inputPlaceholderRTL: {
    textAlign: 'right',
    lineHeight: 40,
  },
});

function SearchInput({value, onCancel, placeholderText = '', ...restProps}) {
  const inputRef = useRef();
  const isRTLText = isRTL(placeholderText);

  return (
    <View>
      <TextInput
        ref={inputRef}
        value={value}
        inputStyle={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        {...restProps}
      />
      {!!value && (
        <QueryCancelIcon
          onPress={onCancel}
          iconColor={flipFlopColors.b60}
          style={styles.cancelIcon}
        />
      )}
      {!value && (
        <TouchableOpacity
          onPress={() => inputRef.current.focus()}
          activeOpacity={1}
          style={
            isRTLText ? styles.placeholderWrapperRTL : styles.placeholderWrapper
          }>
          <AwesomeIcon
            name="search"
            size={16}
            color={flipFlopColors.b70}
            weight="light"
            style={isRTLText ? styles.searchIconRTL : styles.searchIcon}
          />
          <Text
            size={16}
            color={flipFlopColors.b70}
            style={[
              styles.inputPlaceholder,
              isRTLText && styles.inputPlaceholderRTL,
            ]}
            numberOfLines={1}>
            {placeholderText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

SearchInput.propTypes = {
  value: PropTypes.string,
  onCancel: PropTypes.func,
  placeholderText: PropTypes.string,
};

export default SearchInput;
