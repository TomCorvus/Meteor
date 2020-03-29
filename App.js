import React from 'react';
import { Provider } from "react-redux";
import { createStore } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';

import * as actionCreators from './actions/MeteorActions'

import Home from './pages/PageHome';
import MeteorReducer from "./reducers/MeteorReducers";

const composeEnhancers = composeWithDevTools({
  actionCreators,
  trace: true,
  traceLimit: 25,
})

const store = createStore(MeteorReducer, composeEnhancers());

export default class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <Home />
      </Provider>
    );
  }

}