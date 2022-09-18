import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from './Redux/Store/Store';
import { PersistGate } from 'redux-persist/integration/react'
import persistor from './Redux/Store/persistor';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';


ReactDOM.render(
  <Provider store={Store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);


