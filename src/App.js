import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
          <a className="navbar-brand">Brand</a>
          <button className="navbar-toggler" data-target="#my-nav" data-toggle="collapse" aria-controls="my-nav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div id="my-nav" className="collapse navbar-collapse">
          </div>
        </nav>
      </header>
      <p>
        <button type="button" class="btn btn-primary">Primary button!</button>
        <div className="container-fluid">
          <div className="row">
            <div className="col col-6">
              left
            </div>
            <div className="col col-6">
              right
            </div>
          </div>
        </div>
      </p>
    </div>
  );
}

export default App;
