import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {View, PlaceholderRectangle} from '../basicComponents';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class PeopleSearchResultPlaceholders extends React.PureComponent {
  static renderPlaceholderItem = ({index, containerStyle, textStyle}) => (
    <View key={index} style={containerStyle}>
      <PlaceholderRectangle
        width={55}
        height={55}
        borderRadius={55}
        marginRight={0}
        marginBottom={0}
      />
      <View style={[styles.content, textStyle]}>
        <PlaceholderRectangle
          width={35}
          height={12}
          borderRadius={6}
          marginRight={0}
          marginBottom={8}
        />
        <PlaceholderRectangle
          width={55}
          height={12}
          borderRadius={6}
          marginRight={0}
          marginBottom={6}
        />
      </View>
    </View>
  );

  render() {
    const {containerStyle, textStyle, numOfPlaceholders} = this.props;
    return (
      <View style={styles.container}>
        {Array.from({length: numOfPlaceholders}, (item, index) =>
          PeopleSearchResultPlaceholders.renderPlaceholderItem({
            index,
            containerStyle,
            textStyle,
          }),
        )}
      </View>
    );
  }
}

PeopleSearchResultPlaceholders.defaultProps = {
  numOfPlaceholders: 6,
};

PeopleSearchResultPlaceholders.propTypes = {
  containerStyle: PropTypes.object,
  textStyle: PropTypes.object,
  numOfPlaceholders: PropTypes.number,
};

export default PeopleSearchResultPlaceholders;
