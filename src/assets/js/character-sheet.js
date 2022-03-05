/* global CURRENT_GAME */
import { getCharacter } from './characters/get-character.js';
import { computedStat } from './characters/computed-stat.js';

(() => {
  const updateTitle = ({ name }) => {
    document.title = `${name}: Character Sheet | ${CURRENT_GAME}`;
    const element = document.querySelector('[data-character-name]');
    element.textContent = name;
  };

  const displayStats = ({ stats }) => {
    const content = `
      <table>
        <thead>
          <tr>
            <th scope="col">Stat</th>
            <th scope="col">Roll</th>
            <th scope="col">DC</th>
          </tr>
        </thead>
        <tbody>
          ${stats.map(({
    name, die, bonus, dcBonus,
  }) => `
            <tr>
              <th scope="row">${name}</th>
              <td>${die}${bonus > 0 ? ` + ${bonus}` : ''}</td>
              <td>${computedStat(die, 2)}${dcBonus > 0 ? ` + ${dcBonus}` : ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    const element = document.querySelector('[data-stats]');
    element.innerHTML = content;
  };

  const displaySecondaryStats = ({
    damageDie,
    numDamageDie,
    damageBonus,
    healingDie,
    numHealingDie,
    healingBonus,
    damageThreshold,
  }) => {
    const content = `
      <p>
        Damage Dice: ${numDamageDie > 1 ? numDamageDie : ''}${damageDie}${damageBonus > 0 ? ` + ${damageBonus}` : ''}
      </p>
      <p>
        Damage Threshold: ${damageThreshold}
      </p>
      <p>
        Healing Dice: ${numHealingDie > 1 ? numHealingDie : ''}${healingDie}${healingBonus > 0 ? ` + ${healingBonus}` : ''}
      </p>
    `;

    const element = document.querySelector('[data-secondary-stats]');
    element.innerHTML = content;
  };

  const displaySkills = ({ skills }) => {
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

    const element = document.querySelector('[data-skills]');
    element.innerHTML = content;
  };

  const displayStatus = ({
    actionPointMax,
    actionPoints,
    experiencePoints,
    baseHitPointMax,
    hitPointMultiplier,
    hitPoints,
    hitPointRegen,
    baseShieldHitPointMax,
    shieldHitPointMultiplier,
    shieldHitPoints,
    shieldHitPointRegen,
  }) => {
    const content = `
      <p>
        HP: ${hitPoints}/${baseHitPointMax * hitPointMultiplier}
      </p>
      ${hitPointRegen ? `
        <p>
          HP Regen: ${hitPointRegen}
        </p>
      ` : ''}
      ${baseShieldHitPointMax ? `
        <p>
          Shield HP: ${shieldHitPoints}/${baseShieldHitPointMax * shieldHitPointMultiplier}
        </p>
      ` : ''}
      ${shieldHitPointRegen ? `
        <p>
          Shield HP Regen: ${shieldHitPointRegen}
        </p>
      ` : ''}
      <p>
        AP: ${actionPoints}/${actionPointMax}
      </p>
      <p>
        XP: ${experiencePoints}
      </p>
    `;

    const element = document.querySelector('[data-status]');
    element.innerHTML = content;
  };

  const displayVulnerabilities = ({ vulnerabilities }) => {
    if (!vulnerabilities.length) {
      return;
    }

    const content = `
      <p>
        Vulnerable to:
      </p>
      <ul>
        ${vulnerabilities.map((vulnerability) => `<li>${vulnerability}</li>`).join('')}
      </ul>
    `;

    const element = document.querySelector('[data-vulnerabilities]');
    element.innerHTML = content;
  };

  const displayResistances = ({ resistances }) => {
    if (!resistances.length) {
      return;
    }

    const content = `
      <p>
        Resistant to:
      </p>
      <ul>
        ${resistances.map((resistance) => `<li>${resistance}</li>`).join('')}
      </ul>
    `;

    const element = document.querySelector('[data-resistances]');
    element.innerHTML = content;
  };

  const displayImmunities = ({ immunities }) => {
    if (!immunities.length) {
      return;
    }

    const content = `
      <p>
        Immune to:
      </p>
      <ul>
        ${immunities.map((immunity) => `<li>${immunity}</li>`).join('')}
      </ul>
    `;

    const element = document.querySelector('[data-immunities]');
    element.innerHTML = content;
  };

  const displayUpgrades = ({ upgrades }) => {
    if (!upgrades.length) {
      return;
    }

    const content = `
      <p>
        Upgrades:
      </p>
      <dl>
        ${upgrades.map(({ name, description }) => `
          <dt>${name}</dt>
          <dd>${description}</dd>
        `).join('')}
      </dl>
    `;

    const element = document.querySelector('[data-upgrades]');
    element.innerHTML = content;
  };

  document.addEventListener('user-logged-in', async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id');

    const character = await getCharacter(id);

    updateTitle(character);
    displayStats(character);
    displaySecondaryStats(character);
    displaySkills(character);
    displayStatus(character);
    displayVulnerabilities(character);
    displayResistances(character);
    displayImmunities(character);
    displayUpgrades(character);
  });
})();
