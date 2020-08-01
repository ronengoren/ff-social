import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {
  Text,
  QueryCancelIcon,
  View,
  Image,
} from '../../components/basicComponents';
import {flipFlopColors} from '../../vars';
import {FlipFlopIcon, AwesomeIcon} from '../../assets/icons';
import {removeAddressSuffix} from '../../infra/utils/addressUtils';
import I18n from '../../infra/localization';
import {stylesScheme} from '../../schemas';

const ITEM_DIMENSION = 70;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    shadowColor: flipFlopColors.boxShadow,
    shadowRadius: 8,
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    borderRadius: 10,
    backgroundColor: flipFlopColors.white,
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 3,
    height: ITEM_DIMENSION,
  },
  title: {
    marginBottom: 10,
  },
  location: {
    marginLeft: 4,
  },
  textWrapper: {
    flex: 1,
    marginRight: 15,
    marginTop: 9,
  },
  image: {
    height: ITEM_DIMENSION,
    width: ITEM_DIMENSION,
    marginRight: 15,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  placeholderImageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: flipFlopColors.lightBlue,
  },
  locationWrapper: {
    flexDirection: 'row',
    marginLeft: -1,
  },
  textRightMargin: {
    marginRight: 50,
  },
  cancelIcon: {
    top: 5,
    right: 5,
  },
  createButton: {
    alignSelf: 'flex-end',
    marginRight: 15,
    marginBottom: 14,
  },
});

class SuggestionItem extends Component {
  static itemDimension = ITEM_DIMENSION;

  render() {
    const {
      item,
      isCreatableItem,
      onRemoveItem,
      onPressItem,
      style,
    } = this.props;
    const {mediaUrl, title, location} = item;
    const isShowCancelButton = !!onRemoveItem;
    const testID =
      !item.pageId && !item.googlePlaceId
        ? 'customListSuggestionItem'
        : 'listSuggestionItem';

    return (
      <TouchableOpacity
        style={[styles.container, style]}
        onPress={() => onPressItem({item})}
        activeOpacity={0.5}
        testID={testID}>
        {mediaUrl ? (
          <Image
            source={{uri: item.mediaUrl}}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.placeholderImageWrapper]}>
            <AwesomeIcon
              name="globe"
              size={40}
              color={flipFlopColors.white}
              weight="solid"
            />
          </View>
        )}
        <View
          style={[
            styles.textWrapper,
            isShowCancelButton && styles.textRightMargin,
          ]}>
          <Text
            style={styles.title}
            bold
            size={18}
            lineHeight={22}
            color={flipFlopColors.azure}
            numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.locationWrapper}>
            <FlipFlopIcon
              name="location"
              size={16}
              color={location ? flipFlopColors.b30 : flipFlopColors.b60}
            />
            <Text
              style={styles.location}
              size={14}
              lineHeight={16}
              color={flipFlopColors.b30}
              numberOfLines={1}>
              {location
                ? removeAddressSuffix(location)
                : I18n.t('searchable_form.no_address')}
            </Text>
          </View>
        </View>
        {isShowCancelButton && (
          <QueryCancelIcon
            size={18}
            onPress={onRemoveItem}
            style={styles.cancelIcon}
          />
        )}
        {isCreatableItem && (
          <Text
            size={14}
            lineHeight={16}
            color={flipFlopColors.azure}
            style={styles.createButton}>
            {I18n.t('searchable_form.create')}
          </Text>
        )}
      </TouchableOpacity>
    );
  }
}

SuggestionItem.propTypes = {
  onPressItem: PropTypes.func,
  onRemoveItem: PropTypes.func,
  isCreatableItem: PropTypes.bool,
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    mediaUrl: PropTypes.string,
    location: PropTypes.string,
    pageId: PropTypes.string,
    googlePlaceId: PropTypes.string,
  }),
  style: stylesScheme,
};

export default SuggestionItem;
