import React from 'react';
import logo from './logo.svg';
import './App.css';
import Chart from './components/Chart'

function App() {
  return (
    
      <div className="d-flex flex-column">
        <div className="container-fluid">
          <header className="app-header">
            <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
              <h3>Covid 19: Daily Confirmed Cases (D3 / React Sample)</h3>
              <button className="navbar-toggler" data-target="#my-nav" data-toggle="collapse" aria-controls="my-nav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
            </nav>
          </header>
        </div>
        {/* body */}
        <div id="main">
          <Chart />
        </div>
      </div>
    
  );
}

export default App;
