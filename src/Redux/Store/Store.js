import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import Reducer from '../Reducers/Reducer';
import {persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const middleware = [thunk];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, Reducer)


export const Store = createStore(persistedReducer, composeEnhancers(
    applyMiddleware(...middleware)
  ));
