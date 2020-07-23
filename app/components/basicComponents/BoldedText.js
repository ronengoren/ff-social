import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {HTMLView} from '../basicComponents';
import {flipFlopFonts, flipFlopFontsWeights, flipFlopColors} from '../../vars';
import {stylesScheme} from '../../schemas';

const styles = StyleSheet.create({
  boldText: {
    letterSpacing: 0.2,
    fontFamily: flipFlopFonts.bold,
    fontWeight: flipFlopFontsWeights.bold,
    fontSize: 16,
    lineHeight: 20,
  },
  text: {
    textAlign: 'left',
    color: flipFlopColors.black,
    letterSpacing: 0.2,
    fontSize: 16,
    lineHeight: 20,
    fontFamily: flipFlopFonts.regular,
    fontWeight: flipFlopFontsWeights.regular,
  },
});

const BoldedText = ({text, BoldedText = '', style}) => {
  const boldedWords = BoldedText.split(/ +/);
  let boldText = text || '';

  // Sorting the words from longest word to shortest. So that if we have 2 words: 'be' and 'ben
  // then after first loop we'll get "<b>be</b>n" and then we won't get the whole "ben" word bolded.
  // That's why arranging them by length will make sure wehave the larget word match in bold.
  const sortedWords = boldedWords.sort((a, b) => b.length - a.length);

  sortedWords.forEach((word) => {
    if (word.length) {
      let regExp;
      if (word === 'b') {
        regExp = new RegExp(`b(?!>)`, 'ig'); // escape the "b>" tags
      } else {
        regExp = new RegExp(`\\b${word}`, 'ig');
      }
      boldText = boldText.replace(regExp, '<b>$&</b>');
    }
  });

  return (
    <HTMLView
      wrapperProps={{numberOfLines: 1, style: [styles.text, style]}}
      html={boldText}
      tagsStyles={{
        b: styles.boldText,
        p: styles.text,
      }}
      baseFontStyle={style}
    />
  );
};

BoldedText.propTypes = {
  text: PropTypes.string,
  BoldedText: PropTypes.string,
  style: stylesScheme,
};

export default BoldedText;
