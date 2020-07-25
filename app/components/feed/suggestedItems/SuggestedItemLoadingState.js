import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {View, PlaceholderRectangle} from '../../basicComponents';
import {flipFlopColors} from '../../../vars/colors';
import {random} from '../../../infra/utils';
import {stylesScheme} from '../../../schemas';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 15,
  },
  baseCard: {
    height: 270,
    width: 210,
    borderRadius: 10,
    marginTop: 10,
    marginRight: 15,
    marginBottom: 15,
    shadowColor: flipFlopColors.boxShadow,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
    backgroundColor: flipFlopColors.white,
    elevation: 1,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  smallUnifiedLookCard: {
    width: 140,
    height: 160,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  smallActionlessCard: {
    width: 140,
    height: 160,
  },
  baseAvatarPlaceholder: {
    width: '100%',
    height: 160,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: flipFlopColors.b70,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  smallUnifiedLookAvatarPlaceholder: {
    height: 110,
    backgroundColor: flipFlopColors.fillGrey,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  smallActionlessAvatarPlaceholder: {
    height: 90,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  bottomSection: {
    borderTopWidth: 1,
    borderTopColor: flipFlopColors.paleGrey,
    paddingHorizontal: 10,
    paddingTop: 10,
    marginBottom: 10,
  },
});

const SuggestedItemLoadingState = (props) => {
  const {size, placeholderStyle, style} = props;
  const renderCard = () => (
    <View style={[styles.baseCard, styles[`${size}Card`] || {}, style]}>
      <View
        style={[
          styles.baseAvatarPlaceholder,
          styles[`${size}AvatarPlaceholder`] || {},
          placeholderStyle,
        ]}
      />
      <View style={styles.bottomSection}>
        <PlaceholderRectangle width={`${random(40, 90, false)}%`} height={8} />
        <PlaceholderRectangle
          width={`${random(40, 90, false)}%`}
          height={8}
          borderRadius={3}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderCard(size)}
      {renderCard(size)}
      {renderCard(size)}
      {renderCard(size)}
    </View>
  );
};

SuggestedItemLoadingState.propTypes = {
  style: stylesScheme,
  placeholderStyle: stylesScheme,
  size: PropTypes.string,
};

export default SuggestedItemLoadingState;
