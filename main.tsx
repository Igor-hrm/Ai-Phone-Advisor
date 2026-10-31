import { createRoot } from 'react-dom/client';
import { App } from './App';
import { HashRouter as Router } from 'react-router-dom';

import { UnavailablePopupProvider } from './contexts/UnavailablePopupContext';

import './styles/globals.scss';

createRoot(document.getElementById('root') as HTMLElement).render(
  <Router>
    <UnavailablePopupProvider>
      <App />
    </UnavailablePopupProvider>
  </Router>,
);
