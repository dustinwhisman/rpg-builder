import { fetcher } from '../utilities/fetcher.js';

export const getCharacters = async ({ uid, CURRENT_GAME }) => {
  const query = `
      query {
        charactersByGame(uid: "${uid}", game: "${CURRENT_GAME}") {
          data {
            _id
            name
          }
        }
      }
    `;

  const response = await fetcher('/api/graphql', {
    method: 'POST',
    body: JSON.stringify({
      query,
    }),
  });

  const { result } = await response.json();
  const characters = result.data.charactersByGame.data;

  return characters;
};
