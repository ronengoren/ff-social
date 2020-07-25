import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useSelector, useDispatch} from 'react-redux';
import {StyleSheet, TouchableOpacity} from 'react-native';
// import { getOwnedPages } from '/redux/pages/actions';
import {useUser} from '/hooks';
import {InfiniteScroll} from '../../../components';
import {
  NewTextButton,
  View,
  Text,
  Avatar,
} from '../../../components/basicComponents';
import SlideUpModal from '../../../components/modals/SlideUpModal';
import {AwesomeIcon} from '../../../assets/icons';
import {flipFlopColors} from '../../../vars';
import {entityTypes} from '../../../vars/enums';
import {get} from '../../../infra/utils';
import I18n from '../../../infra/localization';

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: flipFlopColors.fillGrey,
    borderWidth: 0,
    margin: 15,
    height: 35,
  },
  options: {
    backgroundColor: flipFlopColors.white,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    backgroundColor: flipFlopColors.white,
    marginHorizontal: 15,
    paddingRight: 5,
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: flipFlopColors.b95,
    flex: 1,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 70,
  },
  avatar: {
    marginRight: 15,
  },
});

function Option({data, activeId, onPress}) {
  const {id, media, name} = data;
  const isActive = id === activeId;

  return (
    <TouchableOpacity style={styles.option} onPress={() => onPress(id)}>
      <View style={styles.optionLeft}>
        <Avatar
          entityType={entityTypes.PAGE}
          size="medium1"
          thumbnail={media && media.thumbnail}
          style={styles.avatar}
          linkable={false}
        />
        <Text
          size={16}
          color={isActive ? flipFlopColors.green : flipFlopColors.b30}
          numberOfLines={1}>
          {name}
        </Text>
      </View>
      {!!isActive && (
        <AwesomeIcon
          name="check-circle"
          size={22}
          color={flipFlopColors.green}
          style={styles.doneIcon}
          weight="solid"
        />
      )}
    </TouchableOpacity>
  );
}

Option.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string,
    media: PropTypes.shape({thumbnail: PropTypes.string}),
    name: PropTypes.string,
  }),
  activeId: PropTypes.string,
  onPress: PropTypes.func,
};

function PageFilter({value, onChange}) {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const pages = useSelector((state) => get(state, 'pages.owned.data') || []);
  const user = useUser();

  useEffect(() => {
    // dispatch(getOwnedPages({ userId: user.id }));
  }, []);

  if (!pages.length) {
    return null;
  }

  function handlePress() {
    setShowModal(true);
  }

  function handleModalClosed() {
    setShowModal(false);
  }

  function handleChoose(pageId) {
    onChange(pageId);
    setShowModal(false);
  }

  const ModalContent = (
    <View style={styles.options}>
      <InfiniteScroll
        reducerStatePath="pages.owned"
        apiQuery={{domain: 'pages', key: 'getOwned', params: {userId: user.id}}}
        ListItemComponent={Option}
        listItemProps={{activeId: value, onPress: handleChoose}}
        ListHeaderComponent={
          <Option
            data={{id: null, media: null, name: I18n.t('chat.page_filter.all')}}
            activeId={value}
            onPress={handleChoose}
          />
        }
      />
    </View>
  );

  const selectedPage = pages.find((p) => p.id === value);

  return (
    <React.Fragment>
      <NewTextButton
        autoWidth
        size={NewTextButton.sizes.SMALL35}
        style={styles.wrapper}
        onPress={handlePress}>
        {selectedPage ? selectedPage.name : I18n.t('chat.page_filter.all')}{' '}
        <AwesomeIcon
          name="caret-down"
          size={16}
          color={flipFlopColors.green}
          weight="solid"
        />
      </NewTextButton>
      {showModal && (
        <SlideUpModal
          Content={ModalContent}
          closeModal={handleModalClosed}
          visible={showModal}
        />
      )}
    </React.Fragment>
  );
}

PageFilter.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default PageFilter;
