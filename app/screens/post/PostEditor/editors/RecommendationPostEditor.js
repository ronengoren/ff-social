import React from 'react';
import PropTypes from 'prop-types';
import {PageEditor} from '../../../../components/page';
import {editModes} from '../../../../vars/enums';
import {navigationService} from '../../../../infra/navigation';

class RecommendationPostEditor extends React.Component {
  render() {
    // const {
    //   form,
    //   onSubmit,
    //   updateForm,
    //   setMedia,
    //   hidePicker,
    //   mode,
    //   header,
    // } = this.props;
    return (
      <PageEditor
        form={form}
        updateForm={updateForm}
        setMedia={setMedia}
        onSubmit={onSubmit}
        type={PageEditor.TYPES.RECOMMENDATION}
        header={header}
        backAction={() => navigationService.goBack()}
        ref={(node) => {
          this.creatorEditor = node;
        }}
        // onTitleInputFocus={hidePicker}
        mode={mode}
      />
    );
  }

  inputFocus = () => {
    // The CreatorEditor focuses on componentDidMount but the PostEditor is using this function and will try to invoke it so it needs to be here
  };

  inputBlur = () => {
    this.creatorEditor && this.creatorEditor.inputBlur();
  };
}

RecommendationPostEditor.propTypes = {
  form: PropTypes.shape({
    location: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    text: PropTypes.string,
    url: PropTypes.string,
    scrapedUrlId: PropTypes.string,
    pageId: PropTypes.string,
    googlePlaceId: PropTypes.string,
    mediaUrl: PropTypes.string,
  }),
  mode: PropTypes.oneOf(Object.values(editModes)),
  updateForm: PropTypes.func,
  setMedia: PropTypes.func,
  onSubmit: PropTypes.func,
  // hidePicker: PropTypes.func,
  header: PropTypes.node,
};

export default RecommendationPostEditor;
