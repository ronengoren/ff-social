import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native';
import {BoldedText} from '../basicComponents';
import {FlipFlopIcon} from '../../assets/icons';
import {flipFlopColors} from '../../vars';
import {removeAddressSuffix} from '../../infra/utils/addressUtils';
import {stylesScheme} from '../../schemas';

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    height: 50,
    paddingRight: 60,
  },
  containerBorder: {
    borderBottomWidth: 1,
    borderBottomColor: flipFlopColors.disabledGrey,
  },
  icon: {
    marginRight: 15,
  },
};

const SearchAddressResultRow = ({
  searchQuery,
  searchResult,
  renderIcon,
  onPress,
  testID,
  withBorderBetweenItems,
  style,
}) => (
  <TouchableOpacity
    activeOpacity={0.75}
    onPress={() => onPress(searchResult)}
    testID={testID}
    style={[
      styles.container,
      withBorderBetweenItems && stylesScheme.containerBorder,
      style,
    ]}>
    {renderIcon && renderIcon({query: searchQuery})}
    <BoldedText
      text={removeAddressSuffix(searchResult.description)}
      BoldedText={searchQuery}
    />
  </TouchableOpacity>
);

SearchAddressResultRow.ITEM_HEIGHT = 61;

SearchAddressResultRow.defaultProps = {
  renderIcon: () => (
    <FlipFlopIcon
      name="location"
      size={20}
      color={flipFlopColors.emptyGrey}
      style={styles.icon}
    />
  ),
  withBorderBetweenItems: true,
};

SearchAddressResultRow.propTypes = {
  withBorderBetweenItems: PropTypes.bool,
  searchResult: PropTypes.object,
  searchQuery: PropTypes.string,
  onPress: PropTypes.func,
  renderIcon: PropTypes.func,
  testID: PropTypes.string,
  style: stylesScheme,
};

export default SearchAddressResultRow;
