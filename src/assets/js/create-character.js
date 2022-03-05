import { fetcher } from './utilities/fetcher.js';
import { computedStat } from './characters/computed-stat.js';

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
          const { name, value: relatedStat } = input;
          return [
            ...skillsArray,
            {
              relatedStat,
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
                  name: "${name}"
                  die: "${die}"
                  bonus: ${bonus}
                  dcBonus: 0
                  skills: {
                    create: [${skills
    .filter(({ relatedStat }) => relatedStat === name)
    .map(({ name: skillName, die: skillDie, bonus: skillBonus }) => `
                      {
                        name: "${skillName}"
                        die: "${skillDie}"
                        bonus: ${skillBonus}
                      }`).join('')}
                    ]
                  }
                }`).join('')}
              ]
            }
            damageDie: "${elements.offense.value}"
            numDamageDie: 1
            damageBonus: 0
            healingDie: "${elements.healing.value}"
            numHealingDie: 1
            healingBonus: 0
            damageThreshold: ${Number.parseInt(elements.defense.value, 10)}
            actionPointMax: 3
            actionPoints: 3
            experiencePoints: 0
            baseHitPointMax: ${computedStat(stats.find(({ name }) => name === 'Tough').die, 7)}
            hitPointMultiplier: 1
            hitPoints: ${computedStat(stats.find(({ name }) => name === 'Tough').die, 7)}
            hitPointRegen: 0
            baseShieldHitPointMax: 0
            shieldHitPointMultiplier: 1
            shieldHitPoints: 0
            shieldHitPointRegen: 0
            vulnerabilities: ["${Array.from(elements.vulnerabilities).filter((v) => v.checked).map((v) => v.value).join('", "')}"]
            resistances: ["${Array.from(elements.resistances).filter((r) => r.checked).map((r) => r.value).join('", "')}"]
            immunities: ["${Array.from(elements.immunities).filter((i) => i.checked).map((i) => i.value).join('", "')}"]
            upgrades: {
              create: []
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
      window.location.href = `../character-sheet?id=${id}`;
    }
  });
})();
