import React from 'react';
import {FlatList, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import {plural} from 'pluralize';
import I18n from '../../../infra/localization';
import {View, Text, Image} from '../../../components/basicComponents';
import {flipFlopColors, commonStyles, postTypes} from '../../../vars';
import {entityTypes, screenNames} from '../../../vars/enums';
import {navigationService} from '../../../infra/navigation';
import images from '../../../assets/images';
import {isHighDevice} from '../../../infra/utils/deviceUtils';

const {width} = Dimensions.get('screen');

const BOX_SIZE = width / 3 - 20;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: isHighDevice ? 15 : 0,
  },
  title: {
    alignSelf: 'flex-start',
    marginHorizontal: 15,
  },
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderRadius: 10,
    backgroundColor: flipFlopColors.paleGreyTwo,
    marginRight: 10,
    borderColor: flipFlopColors.b90,
    borderWidth: 1,
  },
  boardsList: {
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 20,
  },
  boardImage: {
    marginTop: 4,
    width: 37,
    height: 37,
    marginBottom: 8,
  },
});

const boards = [
  postTypes.JOB,
  postTypes.REAL_ESTATE,
  plural(entityTypes.EVENT),
  postTypes.GIVE_TAKE,
];

const navigateToBoard = (board) => {
  if (board === plural(entityTypes.EVENT)) {
    navigationService.navigate(screenNames.Events);
  } else {
    navigationService.navigate(screenNames.CityResults, {postType: board});
  }
};

function SolutionsTabBoardsSection() {
  return (
    <View style={[styles.wrapper]}>
      <Text
        size={16}
        lineHeight={19}
        color={flipFlopColors.b70}
        numberOfLines={1}
        style={[styles.title]}>
        {I18n.t('solutions.lobby.boards_title')}
      </Text>

      <FlatList
        horizontal
        contentContainerStyle={[
          !boards.length && commonStyles.flex1,
          styles.boardsList,
        ]}
        keyboardShouldPersistTaps="always"
        showsHorizontalScrollIndicator={false}
        data={boards}
        testID="solutionsTabBoardsSection"
        renderItem={({item}) => (
          <TouchableOpacity
            key={item}
            style={[styles.box, commonStyles.shadow]}
            onPress={() => navigateToBoard(item)}>
            <Image
              style={styles.boardImage}
              source={images.solutions[item]}
              resizeMode="contain"
            />
            <Text
              size={14}
              color={flipFlopColors.b30}
              center
              testID={`${item}Board`}>
              {I18n.t(`home.boards.${item}`)}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(i) => i}
      />
    </View>
  );
}

export default SolutionsTabBoardsSection;
