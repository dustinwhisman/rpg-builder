/* global CURRENT_GAME AC_STAT HP_STAT */
import { getCharacter } from './characters/get-character.js';

(() => {
  const updateTitle = (name) => {
    document.title = `${name}: Character Sheet | ${CURRENT_GAME}`;
    const headingElement = document.querySelector('[data-character-name]');
    headingElement.textContent = ` – ${name}`;
  };

  const displayComputedStats = (stats) => {
    const armorClassDie = stats.find((stat) => stat.name === AC_STAT).die;
    const hitPointDie = stats.find((stat) => stat.name === HP_STAT).die;

    const armorClass = (Number.parseInt(armorClassDie.replace('d', ''), 10) / 2) + 3;
    const hitPoints = (Number.parseInt(hitPointDie.replace('d', ''), 10) / 2) + 7;

    const content = `
      <div class="cmp-cluster">
        <p>Max <abbr title="Hit Points">HP</abbr>: ${hitPoints}</p>
        <p><abbr title="Armor Class">AC</abbr>: ${armorClass}</p>
      </div>
    `;

    const computedStatsElement = document.querySelector('[data-computed-stats]');
    computedStatsElement.innerHTML = content;
  };

  const displayStats = (stats) => {
    const content = `
      <table>
        <thead>
          <tr>
            <th scope="col">Stat</th>
            <th scope="col">Roll</th>
          </tr>
        </thead>
        <tbody>
          ${stats.map(({ name, die, bonus }) => `
            <tr>
              <th scope="row">${name}</th>
              <td>${die}${bonus > 0 ? ` + ${bonus}` : ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    const statsElement = document.querySelector('[data-stats]');
    statsElement.innerHTML = content;
  };

  const displaySkills = (skills) => {
    const content = `
      <table>
        <thead>
          <tr>
            <th scope="col">Skill</th>
            <th scope="col">Roll</th>
          </tr>
        </thead>
        <tbody>
          ${skills.map(({
    name, die, bonus, statDie, statBonus,
  }) => `
            <tr>
              <th scope="row">${name}</th>
              <td>${statDie}${die !== '' ? ` + ${die}` : ''}${bonus + statBonus > 0 ? ` + ${bonus + statBonus}` : ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    const skillsElement = document.querySelector('[data-skills]');
    skillsElement.innerHTML = content;
  };

  document.addEventListener('user-logged-in', async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id');

    const { name, stats, skills } = await getCharacter(id);

    updateTitle(name);
    displayComputedStats(stats);
    displayStats(stats);
    displaySkills(skills);
  });
})();
