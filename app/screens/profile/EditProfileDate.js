import React from 'react';
import I18n from '../../infra/localization';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Platform,
  TouchableOpacity,
  DatePickerIOS,
} from 'react-native'; // eslint-disable-line react-native/split-platform-components
import {
  View,
  Text,
  Separator,
  TextButton,
  Switch,
} from '../../components/basicComponents';
import {Screen, NativeDateTimePickerAndroid} from '../../components';
import {flipFlopColors, flipFlopFonts, flipFlopFontsWeights} from '../../vars';
import {translateDate} from '../../infra/utils/dateTimeUtils';
import {navigationService} from '../../infra/navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: flipFlopColors.fillGrey,
  },
  upperPart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: flipFlopColors.white,
  },
  header: {
    height: 20,
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: flipFlopFonts.medium,
    fontWeight: flipFlopFontsWeights.medium,
    fontSize: 20,
    lineHeight: 20,
    color: flipFlopColors.black,
  },
  subHeader: {
    height: 20,
    fontFamily: flipFlopFonts.medium,
    fontWeight: flipFlopFontsWeights.medium,
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'center',
    color: flipFlopColors.placeholderGrey,
  },
  dateText: {
    maxWidth: 335,
    height: 30,
    fontSize: 16,
    lineHeight: 30,
    textAlign: 'center',
    color: flipFlopColors.black,
  },
  dateBottomLine: {
    width: '100%',
    maxWidth: 335,
    height: 2,
    backgroundColor: flipFlopColors.green,
  },
  lowerPart: {
    width: '100%',
    height: 280,
    backgroundColor: flipFlopColors.white,
  },
  toggleLine: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: flipFlopColors.white,
    borderBottomColor: flipFlopColors.disabledGrey,
    borderBottomWidth: 1,
  },
  toggleLineText: {
    height: 22,
    fontFamily: flipFlopFonts.medium,
    fontWeight: flipFlopFontsWeights.medium,
    fontSize: 15,
    lineHeight: 22.0,
    color: flipFlopColors.black,
  },
});

class EditProfileDate extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.upperPart}>
          <Text style={styles.header}>header</Text>
          <Text style={styles.subHeader}>subHeader</Text>
          <TouchableOpacity
            onPress={Platform.select({
              android: () => this.openNativeDatePickerAndroid(),
            })}>
            <Text style={styles.dateText}>{translateDate()}</Text>
          </TouchableOpacity>
          <View style={styles.dateBottomLine} />
        </View>
        <Separator height={5} />
        <View style={styles.lowerPart}>
          <View style={styles.toggleLine}>
            <Text style={styles.toggleLineText}>
              {I18n.t('profile.edit.date_privacy_toggle_label')}
            </Text>
            <Switch onChange={this.toggleVisibleInProfile} active={true} />
          </View>
          {Platform.OS === 'ios' && (
            <DatePickerIOS
              mode="date"
              onDateChange={this.onDateChange}
              date={new Date()}
              // maximumDate={maxDate || new Date()}
              // minimumDate={minDate}
            />
          )}
        </View>
        <TextButton footerButton size="huge" onPress={this.onSave}>
          {I18n.t('common.buttons.save')}
        </TextButton>
      </View>
    );
  }

  openNativeDatePickerAndroid() {
    const {
      navigation: {
        state: {
          params: {
            data: {minDate, maxDate},
          },
        },
      },
    } = this.props;

    NativeDateTimePickerAndroid.openDateOnly({
      date: this.state.date,
      minDate,
      maxDate: maxDate || new Date(),
      onSelected: ({year, month, day}) => {
        const date = new Date(year, month, day);
        this.setState({date});
      },
    });
  }

  onDateChange = (date) => {
    this.setState({date});
  };

  toggleVisibleInProfile = () => {
    this.setState({isVisibleInProfile: !this.state.isVisibleInProfile});
  };

  onSave = () => {
    const {
      navigation: {
        state: {
          params: {saveAction, dataFields},
        },
      },
    } = this.props;
    const {date, isVisibleInProfile} = this.state;

    const dataToSave = {};
    dataToSave[dataFields[0]] = date;
    if (dataFields.length > 1) {
      dataToSave[dataFields[1]] = isVisibleInProfile;
    }
    saveAction({...dataToSave});
    navigationService.goBack();
  };
}

EditProfileDate.propTypes = {
  // navigation: PropTypes.object,
};

EditProfileDate = Screen()(EditProfileDate);
export default EditProfileDate;
