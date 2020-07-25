import React, {Component} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import I18n from '../../infra/localization';
import {View, Text, Image} from '../../components/basicComponents';
import {flipFlopColors} from '../../vars';
import {uiConstants} from '../../vars/uiConstants';
import images from '../../assets/images';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  containerSmall: {
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  text: {
    marginBottom: 5,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 200,
  },
  imageSmall: {
    height: 140,
  },
});

class EmptyList extends Component {
  render() {
    const {height} = Dimensions.get('window');
    const smallScreen = height <= uiConstants.NORMAL_DEVICE_HEIGHT;

    return (
      <React.Fragment>
        <View style={[styles.container, smallScreen && styles.containerSmall]}>
          <Text
            bold
            size={24}
            lineHeight={38}
            color={flipFlopColors.b70}
            style={styles.text}>
            {I18n.t('communication_center.notifications.empty_state.title')}
          </Text>
          <Text
            size={16}
            lineHeight={22}
            color={flipFlopColors.b70}
            style={styles.text}>
            {I18n.t('communication_center.notifications.empty_state.body')}
          </Text>
        </View>
        <Image
          source={images.notification.empty}
          resizeMode="contain"
          style={[styles.image, smallScreen && styles.imageSmall]}
        />
      </React.Fragment>
    );
  }
}

export default EmptyList;
