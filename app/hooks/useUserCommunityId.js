import {useSelector} from 'react-redux';
import {get} from '../infra/utils';

function useUserCommunityId() {
  return useSelector((state) => get(state, 'auth.user.community.id'));
}

export default useUserCommunityId;
