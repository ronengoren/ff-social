import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, IconButton} from '../../basicComponents';
import {HomeisIcon} from '../../../assets/icons';
import {flipFlopColors} from '../../../vars';

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 42.5,
  },
  text: {
    marginBottom: 9,
    color: flipFlopColors.placeholderGrey,
    textAlign: 'center',
  },
  retryIconContainer: {
    backgroundColor: flipFlopColors.emptyGrey,
    height: 70,
    width: 70,
    borderRadius: 70,
    marginBottom: 25,
  },
  retryIcon: {
    marginRight: 4,
    marginTop: 2,
  },
};

const ErrorScreen = ({icon, title, content, onRefresh}) => (
  <View style={styles.container}>
    {onRefresh ? (
      <IconButton
        onPress={onRefresh}
        style={styles.retryIconContainer}
        iconStyle={styles.retryIcon}
        iconSize={45}
        name={icon}
        iconColor={'white'}
      />
    ) : (
      <HomeisIcon
        name={icon}
        size={100}
        color={flipFlopColors.emptyGrey}
        style={styles.icon}
      />
    )}
    <Text medium size={22} lineHeight={30} style={styles.text}>
      {title}
    </Text>
    <Text size={15} lineHeight={22} style={styles.text}>
      {content}
    </Text>
  </View>
);

ErrorScreen.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.string,
  onRefresh: PropTypes.func,
};

export default ErrorScreen;
