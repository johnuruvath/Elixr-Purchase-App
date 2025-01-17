import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {persistor, store} from './redux/store.ts';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import "./index.scss";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
   <Provider store={store}>
   <PersistGate loading={null} persistor={persistor}>
    <App />
    </PersistGate>
   </Provider>

);

reportWebVitals();
