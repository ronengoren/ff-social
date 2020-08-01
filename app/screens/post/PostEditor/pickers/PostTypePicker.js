import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity, Animated, Dimensions} from 'react-native';
import I18n from '../../../../infra/localization';
import {View, Text, ScrollView} from '../../../../components/basicComponents';
import {AwesomeIcon} from '../../../../assets/icons';
import {flipFlopColors} from '../../../../vars';
import {restrictedCreationPostTypes} from '../../../../vars/constants';
import {
  postTypes,
  entityTypes,
  screenGroupNames,
  uiDefinitions,
  postUiDefinitions,
  uiColorDefinitions,
} from '../../../../vars/enums';
import {isRTL} from '../../../../infra/utils/stringUtils';
import {navigationService} from '../../../../infra/navigation';
import {shouldRestrictPostTypes} from '../../../../infra/utils';
import {userScheme} from '../../../../schemas';
import PostEditorHeader from '../PostEditorHeader';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
  },

  dummyItem: {
    width: 110,
    height: 10,
  },
  pickerWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    borderBottomColor: flipFlopColors.b90,
    borderBottomWidth: 1,
  },
  rtlPickerWrapper: {
    direction: 'rtl',
  },
  pickerIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    width: 30,
    borderRadius: 22,
    marginRight: 15,
  },
  pickerIconTextWrapper: {
    marginTop: 5,
  },
  pickerIconText: {
    textAlign: 'center',
  },
  rightMostItem: {
    marginLeft: 'auto',
  },
  pickerRoot: {
    flexDirection: 'row',
    borderTopRightRadius: 15,
    backgroundColor: flipFlopColors.white,
  },
  pickerLevelOneMenu: {
    flexShrink: 0,
  },
  pickerLevelOneMenuInner: {
    flex: 1,
    flexGrow: 1,
  },
  pickerLevelTwoMenu: {
    flexShrink: 0,
  },
  backButtonWrapper: {
    paddingTop: 10,
    paddingLeft: 20,
  },
  backButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    marginLeft: 10,
  },
  whiteBorderColor: {
    borderBottomColor: flipFlopColors.transparent,
  },
});

class PostTypePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slideMenu: new Animated.Value(0),
      slideMenuTop: null,
      slideMenuTrail: [],
    };
  }

  render() {
    const postTypesList = this.getAllowedPostTypes();
    const {slideMenu, slideMenuTop, slideMenuTrail} = this.state;
    const {height} = Dimensions.get('screen');
    return (
      <Animated.View
        style={[
          styles.pickerRoot,
          {height: height - PostEditorHeader.offsetFromTop},
        ]}>
        <Animated.View style={[styles.pickerLevelOneMenu, {right: slideMenu}]}>
          <View style={styles.pickerLevelOneMenuInner}>
            <ScrollView testID="postTypePicker">
              <View style={styles.wrapper}>
                {this.renderPostTypeSelectors({postTypesList})}
              </View>
            </ScrollView>
          </View>
        </Animated.View>

        {slideMenuTop && (
          <Animated.View
            style={[styles.pickerLevelTwoMenu, {right: slideMenu}]}>
            <View>
              <View style={styles.backButtonWrapper}>
                <TouchableOpacity onPress={this.menuBack} activeOpacity={0.5}>
                  <View style={styles.backButtonInner}>
                    <AwesomeIcon
                      name={'chevron-left'}
                      size={14}
                      color={flipFlopColors.green}
                    />
                    <Text
                      size={16}
                      color={flipFlopColors.green}
                      style={styles.backButtonText}>
                      {'Back'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <ScrollView>
                  <View
                    onLayout={this.subMenuOnLayout}
                    style={[styles.wrapper]}>
                    {this.renderPostTypeSelectors({
                      postTypesList: slideMenuTrail,
                    })}
                  </View>
                </ScrollView>
              </View>
            </View>
          </Animated.View>
        )}
      </Animated.View>
    );
  }

  renderPostTypeSelectors = ({postTypesList}) => {
    const res = postTypesList.map(({type, children}, index) =>
      this.renderPostTypeIcon({
        type,
        children,
        omitBorder: index === postTypesList.length - 1,
      }),
    );
    while (res.length < 6) {
      res.push(<View key={res.length} style={styles.dummyItem} />);
    }
    if (postTypesList.length > 6) {
      while (res.length < 9) {
        res.push(<View key={res.length} style={styles.dummyItem} />);
      }
    }
    return res;
  };

  renderPostTypeIcon = ({type, children, omitBorder}) => {
    const text = I18n.t(`post_editor.post_type_definitions.${type}.text`);
    const isRTLText = isRTL(text);
    const pickerStyle = [
      styles.pickerWrapper,
      omitBorder && styles.whiteBorderColor,
      isRTLText && styles.rtlPickerWrapper,
    ];
    if (children && children.length) {
      const {name: iconName, color: iconColor} = postUiDefinitions[type];
      return (
        <TouchableOpacity
          onPress={() => this.handleChildrenItemPress(type, children)}
          activeOpacity={0.5}
          style={pickerStyle}
          testID={`${type}PostType`}
          key={type}>
          <View style={[styles.pickerIcon]}>
            <AwesomeIcon
              name={iconName}
              weight="solid"
              size={22}
              color={iconColor}
            />
          </View>
          <View style={styles.pickerIconTextWrapper}>
            <Text
              size={16}
              lineHeight={17}
              numberOfLines={1}
              color={flipFlopColors.b30}
              style={styles.pickerIconText}>
              {text}
            </Text>
          </View>
          <View style={styles.rightMostItem}>
            <AwesomeIcon
              name={'chevron-right'}
              size={18}
              color={flipFlopColors.b30}
            />
          </View>
        </TouchableOpacity>
      );
    } else {
      const {name: iconName} = postUiDefinitions[type] || uiDefinitions[type];
      const color =
        (postUiDefinitions[type] || {}).color || uiColorDefinitions[type];
      return (
        <TouchableOpacity
          onPress={() => this.handlePostTypePress(type)}
          activeOpacity={0.5}
          style={pickerStyle}
          testID={`${type}PostType`}
          key={type}>
          <View style={[styles.pickerIcon]}>
            <AwesomeIcon
              name={iconName}
              weight="solid"
              size={22}
              color={color}
            />
          </View>
          <View style={styles.pickerIconTextWrapper}>
            <Text
              size={16}
              lineHeight={17}
              numberOfLines={1}
              color={flipFlopColors.b30}
              style={styles.pickerIconText}>
              {text}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
  };

  getAllowedPostTypes = () => {
    const {user, publishAs} = this.props;
    const basePostTpyesList = this.getPostTypesList();
    const restrictPostTypes = ({type}) =>
      !restrictedCreationPostTypes.includes(type);
    return shouldRestrictPostTypes(user, publishAs)
      ? basePostTpyesList.filter(restrictPostTypes)
      : basePostTpyesList;
  };

  getPostTypesList = () => {
    // const {postIn, publishAs, customPostTypesList} = this.props;
    // if (customPostTypesList) {
    //   return customPostTypesList.map((t) => ({type: t}));
    // } else if (postIn.entityType === entityTypes.NEIGHBORHOOD) {
    //   return [
    //     {type: postTypes.STATUS_UPDATE},
    //     {type: postTypes.TIP_REQUEST},
    //     {type: postTypes.RECOMMENDATION},
    //     {type: postTypes.JOB},
    //     {type: entityTypes.EVENT},
    //     {type: postTypes.REAL_ESTATE},
    //     {type: postTypes.PROMOTION},
    //     {type: postTypes.GIVE_TAKE},
    //     {type: postTypes.GUIDE},
    //     {type: entityTypes.LIST},
    //   ];
    // } else if (postIn.entityType === entityTypes.EVENT) {
    //   return [
    //     {type: postTypes.STATUS_UPDATE},
    //     {type: postTypes.TIP_REQUEST},
    //     {type: postTypes.RECOMMENDATION},
    //     {type: entityTypes.LIST},
    //     {type: postTypes.GUIDE},
    //     {type: postTypes.PROMOTION},
    //   ];
    // } else if (
    //   [publishAs.type, publishAs.entityType].includes(entityTypes.PAGE)
    // ) {
    //   return [
    //     {type: postTypes.STATUS_UPDATE},
    //     {type: postTypes.TIP_REQUEST},
    //     {type: postTypes.RECOMMENDATION},
    //     {type: postTypes.JOB},
    //     {type: entityTypes.EVENT},
    //     {type: postTypes.REAL_ESTATE},
    //     {type: postTypes.PROMOTION},
    //     {type: postTypes.GIVE_TAKE},
    //     {type: postTypes.GUIDE},
    //     {type: entityTypes.LIST},
    //   ];
    // } else {
    //   return [
    //     {type: postTypes.STATUS_UPDATE},
    //     {type: postTypes.TIP_REQUEST},
    //     {type: postTypes.RECOMMENDATION},
    //     {type: postTypes.JOB},
    //     {type: entityTypes.EVENT},
    //     {type: postTypes.REAL_ESTATE},
    //     {type: postTypes.PROMOTION},
    //     {type: postTypes.GIVE_TAKE},
    //     {type: postTypes.GUIDE},
    //     {type: entityTypes.LIST},
    //     // Keeping the example here for sub menu in case we will use it in the future
    //     // {
    //     //   type: 'children',
    //     //   title: 'Publish',
    //     //   children: [{ type: entityTypes.EVENT }, { type: postTypes.JOB }, { type: postTypes.GIVE_TAKE }, { type: postTypes.REAL_ESTATE }, { type: postTypes.PROMOTION }]
    //     // }
    //   ];
    // }
  };

  subMenuOnLayout = () => {
    const {slideMenu} = this.state;
    const {width} = Dimensions.get('screen');
    setImmediate(() => {
      Animated.timing(slideMenu, {
        toValue: width,
        duration: 300,
        delay: 300,
      }).start();
    });
  };

  menuBack = () => {
    const {slideMenu} = this.state;
    Animated.timing(slideMenu, {
      toValue: 0,
      duration: 250,
      delay: 100,
    }).start(() => {
      this.setState({
        slideMenuTop: null,
        slideMenuTrail: [],
      });
    });
  };

  handleChildrenItemPress = (type, children) => {
    this.setState({
      slideMenuTop: type,
      slideMenuTrail: children,
    });
  };

  handlePostTypePress = (type) => {
    const {onTypeChanged} = this.props;
    if (type === entityTypes.EVENT) {
      this.navigateToEventCreate();
    } else {
      onTypeChanged(type);
    }
  };

  navigateToEventCreate = () => {
    const {publishAs, postIn} = this.props;
    navigationService.replace(screenGroupNames.CREATE_EVENT_MODAL, {
      publishAs,
      postIn,
    });
  };
}

PostTypePicker.propTypes = {
  user: userScheme,
  // onTypeChanged: PropTypes.func,
  // postIn: PropTypes.shape({
  //   id: PropTypes.string,
  //   entityType: PropTypes.string,
  //   name: PropTypes.string,
  //   media: PropTypes.object,
  // }),
  publishAs: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    media: PropTypes.object,
    entityType: PropTypes.string,
  }),
  customPostTypesList: PropTypes.arrayOf(PropTypes.string),
};

export default PostTypePicker;
