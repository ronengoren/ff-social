import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity, Platform, Keyboard} from 'react-native';
import {connect} from 'react-redux';
// import { updateProfile } from '/redux/profile/actions';
// import { initSearchAddress } from '/redux/searchAddress/actions';
// import { apiQuery } from '/redux/apiQuery/actions';
import {pluralTranslateWithZero} from '../../redux/utils/common';
// import { refreshUserData } from '/redux/auth/actions';
import {get} from '../../infra/utils';
import {
  translateDate,
  getBirthdateMinMax,
} from '../../infra/utils/dateTimeUtils';
// import { connect as connectInsta, disconnect as disconnectInsta } from '/infra/instagram';
import {navigationService} from '../../infra/navigation';
// import { Logger } from '/infra/reporting';
import I18n from '../../infra/localization';
import {isBoundlessEnabled} from '../../infra/utils/communitiesNationalitiesUtils';
import {getCountryByCode} from '../../screens/signup/JoinCommunity/countries';
import {
  View,
  Text,
  KeyboardAwareScrollView,
  TextArea,
  Separator,
  QueryCancelIcon,
  Spinner,
} from '../../components/basicComponents';
import {Filter} from '../../components/filters';
import {
  Screen,
  FormSection,
  FormTitle,
  FormInput,
  SimpleHeader,
} from '../../components';
import {AwesomeIcon} from '../../assets/icons';
import {
  flipFlopColors,
  flipFlopFonts,
  flipFlopFontsWeights,
  uiConstants,
  commonStyles,
} from '../../vars';
import {
  relationshipType,
  genderType,
  screenNames,
  filterTypes,
} from '../../vars/enums';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: flipFlopColors.white,
    marginTop: uiConstants.NAVBAR_TOP_MARGIN,
  },
  innerContainer: {
    flex: 1,
  },
  horizontalElements: {
    flexDirection: 'row',
  },
  leftInput: {
    marginRight: 10,
  },
  rightInput: {
    marginLeft: 10,
  },
  singleLineWrapper: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: flipFlopColors.white,
  },
  singleLineLeftText: {
    height: 22,
    fontFamily: flipFlopFonts.medium,
    fontWeight: flipFlopFontsWeights.medium,
    fontSize: 15,
    lineHeight: 22,
    color: flipFlopColors.black,
  },
  singleLineRightText: {
    height: 22,
    fontSize: 15,
    lineHeight: 22.0,
    textAlign: 'right',
    color: flipFlopColors.black,
  },
  singleLinePlaceholder: {
    height: 22,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'right',
    color: flipFlopColors.buttonGrey,
  },
  instagramRow: {
    paddingVertical: 18,
  },
  instagramIcon: {
    marginRight: 10,
  },
  journeyArrivalDateWrapper: {
    borderBottomWidth: 1,
    borderColor: flipFlopColors.disabledGrey,
    paddingTop: 25,
    paddingBottom: 1,
    marginBottom: 10,
    flexGrow: 1,
  },
  journeyArrivalDateLabel: {
    position: 'absolute',
    left: Platform.select({ios: 0, android: 4}),
    color: flipFlopColors.placeholderGrey,
    paddingBottom: 1,
    bottom: 8,
    fontSize: 16,
  },
  journeyArrivalDateLabelWithValue: {
    bottom: 32,
    fontSize: 12,
  },
  journeyArrivalDateText: {
    height: 35,
    lineHeight: 35,
    fontSize: 16,
    color: flipFlopColors.black,
  },
  bioWrapper: {
    height: 180,
    backgroundColor: flipFlopColors.fillGrey,
    borderColor: flipFlopColors.disabledGrey,
    borderWidth: 1,
    borderRadius: 5,
  },
  bio: {
    height: '100%',
    fontSize: 15,
    lineHeight: 25,
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
    borderRadius: 5,
    backgroundColor: flipFlopColors.fillGrey,
  },
  cancelIcon: {
    top: 32,
  },
  inputSpinner: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: flipFlopColors.white60,
  },
});

class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    const {
      data: {
        workDetails,
        name,
        user,
        user: {journey},
        birthday,
        numOfKids,
        relationship,
        gender,
        settings,
        bio,
      },
    } = props;
    const form = {
      firstName: {
        value: name.firstName,
        isValid: true,
      },
      lastName: {
        value: name.lastName,
        isValid: true,
      },
      workTitle: {
        value: workDetails ? workDetails.title : null,
        isValid: true,
      },
      workPlace: {
        value: workDetails ? workDetails.place : null,
        isValid: true,
      },
      origin: {
        value: journey.origin,
        googlePlaceId: journey.originGoogleId,
        isValid: true,
      },
      originCountry: {
        countryCode: journey.originCountry.countryCode,
        name: journey.originCountry.name,
        placeSearchCountryFilter:
          journey.originCountry.placeSearchCountryFilter,
        isValid: true,
      },
      currentlyLiveInCity: {
        value: journey.destinationCity.name || user.community.cityName,
        isValid: true,
      },
      currentlyLiveIn: {
        value: journey.currentlyLiveIn,
        isValid: true,
      },
      communityId: {
        value: user.community.id,
        isValid: true,
      },
    };

    this.state = {
      form,
      journeyArrivedDate: journey.arrivedDate,
      birthday: birthday || null,
      relationship:
        !relationship && relationship !== 0
          ? relationshipType.UNKNOWN
          : relationship,
      numOfKids: numOfKids || 0,
      gender: !gender && gender !== 0 ? genderType.UNKNOWN : gender,
      showAge: settings.showAge,
      showRelationship: settings.showRelationship,
      showGender: settings.showGender,
      bio: bio || null,
      isMatchingCommunity: false,
      showCountryFilter: false,
    };

    this.fields = {};
  }

  render() {
    const {
      navigation,
      isDestinationPartitionLevelCity,
      isBoundlessMode,
    } = this.props;
    const {
      form,
      journeyArrivedDate,
      birthday,
      relationship,
      numOfKids,
      gender,
      bio,
      isMatchingCommunity,
      showCountryFilter,
    } = this.state;
    const {focusField = ''} = navigation.state.params;

    return (
      <View style={styles.container}>
        <SimpleHeader
          cancelAction={this.cancelEdit}
          doneAction={this.saveEdit}
          isDoneBtnActive={!isMatchingCommunity}
          title="Edit Profile"
        />
        <KeyboardAwareScrollView
          style={styles.innerContainer}
          extraHeight={220}
          keyboardDismissMode={Platform.select({
            ios: 'on-drag',
            android: 'none',
          })}>
          <FormSection>
            <FormTitle>{I18n.t('profile.edit.basic_info')}</FormTitle>
            <View style={styles.horizontalElements}>
              <FormInput
                value={form.firstName.value}
                isValid={form.firstName.valid}
                onChange={this.onChangeHandlerWrapper('firstName')}
                errorText={form.firstName.errorText}
                validations={[
                  {
                    type: 'minLength',
                    value: 2,
                    errorText: I18n.t('common.form.min_chars', {minChars: 2}),
                  },
                ]}
                label={I18n.t('profile.edit.first_name_placeholder')}
                style={styles.leftInput}
                required
                autoCorrect={false}
              />

              <FormInput
                value={form.lastName.value}
                isValid={form.lastName.valid}
                onChange={this.onChangeHandlerWrapper('lastName')}
                errorText={form.lastName.errorText}
                validations={[
                  {
                    type: 'minLength',
                    value: 2,
                    errorText: I18n.t('common.form.min_chars', {minChars: 2}),
                  },
                ]}
                label={I18n.t('profile.edit.last_name_placeholder')}
                style={styles.rightInput}
                required
                autoCorrect={false}
              />
            </View>
          </FormSection>
          <Separator height={5} />
          {this.renderPersonalDetailsRow({
            onPressAction: this.navigateToEditBirthday,
            title: I18n.t('profile.edit.date_of_birth.title'),
            condition: birthday,
            text1: translateDate(birthday),
            text2: I18n.t('profile.edit.date_of_birth.placeholder'),
          })}
          <Separator height={5} />
          {this.renderPersonalDetailsRow({
            onPressAction: this.navigateToEditRelationship,
            title: I18n.t('profile.edit.relationship.title'),
            condition: relationship !== relationshipType.UNKNOWN,
            text1:
              relationship !== relationshipType.UNKNOWN &&
              pluralTranslateWithZero(
                numOfKids || 0,
                `profile.profile_relationship.${relationship}`,
                {count: numOfKids},
              ),
            text2: I18n.t('profile.edit.relationship.placeholder'),
          })}
          <Separator height={5} />
          {this.renderPersonalDetailsRow({
            onPressAction: this.navigateToEditGender,
            title: I18n.t('profile.edit.gender.title'),
            condition: gender !== genderType.UNKNOWN,
            text1: I18n.t(`profile.gender.${gender}`),
            text2: I18n.t('profile.edit.gender.placeholder'),
            textTestID: 'genderInputField',
          })}
          <Separator height={30} />
          {this.renderInstagramRow()}
          <Separator height={30} />
          <FormSection>
            <FormInput
              value={form.workTitle.value}
              isValid
              onChange={this.onChangeHandlerWrapper('workTitle')}
              errorText={''}
              validations={[]}
              label={I18n.t('profile.edit.work.title_placeholder')}
              maxLength={40}
            />
            <FormInput
              value={form.workPlace.value}
              isValid
              onChange={this.onChangeHandlerWrapper('workPlace')}
              errorText={''}
              validations={[]}
              label={I18n.t('profile.edit.work.place_placeholder')}
              maxLength={40}
              isInitiallyFocused={focusField === 'workplace'}
              ref={this.setRef('workplace')}
            />
          </FormSection>
          <Separator height={30} />
          <FormSection>
            <FormTitle>{I18n.t('profile.edit.my_journey.title')}</FormTitle>
            {isBoundlessMode && (
              <React.Fragment>
                <TouchableOpacity onPress={this.onShowCountryFilter}>
                  <View pointerEvents="none">
                    <FormInput
                      showLabelOnTop={!!form.originCountry.name}
                      value={form.originCountry.name}
                      isValid
                      onChange={() => {}}
                      label={I18n.t('profile.edit.my_journey.origin_label')}
                      editable={false}
                    />
                  </View>
                  {!!form.originCountry.name && (
                    <QueryCancelIcon
                      size={18}
                      onPress={this.onClearOriginCountryPressed}
                      style={styles.cancelIcon}
                    />
                  )}
                </TouchableOpacity>
                {showCountryFilter && (
                  <Filter
                    filterType={filterTypes.ORIGIN_COUNTRY}
                    contextCountryCode={[form.originCountry.countryCode]}
                    applyFilter={this.handleOriginCountryChanged}
                    closeFilter={this.onCloseCountryFilter}
                    actionButtonText={I18n.t(`filters.ok_button.select`)}
                  />
                )}
              </React.Fragment>
            )}
            <TouchableOpacity onPress={this.onOriginPressed}>
              <View pointerEvents="none">
                <FormInput
                  showLabelOnTop={!!form.origin.value}
                  value={form.origin.value}
                  isValid
                  onChange={() => {}}
                  label={
                    isBoundlessMode
                      ? I18n.t('profile.edit.my_journey.from_city_label')
                      : I18n.t('profile.edit.my_journey.origin_label')
                  }
                  editable={false}
                />
              </View>
              {!!form.origin.value && (
                <QueryCancelIcon
                  size={18}
                  onPress={this.onClearOriginPressed}
                  style={styles.cancelIcon}
                />
              )}
            </TouchableOpacity>
            {!isDestinationPartitionLevelCity && (
              <TouchableOpacity onPress={this.onCurrentlyLiveInCityPressed}>
                <View pointerEvents="none">
                  <FormInput
                    showLabelOnTop={!!form.currentlyLiveInCity.value}
                    value={form.currentlyLiveInCity.value}
                    isValid
                    onChange={() => {}}
                    label={I18n.t('profile.edit.my_journey.current_city_label')}
                    editable={false}
                  />
                  {isMatchingCommunity && (
                    <Spinner style={styles.inputSpinner} />
                  )}
                </View>
                {!!form.currentlyLiveInCity.value && (
                  <QueryCancelIcon
                    size={18}
                    onPress={this.onClearCurrentlyLiveInCityPressed}
                    style={styles.cancelIcon}
                  />
                )}
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={this.onCurrentlyLiveInPressed}>
              <View pointerEvents="none">
                <FormInput
                  showLabelOnTop={!!form.currentlyLiveIn.value}
                  value={form.currentlyLiveIn.value}
                  isValid
                  onChange={() => {}}
                  label={
                    isDestinationPartitionLevelCity
                      ? I18n.t('profile.edit.my_journey.current_city_label')
                      : I18n.t('profile.edit.my_journey.current_label')
                  }
                  editable={false}
                />
              </View>
              {!!form.currentlyLiveIn.value && (
                <QueryCancelIcon
                  size={18}
                  onPress={this.onClearCurrentlyLiveInPressed}
                  style={styles.cancelIcon}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              onPress={this.navigateToEditArrivalDate}
              style={styles.journeyArrivalDateWrapper}>
              <Text style={styles.journeyArrivalDateText}>
                {translateDate(journeyArrivedDate)}
              </Text>
              <Text
                style={[
                  styles.journeyArrivalDateLabel,
                  journeyArrivedDate && styles.journeyArrivalDateLabelWithValue,
                ]}>
                {I18n.t('profile.edit.my_journey.arrival_date_header')}
              </Text>
            </TouchableOpacity>
          </FormSection>
          <Separator height={30} />
          <FormSection>
            <FormTitle>{I18n.t('profile.edit.bio.title')}</FormTitle>
            <View style={styles.bioWrapper}>
              <TextArea
                ref={this.setRef('bio')}
                style={styles.bio}
                placeholder={I18n.t('profile.edit.bio.placeholder')}
                onChange={(val) => this.setState({bio: val})}
                value={bio}
                maxLength={500}
                defaultHeight={Platform.select({android: 180})}
              />
            </View>
          </FormSection>
        </KeyboardAwareScrollView>
      </View>
    );
  }

  componentDidMount() {
    const {navigation} = this.props;
    const {focusField} = navigation.state.params;
    if (focusField) {
      const action = this.actionByFieldName[focusField];
      action && action();
      navigation.setParams({
        params: {showKeyboard: false},
        key: navigation.state.key,
      });
    }
  }

  renderPersonalDetailsRow = ({
    onPressAction,
    title,
    condition,
    text1,
    text2,
    ref,
    textTestID,
  }) => (
    <TouchableOpacity
      style={styles.singleLineWrapper}
      activeOpacity={1}
      onPress={onPressAction}
      onFocus={onPressAction}
      ref={ref}>
      <Text style={styles.singleLineLeftText}>{title}</Text>
      {condition ? (
        <Text style={styles.singleLineRightText} testID={textTestID}>
          {text1}
        </Text>
      ) : (
        <Text style={styles.singleLinePlaceholder}>{text2}</Text>
      )}
    </TouchableOpacity>
  );

  renderInstagramRow = () => {
    const {instagramToken} = this.props;
    const isConnected = !!instagramToken;
    return (
      <TouchableOpacity
        style={[styles.singleLineWrapper, styles.instagramRow]}
        activeOpacity={1}>
        <View style={commonStyles.flexDirectionRow}>
          <AwesomeIcon
            name="instagram"
            weight="brands"
            color={flipFlopColors.darkGreyBlue}
            size={25}
            style={styles.instagramIcon}
          />
          <Text style={styles.singleLineLeftText}>
            {I18n.t('profile.edit.instagram.title')}
          </Text>
        </View>
        {isConnected ? (
          <Text
            style={[styles.singleLineRightText, {color: flipFlopColors.red}]}>
            {I18n.t('profile.edit.instagram.disconnect_btn')}
          </Text>
        ) : (
          <Text
            style={[styles.singleLineRightText, {color: flipFlopColors.azure}]}>
            {I18n.t('profile.edit.instagram.connect_btn')}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  onShowCountryFilter = () => {
    this.setState({
      showCountryFilter: true,
    });
  };

  onCloseCountryFilter = () => {
    this.setState({
      showCountryFilter: false,
    });
  };

  onOriginPressed = () => {
    // const {
    //   initSearchAddress,
    //   user: { community, journey }
    // } = this.props;
    // const { form } = this.state;
    // const placeSearchCountryFilter =
    //   get(form, 'originCountry.placeSearchCountryFilter') || get(journey, 'originCountry.placeSearchCountryFilter') || community.placeSearchCountryFilter;
    // initSearchAddress({ country: placeSearchCountryFilter, types: '(cities)' });
    // navigationService.navigate(screenNames.SearchAddress, { onAddressChosen: this.onChangeHandlerWrapper('origin') });
  };

  onCurrentlyLiveInPressed = () => {
    // const { initSearchAddress, isDestinationPartitionLevelCity } = this.props;
    // initSearchAddress({ isNeighborhoods: true }); // TODO: This should be changes according to the community - currently all neighborhoods are from New-York
    // navigationService.navigate(screenNames.SearchAddress, {
    //   onAddressChosen: this.onChangeHandlerWrapper('currentlyLiveIn'),
    //   placeholderText: isDestinationPartitionLevelCity && I18n.t('profile.edit.my_journey.search_city')
    // });
  };

  onCurrentlyLiveInCityPressed = () => {
    // const { initSearchAddress, user } = this.props;
    // initSearchAddress({ country: user.community.destinationCountryCode, isCities: true }); // TODO: This should be changed to Cities(Communities)
    // navigationService.navigate(screenNames.SearchAddress, { onAddressChosen: this.handleLiveInCityChanged, placeholderText: I18n.t('profile.edit.my_journey.search_city') });
  };

  handleLiveInCityChanged = async ({value, id}) => {
    // const { user, apiQuery } = this.props;
    // const { form } = this.state;
    // const originName = get(user, 'community.originCountryName');
    // try {
    //   this.setState({ isMatchingCommunity: true });
    //   const matchedCommunityResponse = await apiQuery({
    //     query: {
    //       domain: 'auth',
    //       key: 'matchedCommunity',
    //       params: { originName, originCountryCode: form.originCountry.countryCode, destinationCityId: id }
    //     }
    //   });
    //   const communityId = get(matchedCommunityResponse, 'data.data.id');
    //   const didCommunityChange = communityId && communityId !== user.community.id;
    //   this.onChangeHandlerWrapper('currentlyLiveInCity')({ value, cityId: id });
    //   this.onChangeHandlerWrapper('currentlyLiveIn')({ value: null, id: null });
    //   if (didCommunityChange) {
    //     this.onChangeHandlerWrapper('communityId')({ value: communityId });
    //   }
    // } catch (err) {
    //   Logger.error('Failed to change destination city', err);
    // }
    // this.setState({ isMatchingCommunity: false });
  };

  handleOriginCountryChanged = ({contextCountryCode}) => {
    const {name, alpha2: placeSearchCountryFilter} =
      getCountryByCode(contextCountryCode[0]) || {};
    this.onChangeHandlerWrapper('originCountry')({
      name,
      placeSearchCountryFilter,
    });
    this.onClearOriginPressed();
  };

  onClearOriginCountryPressed = () => {
    this.onChangeHandlerWrapper('originCountry')({
      name: null,
      placeSearchCountryFilter: null,
    });
    this.onClearOriginPressed();
  };

  onClearOriginPressed = () => {
    this.onChangeHandlerWrapper('origin')({value: null, googlePlaceId: null});
  };

  onClearCurrentlyLiveInCityPressed = () => {
    this.onChangeHandlerWrapper('currentlyLiveInCity')({
      value: null,
      cityId: null,
    });
    this.onClearCurrentlyLiveInPressed();
  };

  onClearCurrentlyLiveInPressed = () => {
    this.onChangeHandlerWrapper('currentlyLiveIn')({value: null, id: null});
  };

  onChangeHandlerWrapper = (field) => (changes) => {
    this.setState(({form}) => ({
      form: {
        ...form,
        [field]: {
          ...form[field],
          ...changes,
        },
      },
    }));
  };

  updateInnerScreensData = (edits) => {
    this.setState({
      ...this.state,
      ...edits,
    });
  };

  navigateToEditBirthday = () => {
    const {birthday, showAge} = this.state;
    const {minDate, maxDate} = getBirthdateMinMax();

    navigationService.navigate(screenNames.EditProfileDate, {
      data: {date: birthday, isVisibleInProfile: showAge, minDate, maxDate},
      hasToggle: true,
      dataFields: ['birthday', 'showAge'],
      saveAction: this.updateInnerScreensData,
      header: I18n.t('profile.edit.date_of_birth.picker_header'),
      subHeader: I18n.t('profile.edit.date_of_birth.picker_subheader'),
    });
  };

  navigateToEditRelationship = () => {
    Keyboard.dismiss();
    const {relationship, numOfKids, showRelationship} = this.state;
    navigationService.navigate(screenNames.EditProfileRelationship, {
      data: {relationship, numOfKids, showRelationship},
      saveAction: this.updateInnerScreensData,
    });
  };

  navigateToEditGender = () => {
    Keyboard.dismiss();
    const {gender, showGender} = this.state;
    navigationService.navigate(screenNames.EditProfileGender, {
      data: {gender, showGender},
      saveAction: this.updateInnerScreensData,
    });
  };

  navigateToEditArrivalDate = () => {
    Keyboard.dismiss();
    const {journeyArrivedDate} = this.state;
    navigationService.navigate(screenNames.EditProfileDate, {
      data: {date: journeyArrivedDate},
      dataFields: ['journeyArrivedDate'],
      saveAction: this.updateInnerScreensData,
      header: I18n.t('profile.edit.my_journey.arrival_picker_header'),
      subHeader: I18n.t('profile.edit.my_journey.arrival_picker_subheader'),
    });
  };

  setRef = (name) => (node) => {
    this.fields[name] = node;
  };

  cancelEdit = () => {
    Keyboard.dismiss();
    navigationService.goBack();
  };

  saveEdit = async () => {
    // Keyboard.dismiss();
    // const {
    //   data: {
    //     user: { id, journey, community }
    //   },
    //   updateProfile,
    //   refreshUserData
    // } = this.props;
    // const { form, journeyArrivedDate, birthday, showAge, relationship, numOfKids, showRelationship, gender, showGender, bio } = this.state;
    // const { originCountry, origin, currentlyLiveIn, currentlyLiveInCity, firstName, lastName, workTitle, workPlace, communityId } = form;
    // const canSubmitEdit = !Object.keys(form).some((key) => form[key].isValid === false);
    // if (!canSubmitEdit || this.donePressed) {
    //   return;
    // }
    // this.donePressed = true;
    // const dataToSend = {
    //   user: {
    //     name: `${firstName.value} ${lastName.value}`,
    //     journey: {
    //       arrivedDate: journeyArrivedDate,
    //       originCountryName: originCountry.name,
    //       originPlaceSearchCountryFilter: originCountry.placeSearchCountryFilter,
    //       originGoogleId: origin.googlePlaceId,
    //       origin: origin.value,
    //       ...(currentlyLiveInCity.cityId ? { destinationCityName: currentlyLiveInCity.value } : {}),
    //       destinationCityId: currentlyLiveInCity.cityId,
    //       currentlyLiveIn: currentlyLiveIn.value,
    //       currentlyLiveInId: currentlyLiveIn.id
    //     }
    //   },
    //   name: {
    //     firstName: firstName.value,
    //     lastName: lastName.value
    //   },
    //   workDetails: {
    //     title: workTitle.value,
    //     place: workPlace.value
    //   },
    //   birthday,
    //   relationship,
    //   numOfKids,
    //   gender,
    //   settings: {
    //     showAge,
    //     showRelationship,
    //     showGender
    //   },
    //   bio,
    //   communityId: communityId.value
    // };
    // const isOriginCountryChanged = get(journey, 'originCountry.name') !== originCountry.name;
    // const isCommunityChanged = form.communityId.value !== community.id;
    // const profile = await updateProfile({ userId: id, delta: dataToSend });
    // if (profile && (isOriginCountryChanged || isCommunityChanged)) {
    //   refreshUserData();
    // }
    // navigationService.goBack();
  };

  actionByFieldName = {
    date_of_birth: this.navigateToEditBirthday,
    relationship: this.navigateToEditRelationship,
    gender: this.navigateToEditGender,
    originCountry: this.onShowCountryFilter,
    origin: this.onOriginPressed,
    bio: () =>
      get(this.fields, 'bio.focus') &&
      setTimeout(() => this.fields.bio.focus(), 500),
    workplace: () =>
      get(this.fields, 'workplace.focus') &&
      setTimeout(() => this.fields.workplace.focus(), 500),
  };
}

EditProfile.propTypes = {
  data: PropTypes.object,
  navigation: PropTypes.object,
  //   updateProfile: PropTypes.func,
  //   initSearchAddress: PropTypes.func,
  user: PropTypes.object,
  instagramToken: PropTypes.string,
  isDestinationPartitionLevelCity: PropTypes.bool,
  //   apiQuery: PropTypes.func,
  isBoundlessMode: PropTypes.bool,
  //   refreshUserData: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  const {data} = ownProps.navigation.state.params;
  const {user} = state.auth;
  const instagramToken = get(
    state,
    `profile[${user.id}].data.user.instagramV2Token`,
  );
  const destinationPartitionLevel = get(
    user,
    'community.destinationPartitionLevel',
  );
  const isDestinationPartitionLevelCity = destinationPartitionLevel === 'city';
  const isBoundlessMode = isBoundlessEnabled(user.nationalityGroup);

  return {
    data,
    user,
    instagramToken,
    isDestinationPartitionLevelCity,
    isBoundlessMode,
  };
};

const mapDispatchToProps = {
  //   updateProfile,
  //   initSearchAddress,
  //   apiQuery,
  //   refreshUserData
};

EditProfile = connect(mapStateToProps, mapDispatchToProps)(EditProfile);
export default Screen()(EditProfile);
