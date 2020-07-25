import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {View, Text, TranslatedText} from '../../components/basicComponents';
import {flipFlopColors, commonStyles} from '../../vars';
import I18n from '../../infra/localization';

const styles = StyleSheet.create({
  blockMessage: {
    padding: 20,
    marginTop: 20,
    backgroundColor: flipFlopColors.paleGreyTwo,
    borderWidth: 1,
    borderColor: flipFlopColors.b90,
  },
  blockActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blockBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    fontSize: 22,
  },
  blockActionsSeparator: {
    width: 1,
    height: 30,
    backgroundColor: flipFlopColors.b90,
  },
});

function BlockMessage({
  participantFullName,
  toggleChatUserBlocking,
  handleAllowClick,
}) {
  return (
    <View>
      <View style={styles.blockMessage}>
        <TranslatedText style={commonStyles.textAlignCenter}>
          {I18n.t('chat.block.message', {participantFullName})}
        </TranslatedText>
      </View>
      <View style={styles.blockActionsRow}>
        <TouchableOpacity
          style={styles.blockBtn}
          accessibilityTraits="button"
          accessibilityComponentType="button"
          activeOpacity={1}
          onPress={toggleChatUserBlocking}>
          <Text color={flipFlopColors.red} bold>
            {I18n.t('chat.block.decline_button')}
          </Text>
        </TouchableOpacity>
        <View style={styles.blockActionsSeparator} />
        <TouchableOpacity
          style={styles.blockBtn}
          accessibilityTraits="button"
          accessibilityComponentType="button"
          activeOpacity={1}
          onPress={handleAllowClick}>
          <Text color={flipFlopColors.azure} bold>
            {I18n.t('chat.block.allow_button')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

BlockMessage.propTypes = {
  participantFullName: PropTypes.string,
  toggleChatUserBlocking: PropTypes.func,
  handleAllowClick: PropTypes.func,
};

export default BlockMessage;
