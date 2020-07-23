import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, StatusBar} from 'react-native';
import PropTypes from 'prop-types';
import {OptionsSelector} from '../../components';
import {Text, Image, IconButton} from '../basicComponents';
import {flipFlopColors, uiConstants} from '../../vars';
import {isHebrewOrArabic} from '../../infra/utils/stringUtils';
import {navigationService} from '../../infra/navigation';
import {AwesomeIcon} from '../../assets/icons';
import {stylesScheme} from '../../schemas';

const styles = StyleSheet.create({
  container: {
    backgroundColor: flipFlopColors.white,
    height: 240 + uiConstants.NAVBAR_TOP_MARGIN,
  },
  textSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  title: {
    marginBottom: 3,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 25 + uiConstants.NAVBAR_TOP_MARGIN,
    left: 12,
    zIndex: 1000,
  },
  createButton: {
    position: 'absolute',
    top: 25 + uiConstants.NAVBAR_TOP_MARGIN,
    right: 12,
    zIndex: 1000,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createEntityButtonIcon: {
    marginTop: 2,
    marginLeft: 6,
    lineHeight: 21,
  },
  options: {
    backgroundColor: flipFlopColors.transparent,
    position: 'absolute',
    bottom: 0,
    left: 0,
    marginTop: 15,
    marginBottom: 5,
  },
  optionSelector: {
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: flipFlopColors.lightWhite,
    borderWidth: 0,
  },
  optionSelectorText: {
    color: flipFlopColors.white,
  },
  children: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class EntityImageHeader extends Component {
  render() {
    const {
      title,
      subTitle,
      image,
      withBackButton,
      createAction,
      optionsList,
      style,
      children,
    } = this.props;
    const isHebrewSubTitle = isHebrewOrArabic(subTitle);

    return (
      <React.Fragment>
        <StatusBar
          translucent
          barStyle="light-content"
          backgroundColor="transparent"
        />
        <View style={[styles.container, style]}>
          <Image source={image} style={styles.image} />
          <View style={StyleSheet.absoluteFill}>
            <View style={styles.textSection}>
              <Text
                size={32}
                lineHeight={35}
                color={flipFlopColors.white}
                bold
                style={styles.title}>
                {title}
              </Text>
              <Text
                size={isHebrewSubTitle ? 18 : 16}
                lineHeight={isHebrewSubTitle ? 24 : 18}
                color={flipFlopColors.white}
                bold>
                {subTitle}
              </Text>
            </View>
          </View>
          {!!children && <View style={styles.children}>{children}</View>}
          {!!optionsList && this.renderOptionsList()}
          {withBackButton && this.renderBackButton()}
          {!!createAction && this.renderCreateButton()}
        </View>
      </React.Fragment>
    );
  }

  renderOptionsList = () => {
    const {
      color,
      optionsList,
      chosenIndex,
      selectOptionAction,
      showOptionAll,
    } = this.props;

    return (
      <OptionsSelector
        optionsList={optionsList}
        color={color}
        style={styles.options}
        textStyle={styles.optionSelectorText}
        optionStyle={styles.optionSelector}
        selectedOptionIndex={chosenIndex}
        selectOption={selectOptionAction}
        showOptionAll={showOptionAll}
      />
    );
  };

  renderBackButton = () => (
    <IconButton
      name="back-arrow"
      iconColor="white"
      iconSize={26}
      onPress={navigationService.goBack}
      style={styles.backButton}
      hitSlop={{left: 15, right: 15, top: 15, bottom: 30}}
    />
  );

  renderCreateButton = () => {
    const {createAction, createBtnText} = this.props;
    return (
      <TouchableOpacity
        testID="createEvent"
        onPress={createAction}
        style={styles.createButton}
        activeOpacity={1}>
        <Text size={16} lineHeight={21} color={flipFlopColors.white}>
          {createBtnText}
        </Text>
        <AwesomeIcon
          name="plus-circle"
          color={flipFlopColors.white}
          size={16}
          weight="solid"
          style={styles.createEntityButtonIcon}
        />
      </TouchableOpacity>
    );
  };
}

EntityImageHeader.defaultProps = {
  withBackButton: true,
  showOptionAll: true,
};

EntityImageHeader.propTypes = {
  showOptionAll: PropTypes.bool,
  children: PropTypes.node,
  color: PropTypes.string,
  optionsList: PropTypes.array,
  chosenIndex: PropTypes.number,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  image: PropTypes.number,
  createAction: PropTypes.func,
  createBtnText: PropTypes.string,
  selectOptionAction: PropTypes.func,
  withBackButton: PropTypes.bool,
  style: stylesScheme,
};

export default EntityImageHeader;
