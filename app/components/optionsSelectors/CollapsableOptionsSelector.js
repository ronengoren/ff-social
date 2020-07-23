import React, {Component} from 'react';
import PropTypes from 'prop-types';
import I18n from '../../infra/localization';
import {StyleSheet, Animated} from 'react-native';
import {View, Chip, Spinner} from '../basicComponents';
import {AwesomeIcon} from '../../assets/icons';
import {clone} from '/infra/utils';
import {addSpaceOnCapitalsAndCapitalize} from '../../infra/utils/stringUtils';
import {flipFlopColors} from '../../vars';
import {stylesScheme} from '../../schemas';

const CHIP_HEIGHT = 34;
const CHIP_MARGIN = 10;
const NUM_OF_LINES = 3;

const styles = StyleSheet.create({
  optionsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  expandableDemiInnerWrapper: {
    overflow: 'hidden',
  },
  expandableDemiWrapper: {
    position: 'absolute',
    top: 200000,
    left: 0,
    right: 0,
    zIndex: -10,
  },
  optionStyle: {
    borderRadius: 18,
    height: CHIP_HEIGHT,
    marginBottom: CHIP_MARGIN,
    marginRight: 7,
  },
  textStyle: {
    fontSize: 13,
  },
  spinner: {
    height: 70,
  },
  caretIcon: {
    marginLeft: 7,
    lineHeight: 30,
  },
});

const MORE_OPTION_NAME = 'more';

class CollapsableOptionsSelector extends Component {
  state = {
    isExpanded: false,
    isCalculating: true,
    moreButtonPosition: -1,
    containerWidth: 0,
    expandedHeight: 0,
    tagsContainerMaxHeight: new Animated.Value(0),
  };

  constructor(props) {
    super(props);
    this.chipsSizes = {};
  }

  render() {
    const {isCalculating, tagsContainerMaxHeight} = this.state;
    const {style} = this.props;
    return (
      <View>
        {isCalculating && (
          <View style={styles.expandableDemiWrapper}>
            <View
              style={[styles.optionsWrapper, styles.expandableDemiInnerWrapper]}
              onLayout={this.onLayout}>
              {this.renderOptions({addMeasureFunc: true})}
            </View>
          </View>
        )}
        {isCalculating ? (
          <Spinner
            center
            color={flipFlopColors.white}
            size="large"
            style={styles.spinner}
          />
        ) : (
          <Animated.View
            style={[
              styles.optionsWrapper,
              style,
              {maxHeight: tagsContainerMaxHeight},
            ]}>
            {this.renderOptions({addMeasureFunc: false})}
          </Animated.View>
        )}
      </View>
    );
  }

  renderOptions = ({addMeasureFunc = false}) => {
    const {
      optionsList,
      selectedOptionIndex,
      selectOption,
      color,
      optionStyle,
      textStyle,
    } = this.props;
    const {isExpanded, moreButtonPosition} = this.state;
    let clonedList = clone(optionsList);

    let options = [];

    if (addMeasureFunc) {
      clonedList.push(MORE_OPTION_NAME);
    } else if (moreButtonPosition > 0 && !isExpanded) {
      clonedList = clonedList.slice(0, moreButtonPosition);
      clonedList.push(MORE_OPTION_NAME);
    }

    if (clonedList && clonedList.length) {
      options = clonedList.map((option, index) => (
        <Chip
          style={optionStyle || styles.optionStyle}
          color={color}
          active={index === selectedOptionIndex}
          key={option}
          onPress={() =>
            option === MORE_OPTION_NAME
              ? this.onMoreClicked()
              : selectOption(index)
          }
          textStyle={textStyle || styles.textStyle}
          isBold
          onLayout={
            addMeasureFunc
              ? ({nativeEvent}) => this.onChipLayout({nativeEvent, key: option})
              : null
          }
          afterTextComponent={
            option === MORE_OPTION_NAME && (
              <AwesomeIcon
                name="caret-down"
                size={14}
                color={flipFlopColors.b30}
                style={styles.caretIcon}
                weight="solid"
              />
            )
          }>
          {I18n.t(`shared.tags.${option}`, {
            defaultValue: addSpaceOnCapitalsAndCapitalize(option),
          })}
        </Chip>
      ));
    }

    return options;
  };

  calculateMorePosition = () => {
    const {optionsList} = this.props;
    const {moreButtonPosition, containerWidth} = this.state;

    let morePos = moreButtonPosition;
    if (moreButtonPosition === -1) {
      const moreChip = this.chipsSizes[MORE_OPTION_NAME];
      const lastLineChips = [];
      Object.keys(this.chipsSizes).forEach((option) => {
        const chip = this.chipsSizes[option];
        // Math.floor because on some Android devices y can be 44.15123 and not 44.
        if (
          Math.floor(chip.y) ===
          CHIP_HEIGHT * (NUM_OF_LINES - 1) + CHIP_MARGIN * (NUM_OF_LINES - 1)
        ) {
          lastLineChips.push({...chip, option});
        }
      });
      lastLineChips.sort((a, b) => b.x - a.x);
      const candidate = lastLineChips[0];
      morePos = optionsList.indexOf(lastLineChips[0].option);
      if (
        containerWidth - candidate.x - candidate.width >
        moreChip.width + CHIP_MARGIN
      ) {
        morePos += 1;
      } else if (
        containerWidth - candidate.x - moreChip.width - CHIP_MARGIN <
        0
      ) {
        morePos -= 1;
      }
      this.setState({moreButtonPosition: morePos});
    }
  };

  onMoreClicked = () => {
    const {expandedHeight} = this.state;
    Animated.timing(this.state.tagsContainerMaxHeight, {
      toValue: expandedHeight,
      duration: 300,
    }).start();
    this.setState({isExpanded: true});
  };

  calculateExpandableSize = () => {
    let toHeight = 0;
    Object.keys(this.chipsSizes).forEach((chipname) => {
      const chipBottom =
        this.chipsSizes[chipname].y + this.chipsSizes[chipname].height;
      if (chipname !== MORE_OPTION_NAME && toHeight < chipBottom) {
        toHeight = chipBottom;
      }
    });
    this.setState({expandedHeight: toHeight});
    this.state.tagsContainerMaxHeight.setValue(
      CHIP_HEIGHT * NUM_OF_LINES + CHIP_MARGIN * (NUM_OF_LINES - 1),
    );
  };

  onChipLayout = async ({nativeEvent, key}) => {
    const {width, height, x, y} = nativeEvent.layout;
    const {optionsList} = this.props;
    const {isCalculating} = this.state;

    this.chipsSizes[key] = {width, height, x, y};
    if (
      isCalculating &&
      Object.keys(this.chipsSizes).length > optionsList.length
    ) {
      const isOverflowed = Object.keys(this.chipsSizes).some(
        (chipOptionName) => {
          const chipSize = this.chipsSizes[chipOptionName];
          return (
            chipOptionName !== MORE_OPTION_NAME &&
            chipSize.y >
              CHIP_HEIGHT * NUM_OF_LINES + CHIP_MARGIN * (NUM_OF_LINES - 1)
          );
        },
      );
      if (isOverflowed) {
        this.calculateMorePosition();
      }
      this.calculateExpandableSize();
      this.setState({isCalculating: false});
    }
  };

  onLayout = ({nativeEvent}) => {
    const {width} = nativeEvent.layout;

    this.setState({
      containerWidth: width,
    });
  };
}

CollapsableOptionsSelector.defaultProps = {
  color: flipFlopColors.b30,
};

CollapsableOptionsSelector.propTypes = {
  optionsList: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectOption: PropTypes.func.isRequired,
  selectedOptionIndex: PropTypes.number,
  color: PropTypes.string,
  style: stylesScheme,
  textStyle: stylesScheme,
  optionStyle: stylesScheme,
};

export default CollapsableOptionsSelector;
