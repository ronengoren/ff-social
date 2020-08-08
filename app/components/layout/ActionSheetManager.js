import React from 'react';
import PropTypes from 'prop-types';
import {Modal, StyleSheet, TouchableOpacity} from 'react-native';
import I18n from '../../infra/localization';
import {connect} from 'react-redux';
import {closeActionSheet} from '../../redux/general/actions';
import {apiCommand} from '../../redux/apiCommands/actions';
import {Text, View, ShareTypeIcon} from '../basicComponents';
import {flipFlopColors, flipFlopFonts, flipFlopFontsWeights} from '../../vars';
// import Logger from '/infra/reporting/Logger';
import {stylesScheme} from '../../schemas';
import {isRTL} from '../../infra/utils/stringUtils';

const styles = StyleSheet.create({
  modal: {
    backgroundColor: flipFlopColors.paleBlack,
    height: '100%',
    width: '100%',
  },
  actionSheetOuterContainer: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15,
  },
  container: {
    borderRadius: 10,
    backgroundColor: flipFlopColors.white,
    width: '100%',
    marginBottom: 20,
  },
  headerText: {
    color: flipFlopColors.buttonGrey,
    fontSize: 14,
  },
  actionSheetItemWrapRadius: {
    borderRadius: 10,
    backgroundColor: flipFlopColors.white,
  },
  rtlWrapper: {
    direction: 'rtl',
  },
  actionSheetItemWrap: {
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  actionSheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: flipFlopColors.white,
    justifyContent: 'center',
  },
  actionSheetItemWithIcon: {
    justifyContent: 'flex-start',
  },
  actionSheetItemText: {
    fontSize: 16,
    fontFamily: flipFlopFonts.medium,
    fontWeight: flipFlopFontsWeights.medium,
    lineHeight: 30,
    color: flipFlopColors.black,
    textAlignVertical: 'center',
  },
  actionSheetIconWrapper: {
    marginRight: 20,
  },
  actionSheetAwesomeIconWrapper: {
    marginRight: 23,
  },
  line: {
    height: 1,
    backgroundColor: flipFlopColors.disabledGrey,
  },
});

const ActionSheetItem = ({
  iconName,
  awesomeIconName,
  iconSize = 19,
  awesomeIconSize = 16,
  awesomeIconWeight = 'solid',
  text,
  textStyle,
  iconWrapperStyle,
  iconStyle,
  color,
  onPress,
  testID,
}) => {
  const isAwesomeIcon = !iconName && awesomeIconName;

  const item = (
    <View style={styles.actionSheetItemWrapRadius}>
      <View style={[styles.actionSheetItemWrap]}>
        <View
          style={[
            styles.actionSheetItem,
            (iconName || awesomeIconName) && styles.actionSheetItemWithIcon,
          ]}>
          {(iconName || awesomeIconName) && (
            <ShareTypeIcon
              onPress={onPress}
              iconName={awesomeIconName || iconName}
              color={color || flipFlopColors.black}
              iconSize={iconSize || awesomeIconSize}
              isAwesomeIcon={isAwesomeIcon}
              style={[
                isAwesomeIcon
                  ? styles.actionSheetAwesomeIconWrapper
                  : styles.actionSheetIconWrapper,
                iconWrapperStyle,
              ]}
              iconStyle={iconStyle}
              iconWeight={awesomeIconWeight}
            />
          )}
          <Text
            medium
            style={[styles.actionSheetItemText, textStyle, color && {color}]}
            testID="actionSheetItemText">
            {text}
          </Text>
        </View>
      </View>
    </View>
  );

  return !onPress ? (
    item
  ) : (
    <TouchableOpacity onPress={onPress} testID={testID}>
      {item}
    </TouchableOpacity>
  );
};

ActionSheetItem.propTypes = {
  iconName: PropTypes.string,
  awesomeIconName: PropTypes.string,
  iconSize: PropTypes.number,
  awesomeIconSize: PropTypes.number,
  awesomeIconWeight: PropTypes.string,
  text: PropTypes.string,
  textStyle: stylesScheme,
  iconWrapperStyle: stylesScheme,
  iconStyle: stylesScheme,
  color: PropTypes.string,
  onPress: PropTypes.func,
  testID: PropTypes.string,
};

const ActionSheetManager = ({actionSheet, closeActionSheet, apiCommand}) => {
  if (!actionSheet) return null;

  const handleItemPress = (option) => {
    if (option.action) {
      option.action();
    }
    if (option.shouldClose) {
      closeActionSheet();
    }
  };

  const handleCancel = () => {
    if (actionSheet.onCancel) {
      setImmediate(actionSheet.onCancel);
    }
    closeActionSheet();
  };

  const renderCancelButton = () => (
    <ActionSheetItem
      onPress={handleCancel}
      text={I18n.t('action_sheets.cancel')}
    />
  );

  const renderHeader = (header) => (
    <View>
      <ActionSheetItem text={header.text} textStyle={styles.headerText} />
      <View style={styles.line} />
    </View>
  );

  const renderOptions = (options) => {
    const isAllActionsRTL = options.every((o) => o && o.text && isRTL(o.text));
    return (
      <View style={[isAllActionsRTL && styles.rtlWrapper]}>
        {options.map((option, i) => (
          <View key={option.id}>
            <ActionSheetItem
              onPress={() => handleItemPress(option)}
              text={option.text}
              color={option.color}
              iconName={option.iconName}
              awesomeIconName={option.awesomeIconName}
              awesomeIconSize={option.awesomeIconSize}
              isAwesomeIcon={option.isAwesomeIcon}
              awesomeIconWeight={option.awesomeIconWeight}
              iconSize={option.iconSize}
              testID={option.testID}
              iconStyle={option.iconStyle}
              iconWrapperStyle={option.iconWrapperStyle}
              textStyle={option.textStyle}
            />
            {i < options.length - 1 && <View style={styles.line} />}
          </View>
        ))}
      </View>
    );
  };

  const deps = {apiCommand};
  const actionSheetDef =
    typeof actionSheet === 'function' ? actionSheet(deps) : actionSheet;
  const {header} = actionSheetDef;
  let {options, hasCancelButton} = actionSheetDef;

  if (!Array.isArray(options)) {
    hasCancelButton = true;
    options = [];
    console.error('Actionsheet called with no options!', actionSheetDef);
  }

  return (
    <Modal
      animationType="fade"
      transparent
      visible={!!actionSheet}
      onRequestClose={closeActionSheet}>
      <View style={styles.modal}>
        <View style={styles.actionSheetOuterContainer}>
          <View style={styles.container}>
            {header && renderHeader(header)}
            {renderOptions(options)}
          </View>
          {hasCancelButton && renderCancelButton()}
        </View>
      </View>
    </Modal>
  );
};

ActionSheetManager.propTypes = {
  closeActionSheet: PropTypes.func,
  apiCommand: PropTypes.func,
  actionSheet: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

const mapStateToProps = (state, ownProps) => ({
  actionSheet: ownProps.actionSheet || state.general.actionSheet,
});

const mapDispatchToProps = {closeActionSheet, apiCommand};

export default connect(mapStateToProps, mapDispatchToProps)(ActionSheetManager);
