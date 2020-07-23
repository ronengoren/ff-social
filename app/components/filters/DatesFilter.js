import React, {Component} from 'react';
import {
  StyleSheet,
  Platform,
  TouchableOpacity,
  DatePickerIOS,
} from 'react-native'; // eslint-disable-line react-native/split-platform-components
import I18n from '../../infra/localization';
import PropTypes from 'prop-types';
import {NativeDateTimePickerAndroid} from '../../components';
import {Text, View} from '../basicComponents';
import {flipFlopColors} from '../../vars';
import {translateDate} from '../../infra/utils/dateTimeUtils';
import {dateTimeSelectorModes as selectorModes} from '../../vars/enums';

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 65,
    borderBottomWidth: 1,
    borderBottomColor: flipFlopColors.b90,
  },
  pickersWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  picker: {
    flex: 1,
    height: 215,
  },
});

class DatesFilter extends Component {
  state = {
    selectorMode: selectorModes.startDate,
  };

  render() {
    const {startDate, endDate} = this.props;
    const {selectorMode} = this.state;
    const isStartDataActive = selectorMode === selectorModes.startDate;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={this.getAction(selectorModes.startDate)}
          activeOpacity={1}
          style={styles.row}>
          <Text size={16} lineHeight={19} color={flipFlopColors.b30}>
            {I18n.t('filters.dates.from')}
          </Text>
          <Text
            size={16}
            lineHeight={19}
            color={
              isStartDataActive ? flipFlopColors.green : flipFlopColors.b30
            }>
            {translateDate(startDate)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.getAction(selectorModes.endDate)}
          activeOpacity={1}
          style={styles.row}>
          <Text size={16} lineHeight={19} color={flipFlopColors.b30}>
            {I18n.t('filters.dates.to')}
          </Text>
          <Text
            size={16}
            lineHeight={19}
            color={
              !isStartDataActive ? flipFlopColors.green : flipFlopColors.b30
            }>
            {endDate ? translateDate(endDate) : ''}
          </Text>
        </TouchableOpacity>

        {Platform.OS === 'ios' && (
          <View style={styles.pickersWrapper}>
            <DatePickerIOS
              date={isStartDataActive ? startDate : endDate}
              mode="date"
              onDateChange={this.onDateChange}
              minimumDate={this.getMinimumDate(selectorMode)}
              style={styles.picker}
            />
          </View>
        )}
      </View>
    );
  }

  getAction = (selectorMode) =>
    Platform.select({
      ios: () => this.setSelectorMode(selectorMode),
      android: () => this.openNativeDateTimePickerAndroid(selectorMode),
    });

  getMinimumDate(field) {
    const {startDate} = this.props;
    let minimumDate = new Date();
    if (field === selectorModes.endDate && startDate) {
      minimumDate = new Date(startDate);
      minimumDate.setDate(minimumDate.getDate() + 1);
    }

    return minimumDate;
  }

  openNativeDateTimePickerAndroid(field) {
    const {onDatesChanged, startDate} = this.props;
    this.setState({selectorMode: field});
    let date;
    if (field === selectorModes.endDate) {
      date = this.getEndDate(field);
      onDatesChanged({
        startDate,
        endDate: this.getEndDate(selectorModes.endDate),
      });
    } else {
      date = this.state.startDate;
    }

    NativeDateTimePickerAndroid.openDateOnly({
      date,
      onSelected: this.onAndroidDateChange(field),
      minDate: this.getMinimumDate(field),
    });
  }

  setSelectorMode = (selectorMode) => {
    const {onDatesChanged, startDate} = this.props;
    this.setState({selectorMode});
    onDatesChanged({startDate, endDate: this.getEndDate(selectorMode)});
  };

  getEndDate = (field) => {
    const {startDate, endDate} = this.props;
    let newEndDate = endDate;
    if (field === selectorModes.endDate && !endDate) {
      newEndDate = new Date(startDate);
      newEndDate.setDate(startDate.getDate() + 1);
    }
    return newEndDate;
  };

  onAndroidDateChange = (field) => ({year, month, day}) => {
    const date = new Date(year, month, day);
    this.updateDates(field, date);
  };

  onDateChange = (date) => {
    const {selectorMode} = this.state;
    this.updateDates(selectorMode, date);
  };

  updateDates(field, date) {
    const {onDatesChanged, startDate, endDate} = this.props;
    if (field === selectorModes.startDate && endDate && date > endDate) {
      const newEndDate = new Date(date);
      newEndDate.setDate(date.getDate() + 1);
      onDatesChanged({startDate: date, endDate: newEndDate});
    } else {
      const updatedDate = {startDate, endDate};
      updatedDate[field] = date;
      onDatesChanged(updatedDate);
    }
  }
}

DatesFilter.propTypes = {
  onDatesChanged: PropTypes.func.isRequired,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
};

export default DatesFilter;
