import React from 'react';
import {StyleSheet, View, Animated} from 'react-native';
import I18n from '../../../infra/localization';
import {Text} from '../../../components/basicComponents';
import {flipFlopColors} from '../../../vars';

const animationConsts = {
  initialValue: 0,
  targetValue: -6,
  delay: 150,
  duration: 500,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    marginLeft: 15,
    paddingHorizontal: 10,
    borderRadius: 28,
    backgroundColor: flipFlopColors.paleGreyFour,
  },
  text: {
    marginRight: 10,
  },
  bubble: {
    height: 5,
    width: 5,
    borderRadius: 3,
    backgroundColor: flipFlopColors.b60,
    marginRight: 5,
  },
});

class MediaUploadIndicator extends React.Component {
  state = {
    bubblesY: [
      new Animated.Value(animationConsts.initialValue),
      new Animated.Value(animationConsts.initialValue),
      new Animated.Value(animationConsts.initialValue),
    ],
  };

  render() {
    const {bubblesY} = this.state;
    return (
      <View style={styles.container}>
        <Text
          size={12}
          lineHeight={14}
          color={flipFlopColors.b60}
          style={styles.text}>
          {I18n.t('chat.sending_image_text')}
        </Text>
        {bubblesY.map((animatedY, index) => (
          <Animated.View
            key={index}
            style={[styles.bubble, {transform: [{translateY: animatedY}]}]}
          /> // eslint-disable-line react/no-array-index-key
        ))}
      </View>
    );
  }

  componentDidMount() {
    this.animate();
  }

  animate() {
    Animated.stagger(animationConsts.delay, [
      this.animateUpAndDown(0),
      this.animateUpAndDown(1),
      this.animateUpAndDown(2),
    ]).start();
  }

  animateUpAndDown(i) {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.bubblesY[i], {
          toValue: animationConsts.targetValue,
          duration: animationConsts.duration,
          useNativeDriver: true,
        }),
        Animated.timing(this.state.bubblesY[i], {
          toValue: animationConsts.initialValue,
          duration: animationConsts.duration,
          useNativeDriver: true,
        }),
      ]),
    );
  }
}

export default MediaUploadIndicator;
