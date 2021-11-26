const stats = {
  Fight: [],
  Flight: [
    'Acrobatics',
    'Perception',
    'Sleight of Hand',
    'Stealth',
  ],
  Brains: [
    'Investigation',
    'Medicine',
    'Science & Technology',
  ],
  Brawn: [
    'Athletics',
    'Intimidation',
  ],
  Grit: [
    'Nature',
    'Survival',
  ],
  Charm: [
    'Deception',
    'Insight',
    'Performance',
    'Persuasion',
  ],
};

const baseDice = [
  'd4',
  'd6',
  'd8',
  'd10',
  'd12',
  'd20',
];

const fromDice = [
  'd4',
  'd6',
  'd8',
  'd10',
  'd12',
];

const toDice = [
  'd6',
  'd8',
  'd10',
  'd12',
  'd20',
];

const statUpgrades = Object.keys(stats).reduce((upgradeList, key) => {
  const list = [];

  for (let i = 0; i < 5; i += 1) {
    list.push({
      name: `${key} Upgrade (Level ${i + 1})`,
      description: `Increase your ${key} stat from a ${fromDice[i]} to a ${toDice[i]}.`,
      cost: i + 1,
    });
  }

  list.push({
    name: `${key} Bonus`,
    description: `Add a permanent +1 bonus to all ${key} rolls, or increase your existing bonus by +1. The maximum bonus is half of your ${key} die's highest value.`,
    cost: 1,
  });

  return upgradeList.concat(list);
}, []);

const skillUpgrades = Object.keys(stats).reduce((upgradeList, key) => {
  const list = [];

  stats[key].forEach((skill) => {
    list.push({
      name: `${skill} Proficiency (Level 1)`,
      description: `Roll a d4 in addition to your ${key} die on ${skill} checks. Your ${key} die must be at least a d8.`,
      cost: 1,
    });

    for (let i = 0; i < 3; i += 1) {
      list.push({
        name: `${skill} Proficiency (Level ${i + 2})`,
        description: `Increase your ${skill} bonus die from a ${fromDice[i]} to a ${toDice[i]}. Your ${key} die must be ${i < 2 ? 'at least' : ''} a ${toDice[i + 2]}.`,
        cost: i + 2,
      });
    }

    list.push({
      name: `${skill} Bonus`,
      description: `Add a permanent +1 bonus to all ${skill} rolls, or increase your existing bonus by +1. The maximum bonus is half of your ${key} die's highest value.`,
      cost: 1,
    });
  });

  return upgradeList.concat(list);
}, []);

module.exports = {
  stats,
  baseDice,
  statUpgrades,
  skillUpgrades,
};
