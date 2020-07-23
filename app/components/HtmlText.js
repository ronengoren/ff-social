import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Platform} from 'react-native';
import {get} from 'lodash';
import {_constructStyles} from 'react-native-render-html/src/HTMLStyles';
import HTML from 'react-native-render-html';
import {ExpandableText, View, Text} from './basicComponents';
import {isRTL} from '../infra/utils/stringUtils';
import {
  flipFlopFonts,
  flipFlopFontsWeights,
  flipFlopColors,
  commonStyles,
} from '../vars';
import {stylesScheme} from '../schemas';
import TranslateButton from './TranslateButton';

const DEFAULT_LINE_HEIGHT = 20;
const BLOCK_ELEMENTS_REGEX = /<\/(p|li|h1|h2|h3|h4|h5|h6)>/gi;
const MAX_LIST_ITEM_TEXT_DEPTH = 5;

const styles = {
  p: {
    margin: 0,
  },
  list: {
    marginTop: 2,
    marginBottom: 0,
  },
  a: {
    fontSize: Platform.OS === 'ios' ? 14 : 16,
    color: flipFlopColors.azure,
    textDecorationLine: 'none',
    fontWeight: flipFlopFontsWeights.bold,
  },
  regularText: {
    fontSize: 14,
    fontFamily: flipFlopFonts.regular,
    fontWeight: flipFlopFontsWeights.regular,
    color: flipFlopColors.black,
  },
  rtl: {
    writingDirection: 'rtl',
    textAlign: 'right',
    margin: 0,
  },
  ltr: {
    writingDirection: 'ltr',
    textAlign: 'left',
    margin: 0,
  },
  listItemContainer: {flexDirection: 'row', marginBottom: 8},
  rtlListItem: {marginRight: 20, marginLeft: 10},
  ltrListItem: {marginRight: 10, marginLeft: 10},
};

const headerStyles = {
  h1: {
    fontFamily: flipFlopFonts.bold,
    fontWeight: flipFlopFontsWeights.bold,
    fontSize: 32,
    lineHeight: 38,
  },
  h2: {
    fontFamily: flipFlopFonts.bold,
    fontWeight: flipFlopFontsWeights.bold,
    fontSize: 26,
    lineHeight: 32,
  },
  h3: {
    fontFamily: flipFlopFonts.bold,
    fontWeight: flipFlopFontsWeights.bold,
    fontSize: 20,
    lineHeight: 27,
  },
  h4: {
    fontSize: 16,
    lineHeight: 27,
  },
  h5: {
    fontSize: 13,
    lineHeight: 17,
  },
  h6: {
    fontSize: 12,
    lineHeight: 16,
  },
};

Object.keys(headerStyles).forEach((key) => {
  styles[`${key}Ltr`] = {...headerStyles[key], ...styles.ltr};
  styles[`${key}Rtl`] = {...headerStyles[key], ...styles.rtl};
});

const DEFAULT_STYLES = StyleSheet.create(styles);

class HtmlText extends Component {
  static translateBtnPositions = {
    BOTTOM: 0,
    TOP: 1,
    NONE: 2,
  };

  constructor(props) {
    super(props);

    this.state = {
      presentedValue: props.value,
    };
  }

  render() {
    const {presentedValue, collapsed, hasHtml} = this.state;
    const {
      lineHeight = DEFAULT_LINE_HEIGHT,
      value,
      showFullText,
      translateBtnPosition = showFullText
        ? HtmlText.translateBtnPositions.TOP
        : HtmlText.translateBtnPositions.BOTTOM,
      showTranslateButton = true,
      wrapperStyle,
      textStyle,
      onLinkPress,
      disableRtl,
      selectable,
    } = this.props;

    const translateBtnPositionStyle = {
      flexDirection:
        translateBtnPosition === HtmlText.translateBtnPositions.TOP
          ? 'column-reverse'
          : 'column',
    };

    const isRightToLeft = disableRtl
      ? false
      : isRTL((presentedValue || '').toString());
    const alignmentStyles = isRightToLeft
      ? DEFAULT_STYLES.rtl
      : DEFAULT_STYLES.ltr;
    const unitedTextStyle = StyleSheet.flatten([
      DEFAULT_STYLES.regularText,
      alignmentStyles,
      textStyle,
      {lineHeight},
    ]);
    const stylesSuffix = isRightToLeft ? 'Rtl' : 'Ltr';
    const h1Styles = DEFAULT_STYLES[`h1${stylesSuffix}`];
    const h2Styles = DEFAULT_STYLES[`h2${stylesSuffix}`];
    const h3Styles = DEFAULT_STYLES[`h3${stylesSuffix}`];
    const h4Styles = DEFAULT_STYLES[`h4${stylesSuffix}`];
    const h5Styles = DEFAULT_STYLES[`h5${stylesSuffix}`];
    const h6Styles = DEFAULT_STYLES[`h6${stylesSuffix}`];

    if (!presentedValue) {
      return null;
    }

    return (
      <View style={[translateBtnPositionStyle, wrapperStyle]}>
        <HTML
          html={presentedValue}
          renderers={
            collapsed
              ? {
                  ul: this.renderListWithoutViewElements,
                  ol: this.renderListWithoutViewElements,
                  li: this.renderListItemWithoutViewElements,
                }
              : {
                  ...(hasHtml ? {br: null} : {}),
                  ul: this.renderListWithModifications(disableRtl),
                  ol: this.renderListWithModifications(disableRtl),
                }
          }
          tagsStyles={{
            p: DEFAULT_STYLES.p,
            h1: h1Styles,
            h2: h2Styles,
            h3: h3Styles,
            h4: h4Styles,
            h5: h5Styles,
            h6: h6Styles,
            a: DEFAULT_STYLES.a,
            ul: DEFAULT_STYLES.list,
            li: DEFAULT_STYLES.list,
          }}
          onLinkPress={(event, url) => onLinkPress && onLinkPress(url)}
          textSelectable={selectable}
          customWrapper={this.renderCustomWrapper(isRightToLeft)}
          baseFontStyle={unitedTextStyle}
        />
        {showTranslateButton &&
          translateBtnPosition !== HtmlText.translateBtnPositions.NONE && (
            <TranslateButton
              onChange={this.handleTranslationChange}
              initialValue={value}
              key={value}
            />
          )}
      </View>
    );
  }

  renderCustomWrapper = (isRightToLeft) => (children) => {
    const {
      style,
      selectable,
      showFullText,
      showExpand = true,
      lineHeight = DEFAULT_LINE_HEIGHT,
      numberOfLines = 3,
      ctaText = 'See More',
      textStyle,
      ctaTextStyle,
      onPress,
      testID,
    } = this.props;
    return (
      <ExpandableText
        {...{
          style,
          selectable,
          showFullText,
          showExpand,
          lineHeight,
          numberOfLines,
          ctaText,
          textStyle,
          ctaTextStyle,
          isRightToLeft,
          onPress,
          testID,
        }}>
        {React.Children.toArray(children)}
      </ExpandableText>
    );
  };

  renderListWithoutViewElements = (htmlAttribs, children) => children;

  renderListItemWithoutViewElements = (
    htmlAttribs,
    children,
    convertedCSSStyles,
    passProps,
  ) => {
    const {
      parentTag,
      baseFontStyle: {fontSize},
      allowFontScaling,
      nodeIndex,
    } = passProps;

    const prefix =
      parentTag === 'ul' ? (
        <Text
          style={{
            fontSize: fontSize * 1.4,
          }}>
          &nbsp;&nbsp;&nbsp;&nbsp;&bull;&nbsp;
        </Text>
      ) : (
        <Text allowFontScaling={allowFontScaling} style={{fontSize}}>
          &nbsp;&nbsp;&nbsp;&nbsp;{nodeIndex + 1}.&nbsp;
        </Text>
      );

    return (
      <Text style={convertedCSSStyles}>
        {prefix}
        {children}
      </Text>
    );
  };

  // The content of the function was copied from https://github.com/archriss/react-native-render-html/blob/master/src/HTMLRenderers.js#L60
  // Modified it to fit our needs (done to handle RTL)
  renderListWithModifications = (disableRtl) => (
    htmlAttribs,
    children,
    convertedCSSStyles,
    passProps,
  ) => {
    const style = _constructStyles({
      tagName: 'ul',
      htmlAttribs,
      passProps,
      styleSet: 'VIEW',
    });
    const {
      allowFontScaling,
      rawChildren,
      nodeIndex,
      key,
      baseFontStyle,
    } = passProps;
    const baseFontSize = baseFontStyle.fontSize || 14;

    const mappedChildren =
      children &&
      children.map((child, index) => {
        const rawChild = rawChildren[index];
        let prefix = false;

        let isRTLText = false;
        if (!disableRtl) {
          isRTLText = isRTL(this.getListItemText(rawChild));
        }

        const alignmentStyle = isRTLText
          ? DEFAULT_STYLES.rtlListItem
          : DEFAULT_STYLES.ltrListItem;

        if (rawChild) {
          if (rawChild.parentTag === 'ul' && rawChild.tagName === 'li') {
            prefix = (
              <View
                // eslint-disable-next-line react/no-array-index-key
                key={`list-item-prefix-${nodeIndex}-${index}`}
                style={{
                  width: baseFontSize / 2.8,
                  height: baseFontSize / 2.8,
                  marginTop: baseFontSize / 2,
                  borderRadius: baseFontSize / 2.8,
                  backgroundColor: flipFlopColors.black,
                  ...alignmentStyle,
                }}
              />
            );
          } else if (rawChild.parentTag === 'ol' && rawChild.tagName === 'li') {
            const bulletNumber = index + 1;
            prefix = (
              <Text
                // eslint-disable-next-line react/no-array-index-key
                key={`list-item-prefix-${nodeIndex}-${index}`}
                allowFontScaling={allowFontScaling}
                style={{
                  fontSize: baseFontSize,
                  ...alignmentStyle,
                }}>
                {isRTL ? `.${bulletNumber}` : `${bulletNumber}.`}
              </Text>
            );
          }
        }

        const listItemChildern = [
          // eslint-disable-next-line react/no-array-index-key
          <View
            key={`list-item-text-${nodeIndex}-${index}`}
            style={commonStyles.flex1}>
            {child}
          </View>,
        ];
        listItemChildern[isRTLText ? 'push' : 'unshift'](prefix);

        return (
          // eslint-disable-next-line react/no-array-index-key
          <View
            key={`list-${nodeIndex}-${index}-${key}`}
            style={DEFAULT_STYLES.listItemContainer}>
            {listItemChildern}
          </View>
        );
      });
    return (
      <View style={style} key={key}>
        {mappedChildren}
      </View>
    );
  };

  getListItemText = (listItem) => {
    let pathToChildWithData = 'children[0].data';
    let count = 0;
    let text = '';
    while (count < MAX_LIST_ITEM_TEXT_DEPTH && !text) {
      count += 1;
      text = get(listItem, pathToChildWithData);
      pathToChildWithData = `children[0].${pathToChildWithData}`;
    }
    return text;
  };

  static getDerivedStateFromProps(props, state) {
    const {value, showFullText, showExpand} = props;
    if (state.value !== value) {
      const collapsed = !showFullText && !showExpand;

      let presentedValue = collapsed
        ? value
            .replace(/<p><br \/><\/p>/gi, '<br/>')
            .replace(BLOCK_ELEMENTS_REGEX, (match) => `${match}<br/>`)
        : value;
      presentedValue = presentedValue
        .replace(/\r/gi, '')
        .replace(/\n/gi, '<br/>');
      const matchedParagraphsEndings = presentedValue.match(/<\/p>/gi);

      return {
        value,
        presentedValue,
        collapsed,
        hasHtml:
          matchedParagraphsEndings && matchedParagraphsEndings.length > 1,
      };
    }
    return null;
  }

  handleTranslationChange = (newValue) => {
    this.setState({presentedValue: newValue});
  };
}

HtmlText.propTypes = {
  lineHeight: PropTypes.number,
  numberOfLines: PropTypes.number,
  value: PropTypes.string,
  showFullText: PropTypes.bool,
  showExpand: PropTypes.bool,
  translateBtnPosition: PropTypes.number,
  showTranslateButton: PropTypes.bool,
  wrapperStyle: stylesScheme,
  style: stylesScheme,
  textStyle: stylesScheme,
  boldTextStyle: stylesScheme,
  listStyle: stylesScheme,
  ctaText: PropTypes.string,
  ctaTextStyle: stylesScheme,
  onPress: PropTypes.func,
  onLinkPress: PropTypes.func,
  disableRtl: PropTypes.bool,
  selectable: PropTypes.bool,
  testID: PropTypes.string,
};

export default HtmlText;
