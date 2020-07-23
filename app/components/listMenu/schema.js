import PropTypes from 'prop-types';
import {iconMaskTypes, checkboxStyles} from '../../vars/enums';

const listMenuItemIconSchema = {
  name: PropTypes.string,
  url: PropTypes.string,
  size: PropTypes.number,
  weight: PropTypes.oneOf(['solid', 'light']),
  color: PropTypes.string,
  style: PropTypes.object,
  iconMask: PropTypes.oneOf(Object.values(iconMaskTypes)),
};

const listMenuItemTextSchema = {
  caption: PropTypes.string,
  size: PropTypes.number,
  lineHeight: PropTypes.number,
  style: PropTypes.object,
  color: PropTypes.string,
};

const listMenuItemSchema = {
  text: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.shape(listMenuItemTextSchema),
  ]),
  icon: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.shape(listMenuItemIconSchema),
  ]),
  rightSideIcon: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.shape(listMenuItemIconSchema),
  ]),
  isSelectable: PropTypes.bool,
  isSelected: PropTypes.bool,
  id: PropTypes.string,
  onItemClick: PropTypes.func,
  data: PropTypes.object,
  index: PropTypes.number,
  withBorder: PropTypes.bool,
  checkboxStyle: PropTypes.oneOf(Object.values(checkboxStyles)),
};

const listMenuQuerySchema = PropTypes.shape({
  reducerStatePath: PropTypes.string,
  apiQuery: PropTypes.shape({
    domain: PropTypes.shape,
    key: PropTypes.string,
    params: PropTypes.object,
  }),
  extraTopComponentsData: PropTypes.object,
  adjustQueryItemData: PropTypes.func,
});

const schema = {
  listMenuItemIconSchema,
  listMenuItemTextSchema,
  listMenuItemSchema,
  listMenuQuerySchema,
};

export default schema;
