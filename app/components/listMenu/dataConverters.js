import {iconMaskTypes} from '../../vars/enums';

const defaultConverter = ({data}) => {
  const {id, name, media: {thumbnail} = {}, type, extraProps = {}} = data;

  return {
    text: {caption: name},
    icon: {url: thumbnail, iconMask: iconMaskTypes.AVATAR},
    id,
    type,
    data,
    ...extraProps,
  };
};

export default {
  defaultConverter,
};
