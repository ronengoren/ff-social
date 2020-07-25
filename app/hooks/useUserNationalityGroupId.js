import {useSelector} from 'react-redux';
import {get} from '../infra/utils';

function useUserNationalityGroupId() {
  return useSelector((state) => get(state, 'auth.user.nationalityGroup.id'));
}

export default useUserNationalityGroupId;
