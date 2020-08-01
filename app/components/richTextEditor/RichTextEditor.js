/* eslint-disable global-require */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Platform, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
// import { Logger } from '/infra/reporting';
import {commonStyles} from '../../vars';
import {messages} from './const';
import {Spinner} from '../basicComponents';

const styles = StyleSheet.create({
  webviewContainer: {
    flex: 0,
    height: '100%',
    width: '100%',
  },
});

const pageSource = Platform.select({
  ios: require('./editor.html'),
  android: {uri: 'file:///android_asset/editor.html'}, // in release build, external html files in Android can't be required,
  // so they must be placed in the assets folder and accessed via uri: https://github.com/facebook/react-native/pull/17304
});

const injectScript = `
  (function () {
    if(window.onWebViewInit) {
      window.onWebViewInit();
    }
  }());
`;

export default class RichTextEditor extends Component {
  state = {
    uri: null,
  };

  static getEditorUrl() {
    return pageSource;
  }

  constructor() {
    super();
    this.onChangeListeners = [];
    this.selectionChangeListeners = [];
  }

  render() {
    const {uri} = this.state;

    return (
      <View style={commonStyles.flex1}>
        <WebView
          testID="richTextEditorWebView"
          {...this.props}
          hideKeyboardAccessoryView
          keyboardDisplayRequiresUserAction={false}
          ref={(r) => {
            if (!this.webview) {
              this.webview = r;
              if (Platform.OS === 'android') {
                this.webview.requestFocus();
              }
            }
          }}
          scrollEnabled={false}
          overScrollMode={'never'}
          onMessage={this.onMessage}
          source={uri ? {uri} : RichTextEditor.getEditorUrl()}
          javaScriptEnabled
          injectedJavaScript={injectScript}
          mixedContentMode={'always'}
          containerStyle={styles.webviewContainer}
          originWhitelist={['*']}
          startInLoadingState
          renderLoading={() => (
            <View style={StyleSheet.absoluteFillObject}>
              <Spinner />
            </View>
          )}
        />
      </View>
    );
  }

  onMessage = (event) => {
    // try {
    //   const message = JSON.parse(event.nativeEvent.data);
    //   switch (message.type) {
    //     case messages.EDITOR_INITIALIZED: {
    //       const { editorInitializedCallback } = this.props;
    //       editorInitializedCallback && editorInitializedCallback();
    //       if (Platform.OS === 'android') {
    //         // eslint-disable-next-line no-script-url
    //         this.setState({ uri: `javascript:editor.quill.blur();editor.quill.focus();setTimeout(() => { editor.placeholder.scrollTop = 100000; }, 200);` });
    //       }
    //       break;
    //     }
    //     case messages.LOG: {
    //       const msg = `From Quill Editor: ${message.data}`;
    //       console.log(msg); // eslint-disable-line no-console
    //       Logger.warn(msg);
    //       break;
    //     }
    //     case messages.SELECTION_CHANGE: {
    //       /* eslint-disable array-callback-return */
    //       const { formatting, selection } = message.data;
    //       this.selectionChangeListeners.map((listener) => {
    //         listener({ formatting, selection });
    //       });
    //       break;
    //     }
    //     case messages.CONTENT_CHANGE: {
    //       const { html, text, formatting, selection } = message.data;
    //       this.onChangeListeners.map((listener) => listener({ html, text, formatting }));
    //       this.selectionChangeListeners.map((listener) => {
    //         listener({ formatting, selection });
    //       });
    //       break;
    //     }
    //     default:
    //       break;
    //   }
    // } catch (e) {
    //   Logger.warn(`Non json message from webview: ${e}`);
    // }
  };

  toggleHeader(header) {
    this.webview.injectJavaScript(`editor.toggleHeader("${header}");`);
  }

  toggleBold() {
    this.webview.injectJavaScript(`editor.toggleBold();`);
  }

  toggleUnderline() {
    this.webview.injectJavaScript(`editor.toggleUnderline();`);
  }

  toggleBulletsList() {
    this.webview.injectJavaScript(`editor.toggleBulletsList();`);
  }

  toggleOrderedList() {
    this.webview.injectJavaScript(`editor.toggleOrderedList();`);
  }

  setPlacholderText(text) {
    this.webview.injectJavaScript(`editor.setPlacholderText("${text}");`);
  }

  setContentHTML(data) {
    this.webview.injectJavaScript(
      `editor.setContentHTML(\`${data.replace(/\r?\n/g, '<br />')}\`);`,
    );
  }

  setSelection(index) {
    this.webview.injectJavaScript(`editor.setSelection(${index});`);
  }

  mentionSelected(mention) {
    const stringifiedMention = JSON.stringify(mention);
    this.webview.injectJavaScript(
      `editor.mentionSelected(\`${stringifiedMention}\`);`,
    );
  }

  registerContentChangeListener(listener) {
    this.onChangeListeners.push(listener);
  }

  registerSelectionChangedListener(listener) {
    this.selectionChangeListeners.push(listener);
  }
}

RichTextEditor.propTypes = {
  editorInitializedCallback: PropTypes.func,
};
