import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import I18n from '../../infra/localization';
import {
  View,
  Text,
  Separator,
  Checkbox,
  TextButton,
  Switch,
} from '../../components/basicComponents';
import {Screen} from '../../components';
import {flipFlopColors, flipFlopFonts, flipFlopFontsWeights} from '../../vars';
import {genderType} from '../../vars/enums';
import {navigationService} from '../../infra/navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: flipFlopColors.fillGrey,
  },
  innerContainer: {
    flex: 1,
    paddingTop: 30,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: flipFlopColors.white,
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
  toggleLine: {
    width: '100%',
    height: 60,
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
});

class EditProfileGender extends React.Component {
  constructor(props) {
    super(props);
    // const {
    //   navigation: {
    //     state: {
    //       params: {
    //         data: {gender, showGender},
    //       },
    //     },
    //   },
    // } = props;
    this.state = {
      selectedGender: ['1', '2'],
      showGender: true,
    };
  }

  render() {
    const {selectedGender, showGender} = this.state;
    const genders = Object.values(genderType);
    return (
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.header}>
            {I18n.t('profile.edit.gender.checkboxes_title')}
          </Text>
          {genders.map((value) => {
            if (value === genders.length - 1) {
              return null;
            }
            return (
              <View style={styles.singleLine} key={`gender${value}`}>
                <Checkbox
                  onChange={this.onGenderChange(value)}
                  value={selectedGender === value}
                />
                <Text style={styles.singleLineText}>
                  {I18n.t(`profile.gender.${value}`)}
                </Text>
              </View>
            );
          })}
        </View>
        {false && ( // TODO: toggle is hidden until further decision by product
          <View style={styles.toggleLine}>
            <Separator height={5} />
            <Text style={styles.toggleLineText}>Show this on my profile</Text>
            <Switch
              onChange={this.toggleSettingsShowGender}
              active={showGender}
            />
          </View>
        )}
        <TextButton footerButton size="huge" onPress={this.onSave}>
          Save
        </TextButton>
      </View>
    );
  }

  onGenderChange = (gender) => () => {
    this.setState({
      selectedGender: gender,
    });
  };

  toggleSettingsShowGender = () => {
    this.setState({showGender: !this.state.showGender});
  };

  onSave = () => {
    const {
      navigation: {
        state: {
          params: {saveAction},
        },
      },
    } = this.props;
    const {selectedGender, showGender} = this.state;
    saveAction({gender: selectedGender, showGender});
    navigationService.goBack();
  };
}

EditProfileGender.propTypes = {
  navigation: PropTypes.object,
};

EditProfileGender = Screen()(EditProfileGender);
export default EditProfileGender;
