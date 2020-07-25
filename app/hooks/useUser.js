import {useSelector} from 'react-redux';
import {get} from '../infra/utils';

const useUser = () => useSelector((state) => get(state, 'auth.user'));

export default useUser;
