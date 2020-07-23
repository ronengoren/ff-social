/**
 * ? The pickers are implememnted and exported as a React component.
 * ? since we're not using android as a component throughout our codebase - we have to import specificly the underlying module instead of the component that is exposed by default
 * */
// TODO: lean IOS & Android date/time pickers to use the same component and interface
import DatePickerAndroid from '@react-native-community/datetimepicker/src/datepicker.android';
import TimePickerAndroid from '@react-native-community/datetimepicker/src/timepicker.android';

import {ErrorsLogger} from '/infra/reporting';

class NativeDateTimePickerAndroid {
  static async open({onSelected, minDate, maxDate, date}) {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        minDate,
        maxDate,
        date,
      });
      if (action === DatePickerAndroid.dismissedAction) {
        return;
      }

      const {hour = 0, minute = 0} = await TimePickerAndroid.open({
        hour: minDate.getHours(),
        minute: minDate.getMinutes(),
        is24Hour: false,
      });

      onSelected && onSelected({year, month, day, hour, minute});
    } catch ({code, message}) {
      ErrorsLogger.nativeDataTimePickerError(code, message);
      throw message;
    }
  }

  static async openDateOnly({onSelected, minDate, maxDate, date}) {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        minDate,
        maxDate,
        date,
        mode: 'spinner',
      });
      if (action === DatePickerAndroid.dismissedAction) {
        return;
      }

      onSelected && onSelected({year, month, day});
    } catch ({code, message}) {
      ErrorsLogger.nativeDataTimePickerError(code, message);
      throw message;
    }
  }
}

export default NativeDateTimePickerAndroid;
