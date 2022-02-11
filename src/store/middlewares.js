import { applyMiddleware, compose } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

const isDevCompose =
  process.env.NODE_ENV !== 'production' && typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

// Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
const composeEnhancers = isDevCompose ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;
const logger = process.env.NODE_ENV === 'development' && createLogger({ collapsed: true });
const middleware = [thunk, promiseMiddleware(), logger].filter(Boolean);
const middlewareEnhancer = applyMiddleware(...middleware);

export default composeEnhancers(middlewareEnhancer);
