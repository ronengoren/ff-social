import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
// import { getGallery } from '/infra/instagram';

class InstagramProvider extends React.Component {
  state = {
    gallery: null,
  };

  static mediaTypes = {
    IMAGE: 'image',
    VIDEO: 'video',
  };

  render() {
    const {gallery, user, error, loading} = this.state;

    const {
      children,
      LoadingComponent,
      CtaComponent,
      ErrorComponent,
      token,
    } = this.props;

    if (!token) {
      return CtaComponent;
    }

    if (error) {
      return ErrorComponent;
    }

    if (loading) {
      return LoadingComponent;
    }

    if (gallery && gallery.length) {
      return children({gallery, user});
    }

    return null;
  }

  // componentDidMount() {
  //   const { token, postId, withUserInfo } = this.props;
  //   if (token) {
  //     getGallery({ token, postId, onLoading: this.onLoadingGallery, onSuccess: this.onFetchGallerySuccess, onError: this.onFetchGalleryError, withUserInfo });
  //   }
  // }

  // componentDidUpdate(prevProps) {
  //   const { token, postId, withUserInfo } = this.props;
  //   if (token && prevProps.token !== token) {
  //     getGallery({ token, postId, onLoading: this.onLoadingGallery, onSuccess: this.onFetchGallerySuccess, onError: this.onFetchGalleryError, withUserInfo });
  //   }
  // }

  onLoadingGallery = () => {
    const {onLoadingGallery} = this.props;
    onLoadingGallery && onLoadingGallery();
    this.setState({loading: true});
  };

  onFetchGallerySuccess = (data) => {
    const {onFetchGallerySuccess} = this.props;
    onFetchGallerySuccess && onFetchGallerySuccess(data);
    this.setState({...data, loading: false});
  };

  onFetchGalleryError = (error) => {
    const {onFetchGalleryError} = this.props;
    onFetchGalleryError && onFetchGalleryError(error);
    this.setState({error, loading: false});
  };
}

InstagramProvider.propTypes = {
  onLoadingGallery: PropTypes.func,
  onFetchGallerySuccess: PropTypes.func,
  onFetchGalleryError: PropTypes.func,
  postId: PropTypes.string,
  token: PropTypes.string,
  withUserInfo: PropTypes.bool,
  children: PropTypes.func,
  LoadingComponent: PropTypes.node,
  CtaComponent: PropTypes.node,
  ErrorComponent: PropTypes.node,
};

InstagramProvider.defaultProps = {
  CtaComponent: <View />,
  ErrorComponent: <View />,
  LoadingComponent: <View />,
};

export default InstagramProvider;
