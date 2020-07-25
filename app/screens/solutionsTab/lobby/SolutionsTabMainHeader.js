import React from 'react';
import {StyleSheet} from 'react-native';
import I18n from '/infra/localization';
import {View, Text} from '../../../components/basicComponents';
import {flipFlopColors} from '../../../vars';

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 75,
  },
  title: {
    paddingHorizontal: 15,
    textAlign: 'left',
  },
});

function SolutionsTabMainHeader(props) {
  return (
    <View style={styles.wrapper} {...props}>
      <Text
        size={28}
        lineHeight={34}
        color={flipFlopColors.b30}
        bolder
        style={styles.title}>
        {I18n.t('solutions.lobby.title')}
      </Text>
    </View>
  );
}

export default SolutionsTabMainHeader;
