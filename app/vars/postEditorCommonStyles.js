import {StyleSheet} from 'react-native';
import {flipFlopColors} from '/vars';

export const FIELD_HEIGHT = 60;

const border = (color, dir = 'Bottom') => ({
  [`border${dir}Width`]: 1,
  [`border${dir}Color`]: color,
});

export const postEditorCommonStyles = StyleSheet.create({
  editorWrapper: {
    padding: 15,
  },
  checkboxesSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 0,
    paddingTop: 15,
    ...border(flipFlopColors.b70),
  },
  checkbox: {
    width: '50%',
  },
  rtlCheckboxesSection: {
    flexDirection: 'row-reverse',
  },
  fieldsWrapper: {
    paddingHorizontal: 15,
  },
  input: {
    paddingHorizontal: 0,
    paddingVertical: 15,
    paddingTop: 15,
    fontSize: 16,
    lineHeight: 20,
  },
  bottomBorder: {
    ...border(flipFlopColors.b90),
  },
  topBorder: {
    ...border(flipFlopColors.b90, 'Top'),
  },
  dummyInput: {
    paddingVertical: 20,
    fontSize: 16,
    lineHeight: 20,
  },
});
