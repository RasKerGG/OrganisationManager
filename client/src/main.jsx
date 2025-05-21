import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter as Router} from 'react-router-dom'

import {
    ModuleRegistry,
    AllCommunityModule,
} from 'ag-grid-community';
import {
    AllEnterpriseModule,
    ServerSideRowModelModule,
} from 'ag-grid-enterprise';

ModuleRegistry.registerModules([
    AllEnterpriseModule,
    AllCommunityModule,
    ServerSideRowModelModule,
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Router>
         <App />
      </Router>
  </StrictMode>,
)
