import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, Platform, Share, Linking} from 'react-native';
import {WebView as RnWebView} from 'react-native-webview';
import Orientation from 'react-native-orientation';
import {Screen} from '../../components';
import {
  Text,
  IconButton,
  ProgressBar,
  Spinner,
} from '../../components/basicComponents';
import {get} from '../../infra/utils';
import {navigationService} from '../../infra/navigation';
import {uiConstants, flipFlopColors} from '../../vars';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerOuter: {
    paddingTop: uiConstants.PHONE_BAR_HEIGHT_TRANSLUCENT,
    backgroundColor: flipFlopColors.green,
  },
  headerInner: {
    paddingTop: 8,
    paddingBottom: 6,
    paddingLeft: 50,
    paddingRight: 20,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    backgroundColor: flipFlopColors.paleGreyTwo,
  },
  titleText: {
    marginBottom: 2,
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 45,
    paddingHorizontal: 35,
    paddingVertical: 10,
    backgroundColor: flipFlopColors.paleGreyTwo,
  },
  progressBar: {
    height: 2,
  },
});

class WebView extends Component {
  state = {
    navStepsCounter: 0,
    maxNavStepsCounter: 0,
    canGoBack: false,
    canGoForward: false,
    shouldUpdateNavCounter: true,
    // currentUrl: this.props.navigation.state.params.url,
    title: get(this.props.navigation, 'state.params.title', null),
    subtitle: get(this.props.navigation, 'state.params.subtitle', null),
  };

  render() {
    const {title, subtitle, canGoBack, canGoForward, progress} = this.state;
    // const {
    //   navigation: {
    //     state: {
    //       params: {url},
    //     },
    //   },
    // } = this.props;
    const isIOS = Platform.OS === 'ios';

    return (
      <View style={styles.container}>
        <View style={styles.headerOuter}>
          <View style={styles.headerInner}>
            <Text
              size={14}
              lineHeight={18}
              color={flipFlopColors.b30}
              numberOfLines={1}
              style={styles.titleText}>
              {title || ' '}
            </Text>
            <Text
              size={11}
              lineHeight={18}
              color={flipFlopColors.b70}
              bold
              numberOfLines={1}>
              {subtitle || ' '}
            </Text>
            <IconButton
              name="close"
              style={styles.closeIcon}
              iconColor="b70"
              iconSize={23}
              onPress={() => navigationService.goBack()}
            />
          </View>
        </View>
        {isIOS && progress !== 1 && (
          <ProgressBar style={styles.progressBar} progress={progress} />
        )}
        <RnWebView
          useWebKit
          ref={(node) => {
            this.webView = node;
          }}
          // source={{uri: url}}
          renderLoading={() => <Spinner />}
          startInLoadingState
          onNavigationStateChange={this.handleNavStateChange}
        />
        <View style={styles.footer}>
          <IconButton
            name="angle-left"
            iconColor="realBlack"
            disabled={!canGoBack}
            iconSize={24}
            isAwesomeIcon
            onPress={this.webViewGoBack}
          />
          <IconButton
            name="angle-right"
            iconColor="realBlack"
            disabled={!canGoForward}
            iconSize={24}
            isAwesomeIcon
            onPress={this.webViewGoForward}
          />
          <IconButton
            name="share-alt"
            iconColor="realBlack"
            iconSize={20}
            isAwesomeIcon
            onPress={this.openNativeShare}
          />
          <IconButton
            name="globe"
            iconColor="realBlack"
            iconSize={20}
            isAwesomeIcon
            onPress={this.openLinkInDefaultBrowser}
          />
        </View>
      </View>
    );
  }

  componentDidMount() {
    Orientation.unlockAllOrientations();
  }

  componentWillUnmount() {
    Orientation.lockToPortrait();
  }

  handleNavStateChange = (e) => {
    // const {
    //   currentUrl,
    //   shouldUpdateNavCounter,
    //   navStepsCounter,
    //   title: currentTitle,
    //   subtitle: currentSubTitle,
    // } = this.state;
    // const {onUrlChange} = this.props.navigation.state.params;
    // const {title, url} = e;
    // const newState = {navStepsCounter};
    // if (onUrlChange && url !== currentUrl) {
    //   onUrlChange(url);
    // }
    // if (url !== currentUrl && shouldUpdateNavCounter) {
    //   newState.navStepsCounter = navStepsCounter + 1;
    //   newState.maxNavStepsCounter = newState.navStepsCounter;
    // }
    // if (!currentTitle) {
    //   newState.title = title;
    // }
    // if (!currentSubTitle) {
    //   const match = (url && url.match(/(?:\w+\.)+\w+/i)) || [];
    //   newState.subtitle = match[0];
    // }
    // this.setState({
    //   currentUrl: url,
    //   shouldUpdateNavCounter: true,
    //   ...newState,
    //   canGoBack: newState.navStepsCounter > 0,
    // });
  };

  webViewGoBack = () => {
    const {navStepsCounter} = this.state;
    this.webView.goBack();
    this.setState({
      navStepsCounter: navStepsCounter - 1,
      canGoBack: navStepsCounter - 1 > 0,
      canGoForward: true,
      shouldUpdateNavCounter: false,
    });
  };

  webViewGoForward = () => {
    const {navStepsCounter, maxNavStepsCounter} = this.state;
    this.webView.goForward();
    this.setState({
      navStepsCounter: navStepsCounter + 1,
      canGoBack: true,
      canGoForward: navStepsCounter + 1 < maxNavStepsCounter,
      shouldUpdateNavCounter: false,
    });
  };

  handleProgress = (progress) => {
    this.setState({progress});
  };

  openNativeShare = () => {
    const {
      navigation: {
        state: {
          params: {url},
        },
      },
    } = this.props;
    Share.share(
      {
        ...Platform.select({
          ios: {
            message: '',
            url,
          },
          android: {
            message: url,
          },
        }),
        title: '',
      },
      {
        dialogTitle: `Share : `,
      },
    );
  };

  openLinkInDefaultBrowser = () => {
    const {
      navigation: {
        state: {
          params: {url},
        },
      },
    } = this.props;
    Linking.openURL(url);
  };
}

WebView.propTypes = {
  // navigation: PropTypes.shape({
  //   state: PropTypes.shape({
  //     params: PropTypes.shape({
  //       url: PropTypes.string,
  //       title: PropTypes.string,
  //       subtitle: PropTypes.string,
  //       onUrlChange: PropTypes.func,
  //     }),
  //   }),
  // }),
};

WebView = Screen()(WebView);
export default WebView;
