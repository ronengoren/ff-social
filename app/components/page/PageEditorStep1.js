import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, LayoutAnimation, Keyboard, Platform} from 'react-native';
import I18n from '/infra/localization';
import * as Animatable from 'react-native-animatable';
import {SuggestionsList} from '../../components/searchableForm';
import {View, Text, TextInput} from '../basicComponents';
import {FlipFlopIcon} from '../../assets/icons';
import {commonStyles, uiConstants, flipFlopColors} from '../../vars';
import {editModes} from '../../vars/enums';

const styles = StyleSheet.create({
  wrapper: {
    width: '50%',
    paddingBottom: uiConstants.FOOTER_MARGIN_BOTTOM,
    backgroundColor: flipFlopColors.white,
  },
  headerText: {
    paddingTop: 15,
    paddingHorizontal: 15,
  },
  textAreaWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  textArea: {
    fontSize: 18,
    lineHeight: 22,
    padding: 0,
    backgroundColor: flipFlopColors.transparent,
  },
  textAreaInner: {
    flex: 1,
    justifyContent: 'center',
  },
  searchIcon: {
    marginRight: 5,
  },
});

const TEXT_LINE_HEIGHT = 25;
const LIST_ITEM_TRANSLATION_SLUG = 'list_item';

class PageEditorStep1 extends React.Component {
  render() {
    const {
      type,
      hasSearchIcon,
      onTitleInputFocus,
      title,
      searchTerm,
      isShowSearch,
      onTitleChange,
      onFinishedTypingTitle,
      mode,
    } = this.props;
    const header = I18n.t(`page.create.part1.${type}.header`);
    const isHeaderVisible =
      !isShowSearch && header && type !== LIST_ITEM_TRANSLATION_SLUG;
    return (
      <View style={styles.wrapper}>
        {!!isHeaderVisible && (
          <Text
            size={22}
            lineHeight={30}
            color={flipFlopColors.b30}
            bold
            style={styles.headerText}>
            {header}
          </Text>
        )}
        <View style={styles.textAreaWrapper}>
          {hasSearchIcon && (
            <FlipFlopIcon
              name="search"
              size={22}
              color={flipFlopColors.b70}
              style={styles.searchIcon}
            />
          )}
          <TextInput
            placeholder={I18n.t(`page.create.part1.${type}.placeholder`)}
            value={title}
            onChange={onTitleChange}
            onChangeDebounced={onFinishedTypingTitle}
            debounceTime={250}
            maxLength={50}
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
            height={2 * TEXT_LINE_HEIGHT}
            autoFocus={mode === editModes.CREATE}
            ref={(node) => {
              this.titleInput = node;
            }}
            onFocus={onTitleInputFocus}
            style={styles.textArea}
            containerStyle={styles.textAreaInner}
            testID={`${type}Title`}
          />
        </View>
        {isShowSearch && (
          <Animatable.View
            style={commonStyles.flex1}
            animation="fadeInUp"
            duration={1000}>
            <SuggestionsList
              searchText={searchTerm}
              onSelectionPress={this.proceedToNextStep}
            />
          </Animatable.View>
        )}
      </View>
    );
  }

  componentDidUpdate = (prevProps) => {
    if (
      prevProps.isShowSearch !== this.props.isShowSearch &&
      Platform.OS === 'ios'
    ) {
      LayoutAnimation.easeInEaseOut();
    }
  };

  proceedToNextStep = ({item}) => {
    const {proceedToNextStep} = this.props;
    Keyboard.dismiss();
    proceedToNextStep({item});
  };

  inputBlur = () => {
    this.titleInput && this.titleInput.blur();
  };
}

PageEditorStep1.defaultProps = {
  onTitleInputFocus: () => {},
};

PageEditorStep1.propTypes = {
  type: PropTypes.string,
  hasSearchIcon: PropTypes.bool,
  title: PropTypes.string,
  searchTerm: PropTypes.string,
  isShowSearch: PropTypes.bool,
  mode: PropTypes.oneOf(Object.values(editModes)),
  proceedToNextStep: PropTypes.func,
  onTitleChange: PropTypes.func,
  onFinishedTypingTitle: PropTypes.func,
  onTitleInputFocus: PropTypes.func,
};

export default PageEditorStep1;
