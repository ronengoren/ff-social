import React, {Component} from 'react';
import {StyleSheet, Keyboard, Platform, LayoutAnimation} from 'react-native';
import {
  View,
  Text,
  KeyboardAvoidingView,
} from '../../../components/basicComponents';
import {commonStyles, flipFlopColors} from '../../../vars';
import PostEditorBody from './PostEditorBody';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: flipFlopColors.white,
  },
  confirmationModalText: {
    paddingHorizontal: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  countryPickerMargin: {
    marginBottom: 20,
  },
});

class PostEditor extends Component {
  render() {
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={commonStyles.flex1}
          behavior={Platform.select({
            ios: 'padding',
            android: null,
          })}>
          <PostEditorBody />
        </KeyboardAvoidingView>
      </View>
    );
  }
}

export default PostEditor;
