import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {Text} from '../basicComponents';
import {HtmlText} from '../../components';
import {flipFlopColors} from '../../vars';
import {screenNames} from '../../vars/enums';
import {navigationService} from '../../infra/navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
  },
  textStyle: {
    fontSize: 16,
  },
});

function RichTextShowAndEdit({text, placeholderText, onSubmit, onPress}) {
  const renderText = () => (
    <HtmlText value={text} showFullText textStyle={styles.textStyle} />
  );

  const renderPlaceholder = () => (
    <Text size={16} lineHeight={20} color={flipFlopColors.b60} alignLocale>
      {placeholderText}
    </Text>
  );

  const navigateToTextEditor = () => {
    navigationService.navigate(screenNames.RichTextEditor, {
      text,
      onSubmit,
      placeholderText,
    });
  };

  return (
    <TouchableOpacity
      onPress={onPress || navigateToTextEditor}
      style={styles.container}
      testID="richTextShowAndEditWrapper">
      {text && text.length ? renderText() : renderPlaceholder()}
    </TouchableOpacity>
  );
}

RichTextShowAndEdit.propTypes = {
  text: PropTypes.string,
  placeholderText: PropTypes.string,
  onPress: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default RichTextShowAndEdit;
