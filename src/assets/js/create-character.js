import { fetcher } from './utilities/fetcher.js';

(() => {
  document.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (event.target.matches('#create-character-form')) {
      const { elements } = event.target;

      const { uid } = window.CURRENT_USER;
      const characterName = elements['character-name'].value;
      const game = elements.game.value;

      const statInputs = event.target.querySelectorAll('[data-stat]');
      const stats = Array.from(statInputs)
        .filter((input) => input.checked)
        .reduce((statsArray, input) => {
          const { name, value } = input;
          return [
            ...statsArray,
            {
              name,
              die: value,
              bonus: 0,
            },
          ];
        }, []);

      const skillInputs = event.target.querySelectorAll('[data-skill]');
      const skills = Array.from(skillInputs)
        .reduce((skillsArray, input) => {
          const { name } = input;
          return [
            ...skillsArray,
            {
              name,
              die: '',
              bonus: 0,
            },
          ];
        }, []);

      const mutation = `
        mutation {
          createCharacter(data: {
            uid: "${uid}"
            name: "${characterName}"
            game: "${game}"
            stats: {
              create: [${stats.map(({ name, die, bonus }) => `
                {
                  name: "${name}",
                  die: "${die}",
                  bonus: ${bonus},
                }`).join('')}
              ]
            }
            skills: {
              create: [${skills.map(({ name, die, bonus }) => `
                {
                  name: "${name}",
                  die: "${die}",
                  bonus: ${bonus},
                }`).join('')}
              ]
            }
          }) {
            _id
          }
        }
      `;

      const response = await fetcher('/api/graphql', {
        method: 'POST',
        body: JSON.stringify({
          query: mutation,
        }),
      });

      const { result } = await response.json();
      const { _id: id } = result.data.createCharacter;
      window.location.href = `../characters?id=${id}`;
    }
  });
})();
