import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Text} from './basicComponents';
import I18n from '../infra/localization';
// import GoogleTranslateService from '/infra/google/googleTranslateService';
import {flipFlopColors} from '../vars';
import {isAppAdmin} from '../infra/utils';

const modes = {
  INITIAL: 0,
  LOADING: 1,
  TRANSLATED: 2,
  ERROR: 4,
};

class TranslateButton extends React.Component {
  state = {
    mode: modes.INITIAL,
  };

  render() {
    const {user} = this.props;
    const {mode} = this.state;

    if (
      !isAppAdmin(user) ||
      user.settings.language === user.community.defaultLanguage
    ) {
      return null;
    }

    let textKey;

    switch (mode) {
      case modes.TRANSLATED:
        textKey = 'see_original';
        break;
      case modes.LOADING:
        textKey = 'loading';
        break;
      case modes.ERROR:
        textKey = 'error';
        break;
      case modes.INITIAL:
      default:
        textKey = 'see_translation';
        break;
    }

    return (
      <Text
        size={10}
        lineHeight={20}
        color={flipFlopColors.b30}
        onPress={this.handlePress}
        bold>
        {I18n.t(`common.buttons.translate.${textKey}`)}
      </Text>
    );
  }

  handlePress = async () => {
    //     const { mode } = this.state;
    //     const { initialValue, onChange } = this.props;
    //     switch (mode) {
    //       case modes.ERROR:
    //       case modes.LOADING:
    //         break;
    //       case modes.TRANSLATED:
    //         onChange(initialValue);
    //         this.setState({ mode: modes.INITIAL });
    //         break;
    //       case modes.INITIAL:
    //       default:
    //         if (this.translatedText) {
    //           onChange(this.translatedText);
    //           this.setState({ mode: modes.TRANSLATED });
    //         } else {
    //           this.setState({ mode: modes.LOADING });
    //           const translations = await GoogleTranslateService.translateToEnglish(initialValue);
    //           if (translations.length > 0) {
    //             this.translatedText = translations[0].translatedText;
    //             onChange(translations[0].translatedText);
    //             this.setState({ mode: modes.TRANSLATED });
    //           } else {
    //             this.setState({ mode: modes.ERROR });
    //           }
    //         }
    //     }
  };
}

TranslateButton.propTypes = {
  initialValue: PropTypes.string,
  onChange: PropTypes.func,
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(TranslateButton);
