/* global CURRENT_GAME */
import { observeAuthState } from './utilities/auth/observe-auth-state.js';
import { getCharacters } from './characters/get-characters.js';

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

  const isAtGameRoot = () => {
    if (window.location.pathname.endsWith('spacedoor/')) {
      return true;
    }

    if (window.location.pathname.endsWith('heroes-and-henchmen/')) {
      return true;
    }

    return false;
  };

  const updateCharacterLinks = (characters) => {
    const characterList = characters.map(({ _id, name }) => `
        <li>
          <a href="${isAtGameRoot() ? '.' : '..'}/character-sheet?id=${_id}">${name}</a>
        </li>
      `).join('');

    const characterListElements = document.querySelectorAll('[data-character-list-nav]');
    if (characterListElements.length) {
      characterListElements.forEach((element) => {
        // eslint-disable-next-line no-param-reassign
        element.innerHTML = characterList;
      });
    }
  };

  document.addEventListener('user-logged-in', async (event) => {
    window.CURRENT_USER = event.detail;
    updateAuthLinks(true);
    const characters = await getCharacters({ uid: window.CURRENT_USER.uid, CURRENT_GAME });
    document.dispatchEvent(new CustomEvent('characters-welcome', { detail: { characters } }));
  });

  document.addEventListener('user-logged-out', () => {
    window.CURRENT_USER = undefined;
    updateAuthLinks(false);
  });

  document.addEventListener('characters-welcome', ({ detail }) => {
    const { characters } = detail;
    updateCharacterLinks(characters);
  });

  observeAuthState();
})();
