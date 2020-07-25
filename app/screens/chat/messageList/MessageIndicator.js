import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// import { withChannelContext } from 'stream-chat-react-native';
import {View} from '../../../components/basicComponents';
import TypingIndicator from './TypingIndicator';
import MediaUploadIndicator from './MediaUploadIndicator';
import UploadErrorIndicator from './UploadErrorIndicator';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    height: 30,
    marginTop: 15,
    marginHorizontal: 20,
  },
});

class MessageIndicator extends Component {
  render() {
    const {
      typingUser,
      isUploadingMedia,
      isUploadError,
      hideUploadErrorIndicator,
    } = this.props;

    if (!typingUser && !isUploadingMedia) {
      return null;
    }

    const justifyContent =
      !typingUser && (isUploadingMedia || isUploadError)
        ? 'flex-end'
        : 'space-between';
    return (
      <View style={[styles.header, {justifyContent}]}>
        {!!typingUser && <TypingIndicator user={typingUser} />}
        {isUploadingMedia && <MediaUploadIndicator />}
        {isUploadError && (
          <UploadErrorIndicator hideIndicator={hideUploadErrorIndicator} />
        )}
      </View>
    );
  }
}

MessageIndicator.propTypes = {
  typingUser: PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.string,
  }),
  isUploadingMedia: PropTypes.bool,
  hideUploadErrorIndicator: PropTypes.func,
  isUploadError: PropTypes.bool,
};

// MessageIndicator = withChannelContext(MessageIndicator);
export default MessageIndicator;
