import React, {Component} from 'react';
import PropTypes from 'prop-types';
import I18n from '../../infra/localization';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {View, Text, Chip} from '../basicComponents';
import {AwesomeIcon} from '../../assets/icons';
import {navigationService} from '../../infra/navigation';
import {
  addSpaceOnCapitalsAndCapitalize,
  isRTL,
} from '../../infra/utils/stringUtils';
import {flipFlopColors} from '../../vars';
import {screenNames} from '../../vars/enums';
import {stylesScheme} from '../../schemas';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: flipFlopColors.b90,
  },
  subHeader: {
    fontSize: 16,
    lineHeight: 19,
    color: flipFlopColors.b60,
  },
  categoryIcon: {
    marginLeft: 5,
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: -10,
  },
  tagStyle: {
    height: 34,
    borderRadius: 19,
    marginRight: 7,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
});

class TagPicker extends Component {
  render() {
    const {
      selectedTags,
      style,
      subHeaderStyle,
      minHeight,
      testID,
      forceLTR,
    } = this.props;
    const isEmptyState = !selectedTags || !selectedTags.length;
    const placeHolder = I18n.t('category_picker.placeholder');
    const isRtl = !forceLTR && isRTL(placeHolder);

    return (
      <TouchableOpacity
        onPress={this.navigateToCategoryPicker}
        activeOpacity={0.5}
        style={[styles.container, style, {minHeight}]}>
        {isRtl && (
          <AwesomeIcon
            name="chevron-left"
            color={flipFlopColors.b60}
            size={16}
            weight="light"
            style={styles.categoryIcon}
          />
        )}
        {isEmptyState ? (
          <Text style={[styles.subHeader, subHeaderStyle]} testID={testID}>
            {placeHolder}
          </Text>
        ) : (
          this.renderTags()
        )}
        {!isRtl && (
          <AwesomeIcon
            name="chevron-right"
            color={flipFlopColors.b60}
            size={16}
            weight="light"
            style={styles.categoryIcon}
          />
        )}
      </TouchableOpacity>
    );
  }

  renderTags() {
    const {selectedTags, translationKey} = this.props;
    return (
      <View style={styles.tagsWrapper}>
        {selectedTags.map((tag) => (
          <Chip
            key={tag}
            active
            color={flipFlopColors.green}
            style={styles.tagStyle}>
            {I18n.t(`${translationKey}.${tag}`, {
              defaultValue: addSpaceOnCapitalsAndCapitalize(tag),
            })}
          </Chip>
        ))}
      </View>
    );
  }

  navigateToCategoryPicker = () => {
    const {
      selectedTags,
      updateFunc,
      options,
      isWithOtherOption,
      onPress,
    } = this.props;
    onPress && onPress();
    navigationService.navigate(screenNames.CategoryPicker, {
      isWithOtherOption,
      selectedTags,
      options,
      updateFunc,
    });
  };
}

TagPicker.defaultProps = {
  translationKey: 'shared.tags',
  isWithOtherOption: true,
  minHeight: 65,
};

TagPicker.propTypes = {
  selectedTags: PropTypes.arrayOf(PropTypes.string),
  options: PropTypes.array,
  updateFunc: PropTypes.func,
  style: stylesScheme,
  subHeaderStyle: stylesScheme,
  translationKey: PropTypes.string,
  minHeight: PropTypes.number,
  isWithOtherOption: PropTypes.bool,
  testID: PropTypes.string,
  onPress: PropTypes.func,
  forceLTR: PropTypes.bool,
};

export default TagPicker;
