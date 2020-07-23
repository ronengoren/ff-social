import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {View, Text, IconButton} from '../../components/basicComponents';
import {uiConstants, commonStyles} from '../../vars';

const styles = StyleSheet.create({
  container: {
    paddingTop: 10 + uiConstants.PHONE_BAR_HEIGHT_TRANSLUCENT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  containerPadding15: {
    paddingHorizontal: 15,
  },
  noBtnSpacing: {
    width: 24,
  },
  settingsBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 15,
  },
  text: {
    flex: 1,
    textAlign: 'center',
    marginLeft: -13,
  },
});

class ProfileHeaderButtons extends Component {
  render() {
    const {isViewingOwnProfile} = this.props;
    const {
      text,
      navigateBack,
      openProfileActionsheet,
      hasProfileData,
      isRenderedInHeader,
    } = this.props;
    let iconColor = 'white';
    if (!isRenderedInHeader) {
      iconColor = 'black';
    }
    if (!hasProfileData) {
      iconColor = 'disabledGrey';
    }

    return (
      <View
        style={[
          styles.container,
          isRenderedInHeader && styles.containerPadding15,
        ]}>
        <IconButton
          name="back-arrow"
          onPress={hasProfileData ? navigateBack : null}
          iconColor={iconColor}
          iconSize={24}
        />
        {!isRenderedInHeader && !!text && this.renderText()}
        {!isViewingOwnProfile && (
          <IconButton
            name="more"
            onPress={hasProfileData ? openProfileActionsheet : null}
            iconColor={iconColor}
            iconSize={24}
          />
        )}
      </View>
    );
  }

  renderOwnHeaderButtons() {
    const {
      text,
      hasProfileData,
      isRenderedInHeader,
      handleSettingsPress,
      handleSettingsLongPress,
    } = this.props;

    if (isRenderedInHeader) {
      return (
        <IconButton
          name="more"
          onPress={hasProfileData ? handleSettingsPress : null}
          onLongPress={hasProfileData ? handleSettingsLongPress : null}
          iconColor={hasProfileData ? 'b60' : 'disabledGrey'}
          iconSize={30}
          style={[styles.settingsBtn, commonStyles.shadow]}
        />
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.noBtnSpacing} />
        {!!text && this.renderText()}
        <IconButton
          name="more"
          onPress={hasProfileData ? handleSettingsPress : null}
          onLongPress={hasProfileData ? handleSettingsLongPress : null}
          iconColor={hasProfileData ? 'black' : 'disabledGrey'}
          iconSize={24}
        />
      </View>
    );
  }

  renderText() {
    const {text} = this.props;

    return (
      <Text style={styles.text} bold size={16}>
        {text}
      </Text>
    );
  }
}

ProfileHeaderButtons.propTypes = {
  text: PropTypes.string,
  isViewingOwnProfile: PropTypes.bool,
  isRenderedInHeader: PropTypes.bool,
  navigateBack: PropTypes.func,
  openProfileActionsheet: PropTypes.func,
  handleSettingsPress: PropTypes.func,
  handleSettingsLongPress: PropTypes.func,
  hasProfileData: PropTypes.bool,
};

export default ProfileHeaderButtons;
