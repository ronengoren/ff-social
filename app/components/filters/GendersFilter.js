import React, {Component} from 'react';
import I18n from '/infra/localization';
import PropTypes from 'prop-types';
import {genderType} from '../../vars/enums';
import {without} from '../../infra/utils';
import FilterRow from './FilterRow';

class GendersFilter extends Component {
  render() {
    const {genders} = this.props;
    return without(
      Object.values(genderType),
      genderType.UNKNOWN,
    ).map((value, index) => (
      <FilterRow
        key={value}
        action={this.handlePressed(value)}
        index={index}
        isActive={genders.includes(value)}
        text={I18n.t(`filters.genders.${value}`)}
      />
    ));
  }

  handlePressed = (gender) => () => {
    const {onGendersChanged, genders} = this.props;

    let newGenders;
    const genderIndex = genders.findIndex((item) => item === gender);
    if (genderIndex > -1) {
      newGenders = [
        ...genders.slice(0, genderIndex),
        ...genders.slice(genderIndex + 1),
      ];
    } else {
      newGenders = [...genders, gender];
    }

    onGendersChanged(newGenders);
  };
}

GendersFilter.propTypes = {
  genders: PropTypes.array,
  onGendersChanged: PropTypes.func.isRequired,
};

export default GendersFilter;
