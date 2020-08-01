import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Platform} from 'react-native';
import I18n from '../../../../infra/localization';
import {View, ProgressBar, Text} from '../../../../components/basicComponents';
import {flipFlopColors} from '../../../../vars';

const uploadHeaderStyles = StyleSheet.create({
  container: {
    marginTop: Platform.select({ios: 20, android: 0}),
    width: '100%',
    flexDirection: 'row',
    height: 45,
    borderBottomWidth: 1,
    borderBottomColor: flipFlopColors.disabledGrey,
    backgroundColor: flipFlopColors.white,
    zIndex: 10,
  },
  txtContainer: {
    justifyContent: 'center',
  },
  txt: {
    marginLeft: 15,
    fontSize: 13,
  },
  progress: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 13,
    paddingLeft: 13,
  },
});

const UploadHeader = ({progress}) => (
  <View style={uploadHeaderStyles.container}>
    <View style={uploadHeaderStyles.txtContainer}>
      <Text style={uploadHeaderStyles.txt}>
        {I18n.t('post_editor.upload_header')}
      </Text>
    </View>
    <View style={uploadHeaderStyles.progress}>
      <ProgressBar progress={progress} />
    </View>
  </View>
);

UploadHeader.propTypes = {
  progress: PropTypes.number,
};

export default UploadHeader;
