import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import I18n from '../../../infra/localization';
import {
  View,
  Text,
  Avatar,
  Triangle,
  Image,
} from '../../../components/basicComponents';
import {flipFlopColors} from '../../../vars';
import images from '../../../assets/images';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: flipFlopColors.white,
  },
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
  },
  iconWrapper: {
    paddingLeft: 12,
    marginRight: 10,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    width: 60,
    backgroundColor: flipFlopColors.azure,
    borderRadius: 9,
    borderBottomLeftRadius: 0,
  },
  icon: {
    width: 30,
    height: 30,
  },
  iconTriangle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  text: {
    fontSize: 16,
    color: flipFlopColors.placeholderGrey,
    textAlign: 'center',
    lineHeight: 25,
    width: 200,
  },
});

class EmptyList extends Component {
  render() {
    const {participantId, participantName, participantAvatar} = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.imagesContainer}>
          <View style={styles.iconWrapper}>
            <View style={styles.iconContainer}>
              <Image style={styles.icon} source={images.chat.hey} />
            </View>
            <Triangle
              style={styles.iconTriangle}
              direction="down-right"
              width={12}
              height={12}
              color={flipFlopColors.azure}
            />
          </View>
          <Avatar
            size="large"
            style={styles.avatar}
            entityId={participantId}
            entityType="user"
            name={participantName}
            thumbnail={participantAvatar}
          />
        </View>
        <Text medium style={styles.text}>
          {I18n.t('chat.empty_state', {participantName})}
        </Text>
      </View>
    );
  }
}

EmptyList.propTypes = {
  participantAvatar: PropTypes.string,
  participantName: PropTypes.string,
  participantId: PropTypes.string,
};

export default EmptyList;
