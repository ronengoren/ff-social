import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Platform} from 'react-native';
import I18n from '../../infra/localization';
import {
  View,
  Text,
  KeyboardAwareScrollView,
  Separator,
  Checkbox,
  TextButton,
  Switch,
  Picker,
} from '../../components/basicComponents';
import {Screen} from '../../components';
import {GenericConfirmationModal} from '../../components/modals';
import {flipFlopColors, flipFlopFonts, flipFlopFontsWeights} from '../../vars';
import {relationshipType} from '../../vars/enums';
import {navigationService} from '../../infra/navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: flipFlopColors.fillGrey,
  },
  scrollView: {
    flex: 1,
    backgroundColor: flipFlopColors.white,
  },
  innerContainer: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  header: {
    height: 20,
    marginTop: 15,
    marginBottom: 30,
    fontFamily: flipFlopFonts.medium,
    fontWeight: flipFlopFontsWeights.medium,
    fontSize: 20,
    lineHeight: 20,
    color: flipFlopColors.black,
  },
  singleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  singleLineText: {
    height: 30,
    fontSize: 16,
    lineHeight: 30,
    marginLeft: 15,
    color: flipFlopColors.black,
  },
  complexSingleLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  complexSingleLineInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  numOfKidsWrapper: {
    width: 50,
    height: 34,
  },
  numOfKidsWrapperActive: {
    borderBottomWidth: 2,
    borderBottomColor: flipFlopColors.green,
  },
  numOfKidsText: {
    width: 50,
    height: 32,
    lineHeight: 30,
    textAlign: 'center',
  },
  toggleLine: {
    width: '100%',
    height: 60,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: flipFlopColors.white,
  },
  toggleLineText: {
    height: 22,
    fontFamily: flipFlopFonts.medium,
    fontWeight: flipFlopFontsWeights.medium,
    fontSize: 15,
    lineHeight: 22.0,
    color: flipFlopColors.black,
  },
  modalContent: {
    height: '50%',
  },
  pickerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  picker: {
    flex: 1,
    width: Platform.select({ios: '100%', android: 100}),
  },
});

const kidsCounter = (() => {
  const data = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i <= 30; i++) {
    data.push({
      label: `${i}`,
      value: i,
    });
  }
  return data;
})();

class EditProfileRelationship extends React.Component {
  constructor(props) {
    super(props);
    // const {
    //   navigation: {
    //     state: {
    //       params: {
    //         data: {relationship, numOfKids, showRelationship},
    //       },
    //     },
    //   },
    // } = props;
    // this.state = {
    //   selectedRelationship: relationship,
    //   gotKids: numOfKids > 0,
    //   numOfKids: numOfKids > 0 ? numOfKids : 0,
    //   showRelationship,
    //   showChildrenNumSelectorModal: false,
    // };
  }

  render() {
    // const {
    //   selectedRelationship,
    //   gotKids,
    //   numOfKids,
    //   showRelationship,
    // } = this.state;
    const relations = Object.values(relationshipType);
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          style={styles.scrollView}
          extraHeight={140}
          keyboardDismissMode={'on-drag'}>
          <View style={styles.innerContainer}>
            <Text style={styles.header}>
              {I18n.t('profile.edit.relationship.checkboxes_title')}
            </Text>
            {relations.map((value) => {
              if (value === relations.length - 1) {
                return null;
              }
              return (
                <View style={styles.singleLine} key={`relationship${value}`}>
                  <Checkbox
                    onChange={this.onRelationshipChange(value)}
                    value={'selectedRelationship === value'}
                  />
                  <Text style={styles.singleLineText}>
                    {I18n.t(`profile.edit.relationship.options.${value}`)}
                  </Text>
                </View>
              );
            })}
            <Text style={styles.header}>
              {I18n.t('profile.edit.relationship.kids_checkboxes_title')}
            </Text>
            <View style={styles.complexSingleLine}>
              <View style={styles.complexSingleLineInner}>
                <Checkbox onChange={this.toggleGotKids} value={'gotKids'} />
                <Text style={styles.singleLineText}>
                  {I18n.t('profile.edit.relationship.have_kids')}
                </Text>
              </View>
              <View style={[styles.numOfKidsWrapper]}>
                <Text
                  style={styles.numOfKidsText}
                  // onPress={() => this.showChildrenNumSelectorModal(true)}
                >
                  {/* {numOfKids} */}
                </Text>
              </View>
            </View>
          </View>
          <Separator height={5} />
          <View style={styles.toggleLine}>
            <Text style={styles.toggleLineText}>
              {I18n.t('profile.edit.relationship.privacy_toggle_label')}
            </Text>
            <Switch
              onChange={this.toggleSettingsShowRelationship}
              // active={showRelationship}
            />
          </View>
        </KeyboardAwareScrollView>
        <TextButton footerButton size="huge" onPress={this.onSave}>
          {I18n.t('common.buttons.save')}
        </TextButton>
        <GenericConfirmationModal
          // show={this.state.showChildrenNumSelectorModal}
          headerText={I18n.t('profile.edit.kid_selector_modal.header')}
          confirmText={I18n.t('profile.edit.kid_selector_modal.ok_button')}
          confirmTextColor={flipFlopColors.green}
          cancelText={I18n.t('profile.edit.kid_selector_modal.cancel_button')}
          onCancel={() => this.closeChildrenNumSelectorModal(false)}
          onConfirm={() => this.closeChildrenNumSelectorModal(true)}
          wrapperStyle={styles.modalContent}>
          <View style={styles.pickerContainer}>
            <Picker
              data={kidsCounter}
              selectedValue={'numOfKids'}
              onChange={(val) => this.setState({numOfKids: val})}
              style={styles.picker}
            />
          </View>
        </GenericConfirmationModal>
      </View>
    );
  }

  onRelationshipChange = (type) => () => {
    // this.setState({
    //   selectedRelationship: type,
    // });
  };

  toggleGotKids = () => {
    // const nextValue = !this.state.gotKids;
    // this.setState({
    //   gotKids: nextValue,
    //   numOfKids: nextValue ? 1 : 0,
    // });
    // if (nextValue) {
    //   this.showChildrenNumSelectorModal(false);
    // }
  };

  toggleSettingsShowRelationship = () => {
    this.setState({showRelationship: !this.state.showRelationship});
  };

  showChildrenNumSelectorModal = (updateMode) => {
    this.setState({
      showChildrenNumSelectorModal: true,
      modalInUpdateMode: updateMode,
    });
  };

  closeChildrenNumSelectorModal = (updateNumOfKids) => {
    // const {modalInUpdateMode} = this.state;
    // const newState = {showChildrenNumSelectorModal: false};
    // if (!modalInUpdateMode && !updateNumOfKids) {
    //   newState.gotKids = false;
    // }
    // this.setState({
    //   ...this.state,
    //   ...newState,
    // });
  };

  onSave = () => {
    // const {
    //   navigation: {
    //     state: {
    //       params: {saveAction},
    //     },
    //   },
    // } = this.props;
    // const {selectedRelationship, numOfKids, showRelationship} = this.state;
    // saveAction({
    //   relationship: selectedRelationship,
    //   numOfKids,
    //   showRelationship,
    // });
    // navigationService.goBack();
  };
}

EditProfileRelationship.propTypes = {
  // navigation: PropTypes.object,
};

EditProfileRelationship = Screen()(EditProfileRelationship);
export default EditProfileRelationship;
