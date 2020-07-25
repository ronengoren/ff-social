import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, Animated} from 'react-native';
import {Avatar, Text} from '../../../components/basicComponents';
import i18n from '../../../infra/localization';
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
    height: 30,
  },
  bubblesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 45,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 28,
    backgroundColor: flipFlopColors.paleGreyFour,
  },
  bubble: {
    height: 5,
    width: 5,
    borderRadius: 3,
    backgroundColor: flipFlopColors.b60,
    marginRight: 5,
  },
});

class TypingIndicator extends Component {
  state = {
    bubblesY: [
      new Animated.Value(animationConsts.initialValue),
      new Animated.Value(animationConsts.initialValue),
      new Animated.Value(animationConsts.initialValue),
    ],
  };

  render() {
    const {bubblesY} = this.state;
    const {user} = this.props;
    const {image, name, shouldDisplayName} = user;
    return (
      <View style={styles.container}>
        <Avatar
          size="small1"
          style={styles.image}
          entityId={''}
          entityType="user"
          name={name}
          thumbnail={image}
        />
        <View style={styles.bubblesContainer}>
          {bubblesY.map((animatedY, index) => (
            <Animated.View
              key={index}
              style={[styles.bubble, {transform: [{translateY: animatedY}]}]}
            /> // eslint-disable-line react/no-array-index-key
          ))}
        </View>
        {!!shouldDisplayName && (
          <Text lineHeight={30}>{i18n.t('chat.typing', {name})}</Text>
        )}
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

TypingIndicator.propTypes = {
  user: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string.isRequired,
    shouldDisplayName: PropTypes.bool,
  }),
};

export default TypingIndicator;
