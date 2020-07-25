import React, {useEffect} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

// import { apiQuery } from '/redux/apiQuery/actions';
import I18n from '../../../infra/localization';
import {get, isEmpty, memoize} from '../../../infra/utils';
import {
  ScrollView,
  View,
  Text,
  Spinner,
} from '../../../components/basicComponents';
import {flipFlopColors} from '../../../vars';
import {solutionTypes} from '../../../vars/enums';

import TagView from '../common/TagView';
import {getOnPressBySolutionType} from '../utils';

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 15,
  },
  title: {
    alignSelf: 'flex-start',
    marginHorizontal: 15,
    marginBottom: 15,
  },
  tagsList: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
    flex: 1,
    flexWrap: 'wrap',
  },
});

const postProcessSolutionsArray = memoize((data) =>
  data
    .filter(
      (node) =>
        node.solutionType !== solutionTypes.TREE ||
        !isEmpty(node.solutionChildren),
    )
    .sort((solutionA, solutionB) => solutionA.rank > solutionB.rank),
);

function SolutionsTabTagsSection() {
  const solutions = useSelector((state) => get(state, 'solutions.tree', {}));
  const {loading, loaded, data = [], totalCount} = solutions;

  const dispatch = useDispatch();

  useEffect(() => {
    if (isEmpty(data) && !loaded) {
      //   dispatch(apiQuery({ reducerStatePath: 'solutions.tree', query: { domain: 'solutions', key: 'getTree' } }));
    }
  }, []);

  if (isEmpty(data) && loaded && !totalCount) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <Text
        size={16}
        lineHeight={19}
        color={flipFlopColors.b70}
        numberOfLines={1}
        style={[styles.title]}>
        {I18n.t('solutions.lobby.tags_tree_title')}
      </Text>
      <ScrollView>
        {!loading && !isEmpty(data) ? (
          <FlatList
            horizontal
            contentContainerStyle={styles.tagsList}
            keyboardShouldPersistTaps="always"
            showsHorizontalScrollIndicator={false}
            data={postProcessSolutionsArray(data)}
            renderItem={({item}) => (
              <TagView
                key={item.id || item.name || item.tagName}
                item={item}
                onPress={() => getOnPressBySolutionType({child: item})}
              />
            )}
            keyExtractor={(i) => i.id}
          />
        ) : (
          <Spinner color={flipFlopColors.green} />
        )}
      </ScrollView>
    </View>
  );
}

export default SolutionsTabTagsSection;
