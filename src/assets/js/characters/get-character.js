import { fetcher } from '../utilities/fetcher.js';

export const getCharacter = async (id) => {
  const query = `
    query {
      findCharacterByID(id: "${id}") {
        name
        stats {
          data {
            name
            die
            bonus
            skills {
              data {
                name
                die
                bonus
              }
            }
          }
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
  const character = result.data.findCharacterByID;
  const { name } = character;
  const stats = character.stats.data;
  const skills = stats.reduce((skillsArray, stat) => {
    const statSkills = stat.skills.data.map((skill) => ({
      statDie: stat.die,
      statBonus: stat.bonus,
      ...skill,
    }));

    return skillsArray.concat(statSkills);
  }, []);

  return { name, stats, skills };
};
