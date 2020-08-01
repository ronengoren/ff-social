import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity, Keyboard} from 'react-native';
import I18n from '../../../infra/localization';
import {connect} from 'react-redux';
import {Screen, SimpleHeader, FormInput} from '../../../components';
import {TagPicker} from '../../../components/formElements';
import {
  View,
  Text,
  ScrollView,
  ImagePlaceholder,
  Image,
  Switch,
} from '../../../components/basicComponents';
import {FlipFlopIcon} from '../../../assets/icons';
import {flipFlopColors, commonStyles} from '../../../vars';
import {
  groupPrivacyType,
  mediaTypes,
  screenNames,
  entityTypes,
  editModes,
} from '../../../vars/enums';
// import { NativeMediaPicker } from '/infra/media';
import {navigationService} from '../../../infra/navigation';
import {get} from '../../../infra/utils';
import useSlideUpModal from '../../../components/higherOrderComponents/useSlideUpModal';
import CountryPicker, {
  CoutrySearchModalContent,
} from '../../../components/basicComponents/CountryPicker';
import {isBoundlessEnabled} from '../../../infra/utils/communitiesNationalitiesUtils';

const styles = StyleSheet.create({
  bodyWrapper: {
    flex: 1,
    paddingTop: 15,
    paddingHorizontal: 15,
  },
  groupNameInput: {
    marginBottom: 0,
  },
  coverImage: {
    width: '100%',
    height: 120,
    marginBottom: 40,
    borderRadius: 12,
  },
  coverImageUpdateBtn: {
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: flipFlopColors.lightBlack,
    left: 15,
    bottom: 55,
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
  },
  coverImageUpdateBtnIcon: {
    marginRight: 5,
  },
  dummyInputWrapper: {
    justifyContent: 'center',
    width: '100%',
    height: 65,
    borderBottomWidth: 1,
    borderColor: flipFlopColors.b90,
  },
  groupTypeSelectorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: flipFlopColors.b90,
  },
  groupTypeSelectorHeader: {
    marginBottom: 4,
  },
});

class CreateGroup extends React.Component {
  constructor(props) {
    super(props);
    const {userCountryCode} = props;
    this.state = {
      name: {},
      description: '',
      tags: [],
      privacyType: groupPrivacyType.PUBLIC,
    };
    if (props.isShowCountryPicker) {
      this.state.contextCountryCode = [userCountryCode];
    }
  }

  render() {
    const {
      screenProps: {dismiss},
      isShowCountryPicker,
    } = this.props;
    const {name, tags, description, contextCountryCode} = this.state;
    const isNextStepEnabled = name.isValid && tags && tags.length;
    return (
      <View style={commonStyles.flex1} testID="groupCreateFirstScreen">
        <SimpleHeader
          cancelAction={dismiss}
          doneAction={this.proceedToNextScreen}
          doneText={I18n.t('groups.create.continue_button')}
          isDoneBtnActive={isNextStepEnabled}
          title={I18n.t('groups.create.screen_header')}
          testID="groupCreateFirstScreenSubmit"
        />
        <ScrollView keyboardDismissMode="on-drag" style={styles.bodyWrapper}>
          {this.renderGroupImage()}
          <FormInput
            value={this.state.name.value}
            isValid={this.state.name.isValid}
            onChange={this.changeInputHandler}
            errorText={this.state.name.errorText}
            validations={[]}
            label={I18n.t('groups.create.group_name_input_placeholder')}
            required
            autoFocus
            maxLength={50}
            testID="groupNameInput"
            style={styles.groupNameInput}
          />
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={this.navigateToAddDescription}
            style={styles.dummyInputWrapper}>
            <Text size={description ? 13 : 16} color={flipFlopColors.b60}>
              {I18n.t('groups.create.description')}
            </Text>
            {!!description && (
              <Text
                size={16}
                lineHeight={20}
                color={flipFlopColors.b30}
                numberOfLines={1}>
                {description}
              </Text>
            )}
          </TouchableOpacity>
          <TagPicker
            selectedTags={tags}
            updateFunc={({tags}) => this.setState({tags})}
            testID="selectGroupTag"
          />
          <View style={styles.groupTypeSelectorWrapper}>
            <View>
              <Text
                size={16}
                lineHeight={19}
                color={flipFlopColors.b60}
                style={styles.groupTypeSelectorHeader}>
                {I18n.t('groups.create.closed_group')}
              </Text>
              <Text size={13} lineHeight={15} color={flipFlopColors.b60}>
                {I18n.t('groups.create.type_selector')}
              </Text>
            </View>
            <Switch
              onChange={this.toggleGroupTypeHandler}
              activeColor={flipFlopColors.azure}
            />
          </View>
          {isShowCountryPicker && (
            <CountryPicker
              onPressChangeCountry={this.showCountryModal}
              changeCountryCode={this.changeCountryCode}
              onChange={this.toggleCountryGroup}
              contextCountryCode={contextCountryCode}
            />
          )}
        </ScrollView>
      </View>
    );
  }

  showCountryModal = ({onSelectResult}) => {
    const {showModal, hideModal} = this.props;
    showModal({
      content: (
        <CoutrySearchModalContent
          onClose={hideModal}
          onSelectResult={onSelectResult}
        />
      ),
    });
  };

  renderGroupImage = () => {
    const {mediaUrl} = this.state;
    return mediaUrl ? (
      <View>
        <Image
          style={styles.coverImage}
          source={{uri: mediaUrl}}
          resizeMode="cover"
        />
        <TouchableOpacity
          onPress={this.handleAddImage}
          activeOpacity={0.5}
          style={styles.coverImageUpdateBtn}>
          <FlipFlopIcon
            name="camera"
            size={22}
            color={flipFlopColors.white}
            style={styles.coverImageUpdateBtnIcon}
          />
          <Text size={14} lineHeight={30} color={flipFlopColors.white}>
            {I18n.t('groups.create.update_image_button')}
          </Text>
        </TouchableOpacity>
      </View>
    ) : (
      <ImagePlaceholder
        type="rectangular"
        size="small"
        text={I18n.t('groups.create.image_placeholder')}
        iconName="photo"
        onPress={this.handleAddImage}
      />
    );
  };

  navigateToAddDescription = () => {
    const {description} = this.state;
    navigationService.navigate(screenNames.AddDescription, {
      updateFunc: ({text}) => this.setState({description: text}),
      text: description,
      type: 'group',
      title: I18n.t('groups.create.description'),
      placeholder: I18n.t('groups.create.description_placeholder'),
    });
  };

  changeInputHandler = (changes) => {
    this.setState({name: {...this.state.name, ...changes}});
  };

  handleAddImage = async () => {
    // const res = await NativeMediaPicker.show({ mediaType: mediaTypes.IMAGE });
    // if (!res) return;
    // const { localUri, fileName } = res;
    // navigationService.navigate(screenNames.ImageUpload, {
    //   localUri,
    //   fileName,
    //   entityType: entityTypes.GROUP,
    //   onComplete: (media) => {
    //     this.setState({ mediaUrl: media.mediaUrl });
    //   }
    // });
  };

  toggleGroupTypeHandler = () => {
    const {privacyType} = this.state;
    this.setState({
      privacyType:
        privacyType === groupPrivacyType.PUBLIC
          ? groupPrivacyType.PRIVATE
          : groupPrivacyType.PUBLIC,
    });
  };

  toggleCountryGroup = () => {
    const {userCountryCode} = this.props;
    const {contextCountryCode} = this.state;
    const tempContextCountryCode = contextCountryCode.length
      ? []
      : [userCountryCode];
    this.setState({contextCountryCode: tempContextCountryCode});
  };

  changeCountryCode = (countryCode) => {
    this.setState({contextCountryCode: [countryCode]});
  };

  proceedToNextScreen = () => {
    const {
      name,
      privacyType,
      mediaUrl,
      tags,
      description,
      contextCountryCode,
    } = this.state;
    Keyboard.dismiss();
    navigationService.navigate(screenNames.InviteMembers, {
      name: name.value,
      privacyType,
      mediaUrl,
      description,
      tags,
      mode: editModes.CREATE,
      contextCountryCode,
    });
  };
}

CreateGroup.propTypes = {
  screenProps: PropTypes.shape({
    dismiss: PropTypes.func,
  }),
  userCountryCode: PropTypes.number,
  isShowCountryPicker: PropTypes.bool,
  showModal: PropTypes.func,
  hideModal: PropTypes.func,
};

const mapStateToProps = (state) => ({
  userCountryCode: get(state, 'auth.user.journey.originCountry.countryCode'),
  isShowCountryPicker: isBoundlessEnabled(
    get(state, 'auth.user.nationalityGroup'),
  ),
  user: get(state, 'auth.user'),
});

CreateGroup = useSlideUpModal(CreateGroup);
CreateGroup = connect(mapStateToProps)(CreateGroup);
CreateGroup = Screen()(CreateGroup);
export default CreateGroup;
