import {useSelector} from 'react-redux';

function useUnreadPagesCount() {
  const count = useSelector((state) => {
    let count = state.inbox.unreadChats || 0;
    Object.values(state.inbox.unreadTabsChats).forEach((value) => {
      count -= value || 0;
    });
    return Math.max(count, 0);
  });

  return count;
}

export default useUnreadPagesCount;
