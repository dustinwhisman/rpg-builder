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
            dcBonus
            skills {
              data {
                name
                die
                bonus
              }
            }
          }
        }
        damageDie
        numDamageDie
        damageBonus
        healingDie
        numHealingDie
        healingBonus
        damageThreshold
        actionPointMax
        actionPoints
        experiencePoints
        baseHitPointMax
        hitPointMultiplier
        hitPoints
        hitPointRegen
        baseShieldHitPointMax
        shieldHitPointMultiplier
        shieldHitPoints
        shieldHitPointRegen
        vulnerabilities
        resistances
        immunities
        upgrades {
          data {
            name
            description
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
  const stats = character.stats.data;
  const skills = stats.reduce((skillsArray, stat) => {
    const statSkills = stat.skills.data.map((skill) => ({
      statDie: stat.die,
      statBonus: stat.bonus,
      ...skill,
    }));

    return skillsArray.concat(statSkills);
  }, []);

  const upgrades = character.upgrades.data;

  return {
    ...character,
    stats,
    skills,
    upgrades,
  };
};
