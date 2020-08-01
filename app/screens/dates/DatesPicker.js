import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Platform,
  TouchableOpacity,
  DatePickerIOS,
  LayoutAnimation,
  Animated,
} from 'react-native'; // eslint-disable-line react-native/split-platform-components
import I18n from '../../infra/localization';
import {Screen, NativeDateTimePickerAndroid} from '../../components';
import {
  View,
  Text,
  TextButton,
  QueryCancelIcon,
} from '../../components/basicComponents';
import {flipFlopColors, flipFlopFonts, flipFlopFontsWeights} from '../../vars';
import {dateTimeSelectorModes as selectorModes} from '../../vars/enums';
import {
  translateDateTimeAMPM,
  translateDate,
} from '../../infra/utils/dateTimeUtils';
import {navigationService} from '../../infra/navigation';

const LABEL_BOTTOM_TOP = 32;
const LABEL_BOTTOM_CENTER = 8;
const LABEL_FONT_SIZE_TOP = 12;
const LABEL_FONT_SIZE_CENTER = 16;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputsWrapper: {
    marginVertical: 30,
    marginHorizontal: 20,
  },
  fakeInputWrapper: {
    height: 65,
    borderBottomWidth: 2,
    borderColor: flipFlopColors.disabledGrey,
    paddingBottom: 1,
    marginBottom: 10,
  },
  fakeInputText: {
    position: 'absolute',
    bottom: 0,
    height: 35,
    lineHeight: 35,
    fontSize: 16,
    color: flipFlopColors.black,
  },
  pickersWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  picker: {
    flex: 1,
    height: 215,
  },
  saveBtn: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  label: {
    color: flipFlopColors.b60,
    position: 'absolute',
    left: Platform.select({ios: 0, android: 4}),
    paddingBottom: 1,
    fontFamily: flipFlopFonts.regular,
    fontWeight: flipFlopFontsWeights.regular,
  },
  cancelIcon: {
    top: 38,
    right: 5,
  },
});

class DatesPicker extends React.Component {
  static modes = {
    date: 'date',
    datetime: 'datetime',
  };

  constructor(props) {
    super(props);

    const {
      startDate,
      endDate,
      startDateOnly,
      focusOn,
      mode = DatesPicker.modes.date,
    } = props.navigation.state.params;
    const initialStartsOnDate = startDate ? new Date(startDate) : new Date();

    let initialEndsOnDate;
    if (!startDateOnly) {
      if (endDate) {
        initialEndsOnDate = new Date(endDate);
      } else {
        initialEndsOnDate = new Date();
        initialEndsOnDate.setDate(initialStartsOnDate.getDate() + 1);
      }
    }

    this.state = {
      selectorMode: focusOn || selectorModes.startDate,
      startDate: initialStartsOnDate,
      startDateLabelBottom: new Animated.Value(
        initialStartsOnDate ? LABEL_BOTTOM_TOP : LABEL_BOTTOM_CENTER,
      ),
      startDateLabelFontSize: new Animated.Value(
        initialStartsOnDate ? LABEL_FONT_SIZE_TOP : LABEL_FONT_SIZE_CENTER,
      ),
      endDate: initialEndsOnDate,
      endDateLabelBottom: new Animated.Value(
        initialEndsOnDate ? LABEL_BOTTOM_TOP : LABEL_BOTTOM_CENTER,
      ),
      endDateLabelFontSize: new Animated.Value(
        initialEndsOnDate ? LABEL_FONT_SIZE_TOP : LABEL_FONT_SIZE_CENTER,
      ),
      mode,
    };
  }

  render() {
    const {
      color = flipFlopColors.green,
      startDateOnly,
    } = this.props.navigation.state.params;
    const {selectorMode, mode} = this.state;
    const currentDate = this.state[selectorMode] || new Date();
    return (
      <View style={styles.container}>
        <View style={styles.inputsWrapper}>
          {this.renderDateField(selectorModes.startDate)}
          {!startDateOnly && this.renderDateField(selectorModes.endDate)}
        </View>
        {Platform.OS === 'ios' && (
          <View style={styles.pickersWrapper}>
            <DatePickerIOS
              date={currentDate}
              mode={mode}
              onDateChange={this.onDateChange}
              minimumDate={this.getMinimumDate(selectorMode)}
              style={styles.picker}
            />
          </View>
        )}
        <View style={styles.saveBtn}>
          <TextButton
            style={{backgroundColor: color, borderColor: color}}
            footerButton
            size="huge"
            onPress={this.onSave}
            testID="datesPickerSaveButton">
            {I18n.t('post_editor.dates_editor.save_button')}
          </TextButton>
        </View>
      </View>
    );
  }

  animateLabel = (key, to) => {
    Animated.timing(this.state[key], {
      toValue: to,
      duration: 300,
    }).start();
  };

  renderDateField(currentSelectorMode) {
    const {color} = this.props.navigation.state.params;
    const {selectorMode} = this.state;
    const date = this.state[currentSelectorMode];
    const labelBottom = this.state[`${currentSelectorMode}LabelBottom`];
    const labelFontSize = this.state[`${currentSelectorMode}LabelFontSize`];
    const isStartDate = currentSelectorMode === selectorModes.startDate;

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={Platform.select({
          ios: () => this.setSelectorMode(currentSelectorMode),
          android: () =>
            this.openNativeDateTimePickerAndroid(currentSelectorMode),
        })}
        style={[
          styles.fakeInputWrapper,
          selectorMode === currentSelectorMode && {
            borderColor: color || flipFlopColors.green,
          },
        ]}>
        <Animated.Text
          style={[
            styles.label,
            {bottom: labelBottom, fontSize: labelFontSize},
          ]}>
          {I18n.t(
            `post_editor.dates_editor.${isStartDate ? 'starts' : 'ends'}_on`,
          )}
        </Animated.Text>
        {date && (
          <Text style={styles.fakeInputText}>
            {this.getDateTimeByMode(date)}
          </Text>
        )}
        {date && (
          <QueryCancelIcon
            size={16}
            onPress={() => this.clearDate(currentSelectorMode, date)}
            style={styles.cancelIcon}
          />
        )}
      </TouchableOpacity>
    );
  }

  getDateTimeByMode(date) {
    const {mode} = this.state;
    if (mode === DatesPicker.modes.datetime) {
      return translateDateTimeAMPM(date);
    }
    return translateDate(date);
  }

  clearDate(currentSelectorMode, date) {
    this.animateInputElements(currentSelectorMode, date, null);
    this.setState({[currentSelectorMode]: null});
  }

  getMinimumDate(field) {
    const {startDate} = this.state;
    let minimumDate = new Date();
    if (field === selectorModes.endDate && startDate) {
      minimumDate = new Date(startDate);
      minimumDate.setDate(minimumDate.getDate() + 1);
    }

    return minimumDate;
  }

  openNativeDateTimePickerAndroid(field) {
    const {mode, startDate} = this.state;

    this.setState({selectorMode: field});
    let date;
    if (field === selectorModes.endDate) {
      date = this.getEndDate(field);
      this.setState({endDate: date});
    } else {
      date = startDate;
    }

    NativeDateTimePickerAndroid[
      mode === DatesPicker.modes.date ? 'openDateOnly' : 'open'
    ]({
      date: date || new Date(),
      onSelected: this.onAndroidDateChange(field),
      minDate: this.getMinimumDate(field),
    });
  }

  setSelectorMode = (selectorMode) => {
    this.setState({
      selectorMode,
      endDate: this.getEndDate(selectorMode),
    });
  };

  getEndDate = (field) => {
    const {startDate, endDate} = this.state;
    let newEndDate = endDate;
    if (field === selectorModes.endDate && !endDate) {
      newEndDate = new Date(startDate);
      newEndDate.setDate(startDate.getDate() + 1);
    }

    return newEndDate;
  };

  onAndroidDateChange = (field) => ({
    year,
    month,
    day,
    hour = 0,
    minute = 0,
  }) => {
    const date = new Date(year, month, day, hour, minute);
    const prevDate = this.state[field];
    this.animateInputElements(field, prevDate, date);
    this.updateDates(field, date);
  };

  onDateChange = (date) => {
    const {selectorMode} = this.state;
    const prevDate = this.state[selectorMode];
    this.animateInputElements(selectorMode, prevDate, date);
    this.updateDates(selectorMode, date);
  };

  animateInputElements(selectorMode, prevDate, newDate) {
    const isDateChanged = prevDate !== newDate;

    if (isDateChanged) {
      LayoutAnimation.easeInEaseOut();
      this.animateInputLabel(selectorMode, newDate);
    }
  }

  animateInputLabel(selectorMode, date) {
    Animated.parallel([
      this.animateLabel(
        `${selectorMode}LabelBottom`,
        date ? LABEL_BOTTOM_TOP : LABEL_BOTTOM_CENTER,
      ),
      this.animateLabel(
        `${selectorMode}LabelFontSize`,
        date ? LABEL_FONT_SIZE_TOP : LABEL_FONT_SIZE_CENTER,
      ),
    ]);
  }

  updateDates(field, date) {
    const {endDate} = this.state;
    if (field === selectorModes.startDate && endDate && date > endDate) {
      const newEndDate = new Date(date);
      newEndDate.setDate(date.getDate() + 1);
      this.setState({startDate: date, endDate: newEndDate});
    } else {
      this.setState({[field]: date});
    }
  }

  onSave = () => {
    const {navigation} = this.props;
    const {saveAction} = navigation.state.params;
    const {startDate, endDate} = this.state;

    saveAction({
      startDate: (startDate && startDate.toISOString()) || startDate,
      endDate: (endDate && endDate.toISOString()) || endDate,
    });
    navigationService.goBack();
  };
}

DatesPicker.propTypes = {
  navigation: PropTypes.object,
};

DatesPicker = Screen()(DatesPicker);
export default DatesPicker;
