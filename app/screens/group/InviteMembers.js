import React from 'react';
import PropTypes from 'prop-types';
import I18n from '/infra/localization';
import {connect} from 'react-redux';
// import { createGroup, addMembers } from '/redux/groups/actions';
import {Screen, SelectUsers} from '../../components';
import {ErrorModal} from '../../components/modals';
import {navigationService} from '../../infra/navigation';
import {screenNames, editModes, groupType} from '../../vars/enums';

class InviteMembers extends React.Component {
  render() {
    // const {
    //   navigation: {
    //     state: {
    //       params: {mode, entityId},
    //     },
    //   },
    // } = this.props;
    return (
      <SelectUsers
      // listProps={this.getListProps({mode, entityId})}
      // headerProps={this.getHeaderProps({mode})}
      />
    );
  }

  getListProps = ({mode, entityId}) => {
    // const reducerStatePath = 'groups.suggestedMembers';
    // return mode === editModes.CREATE
    //   ? {reducerStatePath, apiQuery: {domain: 'friendships', key: 'friends'}}
    //   : {
    //       reducerStatePath,
    //       apiQuery: {
    //         domain: 'friendships',
    //         key: 'friends',
    //         params: {excludeGroupId: entityId},
    //       },
    //     };
  };

  getHeaderProps = ({mode}) => {
    const title = I18n.t('groups.invite_members.screen_header');
    return mode === editModes.CREATE
      ? {
          doneAction: this.createGroup,
          doneText: I18n.t('groups.invite_members.create_mode_button'),
          title,
          mandatorySelect: false,
        }
      : {
          doneAction: this.inviteMembers,
          doneText: I18n.t('groups.invite_members.edit_mode_button'),
          title,
          mandatorySelect: false,
        };
  };

  createGroup = async ({selectedUsers}) => {
    const {
      navigation: {
        state: {
          params: {
            name,
            privacyType,
            mediaUrl,
            description,
            tags,
            contextCountryCode,
          },
        },
      },
      screenProps: {dismiss},
      createGroup,
    } = this.props;
    if (!this.creatingGroup) {
      this.creatingGroup = true;
      try {
        const res = await createGroup({
          tags,
          description,
          name,
          privacyType,
          mediaUrl,
          membersIds: Array.from(selectedUsers.keys()),
          contextCountryCode,
        });
        dismiss();
        navigationService.navigate(screenNames.GroupView, {
          entityId: res.data.data.id,
          showGroupCreatedModal: true,
          isGroupMember: true,
          groupType: groupType.GROUP,
        });
        this.creatingGroup = false;
      } catch (err) {
        ErrorModal.showAlert();
        this.creatingGroup = false;
      }
    }
  };

  inviteMembers = async ({selectedUsers}) => {
    // const { navigation, screenProps, addMembers } = this.props;
    // const groupId = navigation.state.params.entityId;
    // await addMembers({ groupId, membersIds: Array.from(selectedUsers.keys()), invitedMembers: Array.from(selectedUsers.values()) });
    // screenProps && screenProps.dismiss ? screenProps.dismiss() : navigationService.goBack();
  };
}

InviteMembers.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        mode: PropTypes.string,
        entityId: PropTypes.string,
        name: PropTypes.string,
        privacyType: PropTypes.string,
        mediaUrl: PropTypes.string,
        description: PropTypes.string,
        tags: PropTypes.array,
        contextCountryCode: PropTypes.arrayOf(PropTypes.number),
      }),
    }),
  }),
  screenProps: PropTypes.shape({
    dismiss: PropTypes.func,
  }),
  //   createGroup: PropTypes.func,
  //   addMembers: PropTypes.func
};

const mapDispatchToProps = {
  //   createGroup,
  //   addMembers
};

InviteMembers = connect(null, mapDispatchToProps)(InviteMembers);
InviteMembers = Screen()(InviteMembers);
export default InviteMembers;
