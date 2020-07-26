import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import I18n from '../../infra/localization';
import {Text, View} from '../../components/basicComponents';
import {flipFlopColors} from '/vars';
import CountryIcon from './CountryIcon';

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: flipFlopColors.white,
    margin: 15,
    borderRadius: 10,
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 30,
    paddingBottom: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryIcon: {
    height: 50,
    width: 50,
    borderRadius: 40,
  },
  countryIconsWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  lastCountryIcon: {
    marginLeft: -7,
  },
  questionWrapper: {
    marginTop: 31,
    width: 236,
  },
  baseActionButton: {
    width: '100%',
    marginRight: 15,
    marginLeft: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  originalMove: {
    backgroundColor: flipFlopColors.green,
    height: 50,
    marginTop: 30,
    borderRadius: 10,
  },
  originalMoveText: {
    color: flipFlopColors.white,
  },
  reverseMove: {
    height: 60,
  },
  reverseMoveText: {
    color: flipFlopColors.green,
  },
});

function ReversedNationalityModal({
  originCountry,
  destinationCountry,
  onOriginalNationalityPress,
  onReversedNationalityPress,
}) {
  const {
    name: originCountryName,
    nationality: originCountryNationality,
  } = originCountry;
  const {
    name: destinationCountryName,
    nationality: destinationCountryNationality,
  } = destinationCountry;
  return (
    <View style={styles.modalContent}>
      <View style={styles.countryIconsWrapper}>
        <CountryIcon country={destinationCountry} style={styles.countryIcon} />
        <CountryIcon
          country={originCountry}
          style={[styles.countryIcon, styles.lastCountryIcon]}
        />
      </View>
      <View style={styles.questionWrapper}>
        <Text center size={16} lineHeight={22} style={styles.questionText}>
          {I18n.t(
            'onboarding.set_user_nationality.reversed_nationality.question',
            {originCountryName, destinationCountryName},
          )}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.originalMove, styles.baseActionButton]}
        activeOpacity={0.5}
        onPress={onReversedNationalityPress}>
        <Text bold size={16} style={styles.originalMoveText}>
          {I18n.t(
            'onboarding.set_user_nationality.reversed_nationality.move_from_to',
            {
              originCountryNationality: `${I18n.getLinkWordPlaceholder({
                linkTo: destinationCountryNationality,
              })} ${destinationCountryNationality}`,
              destinationCountryName: originCountryName,
            },
          )}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.reverseMove, styles.baseActionButton]}
        activeOpacity={0.5}
        onPress={onOriginalNationalityPress}>
        <Text size={16} style={styles.reverseMoveText}>
          {I18n.t(
            'onboarding.set_user_nationality.reversed_nationality.move_from_to',
            {
              originCountryNationality: `${I18n.getLinkWordPlaceholder({
                linkTo: originCountryNationality,
              })} ${originCountryNationality}`,
              destinationCountryName,
            },
          )}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

ReversedNationalityModal.propTypes = {
  originCountry: PropTypes.object,
  destinationCountry: PropTypes.object,
  onOriginalNationalityPress: PropTypes.func,
  onReversedNationalityPress: PropTypes.func,
};

export default React.memo(ReversedNationalityModal);
