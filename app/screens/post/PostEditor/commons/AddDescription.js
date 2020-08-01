import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Platform} from 'react-native';
import I18n from '/infra/localization';
import {SimpleHeader, SearchMentionsResults} from '../../../../components';
import {
  View,
  Text,
  TextArea,
  KeyboardAvoidingView,
} from '../../../../components/basicComponents';
import {flipFlopColors} from '../../../../vars';
import {navigationService} from '../../../../infra/navigation';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: flipFlopColors.white,
  },
  innerWrapper: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  innerWrapperPaddingBottom: {
    paddingBottom: 35,
  },
  textArea: {
    padding: 0,
    fontSize: 18,
    lineHeight: 22,
  },
});

const TEXT_LINE_HEIGHT = 25;

class AddDescription extends React.Component {
  state = {
    text: this.props.navigation.state.params.text,
  };

  render() {
    const {
      navigation: {
        state: {
          params: {type, title, subTitle, placeholder, withMentions},
        },
      },
    } = this.props;
    const {text} = this.state;
    return (
      <KeyboardAvoidingView
        style={styles.wrapper}
        contentContainerStyle={styles.body}
        behavior={Platform.select({ios: 'padding', android: null})}>
        <View style={styles.wrapper}>
          <SimpleHeader
            showLeftButton={!withMentions}
            hasBackBtn
            doneAction={this.handleDoneAction}
            doneText={I18n.t(
              `common.buttons.${withMentions ? 'done' : 'save'}`,
            )}
            title={title}
            testID={`${type}DescriptionSave`}
          />
          <View
            style={[
              styles.innerWrapper,
              !withMentions && styles.innerWrapperPaddingBottom,
            ]}>
            {!!subTitle && (
              <Text
                size={22}
                lineHeight={30}
                color={flipFlopColors.b30}
                bold
                style={styles.descriptionHeader}>
                {subTitle}
              </Text>
            )}
            <TextArea
              placeholder={placeholder}
              style={styles.textArea}
              value={text}
              onChange={(text) => this.handleDescriptionChange(text)}
              defaultHeight={TEXT_LINE_HEIGHT * 2}
              autoFocus
              clearMentions={!withMentions}
              withMentions={withMentions}
              testID={`${type}DescriptionInput`}
            />
          </View>
          {withMentions && <SearchMentionsResults />}
        </View>
      </KeyboardAvoidingView>
    );
  }

  handleDoneAction = () => {
    this.updateDescription();
    navigationService.goBack();
  };

  handleDescriptionChange = (text) => {
    const {
      navigation: {
        state: {
          params: {withMentions},
        },
      },
    } = this.props;
    this.setState({text}, () => {
      if (withMentions) {
        this.updateDescription();
      }
    });
  };

  updateDescription = () => {
    const {
      navigation: {
        state: {
          params: {updateFunc, withMentions},
        },
      },
    } = this.props;
    const {text} = this.state;
    updateFunc({text: withMentions || !text ? text : text.trim()});
  };
}

AddDescription.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        updateFunc: PropTypes.func,
        title: PropTypes.string,
        subTitle: PropTypes.string,
        placeholder: PropTypes.string,
        text: PropTypes.string,
        withMentions: PropTypes.bool,
        type: PropTypes.string,
      }),
    }),
  }),
};

export default AddDescription;
