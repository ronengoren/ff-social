import React, {Component} from 'react';
import PropTypes from 'prop-types';
import I18n from '/infra/localization';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {View, Text, Avatar} from '../../../../components/basicComponents';
import {flipFlopColors} from '../../../../vars';
import {entityTypes, groupType, groupRoleTypes} from '../../../../vars/enums';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 15,
    backgroundColor: flipFlopColors.white,
  },
  imageWrapper: {
    marginRight: 15,
    borderWidth: 1,
    borderColor: flipFlopColors.b90,
    borderRadius: 12,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },
});

class ContextPickerItem extends Component {
  render() {
    const {data, onContextChosen} = this.props;
    const {id, entityType, themeColor, media, name} = data;
    const groupTypeText = this.getGroupTypeText();

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => onContextChosen(data)}
        activeOpacity={1}>
        <Avatar
          entityId={id}
          entityType={entityType || entityTypes.USER}
          themeColor={themeColor}
          thumbnail={media.thumbnail}
          name={name}
          style={styles.imageWrapper}
          imageStyle={styles.image}
          size="medium2"
          linkable={false}
        />
        <View>
          <Text
            bold
            size={16}
            lineHeight={22}
            color={flipFlopColors.b30}
            numberOfLines={1}>
            {name}
          </Text>
          {!!groupTypeText && (
            <Text color={flipFlopColors.b60}>{groupTypeText}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  getGroupTypeText() {
    const {data} = this.props;

    switch (data.groupType) {
      case groupType.GROUP:
        if (data.memberType === groupRoleTypes.OWNER) {
          return I18n.t('context_picker.entity_types.group_admin');
        }
        return I18n.t('context_picker.entity_types.group');
      case groupType.TOPIC:
        return I18n.t('context_picker.entity_types.topic');
      default:
        return null;
    }
  }
}

ContextPickerItem.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    entityType: PropTypes.string,
    themeColor: PropTypes.string,
    media: PropTypes.object,
    name: PropTypes.string,
    groupType: PropTypes.string,
    memberType: PropTypes.string,
  }),
  onContextChosen: PropTypes.func,
};

export default ContextPickerItem;
