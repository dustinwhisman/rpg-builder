import { observeAuthState } from './utilities/auth/observe-auth-state.js';

(() => {
  if (localStorage.getItem('is-logged-in')) {
    document.body.classList.add('is-logged-in');
  }

  const updateAuthLinks = (isLoggedIn) => {
    if (isLoggedIn) {
      document.body.classList.add('is-logged-in');
      localStorage.setItem('is-logged-in', 'true');
    } else {
      document.body.classList.remove('is-logged-in');
      localStorage.removeItem('is-logged-in');
    }
  };

  document.addEventListener('user-logged-in', (event) => {
    window.CURRENT_USER = event.detail;
    updateAuthLinks(true);
  });

  document.addEventListener('user-logged-out', () => {
    window.CURRENT_USER = undefined;
    updateAuthLinks(false);
  });

  observeAuthState();
})();
