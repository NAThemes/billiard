import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

type Phase = "mount" | "update" | "nested-update";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

function onRender(
  id: string,
  phase: Phase,
  actualDuration : number,
  baseDuration : number,
  startTime : number,
  commitTime : number
) {
  console.log(id, phase, actualDuration, baseDuration, startTime, commitTime);
}

root.render(
  <React.StrictMode>
    <React.Profiler id="app" onRender={onRender}>
      <App />
    </React.Profiler>
  </React.StrictMode>
);
