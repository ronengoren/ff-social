// import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {LayoutAnimation, Platform, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {Text} from '../basicComponents';
import {BaseHeaderSnackbar} from '../../components/snackbars';
import config from '/config';
import I18n from '../../infra/localization';
import {get} from '../../infra/utils';
import {setConnection} from '../../redux/general/actions';
import {flipFlopColors} from '../../vars';

const reachabilityTypes = {
  UNKNOWN: 'unknown',
  NONE: 'none',
};

const styles = StyleSheet.create({
  connected: {
    backgroundColor: flipFlopColors.green,
  },
  notConnected: {
    backgroundColor: flipFlopColors.red,
  },
  text: {
    color: flipFlopColors.white,
    letterSpacing: 0.2,
  },
});

class ConnectionHeader extends Component {
  state = {
    showConnectionMessage: false,
  };

  render() {
    const {showConnectionMessage} = this.state;
    const {isOnline} = this.props;

    if (!showConnectionMessage) {
      return null;
    }

    return (
      <BaseHeaderSnackbar
        isVisible
        onClickClose={this.hideConnectionMessage}
        style={isOnline ? styles.connected : styles.notConnected}>
        <Text size={15} lineHeight={20} medium style={styles.text}>
          {isOnline
            ? I18n.t('header.online_toast')
            : I18n.t('header.offline_toast')}
        </Text>
      </BaseHeaderSnackbar>
    );
  }

  // componentDidMount() {
  //   this.isNetworkConnected().then((isOnline) => {
  //     if (isOnline !== this.props.isOnline) {
  //       if (isOnline) {
  //         this.showConnectionRestoredMessage();
  //       } else {
  //         this.showNoConnectionMessage();
  //       }
  //     }
  //     NetInfo.addEventListener('connectionChange', this.handleConnectionChange);
  //   });
  // }

  // componentWillUnmount() {
  //   NetInfo.removeEventListener(
  //     'connectionChange',
  //     this.handleConnectionChange,
  //   );
  // }

  handleConnectionChange = async (connectionInfo) => {
    if (connectionInfo.type === reachabilityTypes.UNKNOWN) return;
    const isOnline = connectionInfo.type !== reachabilityTypes.NONE;

    if (isOnline !== this.props.isOnline) {
      // Trying to fix the false positives we have on iOS - showing no connection when disconnecting/connecting
      // back to wifi (while there is still 3G connection)
      if (
        Platform.OS === 'ios' &&
        isOnline !== (await this.checkConnectivity())
      )
        return;

      if (isOnline) {
        this.showConnectionRestoredMessage();
      } else {
        this.showNoConnectionMessage();
      }
    }
  };

  showNoConnectionMessage = () => {
    const {setConnection} = this.props;
    setConnection({online: false});
    this.setState({showConnectionMessage: true});
  };

  showConnectionRestoredMessage = () => {
    const {setConnection} = this.props;
    setConnection({online: true});
    setTimeout(this.hideConnectionMessage, 2000);
  };

  hideConnectionMessage = () => {
    LayoutAnimation.easeInEaseOut();
    this.setState({showConnectionMessage: false});
  };

  checkConnectivity = async () => {
    try {
      const res = await axios.get(config.healthCheckUrl);
      if (res.status === 200) return true;
    } catch (e) {
      // Nothing to do here...
    }
    return false;
  };

  // This is a workaround to a known issue
  // TODO: Follow the issue: https://github.com/facebook/react-native/issues/8615
  // isNetworkConnected = () =>
  //   NetInfo.getConnectionInfo().then((reachability) => {
  //     if (reachability.type === reachabilityTypes.UNKNOWN) {
  //       return new Promise((resolve) => {
  //         const handleFirstConnectivityChangeIOS = (isConnected) => {
  //           NetInfo.isConnected.removeEventListener(
  //             'connectionChange',
  //             handleFirstConnectivityChangeIOS,
  //           );
  //           resolve(isConnected);
  //         };
  //         NetInfo.isConnected.addEventListener(
  //           'connectionChange',
  //           handleFirstConnectivityChangeIOS,
  //         );
  //       });
  //     }
  //     return ![reachabilityTypes.NONE, reachabilityTypes.UNKNOWN].includes(
  //       reachability.type,
  //     );
  //   });
}

const mapStateToProps = (state) => ({
  isOnline: get(state, 'general.isOnline'),
});

const mapDispatchToProps = {
  setConnection,
};

ConnectionHeader.propTypes = {
  isOnline: PropTypes.bool,
  setConnection: PropTypes.func,
};
export default connect(mapStateToProps, mapDispatchToProps)(ConnectionHeader);
