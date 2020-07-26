import React, {Component} from 'react';
import I18n from '../../infra/localization';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {View, Text, Image} from '../basicComponents';
import images from '../../assets/images';
import {flipFlopColors} from '../../vars';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  avatarsImage: {
    width: 240,
    height: 65,
    marginBottom: 18,
    marginLeft: 8,
  },
  title: {
    marginBottom: 6,
  },
  description: {
    textAlign: 'center',
    marginBottom: 13,
  },
  explanationLink: {
    textAlign: 'center',
  },
});

class ReferralProgramAnnotation extends Component {
  render() {
    const {
      isWithExplanationLink,
      onShowExplanationPress,
      maxToRedeem,
      isBright,
    } = this.props;

    return (
      <View style={styles.container}>
        <Image
          source={images.people.referral_program_people}
          style={styles.avatarsImage}
        />
        <Text
          size={20}
          lineHeight={21}
          color={isBright ? flipFlopColors.white : flipFlopColors.realBlack}
          bold
          style={styles.title}>
          {I18n.t('people.referral_program_invite_annotation.title', {
            sum: maxToRedeem,
          })}
        </Text>
        <Text
          size={16}
          lineHeight={22}
          color={isBright ? flipFlopColors.white : flipFlopColors.b30}
          style={styles.description}>
          {I18n.t('people.referral_program_invite_annotation.desc_line')}
        </Text>
        {!!isWithExplanationLink && (
          <Text
            size={16}
            lineHeight={22}
            color={flipFlopColors.green}
            style={styles.explanationLink}
            onPress={onShowExplanationPress}>
            {I18n.t(
              'people.referral_program_invite_annotation.explanation_link',
            )}
          </Text>
        )}
      </View>
    );
  }
}

ReferralProgramAnnotation.propTypes = {
  isWithExplanationLink: PropTypes.bool,
  onShowExplanationPress: PropTypes.func,
  maxToRedeem: PropTypes.number,
  isBright: PropTypes.bool,
};

export default ReferralProgramAnnotation;
