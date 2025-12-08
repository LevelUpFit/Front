import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css';

// PWA 업데이트 체크 및 자동 적용
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.update();
    });
  });

  // 새 버전 감지 시 자동 새로고침
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);