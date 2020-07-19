/* eslint-disable react/no-array-index-key */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Text} from '../../components/basicComponents';
import {flipFlopColors} from '../../vars';

class TranslatedText extends Component {
  render() {
    const {children, style, textStyle, ...restProps} = this.props;

    return (
      <Text style={[style, textStyle]}>
        {this.tagify().map((child, index) => (
          <Text style={textStyle} key={index} {...restProps} {...child.props}>
            {child.text}
          </Text>
        ))}
      </Text>
    );
  }

  tagify() {
    const {children, map} = this.props;
    if (typeof children !== 'string') {
      return '';
    }

    let nodeArr = children.split(
      /(<b>[\s\S]*?<\/b>)|(<(?:green|azure|pinkishRed)>[\s\S]*?<\/(?:green|azure|pinkishRed)>)|(%\d+%)/g,
    );
    nodeArr = nodeArr.filter((node) => node && node.length);
    const response = nodeArr.map((node) => {
      if (node.slice(0, 3) === '<b>') {
        return {text: node.slice(3, -4), props: {bold: true}};
      } else if (node.slice(0, 7) === '<green>') {
        return {text: node.slice(7, -8), props: {color: flipFlopColors.green}};
      } else if (node.slice(0, 7) === '<azure>') {
        return {text: node.slice(7, -8), props: {color: flipFlopColors.azure}};
      } else if (node.slice(0, 12) === '<pinkishRed>') {
        return {
          text: node.slice(12, -13),
          props: {color: flipFlopColors.pinkishRed},
        };
      }
      const match = node.match(/%\d+%/g);
      if (match && match[0].length === node.length) {
        const index = node.slice(1, -1);
        if (map[index]) {
          const {text, ...textProps} = map[index];

          return {text, props: textProps};
        }
      }
      return {text: node};
    });

    return response;
  }
}

TranslatedText.propTypes = {
  children: PropTypes.string,
  style: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.number,
  ]),
  textStyle: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.number,
  ]),
  map: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
    }),
  ),
};

export default TranslatedText;
