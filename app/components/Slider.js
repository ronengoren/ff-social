import React from 'react';
import PropTypes from 'prop-types';

import {View, ScrollView, Platform, StyleSheet} from 'react-native'; // eslint-disable-line react-native/split-platform-components
import {flipFlopColors} from '../vars';
import {stylesScheme} from '../schemas';

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
  },
  swipeButtonsWrapper: {
    width: '100%',
    height: 7,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 30,
  },
  swipeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 61,
    height: 7,
  },
  swipeButton: {
    width: 7,
    height: 7,
    borderRadius: 50,
    backgroundColor: flipFlopColors.disabledGrey,
  },
  swipeButtonActive: {
    backgroundColor: flipFlopColors.green,
  },
});

class Slider extends React.Component {
  constructor(props) {
    super(props);

    this.platform = Platform.OS;

    this.state = {
      offsetX: props.initialSlide * props.sliderWidth || 0,
      currentSlide: props.initialSlide,
      isScrolling: false,
    };
  }

  render() {
    const {style, showBullets} = this.props;

    return (
      <View style={[styles.container, style]}>
        {this.renderSlider()}
        {showBullets && this.renderIndicatorButtons()}
      </View>
    );
  }

  componentDidMount() {
    const {autoPlay} = this.props;
    const {offsetX} = this.state;
    // this if statement exists because 'contentSetOff' prop in scrollView supports only ios and this statement solves it for android.
    if (this.platform === 'android') {
      setTimeout(
        () =>
          this.scrollView &&
          this.scrollView.scrollTo({x: offsetX, animated: false}),
        0,
      );
    }
    autoPlay && this.autoPlay();
  }

  componentDidUpdate(prevProps) {
    const {sliderWidth, autoPlay} = this.props;
    const {isScrolling} = this.state;
    if (sliderWidth !== prevProps.sliderWidth && !isScrolling) {
      this.updateOffset();
    }

    if (!autoPlay) {
      clearTimeout(this.autoPlayTimer);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.autoPlayTimer);
  }

  renderSlider = () => {
    const {offsetX} = this.state;
    const {slidePadding, sliderWidth, contentContainerStyle} = this.props;

    return (
      <ScrollView
        ref={(scroll) => {
          this.scrollView = scroll;
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentOffset={{x: offsetX, y: 0}} // this prop supports only ios platform
        onScrollBeginDrag={this.handleScrollBeginDrag}
        onMomentumScrollEnd={this.handleMomentumScrollEnd}
        onScrollEndDrag={this.handleScrollEndDrag}
        snapToInterval={sliderWidth + slidePadding}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={contentContainerStyle}>
        {this.renderSlides()}
      </ScrollView>
    );
  };

  renderSlides() {
    const {offsetX, currentSlide, isScrolling} = this.state;
    const {children, slidePadding, sliderWidth} = this.props;

    return children({
      width: sliderWidth,
      position: offsetX,
      currentSlide,
      isScrolling,
      ...(slidePadding ? {marginRight: slidePadding} : {}),
    });
  }

  renderIndicatorButtons = () => {
    const {numberOfSlides} = this.props;
    const {currentSlide} = this.state;
    const buttons = [];
    for (let i = 0; i < numberOfSlides; i += 1) {
      buttons.push(
        <View
          key={`SlideButton${i}`}
          style={[
            styles.swipeButton,
            currentSlide === i && styles.swipeButtonActive,
          ]}
        />,
      );
    }
    return (
      <View style={styles.swipeButtonsWrapper}>
        <View style={styles.swipeButtons}>{buttons}</View>
      </View>
    );
  };

  handleScrollBeginDrag = () => {
    this.setState({isScrolling: true});
  };

  handleMomentumScrollEnd = (event) => {
    const {sliderWidth} = this.props;

    this.setState({isScrolling: false});
    let currentOffset = event.nativeEvent.contentOffset;
    if (!currentOffset) {
      // android event adjustment
      currentOffset = {x: event.nativeEvent.position * sliderWidth};
    }
    this.updateIndex({currentOffsetX: currentOffset.x});
  };

  handleScrollEndDrag = (e) => {
    const {children} = this.props;
    const {currentSlide, offsetX} = this.state;
    const {contentOffset} = e.nativeEvent;
    const newOffset = contentOffset.x;

    if (
      offsetX === newOffset &&
      (currentSlide === 0 || currentSlide === children.length - 1)
    ) {
      this.setState({isScrolling: false});
    }
  };

  updateOffset = () => {
    this.setState({offsetX: this.state.currentSlide * this.props.sliderWidth});
  };

  updateIndex = ({currentOffsetX}) => {
    const {currentSlide, offsetX} = this.state;
    const {sliderWidth} = this.props;
    const diff = currentOffsetX - offsetX;

    if (!diff) return;

    // Note: if touch very very quickly and continuous,
    // the variation of `currentSlide` more than 1.
    // parseInt() ensures it's always an integer
    const nextSlide = parseInt(
      currentSlide + Math.round(diff / sliderWidth),
      10,
    );

    this.setState(
      {
        offsetX: currentOffsetX,
        currentSlide: nextSlide,
      },
      () => {
        this.autoPlay();
      },
    );
  };

  scrollToNextSlide = () => {
    const {isScrolling, currentSlide} = this.state;
    const {sliderWidth} = this.props;
    if (isScrolling) return;
    const diff = currentSlide + 1;
    const x = diff * sliderWidth;

    this.scrollView && this.scrollView.scrollTo({x, y: 0, animated: true});

    this.setState({isScrolling: true});

    if (this.platform === 'android') {
      // trigger onScrollEnd manually in android
      setImmediate(() => {
        this.handleMomentumScrollEnd({
          nativeEvent: {
            position: diff,
          },
        });
      });
    }
  };

  autoPlay = () => {
    const {numberOfSlides, autoPlay} = this.props;
    const {isScrolling, currentSlide} = this.state;
    if (!autoPlay || isScrolling) return;

    clearTimeout(this.autoPlayTimer);
    if (currentSlide + 1 < numberOfSlides) {
      this.autoPlayTimer = setTimeout(() => {
        this.scrollToNextSlide();
      }, 3500);
    }
  };
}

Slider.defaultProps = {
  slidePadding: 0,
  initialSlide: 0,
};

Slider.propTypes = {
  initialSlide: PropTypes.number,
  children: PropTypes.func.isRequired,
  style: stylesScheme,
  numberOfSlides: PropTypes.number.isRequired,
  autoPlay: PropTypes.bool,
  showBullets: PropTypes.bool,
  sliderWidth: PropTypes.number,
  slidePadding: PropTypes.number,
  contentContainerStyle: stylesScheme,
};

export default Slider;
