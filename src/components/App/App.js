import React from 'react';
import { HashRouter, Route, Link } from 'react-router-dom';
import logo from '../../logo.svg';
import './App.scss';

import CardContainer from "../CardContainer/CardContainer";

const Home = () => (
    <div className="App">
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
        </p>
    </div>
);

const App = () => (
    <HashRouter>
        <CardContainer/>
    </HashRouter>
);

export default App;
