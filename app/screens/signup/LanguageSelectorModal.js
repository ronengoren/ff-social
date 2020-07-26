import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import I18n from '../../infra/localization';
import {Image, Text, View} from '../../components/basicComponents';
import {flipFlopColors} from '../../vars';

const styles = StyleSheet.create({
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    height: 40,
    marginBottom: 10,
  },
  countryIcon: {
    marginTop: -5,
    width: 25,
    height: 25,
    borderRadius: 25,
    marginLeft: 5,
    marginRight: 10,
  },
  closeButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: flipFlopColors.b80,
    marginTop: 10,
    height: 70,
    marginHorizontal: 15,
  },
});

function LanguageSelectorModal({onSelectLanguage, onClose}) {
  return (
    <View>
      {I18n.languagesDescriptorArray.map(({id, text, icon}) => (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            onSelectLanguage && onSelectLanguage(id);
          }}
          key={id}
          style={styles.languageItem}>
          <Image style={styles.countryIcon} source={{uri: icon}} />
          <Text size={16}>{text}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.closeButton}
        onPress={onClose}>
        <Text size={22} lineHeight={22} color={flipFlopColors.green}>
          {I18n.t('common.buttons.close')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

LanguageSelectorModal.propTypes = {
  onSelectLanguage: PropTypes.func,
  onClose: PropTypes.func,
};

export default React.memo(LanguageSelectorModal);
