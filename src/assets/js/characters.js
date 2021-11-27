(() => {
  document.addEventListener('characters-welcome', async ({ detail }) => {
    const { characters } = detail;
    const characterList = `
      <ul class="util-no-list-style">
        ${characters.map(({ _id, name }) => `
          <li>
            <a href="../character-sheet?id=${_id}">${name}</a>
          </li>
        `).join('')}
      </ul>
    `;

    const characterListElement = document.querySelector('[data-character-list]');
    characterListElement.innerHTML = characterList;
  });
})();
