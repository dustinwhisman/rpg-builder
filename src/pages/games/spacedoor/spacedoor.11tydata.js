const stats = {
  Charm: [
    'Animal Handling',
    'Deception',
    'Insight',
    'Performance',
    'Persuasion',
  ],
  Cool: [
    'Acrobatics',
    'Medicine',
    'Sleight of Hand',
    'Stealth',
  ],
  Sharp: [
    'History',
    'Investigation',
    'Nature',
    'Perception',
  ],
  Tough: [
    'Athletics',
    'Intimidation',
    'Survival',
  ],
  Technobabble: [],
};

const baseDice = [
  'd4',
  'd6',
  'd8',
  'd10',
  'd12',
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
      stat: key,
      name: `${key} Upgrade (Level ${i + 1})`,
      description: `Increase your ${key} stat from a ${fromDice[i]} to a ${toDice[i]}.`,
      cost: i + 1,
      limit: 'once',
    });
  }

  list.push({
    stat: key,
    name: `${key} Bonus`,
    description: `Add a permanent +1 bonus to all ${key} rolls, or increase your existing bonus by +1. The maximum bonus is half of your ${key} die's highest value.`,
    cost: 1,
    limit: `half:${key}`,
  });

  return upgradeList.concat(list);
}, []);

const skillUpgrades = Object.keys(stats).reduce((upgradeList, key) => {
  const list = [];

  stats[key].forEach((skill) => {
    list.push({
      stat: key,
      skill,
      name: `${skill} Proficiency (Level 1)`,
      description: `Roll a d4 in addition to your ${key} die on ${skill} checks. Your ${key} die must be at least a d8.`,
      cost: 1,
      limit: 'once',
    });

    for (let i = 0; i < 3; i += 1) {
      list.push({
        stat: key,
        skill,
        name: `${skill} Proficiency (Level ${i + 2})`,
        description: `Increase your ${skill} bonus die from a ${fromDice[i]} to a ${toDice[i]}. Your ${key} die must be ${i < 2 ? 'at least' : ''} a ${toDice[i + 2]}.`,
        cost: i + 2,
        limit: 'once',
      });
    }

    list.push({
      stat: key,
      skill,
      name: `${skill} Bonus`,
      description: `Add a permanent +1 bonus to all ${skill} rolls, or increase your existing bonus by +1. The maximum bonus is half of your ${key} die's highest value.`,
      cost: 1,
      limit: `half:${key}`,
    });
  });

  return upgradeList.concat(list);
}, []);

const healthUpgrades = [
  {
    stat: 'HP',
    name: 'Max HP Increase',
    description: "Increase your HP by half of your Tough die's highest value, plus 7. This acts as a multiplier of base HP, so if your Tough die changes, your HP will change accordingly.",
    cost: 1,
    limit: 'infinite',
  },
  {
    stat: 'HP',
    name: 'HP Regen',
    description: "At the end of your turn in combat, heal 1 HP. Buying this more than once increases the amount healed by 1 HP. You cannot regenerate health if you are at 0 HP. The maximum regeneration is half of your Tough die's highest value.",
    cost: 1,
    limit: 'half:Tough',
  },
];

module.exports = {
  stats,
  baseDice,
  statUpgrades,
  skillUpgrades,
  healthUpgrades,
};
