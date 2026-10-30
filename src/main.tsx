import { createRoot } from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';

import { App } from './App';
import { UnavailablePopupProvider } from './components';

import './styles/globals.scss';

createRoot(document.getElementById('root') as HTMLElement).render(
  <Router>
    <UnavailablePopupProvider>
      <App />
    </UnavailablePopupProvider>
  </Router>,
);
