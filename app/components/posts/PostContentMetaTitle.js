import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {View, Text} from '../basicComponents';
import {AwesomeIcon, HomeisIcon} from '../../assets/icons';
import {flipFlopColors, commonStyles} from '../../vars';
import {uiDefinitions, entityTypes, postTypes} from '../../vars/enums';
import {isHebrewOrArabic} from '../../infra/utils/stringUtils';

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
    alignItems: 'center',
  },
  rtlDirection: {
    flexDirection: 'row-reverse',
  },
  marginTop: {
    marginTop: 10,
  },
  iconMarginRight: {
    marginRight: 7,
  },
  iconMarginLeft: {
    marginLeft: 7,
  },
  iconOffsetMarginTop: {
    marginTop: -3,
  },
});
const PostContentMetaTitle = ({
  beforeTextComponent,
  afterTextComponent,
  iconName,
  contentType,
  title,
  prefixTitle,
  withMarginTop,
  isRtl,
}) => {
  const iconDefinitions = uiDefinitions[contentType];
  const {isHomeisIcon, name} = iconDefinitions;
  const IconComponent = isHomeisIcon ? HomeisIcon : AwesomeIcon;
  const separator = <Text color={flipFlopColors.azure}> · </Text>;
  const content = [title];

  if (prefixTitle) {
    content.unshift(prefixTitle, separator);
  }

  const isIconWithOffsetMarginTop =
    contentType === postTypes.RECOMMENDATION || isHebrewOrArabic(content);

  const beforeComponent = beforeTextComponent || (
    <IconComponent
      name={iconName || name}
      color={flipFlopColors.azure}
      size={15}
      weight="solid"
      style={[
        isRtl ? styles.iconMarginLeft : styles.iconMarginRight,
        isIconWithOffsetMarginTop && styles.iconOffsetMarginTop,
      ]}
    />
  );

  return (
    <View
      style={[
        commonStyles.flex1,
        styles.container,
        isRtl ? styles.rtlDirection : commonStyles.flexDirectionRow,
        withMarginTop && styles.marginTop,
      ]}>
      {beforeComponent}
      <Text size={16} color={flipFlopColors.azure} numberOfLines={1}>
        {React.Children.toArray(content)}
      </Text>
      {afterTextComponent}
    </View>
  );
};

PostContentMetaTitle.propTypes = {
  prefixTitle: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.number,
  ]),
  contentType: PropTypes.oneOf([
    ...Object.values(postTypes),
    ...Object.values(entityTypes),
  ]),
  title: PropTypes.string,
  iconName: PropTypes.string,
  beforeTextComponent: PropTypes.node,
  afterTextComponent: PropTypes.node,
  withMarginTop: PropTypes.bool,
  isRtl: PropTypes.bool,
};

export default PostContentMetaTitle;
