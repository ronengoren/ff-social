import React, {Component} from 'react';
import PropTypes from 'prop-types';
import I18n from '../../infra/localization';
import {StyleSheet, Clipboard, TouchableOpacity} from 'react-native';
import {
  View,
  Text,
  Triangle,
  TextInLine,
} from '../../components/basicComponents';
import {HomeisIcon} from '../../assets/icons';
import {flipFlopColors} from '../../vars';

const styles = StyleSheet.create({
  separator: {
    paddingHorizontal: 5,
    marginVertical: 5,
  },
  button: {
    alignItems: 'center',
    height: 60,
  },
  copyButtontriangleBorder: {
    position: 'absolute',
    top: 0,
  },
  copyButtontriangle: {
    position: 'absolute',
    top: 1,
  },
  copyButton: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: flipFlopColors.b90,
    backgroundColor: flipFlopColors.white,
  },
  copyButtonDark: {
    backgroundColor: flipFlopColors.paleGreyTwo,
  },
  activeCopyButton: {
    backgroundColor: flipFlopColors.green,
    borderColor: flipFlopColors.green,
  },
  downloadLink: {
    paddingHorizontal: 10,
  },
  copiedLinkTextWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCopyButtonIcon: {
    marginRight: 10,
  },
});
class ShareLink extends Component {
  state = {
    copied: false,
  };

  render() {
    const {copied} = this.state;
    const {downloadLink, isDarkButton} = this.props;

    return [
      <TextInLine key="title" style={styles.separator}>
        {I18n.t('people.invite_friends.share_download_link')}
      </TextInLine>,
      <TouchableOpacity
        key="button"
        onPress={this.copyDownloadLink}
        style={styles.button}
        activeOpacity={1}>
        <Triangle
          style={styles.copyButtontriangleBorder}
          color={copied ? flipFlopColors.green : flipFlopColors.b90}
          direction="up"
          width={12}
          height={6}
        />
        <View
          style={[
            styles.copyButton,
            isDarkButton && styles.copyButtonDark,
            copied && styles.activeCopyButton,
          ]}>
          {copied ? (
            <View style={styles.copiedLinkTextWrapper}>
              <HomeisIcon
                name="check-mark"
                size={18}
                color={flipFlopColors.white}
                style={styles.activeCopyButtonIcon}
              />
              <Text
                size={15}
                lineHeight={22}
                medium
                color={flipFlopColors.white}>
                {I18n.t('people.invite_friends.copied_download_link')}
              </Text>
            </View>
          ) : (
            <Text
              numberOfLines={1}
              size={16}
              color={flipFlopColors.b30}
              style={styles.downloadLink}>
              {downloadLink}
            </Text>
          )}
        </View>
        <Triangle
          style={styles.copyButtontriangle}
          color={copied ? flipFlopColors.green : flipFlopColors.white}
          direction="up"
          width={12}
          height={6}
        />
      </TouchableOpacity>,
    ];
  }

  copyDownloadLink = () => {
    const {downloadLink, enrichUrl} = this.props;
    this.setState({copied: true});
    Clipboard.setString(enrichUrl(downloadLink));
  };
}

ShareLink.propTypes = {
  downloadLink: PropTypes.string.isRequired,
  enrichUrl: PropTypes.func.isRequired,
  isDarkButton: PropTypes.bool,
};

export default ShareLink;
