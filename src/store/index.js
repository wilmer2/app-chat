import { createStore, applyMiddleware } from 'redux';
import Immutable from 'immutable';
import each from 'lodash/each';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import reducer from './reducer';
import saga from './sagas';

const sagaMiddleware = createSagaMiddleware();

let middlewares = [sagaMiddleware];

const setStateTransformer = (state) => {
  const newState = {};

  each(state, (value, key) => {
    if (Immutable.isImmutable(value)) {
      newState[key] = value.toJS();
    } else {
      newState[key] = setStateTransformer(value);
    }
  });

  return newState;
}

if (process.env.NODE_ENV === 'development') {
  const logger = createLogger({
    collapse: true,
    stateTransformer: state =>  setStateTransformer(state),
  });

  middlewares = [...middlewares, logger];
}

const store = createStore(
  reducer,
  applyMiddleware(...middlewares)
);


sagaMiddleware.run(saga);

export default store;
