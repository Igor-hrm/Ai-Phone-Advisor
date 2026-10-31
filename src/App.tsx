import './App.scss';

import { ChatBot, Header } from './components';

import { PhonePage, ProductDetailsPage } from './modules';

import { Routes, Route, Navigate } from 'react-router-dom';

export const App = () => {
  return (
    <div className="App" id="top">
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<PhonePage />} />
          <Route path="/product/:productId" element={<ProductDetailsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <ChatBot />
    </div>
  );
};
