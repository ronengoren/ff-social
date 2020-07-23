import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from '../basicComponents';
import {HomeisIcon} from '../../assets/icons';
import {flipFlopColors} from '../../vars';
import {removeAddressSuffix} from '../../infra/utils/addressUtils';
import {navigationService} from '../../infra/navigation';

const styles = StyleSheet.create({
  iconLocation: {
    marginRight: 5,
    marginLeft: -3,
    lineHeight: 26,
  },
  detailsRowText: {
    flex: 1,
  },
  detailsRow: {
    flex: 1,
    flexDirection: 'row',
  },
});

class PostContentLocation extends React.Component {
  render() {
    const {location} = this.props;
    const {placeName, fullAddress, coordinates} = location;

    if (!placeName && !fullAddress) {
      return null;
    } else {
      return (
        <TouchableOpacity
          onPress={
            coordinates && coordinates.length === 2 ? this.navigateToMap : null
          }
          style={styles.detailsRow}
          activeOpacity={1}>
          <HomeisIcon
            name="location"
            style={styles.iconLocation}
            color={flipFlopColors.b70}
            size={18}
          />
          <Text
            size={16}
            lineHeight={26}
            color={flipFlopColors.b30}
            numberOfLines={1}
            forceLTR
            style={styles.detailsRowText}>
            {fullAddress ? removeAddressSuffix(fullAddress) : placeName}
          </Text>
        </TouchableOpacity>
      );
    }
  }

  navigateToMap = () => {
    const {title, location} = this.props;
    navigationService.navigateToMap({title, location});
  };
}

PostContentLocation.propTypes = {
  location: PropTypes.object,
  title: PropTypes.string,
};

export default PostContentLocation;
