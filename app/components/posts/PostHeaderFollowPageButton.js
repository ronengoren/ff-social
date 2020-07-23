import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, Platform } from 'react-native';
import I18n from '../../infra/localization';
// import { followPage } from '/redux/pages/actions';
import { Text } from '../basicComponents';
import { isRTL } from '../../infra/utils/stringUtils';
import { flipFlopColors } from '../../vars';
import { originTypes } from '../../vars/enums';

const styles = StyleSheet.create({
  followPage: {
    fontSize: 12,
    lineHeight: 17
  },
  followPageRTL: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: Platform.OS === 'ios' ? 3 : 1
  }
});

class PostHeaderFollowPageButton extends React.Component {
  state = {
    requested: false
  };

  render() {
    const { requested } = this.state;
    const text = I18n.t('feed.post_header.page_follow_button.follow');
    const color = flipFlopColors.green;
    if (requested) {
      return null;
    }
    const isRTLText = isRTL(text);
    return (
      <Text style={isRTLText ? styles.followPageRTL : styles.followPage} onPress={this.sendFollowRequest} color={color}>
        {text}
      </Text>
    );
  }

  sendFollowRequest = () => {
//     const { followPage, pageId } = this.props;
//     const { requested } = this.state;

//     this.setState({ requested: !requested });
//     followPage({ pageId, originType: originTypes.VIEW });
//   };
}

PostHeaderFollowPageButton.propTypes = {
  pageId: PropTypes.string.isRequired,
  followPage: PropTypes.func
};
const mapDispatchToProps = { 
    // followPage
     };
export default connect(
  null,
  mapDispatchToProps
)(PostHeaderFollowPageButton);
