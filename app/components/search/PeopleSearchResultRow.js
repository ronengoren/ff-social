import React from 'react';
import {TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {View, Avatar, TruncatedMultiLineName} from '../basicComponents';
import {flipFlopColors} from '../../vars';
import {avatarBadgePosition} from '../../vars/enums';
import {navigationService} from '../../infra/navigation';
import {getTopUserRole} from '../../infra/utils';
import PeopleSearchResultPlaceholders from './PeopleSearchResultPlaceholders';

const styles = {
  container: {
    width: 65,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    paddingVertical: 15,
  },
  textWrapper: {
    height: 40,
    marginTop: 10,
  },
};

class PeopleSearchResultRow extends React.PureComponent {
  render = () => {
    const {searchResult, dummy} = this.props;

    if (dummy) {
      return (
        <PeopleSearchResultPlaceholders
          containerStyle={styles.container}
          textStyle={styles.textWrapper}
        />
      );
    }

    const {name} = searchResult;
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() =>
          navigationService.navigateToProfile({entityId: searchResult.objectID})
        }>
        <View style={styles.container}>
          {this.renderEntityImage({searchResult})}
          <TruncatedMultiLineName
            name={name}
            style={styles.textWrapper}
            size={14}
            lineHeight={16}
            centerText
          />
        </View>
      </TouchableOpacity>
    );
  };

  renderEntityImage = ({searchResult}) => (
    <Avatar
      entityId={searchResult.objectID}
      entityType={searchResult.entityType}
      name={searchResult.name}
      themeColor={searchResult.themeColor}
      thumbnail={searchResult.thumbnail}
      size="medium2"
      showBadge={!!getTopUserRole(searchResult.roles)}
      iconName="crown"
      iconSize={13}
      isAwesomeIcon
      badgeColor={flipFlopColors.orange}
      badgePosition={avatarBadgePosition.BOTTOM}
    />
  );
}

PeopleSearchResultRow.propTypes = {
  searchResult: PropTypes.object,
  dummy: PropTypes.bool,
};

export default PeopleSearchResultRow;
