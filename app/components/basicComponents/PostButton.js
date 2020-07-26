import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {StyleSheet, TouchableOpacity} from 'react-native';
import I18n from '../../infra/localization';
import {Text, Avatar} from '../basicComponents';
import {flipFlopColors, commonStyles} from '../../vars';
import {stylesScheme} from '../../schemas';
import {entityTypes} from '../../vars/enums';
import {AwesomeIcon} from '../../assets/icons';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    height: 55,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 10,
    elevation: 2,
  },
  secondaryWrapper: {
    flex: 1,
    flexDirection: 'row',
    height: 45,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: flipFlopColors.green,
  },
  postIconSecondary: {
    marginRight: 5,
  },
  textStyle: {
    fontSize: 16,
    lineHeight: 18,
    color: flipFlopColors.b60,
    textAlign: 'left',
    flex: 1,
  },
  avatar: {
    marginLeft: 10,
    marginRight: 10,
  },
  postText: {
    fontWeight: 'bold',
    color: flipFlopColors.azure,
    marginRight: 15,
    fontSize: 15,
  },
  postTextSecondary: {
    fontWeight: 'bold',
    color: flipFlopColors.white,
    fontSize: 15,
  },
});

class PostButton extends React.Component {
  render() {
    const {text, user, onPress, testID, isSecondary, style} = this.props;
    // const {id, themeColor, name, media} = user;
    if (isSecondary) {
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={onPress}
          style={[commonStyles.shadow, styles.secondaryWrapper, style]}>
          <AwesomeIcon
            name="plus-circle"
            size={16}
            weight={'solid'}
            color={flipFlopColors.white}
            style={styles.postIconSecondary}
          />
          <Text style={styles.postTextSecondary} testID={testID}>
            {I18n.t('home.post_button')}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        style={[commonStyles.shadow, styles.wrapper, style]}>
        <Avatar
          style={styles.avatar}
          size="medium1"
          // entityId={id}
          entityType={entityTypes.USER}
          themeColor={themeColor}
          // name={name}
          thumbnail={media ? media.thumbnail : null}
          linkable={false}
        />
        <Text
          numberOfLines={1}
          style={styles.textStyle}
          key="text"
          testID={testID}>
          {text}
        </Text>
        <Text style={styles.postText}>{I18n.t('home.post_button')}</Text>
      </TouchableOpacity>
    );
  }
}

PostButton.defaultProps = {
  testID: 'postButton',
};

PostButton.propTypes = {
  style: stylesScheme,
  text: PropTypes.string,
  // user: PropTypes.object,
  onPress: PropTypes.func,
  testID: PropTypes.string,
  isSecondary: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  // user: state.auth.user,
});

PostButton = connect(mapStateToProps)(PostButton);
export default PostButton;
