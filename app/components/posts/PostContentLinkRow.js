import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';

import {Link, View} from '../../components/basicComponents';
import {AwesomeIcon} from '../../assets/icons';
import {flipFlopColors} from '../../vars';

import {navigationService} from '../../infra/navigation';
import {screenNames} from '../../vars/enums';

const styles = StyleSheet.create({
  iconLink: {
    marginRight: 8,
    lineHeight: 26,
    marginTop: 2,
  },
  detailsRowText: {
    flex: 1,
  },
  detailsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

class PostContentLinkRow extends React.Component {
  render() {
    const {url} = this.props;
    return (
      <View style={styles.detailsRow}>
        <AwesomeIcon
          name="link"
          style={styles.iconLink}
          color={flipFlopColors.b70}
          size={12}
          weight="solid"
        />
        <Link
          onPress={() => this.navigateToWebView({url})}
          size={16}
          lineHeight={26}
          color={flipFlopColors.b30}
          numberOfLines={1}
          forceLTR
          style={styles.detailsRowText}>
          {url}
        </Link>
      </View>
    );
  }

  navigateToWebView = ({url}) => {
    navigationService.navigate(screenNames.WebView, {url});
  };
}

PostContentLinkRow.propTypes = {
  url: PropTypes.string,
};

export default PostContentLinkRow;
