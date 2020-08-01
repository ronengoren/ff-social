import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, Keyboard, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {Text, QueryCancelIcon} from '../basicComponents';
// import { initSearchAddress } from '/redux/searchAddress/actions';
import {flipFlopColors, commonStyles} from '../../vars';
import {isRTL} from '../../infra/utils/stringUtils';
import {navigationService} from '../../infra/navigation';
import {screenNames} from '../../vars/enums';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rtlWrapper: {
    flexDirection: 'row-reverse',
  },
  cancelIcon: {
    marginLeft: 10,
    position: 'relative',
    right: 'auto',
    left: 'auto',
    top: 'auto',
    bottom: 'auto',
  },
  rtlCancelIcon: {
    marginLeft: 0,
    marginRight: 10,
  },
});

class LocationInput extends Component {
  render() {
    const {onClearAddress, value, placeholder, height, style} = this.props;
    const isRtl = isRTL(value || placeholder);
    return (
      <TouchableOpacity
        onPress={this.handleAddressLinePressed}
        activeOpacity={0.5}
        style={[styles.wrapper, isRtl && styles.rtlWrapper, {height}, style]}>
        <Text
          size={16}
          lineHeight={19}
          color={value ? flipFlopColors.b30 : flipFlopColors.b60}
          style={commonStyles.flex1}
          numberOfLines={1}
          alignLocale>
          {value || placeholder}
        </Text>
        {!!value && (
          <QueryCancelIcon
            size={18}
            onPress={onClearAddress}
            style={[styles.cancelIcon, isRtl && styles.rtlCancelIcon]}
          />
        )}
      </TouchableOpacity>
    );
  }

  handleAddressLinePressed = () => {
    // const { initSearchAddress, onAddressChosen, community, onPress } = this.props;
    // const { destinationCountryCode, destinationLocation } = community;
    // Keyboard.dismiss();
    // onPress && onPress();
    // initSearchAddress({ country: destinationCountryCode, coordinates: destinationLocation, types: 'geocode|establishment' });
    // navigationService.navigate(screenNames.SearchAddress, { onAddressChosen });
  };
}

LocationInput.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onClearAddress: PropTypes.func,
  onAddressChosen: PropTypes.func,
  community: PropTypes.shape({
    destinationLocation: PropTypes.array,
    destinationCountryCode: PropTypes.string,
  }),
  //   initSearchAddress: PropTypes.func,
  height: PropTypes.number,
  style: PropTypes.object,
  onPress: PropTypes.func,
};

LocationInput.defaultProps = {
  height: 60,
};

const mapStateToProps = (state) => ({
  //   community: state.auth.user.community
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LocationInput);
