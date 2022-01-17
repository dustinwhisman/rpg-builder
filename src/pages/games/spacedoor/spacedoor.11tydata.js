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

const statusEffects = [
  {
    name: 'Armor Break',
    description: 'Affected targets have their AC halved (rounded down). At the end of their turn, they can make a Cool saving throw to try to end the effect.',
    savingThrow: 'Cool',
    opposedStat: 'Tough',
  },
  {
    name: 'Asleep',
    description: 'Affected targets are unable to act in combat. In place of their Action, the target can make a Sharp saving throw to try to wake up. If they succeed, they wake up and can use their Bonus Action and Reaction.',
    savingThrow: 'Sharp',
    opposedStat: 'Charm',
  },
  {
    name: 'Berserk',
    description: 'Affected targets must use their Action to attack the nearest enemy on their turn, and they may only use offensive Bonus Actions and Reactions. At the end of their turn, they can make a Sharp saving throw to try to end the effect.',
    savingThrow: 'Sharp',
    opposedStat: 'Charm',
  },
  {
    name: 'Bleeding',
    description: 'Affected targets take bleed damage at the end of their turn, at which point they can make a Cool saving throw to try to end the effect.',
    savingThrow: 'Cool',
    opposedStat: 'Cool',
  },
  {
    name: 'Blinded',
    description: 'Affected targets are unable to see. Any rolls that require precision targeting must be made with Disadvantage, and any offensive rolls made against the player will be made with Advantage. At the end of their turn, the target can make a Sharp saving throw to try to end the effect.',
    savingThrow: 'Sharp',
    opposedStat: 'Sharp',
  },
  {
    name: 'Confused',
    description: 'Affected targets will randomly attack anybody involved in combat, including themselves. On their turn, the target must roll a d4 to determine who is attacked, with 1 being themselves, and the other numbers being the next closest combatants. At the end of their turn, the Confused target can make a Sharp saving throw to end the effect.',
    savingThrow: 'Sharp',
    opposedStat: 'Charm',
  },
  {
    name: 'Frightened',
    description: 'Affected targets must use their Movement to get away from whoever or whatever inflicted the effect. At the end of their turn, the target can make a Cool saving throw to try to end the effect.',
    savingThrow: 'Cool',
    opposedStat: 'Charm',
  },
  {
    name: 'Mental Break',
    description: 'Affected targets have their core stat DCs halved (rounded down). At the end of their turn, they can make a Sharp saving throw to try to end the effect.',
    savingThrow: 'Sharp',
    opposedStat: 'Cool',
  },
  {
    name: 'Poisoned',
    description: 'Affected targets take poison damage at the end of their turn, at which point they can make a Tough saving throw to try to end the effect.',
    savingThrow: 'Tough',
    opposedStat: 'Cool',
  },
  {
    name: 'Power Break',
    description: 'Affected targets deal half damage (rounded down). At the end of their turn, they can make a Tough saving throw to try to end the effect.',
    savingThrow: 'Tough',
    opposedStat: 'Tough',
  },
  {
    name: 'Restrained',
    description: 'Affected targets cannot use their Movement or Reaction. They can use their Action to make a Tough saving throw to break free, at which point they can use their Movement and Reaction, or they can choose to stay put and use their Action and Bonus Action for something else.',
    savingThrow: 'Tough',
    opposedStat: 'Tough',
  },
  {
    name: 'Silenced',
    description: 'Affected targets cannot speak, and they lose the use of their Bonus Action. At the end of their turn, they can make a Cool saving throw to try to end the effect.',
    savingThrow: 'Cool',
    opposedStat: 'Sharp',
  },
  {
    name: 'Slow',
    description: 'Affected targets can use either their Movement or their Action, but not both, and they cannot use their Bonus Action or Reaction. At the end of their turn, the target can make a Cool saving throw to try to end the effect.',
    savingThrow: 'Cool',
    opposedStat: 'Cool',
  },
  {
    name: 'Stunned',
    description: 'Affected targets are unable to act in combat. In place of their Action, the target can make a Tough saving throw to try to snap out of it. If they succeed, they can use their Bonus Action and Reaction.',
    savingThrow: 'Tough',
    opposedStat: 'Tough',
  },
];

const damageTypes = [
  {
    name: 'Bludgeoning',
    type: 'instant',
  },
  {
    name: 'Explosive',
    type: 'instant',
  },
  {
    name: 'Fire',
    type: 'instant|repeating',
  },
  {
    name: 'Ice',
    type: 'instant|repeating',
  },
  {
    name: 'Lightning',
    type: 'instant',
  },
  {
    name: 'Necrotic',
    type: 'instant|repeating',
  },
  {
    name: 'Piercing',
    type: 'instant',
  },
  {
    name: 'Poison',
    type: 'repeating',
  },
  {
    name: 'Psychic',
    type: 'instant|repeating',
  },
  {
    name: 'Radiation',
    type: 'repeating',
  },
  {
    name: 'Slashing',
    type: 'instant',
  },
  {
    name: 'Water',
    type: 'instant|repeating',
  },
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

const armorUpgrades = [
  {
    stat: 'SHP',
    name: 'Energy Shield',
    description: "Wear an energy shield that will take damage before you lose HP. Shields have Shield Hit Points (SHP) equal to half of your Technobabble die's highest value. If the shield does not take damage during a round of combat, it regenerates one SHP at the end of your turn, unless it is at 0 SHP.",
    cost: 1,
    limit: 'once',
  },
  {
    stat: 'SHP',
    name: 'Max SHP Increase',
    description: "Increase your SHP by half of your Technobabble die's highest value. This acts as a multiplier of base SHP, so if your Technobabble die changes, your SHP will change accordingly.",
    cost: 1,
    limit: 'infinite',
  },
  {
    stat: 'SHP',
    name: 'Improved SHP Regen',
    description: "Increase the amount of SHP your shield regenerates by 1. The maximum value is half of your Technobabble die's highest value.",
    cost: 1,
    limit: 'half:Technobabble',
  },
];

statusEffects.forEach((effect) => {
  armorUpgrades.push({
    statusEffect: effect.name,
    name: `Remove ${effect.name} Vulnerability`,
    description: `You are no longer vulnerable to the ${effect.name} status effect, meaning you don't have to roll with disadvantage on saving throws to avoid or remove the effect.`,
    cost: 1,
    limit: 'once',
  });

  armorUpgrades.push({
    statusEffect: effect.name,
    name: `${effect.name} Resistance`,
    description: `Get advantage on saving throws to avoid or remove the ${effect.name} status effect.`,
    cost: 3,
    limit: 'once',
  });

  armorUpgrades.push({
    statusEffect: effect.name,
    name: `${effect.name} Immunity`,
    description: `You can no longer be affected by the ${effect.name} status effect.`,
    cost: 5,
    limit: 'once',
  });
});

damageTypes.forEach((type) => {
  armorUpgrades.push({
    damageType: type.name,
    name: `Remove ${type.name} Damage Vulnerability`,
    description: `You are no longer vulnerable to the ${type.name} damage type, meaning you no longer take double damage.`,
    cost: 1,
    limit: 'once',
  });

  armorUpgrades.push({
    damageType: type.name,
    name: `${type.name} Damage Resistance`,
    description: `You take only half damage when hurt by the ${type.name} damage type.`,
    cost: 3,
    limit: 'once',
  });

  armorUpgrades.push({
    damageType: type.name,
    name: `${type.name} Damage Immunity`,
    description: `You can no longer be hurt by ${type.name} damage.`,
    cost: 5,
    limit: 'once',
  });
});

const weaponUpgrades = [];

for (let i = 0; i < 5; i += 1) {
  weaponUpgrades.push({
    stat: 'Attack',
    name: `Weapon Proficiency (Level ${i + 1})`,
    description: `Increase your Attack die from a ${fromDice[i]} to a ${toDice[i]}.`,
    cost: i + 1,
    limit: 'once',
  });
}

for (let i = 0; i < 5; i += 1) {
  weaponUpgrades.push({
    stat: 'Damage',
    name: `Stopping Power (Level ${i + 1})`,
    description: `Increase your Damage die from a ${fromDice[i]} to a ${toDice[i]}.`,
    cost: (i + 1) * 2,
    limit: 'once',
  });
}

for (let i = 0; i < 9; i += 1) {
  weaponUpgrades.push({
    stat: 'Damage',
    name: `Barrage (Level ${i + 1})`,
    description: `Increase the number of damage dice you roll from ${i + 1} to ${i + 2}.`,
    cost: i + 1,
    limit: 'once',
  });
}

damageTypes.forEach((damageType) => {
  weaponUpgrades.push({
    damageType: damageType.name,
    name: `Bonus ${damageType.name} Damage (Level 1)`,
    description: `Spend an Action Point to add 1d4 ${damageType.name} damage to your attack. Buying this increases your pool of Action Points by 1.`,
    cost: 1,
    limit: 'once',
  });

  weaponUpgrades.push({
    damageType: damageType.name,
    name: `Bonus ${damageType.name} Damage (Level 2)`,
    description: `You can add 1d4 per Action Point you spend of ${damageType.name} damage to your attack. Buying this increases your pool of Action Points by 1.`,
    cost: 2,
    limit: 'once',
  });

  weaponUpgrades.push({
    damageType: damageType.name,
    name: `Bonus ${damageType.name} Damage (Level 3)`,
    description: `You can upgrade the damage dice for bonus ${damageType.name} damage by spending Action Points. 1 AP changes a d4 to a d6, 2 AP changes it to a d8, and so on. Buying this increases your pool of Action Points by 1.`,
    cost: 3,
    limit: 'once',
  });
});

module.exports = {
  stats,
  baseDice,
  statusEffects,
  damageTypes,
  statUpgrades,
  skillUpgrades,
  healthUpgrades,
  armorUpgrades,
  weaponUpgrades,
};
