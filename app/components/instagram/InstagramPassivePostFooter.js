import React from 'react';
import I18n from 'i18n-js';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {View, Text, DashedBorder} from '../basicComponents';
import {flipFlopColors} from '../../vars';
import {get} from '../../infra/utils';
// import { connect as connectInstagram } from '/infra/instagram';
import {PostFooter} from '../../components/posts';

const styles = StyleSheet.create({
  connectInstagramFooter: {
    backgroundColor: flipFlopColors.white,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  connectInstagramFooterContent: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
});

class InstagramConnectFooter extends React.Component {
  render() {
    const {data, instagramToken, isPostPage} = this.props;

    return (
      <React.Fragment>
        <PostFooter
          post={data}
          withoutBorderBottom={!instagramToken}
          isPostPage={isPostPage}
        />
        {!instagramToken && (
          <View style={styles.connectInstagramFooter}>
            <DashedBorder />
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.connectInstagramFooterContent}
              onPress={connectInstagram}>
              <Text bold size={13} lineHeight={18} color={flipFlopColors.b60}>
                {I18n.t('posts.instagram.connect_header')}
              </Text>
              <Text bold size={13} lineHeight={18} color={flipFlopColors.azure}>
                {I18n.t('posts.instagram.connect_cta')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </React.Fragment>
    );
  }
}

InstagramConnectFooter.propTypes = {
  isPostPage: PropTypes.bool,
  instagramToken: PropTypes.string,
  data: PropTypes.object,
};

const mapStateToProps = (state) => ({
  instagramToken: get(state, 'auth.user.instagramV2Token'),
});

InstagramConnectFooter = connect(mapStateToProps)(InstagramConnectFooter);
export default InstagramConnectFooter;
