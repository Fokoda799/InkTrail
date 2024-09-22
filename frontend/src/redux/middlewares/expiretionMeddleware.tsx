import { BLOGS_FETCHED } from '../../types/blogTypes';
import { Middleware } from 'redux';
import { clearData } from '../reducers/blogReducer';

interface BlogsFetchedAction {
    type: typeof BLOGS_FETCHED;
    // Add other properties if needed
}
  

const expirationMiddleware = (expiryTime: number): Middleware => store => next => (action: BlogsFetchedAction) => {
  if (action.type === BLOGS_FETCHED) {
    setTimeout(() => {
      store.dispatch(clearData());
    }, expiryTime);
  }

  return next(action);
};

export default expirationMiddleware;
