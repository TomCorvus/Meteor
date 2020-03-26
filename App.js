import React from 'react';
import { StyleSheet } from 'react-native';
import { Provider } from "react-redux";
import { createStore } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';

import Home from './pages/PageHome';
import MeteorReducer from "./reducers/MeteorReducers";

const store = createStore(MeteorReducer, composeWithDevTools());

export default class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <Home />
      </Provider>
    );
  }

}