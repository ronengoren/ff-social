import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import I18n from '../../../infra/localization';
import {Text} from '../../../components/basicComponents';
import {AwesomeIcon} from '../../../assets/icons';
import {flipFlopColors} from '../../../vars';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    marginLeft: 15,
    paddingHorizontal: 10,
    borderRadius: 28,
    backgroundColor: flipFlopColors.red,
  },
  text: {
    marginRight: 10,
  },
  closeIcon: {
    marginLeft: 5,
  },
});

class UploadErrorIndicator extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={this.hideIndicator} style={styles.container}>
        <Text
          size={12}
          lineHeight={14}
          color={flipFlopColors.white}
          style={styles.text}>
          {I18n.t('chat.upload_image_error')}
        </Text>
        <AwesomeIcon
          name="times"
          style={styles.closeIcon}
          color={flipFlopColors.white}
          size={14}
        />
      </TouchableOpacity>
    );
  }

  componentDidMount() {
    this.timeOut = setTimeout(this.hideIndicator, 10000);
  }

  componentWillUnmount() {
    clearTimeout(this.timeOut);
  }

  timeOut = null;

  hideIndicator = () => {
    const {hideIndicator} = this.props;
    clearTimeout(this.timeOut);
    hideIndicator();
  };
}

UploadErrorIndicator.propTypes = {
  hideIndicator: PropTypes.func.isRequired,
};

export default UploadErrorIndicator;
