import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Modal, StyleSheet, View, Animated, Dimensions} from 'react-native';
import I18n from '../../infra/localization';
import {Text, IconButton} from '../basicComponents';
import {ThemesChipsList} from '../themes';
import {ErrorModal} from '../../components/modals';
import {saveToThemes} from '../../redux/themes/actions';
import {flipFlopColors} from '../../vars';
import {entityTypes, originTypes} from '../../vars/enums';
import {userScheme} from '../../schemas';

const MARGIN_HORIZONTAL = 15;

const styles = StyleSheet.create({
  fadeContainer: {
    flex: 1,
    backgroundColor: flipFlopColors.paleBlack,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  innerContainer: {
    width: '100%',
    backgroundColor: flipFlopColors.white,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  body: {
    paddingHorizontal: MARGIN_HORIZONTAL,
    paddingTop: 12,
    paddingBottom: 7,
  },
  header: {
    marginBottom: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 11,
    right: 11,
    zIndex: 999,
    backgroundColor: flipFlopColors.transparent,
  },
  scrollView: {
    marginTop: 11,
    marginBottom: 9,
  },
  progressBarWrapper: {
    width: '100%',
    height: 3,
    borderRadius: 1,
  },
  progressBar: {
    height: 3,
    borderRadius: 1,
    backgroundColor: flipFlopColors.green,
  },
});

const CLOSE_TIME = 2000;

class SaveModal extends React.Component {
  constructor(props) {
    super(props);
    const {height} = Dimensions.get('window');
    this.state = {
      progressBarWidth: new Animated.Value(0),
      translateY: new Animated.Value(height),
      backgroundColorOpacity: new Animated.Value(0),
      saved: false,
      selectedThemes: props.preSelectedThemes.length
        ? props.preSelectedThemes
        : ['other'],
    };
  }

  render() {
    const {backgroundColorOpacity} = this.state;
    const backgroundColor = backgroundColorOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(46, 59, 79, 0)', 'rgba(46, 59, 79, 0.5)'],
    });
    return (
      <Modal
        transparent
        visible
        onRequestClose={() => {}}
        onShow={this.showContentAnimation}>
        <Animated.View style={[styles.fadeContainer, {backgroundColor}]}>
          <Animated.View
            style={[
              styles.container,
              {transform: [{translateY: this.state.translateY}]},
            ]}
            onRequestClose={() => {}}>
            <View style={styles.innerContainer}>
              <IconButton
                name="close"
                onPress={this.closeModal}
                iconColor="b70"
                iconSize={16}
                style={styles.closeButton}
              />
              {this.renderBody()}
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    );
  }

  componentDidMount() {
    this.saveToThemes();
  }

  renderBody() {
    const {saved} = this.state;

    if (saved) {
      return this.renderSavedBody();
    } else {
      return null;
    }
  }

  renderSavedBody() {
    const {selectedThemes, progressBarWidth} = this.state;
    const progressBarActualWidth = progressBarWidth.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    });

    return [
      <View style={styles.body} key="unsavedBody">
        {this.renderBodyHeader()}
        <ThemesChipsList
          themes={selectedThemes}
          isShowSaved
          preNavAction={this.closeModal}
          originType={originTypes.SAVED_THEME}
          style={styles.scrollView}
        />
      </View>,
      <View style={styles.progressBarWrapper} key="progressBar">
        <Animated.View
          style={[styles.progressBar, {width: progressBarActualWidth}]}
        />
      </View>,
    ];
  }

  renderBodyHeader() {
    const {saved} = this.state;
    return [
      <Text
        size={16}
        lineHeight={21}
        bold
        color={flipFlopColors.realBlack}
        style={styles.header}
        key="header">
        {I18n.t(`save_modal.${saved ? 'saved_' : ''}header`)}
      </Text>,
      <Text
        size={16}
        lineHeight={21}
        color={flipFlopColors.b60}
        key="subheader">
        {I18n.t(`save_modal.${saved ? 'saved_' : ''}subheader`)}
      </Text>,
    ];
  }

  handleThemeToggle = (theme) => {
    const themeIndex = this.state.selectedThemes.findIndex(
      (item) => item === theme.theme,
    );
    if (themeIndex > -1) {
      this.setState({
        selectedThemes: [
          ...this.state.selectedThemes.slice(0, themeIndex),
          ...this.state.selectedThemes.slice(themeIndex + 1),
        ],
      });
    } else {
      this.setState({
        selectedThemes: [...this.state.selectedThemes, theme.theme],
      });
    }
  };

  closeModal = () => {
    const {saved, progressBarWidth} = this.state;

    if (saved) {
      // Stopping the animation triggers this.hideContentAnimation
      Animated.timing(progressBarWidth).stop();
    } else {
      this.hideContentAnimation();
    }
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

  hideContentAnimation = () => {
    const {onClose} = this.props;
    const {height} = Dimensions.get('window');

    Animated.parallel([
      Animated.timing(this.state.translateY, {toValue: height, duration: 400}),
      Animated.timing(this.state.backgroundColorOpacity, {
        toValue: 0,
        duration: 400,
      }),
    ]).start(onClose);
  };

  saveDisabled = () => {
    const {selectedThemes} = this.state;
    return !selectedThemes.length;
  };

  saveToThemes = async () => {
    const {selectedThemes} = this.state;
    const {
      saveToThemes,
      entityId,
      entityType,
      entitySubType,
      onClose,
      user,
      name,
      creator,
      parentId,
      themes,
      ...restProps
    } = this.props;

    try {
      await saveToThemes({
        themes: selectedThemes,
        entityId,
        entityType,
        entitySubType,
        actor: user,
        entityName: name,
        creator,
        parentId,
        ...restProps,
      });
      this.setState({saved: true});

      Animated.timing(this.state.progressBarWidth, {
        toValue: 1,
        duration: CLOSE_TIME,
      }).start(this.hideContentAnimation);
    } catch (err) {
      ErrorModal.showAlert();
    }
  };
}

SaveModal.propTypes = {
  themes: PropTypes.arrayOf(PropTypes.object),
  saveToThemes: PropTypes.func,
  onClose: PropTypes.func,
  entityId: PropTypes.string,
  entityType: PropTypes.oneOf(Object.values(entityTypes)),
  entitySubType: PropTypes.string,
  user: userScheme,
  name: PropTypes.string,
  creator: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
  }),
  parentId: PropTypes.string,
  preSelectedThemes: PropTypes.arrayOf(PropTypes.string),
};

const mapStateToProps = (state) => ({
  themes: state.themes.savedThemes,
  user: state.auth.user,
});

const mapDispatchToProps = {
  saveToThemes,
};

SaveModal = connect(mapStateToProps, mapDispatchToProps)(SaveModal);
export default SaveModal;
