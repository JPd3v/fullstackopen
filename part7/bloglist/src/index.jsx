import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { QueryClientProvider, QueryClient } from 'react-query';
import NotificationContextProvider from './context/NotificationContextProvider.jsx';
import AuthContextProvider from './context/AuthContextProvider.jsx';
import { BrowserRouter } from 'react-router-dom';
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <NotificationContextProvider>
          <AuthContextProvider>
            <App />
          </AuthContextProvider>
        </NotificationContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
