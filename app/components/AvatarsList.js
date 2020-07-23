import React from 'react';
import PropTypes from 'prop-types';
import {Platform, LayoutAnimation} from 'react-native';
import {View, Avatar} from './basicComponents';
import {flipFlopColors} from '../vars';
import {stylesScheme} from '../schemas';
import {get} from '../infra/utils';

const styles = {
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 50,
    borderColor: flipFlopColors.white,
  },
  separator: {
    position: 'absolute',
    top: -2,
  },
};

const sizeStyles = {
  extraTiny: {
    length: 18,
    borderWidth: 1,
  },
  small1: {
    length: 30,
    borderWidth: 2,
  },
  medium1: {
    length: 30,
    borderWidth: 2,
  },
};

const AVATAR_PADDING = 2;

class AvatarsList extends React.Component {
  render() {
    const {list, style, maxAvatars, size, overlapSize} = this.props;
    if (!list || !list.length) {
      return null;
    }
    const {length} = sizeStyles[size];
    const renderedAvatarCounter = Math.min(list.length, maxAvatars);
    const width =
      (renderedAvatarCounter - 1) * (length * overlapSize + AVATAR_PADDING) +
      length +
      AVATAR_PADDING;

    return (
      <View style={[styles.wrapper, {height: length}, style, {width}]}>
        {this.renderAvatars()}
      </View>
    );
  }

  componentDidUpdate(prevProps) {
    if (
      Platform.OS === 'ios' &&
      get(prevProps, 'list.length') !== get(this.props, 'list.length')
    ) {
      LayoutAnimation.easeInEaseOut();
    }
  }

  renderAvatars() {
    const {list, maxAvatars, size, overlapSize} = this.props;
    const {length, borderWidth} = sizeStyles[size];
    const avatarsToRender = list.slice(0, maxAvatars);

    return avatarsToRender.map((user, index) => (
      <View
        key={user.id}
        style={[
          styles.avatar,
          {
            borderWidth,
            left: index * (length * overlapSize + borderWidth),
            zIndex: maxAvatars - index,
          },
        ]}>
        <Avatar
          size={size}
          entityId={user.id}
          entityType={user.type}
          name={user.name}
          themeColor={user.themeColor}
          thumbnail={user.media.thumbnail}
          linkable={false}
        />
      </View>
    ));
  }
}

AvatarsList.defaultProps = {
  maxAvatars: 4,
  size: 'small1',
  overlapSize: 0.6,
};

AvatarsList.propTypes = {
  style: stylesScheme,
  list: PropTypes.arrayOf(PropTypes.shape(Avatar.propTypes)),
  maxAvatars: PropTypes.number,
  overlapSize: PropTypes.number,
  size: PropTypes.string,
};

export default AvatarsList;
