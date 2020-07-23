import React from 'react';
import I18n from '../../infra/localization';
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import {Text, View, ScrollView} from '../basicComponents';
import {flipFlopColors, uiConstants} from '../../vars';
import ListMenu from './listMenu';
import {listMenuItemSchema, listMenuQuerySchema} from './schema';

const CONTAINER_PADDING_BOTTOM = 0;
const CONTAINER_PADDING_TOP = 200;
const HOOD_CONTAINER_PADDING_TOP = 100;
const BTN_HITSLOP = {top: 15, right: 15, bottom: 15, left: 15};

const isIOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  outerContainer: {
    justifyContent: 'flex-end',
    width: '100%',
    height: '100%',
    paddingTop: 250,
  },
  innerContainer: {
    paddingBottom: uiConstants.FOOTER_MARGIN_BOTTOM,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: flipFlopColors.transparent,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 15,
    backgroundColor: flipFlopColors.white,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomWidth: 1,
    borderBottomColor: flipFlopColors.paleGreyTwo,
  },
  filtersWrapper: {
    paddingHorizontal: 15,
    paddingBottom: uiConstants.FOOTER_MARGIN_BOTTOM + 20,
    backgroundColor: flipFlopColors.white,
  },
  headerLessFiltersWrapper: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
});

class ListMenuModal extends React.Component {
  constructor(props) {
    super(props);
    const {height} = Dimensions.get('window');

    this.state = {
      isVisible: true,
      translateY: new Animated.Value(height),
      backgroundColorOpacity: new Animated.Value(0),
      paddingBottom: new Animated.Value(CONTAINER_PADDING_BOTTOM),
      paddingTop: new Animated.Value(CONTAINER_PADDING_TOP),
    };
  }

  render() {
    const {headerText, isHeaderShown, isSubmitVisible} = this.props;

    const {
      backgroundColorOpacity,
      translateY,
      paddingBottom,
      paddingTop,
      isVisible,
    } = this.state;
    const backgroundColor = backgroundColorOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(125, 152, 179, 0)', 'rgba(125, 152, 179, 0.5)'],
    });

    return (
      isVisible && (
        <Modal
          transparent
          visible
          onRequestClose={() => {}}
          onShow={this.showContentAnimation}>
          <TouchableOpacity
            onPress={() => this.hideContentAnimation()}
            activeOpacity={1}>
            <Animated.View
              style={[
                styles.outerContainer,
                {paddingBottom, paddingTop, backgroundColor},
              ]}>
              <Animated.View style={{transform: [{translateY}]}}>
                <TouchableOpacity
                  onPress={() => {}}
                  activeOpacity={1}
                  style={styles.innerContainer}>
                  {isHeaderShown && (
                    <View style={styles.header}>
                      <Text
                        size={16}
                        lineHeight={21}
                        color={flipFlopColors.b30}
                        bold>
                        {headerText}
                      </Text>
                      {isSubmitVisible && (
                        <TouchableOpacity
                          onPress={this.handleSubmitPressed}
                          hitSlop={BTN_HITSLOP}>
                          <Text
                            size={16}
                            lineHeight={21}
                            color={flipFlopColors.green}
                            bold>
                            {I18n.t(`filters.ok_button`)}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}

                  <ScrollView
                    style={[
                      styles.filtersWrapper,
                      !isHeaderShown ? styles.headerLessFiltersWrapper : {},
                    ]}>
                    {this.renderList()}
                  </ScrollView>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      )
    );
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.handleKeyboardShown,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.handleKeyboardHidden,
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener && this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener && this.keyboardDidHideListener.remove();
  }

  onItemClick = ({id, isMultiLevel}) => {
    const {onClick, closeOnClick} = this.props;

    if (onClick) {
      onClick({id});
    }

    if (closeOnClick && !isMultiLevel) {
      this.hideContentAnimation();
    }
  };

  renderList = () => {
    const {...listProps} = this.props;

    return <ListMenu {...listProps} onClick={this.onItemClick} />;
  };

  handleSubmitPressed = () => {
    const {onFilter} = this.props;

    this.hideContentAnimation(onFilter);
  };

  handleKeyboardShown = (e) => {
    const {height} = e.endCoordinates;
    const animations = [
      Animated.timing(this.state.paddingTop, {
        toValue: HOOD_CONTAINER_PADDING_TOP,
        duration: 200,
      }),
    ];
    if (isIOS) {
      animations.unshift(
        Animated.timing(this.state.paddingBottom, {
          toValue: height,
          duration: 200,
        }),
      );
    }
    Animated.parallel(animations).start();
  };

  handleKeyboardHidden = () => {
    const animations = [
      Animated.timing(this.state.paddingTop, {
        toValue: CONTAINER_PADDING_TOP,
        duration: 200,
      }),
    ];
    if (isIOS) {
      animations.unshift(
        Animated.timing(this.state.paddingBottom, {
          toValue: CONTAINER_PADDING_BOTTOM,
          duration: 200,
        }),
      );
    }
    Animated.parallel(animations).start();
  };

  showContentAnimation = () => {
    Animated.parallel([
      Animated.timing(this.state.translateY, {toValue: 0, duration: 350}),
      Animated.timing(this.state.backgroundColorOpacity, {
        toValue: 1,
        duration: 350,
      }),
    ]).start();
  };

  hideContentAnimation = (onFilterAction) => {
    const {onClose} = this.props;
    const {height} = Dimensions.get('window');

    Animated.parallel([
      Animated.timing(this.state.translateY, {toValue: height, duration: 400}),
      Animated.timing(this.state.backgroundColorOpacity, {
        toValue: 0,
        duration: 400,
      }),
    ]).start(() => {
      this.setState({isVisible: false}, () => {
        onFilterAction && onFilterAction();
        onClose && onClose();
      });
    });
  };
}

ListMenuModal.defaultProps = {
  headerText: '',
  isHeaderShown: false,
  closeOnClick: false,
  isSubmitVisible: true,
  listStyle: {},
};

ListMenuModal.propTypes = {
  headerText: PropTypes.string,

  onClick: PropTypes.func,
  onSelect: PropTypes.func,
  items: PropTypes.arrayOf(listMenuItemSchema),
  selectedIds: PropTypes.arrayOf(PropTypes.string),
  isSelectable: PropTypes.bool,
  isMultiSelect: PropTypes.bool,

  isSubmitVisible: PropTypes.bool,
  isHeaderShown: PropTypes.bool,
  closeOnClick: PropTypes.bool,
  onFilter: PropTypes.func,
  onClose: PropTypes.func,

  listStyle: PropTypes.object,

  query: listMenuQuerySchema,
};

export default ListMenuModal;
