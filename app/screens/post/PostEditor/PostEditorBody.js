import React from 'react';
import {Spinner} from '../../../components/basicComponents';
import {StyleSheet} from 'react-native';
import {
  postTypes,
  entityTypes,
  editorFeaturesTypes,
  editModes,
} from '../../../vars/enums';
import {get, isAppAdmin} from '../../../infra/utils';
import {
  // RegularPostEditor,
  // SharePostEditor,
  // GuidePostEditor,
  // JobPostEditor,
  // RealEstatePostEditor,
  // GiveTakePostEditor,
  // TitledPostEditor,
  // ListPostEditor,
  StoryEditor,
  // RecommendationPostEditor
} from './editors';
const styles = StyleSheet.create({
  regularPostEditorWrapper: {
    flexShrink: 0,
  },
});

const PostEditorBody = ({}) => {
  let bodyContent = false;
  let isStory = true;

  if (bodyContent) {
    bodyContent = <Spinner />;
  } else if (isStory) {
    bodyContent = <StoryEditor />;
  }
  return bodyContent;
};

export default PostEditorBody;
