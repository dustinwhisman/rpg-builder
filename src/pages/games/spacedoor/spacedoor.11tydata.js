const stats = require('./data/stats-and-skills.json');
const { baseDice, fromDice, toDice } = require('./data/dice.json');
const statusEffects = require('./data/status-effects.json');
const damageTypes = require('./data/damage-types.json');

const statUpgrades = stats.reduce((upgradeList, stat) => {
  const list = [];

  // upgrades for increasing the dice size for a stat
  for (let i = 0; i < 5; i += 1) {
    list.push({
      stat: stat.name,
      name: `${stat.name} Upgrade (Level ${i + 1})`,
      description: `Increase your ${stat.name} from a ${fromDice[i]} to a ${toDice[i]}.`,
      cost: i + 1,
      prereqs: [
        `stat:${stat.name}:eq:${fromDice[i]}`,
      ],
    });
  }

  // upgrade the permanent bonus for a stat
  list.push({
    stat: stat.name,
    name: `${stat.name} Bonus`,
    description: `Add a permanent +1 bonus to all ${stat.name} rolls, or increase your existing bonus by +1. The maximum bonus is half of your ${stat.name} die's highest value.`,
    cost: 1,
    prereqs: [
      `bonus:${stat.name}:lth:${stat.name}`,
    ],
  });

  // upgrade the DC for a stat
  list.push({
    stat: stat.name,
    name: `${stat.name} DC Increase`,
    description: `Increase your ${stat.name} DC by 1. You can increase this DC by up to half of your ${stat.name} die's highest value.`,
    cost: 1,
    prereqs: [
      `dc:${stat.name}:lth:${stat.name}`,
    ],
  });

  return upgradeList.concat(list);
}, []);

const skillUpgrades = stats.reduce((upgradeList, stat) => {
  const list = [];

  // upgrade for adding a d4 bonus to skill checks
  stat.skills.forEach((skill) => {
    list.push({
      stat: stat.name,
      skill: skill.name,
      name: `${skill.name} Proficiency (Level 1)`,
      description: `Roll a d4 in addition to your ${stat.name} die on ${skill.name} checks. Your ${stat.name} die must be at least a d8.`,
      cost: 1,
      prereqs: [
        `stat:${stat.name}:gte:d8`,
        `skill:${skill.name}:eq:null`,
      ],
    });

    // upgrades for increasing size of skill die
    for (let i = 0; i < 3; i += 1) {
      list.push({
        stat: stat.name,
        skill: skill.name,
        name: `${skill.name} Proficiency (Level ${i + 2})`,
        description: `Increase your ${skill.name} bonus die from a ${fromDice[i]} to a ${toDice[i]}. Your ${stat.name} die must be ${i < 2 ? 'at least' : ''} a ${toDice[i + 2]}.`,
        cost: i + 2,
        prereqs: [
          `stat:${stat.name}:gte:${toDice[i + 2]}`,
          `skill:${skill.name}:eq:${fromDice[i]}`,
        ],
      });
    }

    // upgrades for permanent skill bonuses
    list.push({
      stat: stat.name,
      skill: skill.name,
      name: `${skill.name} Bonus`,
      description: `Add a permanent +1 bonus to all ${skill.name} rolls, or increase your existing bonus by +1. The maximum bonus is half of your ${stat.name} die's highest value.`,
      cost: 1,
      prereqs: [
        `bonus:${skill.name}:lth:${stat.name}`,
      ],
    });

    // allow Technobabble to replace core stat on skill checks
    list.push({
      stat: stat.name,
      skill: skill.name,
      name: `Tech Augmented ${skill.name}`,
      description: `Use Technobabble instead of ${stat.name} when making ${skill.name} checks.`,
      cost: 3,
      prereqs: [
        `ability:Tech Augmented ${skill.name}:eq:false`,
      ],
    });
  });

  return upgradeList.concat(list);
}, []);

const healthUpgrades = [
  {
    stat: 'HP Multiplier',
    name: 'Max HP Increase',
    description: "Increase your HP by half of your Tough die's highest value, plus 7. This acts as a multiplier of base HP, so if your Tough die changes, your HP will change accordingly.",
    cost: 1,
    prereqs: [],
  },
  {
    stat: 'HP Regen',
    name: 'HP Regen',
    description: "At the end of your turn in combat, heal 1 HP. Buying this more than once increases the amount healed by 1 HP. You cannot regenerate health if you are at 0 HP. The maximum regeneration is half of your Tough die's highest value.",
    cost: 1,
    prereqs: [
      'value:HP Regen:lth:Tough',
    ],
  },
  {
    stat: 'Healing',
    name: 'Effective Medicine',
    description: "Increase the number of healing dice you roll by 1. The maximum number of dice is half of your Cool die's highest value.",
    cost: 2,
    prereqs: [
      'dice:Healing:lth:Cool',
    ],
  },
];

for (let i = 0; i < 5; i += 1) {
  healthUpgrades.push({
    stat: 'Healing',
    name: `Healing Power (Level ${i + 1})`,
    description: `Increase your Healing die from a ${fromDice[i]} to a ${toDice[i]}.`,
    cost: (i + 1) * 2,
    prereqs: [
      `die:Healing:eq:${fromDice[i]}`,
    ],
  });
}

const armorUpgrades = [
  {
    stat: 'SHP Multiplier',
    name: 'Energy Shield',
    description: "Wear an energy shield that will take damage before you lose HP. Shields have Shield Hit Points (SHP) equal to half of your Technobabble die's highest value. If the shield does not take damage during a round of combat, it regenerates one SHP at the end of your turn, unless it is at 0 SHP.",
    cost: 1,
    prereqs: [
      'value:SHP Multiplier:eq:0',
    ],
  },
  {
    stat: 'SHP Multiplier',
    name: 'Max SHP Increase',
    description: "Increase your SHP by half of your Technobabble die's highest value. This acts as a multiplier of base SHP, so if your Technobabble die changes, your SHP will change accordingly.",
    cost: 1,
    prereqs: [
      'value:SHP Multiplier:gt:0',
    ],
  },
  {
    stat: 'SHP Regen',
    name: 'Improved SHP Regen',
    description: "Increase the amount of SHP your shield regenerates by 1. The maximum value is half of your Technobabble die's highest value.",
    cost: 1,
    prereqs: [
      'value:SHP Multiplier:gt:0',
      'value:SHP Regen:lth:Technobabble',
    ],
  },
];

statusEffects.forEach((effect) => {
  armorUpgrades.push({
    statusEffect: effect.name,
    name: `Remove ${effect.name} Vulnerability`,
    description: `You are no longer vulnerable to the ${effect.name} status effect, meaning you don't have to roll with disadvantage on saving throws to avoid or remove the effect.`,
    cost: 1,
    prereqs: [
      `vulnerability:${effect.name}:eq:true`,
    ],
  });

  armorUpgrades.push({
    statusEffect: effect.name,
    name: `${effect.name} Resistance`,
    description: `Get advantage on saving throws to avoid or remove the ${effect.name} status effect.`,
    cost: 3,
    prereqs: [
      `vulnerability:${effect.name}:eq:false`,
      `resistance:${effect.name}:eq:false`,
      `immunity:${effect.name}:eq:false`,
    ],
  });

  armorUpgrades.push({
    statusEffect: effect.name,
    name: `${effect.name} Immunity`,
    description: `You can no longer be affected by the ${effect.name} status effect.`,
    cost: 5,
    prereqs: [
      `vulnerability:${effect.name}:eq:false`,
      `resistance:${effect.name}:eq:true`,
      `immunity:${effect.name}:eq:false`,
    ],
  });
});

damageTypes.forEach((type) => {
  armorUpgrades.push({
    damageType: type.name,
    name: `Remove ${type.name} Damage Vulnerability`,
    description: `You are no longer vulnerable to the ${type.name} damage type, meaning you no longer take double damage.`,
    cost: 1,
    prereqs: [
      `vulnerability:${type.name}:eq:true`,
    ],
  });

  armorUpgrades.push({
    damageType: type.name,
    name: `${type.name} Damage Resistance`,
    description: `You take only half damage when hurt by the ${type.name} damage type.`,
    cost: 3,
    prereqs: [
      `vulnerability:${type.name}:eq:false`,
      `resistance:${type.name}:eq:false`,
      `immunity:${type.name}:eq:false`,
    ],
  });

  armorUpgrades.push({
    damageType: type.name,
    name: `${type.name} Damage Immunity`,
    description: `You can no longer be hurt by ${type.name} damage.`,
    cost: 5,
    prereqs: [
      `vulnerability:${type.name}:eq:false`,
      `resistance:${type.name}:eq:true`,
      `immunity:${type.name}:eq:false`,
    ],
  });
});

const weaponUpgrades = [
  {
    stat: 'Damage',
    name: 'Barrage',
    description: 'Increase the number of damage dice you roll by 1. The maximum number of dice is 10.',
    cost: 3,
    prereqs: [
      'dice:Damage:lt:10',
    ],
  },
  {
    stat: 'Damage',
    name: 'Multi-target Attack (Level 1)',
    description: 'Spend an Action Point to spread your damage between multiple targets. Roll your Damage dice, and allocate the resulting damage between the targets you want to hit.',
    cost: 3,
    prereqs: [
      'ability:Multi-target Attack (Level 1):eq:false',
    ],
  },
  {
    stat: 'Damage',
    name: 'Multi-target Attack (Level 2)',
    description: 'Spend one Action Point per target you want to hit, and deal full damage to each of them.',
    cost: 6,
    prereqs: [
      'ability:Multi-target Attack (Level 1):eq:true',
      'ability:Multi-target Attack (Level 2):eq:false',
    ],
  },
];

for (let i = 0; i < 5; i += 1) {
  weaponUpgrades.push({
    stat: 'Damage',
    name: `Stopping Power (Level ${i + 1})`,
    description: `Increase your Damage die from a ${fromDice[i]} to a ${toDice[i]}.`,
    cost: (i + 1) * 2,
    prereqs: [
      `die:Damage:eq:${fromDice[i]}`,
    ],
  });
}

damageTypes.forEach((damageType) => {
  weaponUpgrades.push({
    damageType: damageType.name,
    name: `Bonus ${damageType.name} Damage`,
    description: `Spend Action Points to add 1 Damage die per Action Point of ${damageType.name} damage to your attack.`,
    cost: 3,
    prereqs: [
      `ability:Bonus ${damageType.name} Damage:eq:false`,
    ],
  });
});

statusEffects
  .filter((effect) => effect.inflictedBy.includes('attack'))
  .forEach((effect) => {
    weaponUpgrades.push({
      statusEffect: effect.name,
      name: `Inflict "${effect.name}"`,
      description: `Spend an Action Point to inflict the ${effect.name} effect with your Attack. Affected targets will make ${effect.savingThrow} saving throws against your ${effect.opposedStat} DC to try to avoid the effect.`,
      cost: 3,
      prereqs: [
        `ability:Inflict ${effect.name}:eq:false`,
      ],
    });
  });

const actions = [
  {
    stat: 'Healing',
    name: 'Cure (Level 1)',
    description: 'Spend an Action Point to heal one ally or yourself, according to your Healing dice. Healing does not apply to energy shields.',
    cost: 1,
    prereqs: [
      'ability:Cure (Level 1):eq:false',
    ],
  },
  {
    stat: 'Healing',
    name: 'Cure (Level 2)',
    description: 'Spend an Action Point to heal multiple members of your party. Roll your Healing dice, and allocate the resulting health between the party members you want to heal.',
    cost: 3,
    prereqs: [
      'ability:Cure (Level 1):eq:true',
      'ability:Cure (Level 2):eq:false',
    ],
  },
  {
    stat: 'Healing',
    name: 'Cure (Level 3)',
    description: 'Spend an Action Point to heal all members of your party. All allies, including yourself, restore the full result of your Healing dice.',
    cost: 5,
    prereqs: [
      'ability:Cure (Level 1):eq:true',
      'ability:Cure (Level 2):eq:true',
      'ability:Cure (Level 3):eq:false',
    ],
  },
  {
    stat: 'Healing',
    name: 'Remedy (Level 1)',
    description: 'Spend an Action Point to remove all negative status effects from one ally or yourself.',
    cost: 1,
    prereqs: [
      'ability:Remedy (Level 1):eq:false',
    ],
  },
  {
    stat: 'Healing',
    name: 'Remedy (Level 2)',
    description: 'Spend multiple Action Points to remove all negative status effects from multiple party members, equal to the number of Action Points.',
    cost: 3,
    prereqs: [
      'ability:Remedy (Level 1):eq:true',
      'ability:Remedy (Level 2):eq:false',
    ],
  },
  {
    stat: 'Healing',
    name: 'Remedy (Level 3)',
    description: 'Spend an Action Point to remove all negative status effects from all party members.',
    cost: 5,
    prereqs: [
      'ability:Remedy (Level 1):eq:true',
      'ability:Remedy (Level 2):eq:true',
      'ability:Remedy (Level 3):eq:false',
    ],
  },
];

statusEffects
  .filter((effect) => effect.inflictedBy.includes('action'))
  .forEach((effect) => {
    actions.push({
      statusEffect: effect.name,
      name: `Inflict "${effect.name}" (Level 1)`,
      description: `Spend an Action Point to inflict the ${effect.name} effect on a single target with your Action. Affected targets will make ${effect.savingThrow} saving throws against your ${effect.opposedStat} DC to try to avoid the effect.`,
      cost: 1,
      prereqs: [
        `ability:Inflict "${effect.name}" (Level 1):eq:false`,
      ],
    });

    actions.push({
      statusEffect: effect.name,
      name: `Inflict "${effect.name}" (Level 2)`,
      description: `Spend more Action Points to inflict the ${effect.name} effect on one target per Action Point.`,
      cost: 2,
      prereqs: [
        `ability:Inflict "${effect.name}" (Level 1):eq:true`,
        `ability:Inflict "${effect.name}" (Level 2):eq:false`,
      ],
    });

    actions.push({
      statusEffect: effect.name,
      name: `Inflict "${effect.name}" (Level 3)`,
      description: `Spend three Action Points to force targets to roll with disadvantage on their saving throws to avoid the ${effect.name} effect.`,
      cost: 3,
      prereqs: [
        `ability:Inflict "${effect.name}" (Level 1):eq:true`,
        `ability:Inflict "${effect.name}" (Level 2):eq:true`,
        `ability:Inflict "${effect.name}" (Level 3):eq:false`,
      ],
    });
  });

const bonusActions = [
  {
    name: 'Inspiration',
    description: 'Give an ally 1d6 that they can add to a future roll of their choosing, expiring at the end of the session.',
    cost: 1,
    prereqs: [
      'ability:Inspiration:eq:false',
    ],
  },
  {
    name: 'First Aid',
    description: 'Roll one of your Healing dice (d4 by default) to heal an ally or yourself.',
    cost: 1,
    prereqs: [
      'ability:First Aid:eq:false',
    ],
  },
  {
    name: 'Surge',
    description: 'Spend an Action Point to use another full Action on your turn.',
    cost: 1,
    prereqs: [
      'ability:Surge:eq:false',
    ],
  },
  {
    name: 'Hide',
    description: 'Make a Stealth check to try to find cover. Enemies will need to make Sharp checks against the result of your Cool check to be able to attack you.',
    cost: 1,
    prereqs: [
      'ability:Hide:eq:false',
    ],
  },
];

const reactions = [
  {
    name: 'Guard',
    description: 'You can take damage in place of a nearby ally when they are attacked. This does not apply if you would both take damage anyway.',
    cost: 1,
    prereqs: [
      'ability:Guard:eq:false',
    ],
  },
  {
    name: 'Dodge',
    description: 'When attacked, you may use this Reaction to take half damage.',
    cost: 1,
    prereqs: [
      'ability:Dodge:eq:false',
    ],
  },
  {
    name: 'Counterattack',
    description: 'When attacked by an enemy, you may attack them right back.',
    cost: 3,
    prereqs: [
      'ability:Counterattack:eq:false',
    ],
  },
  {
    name: 'Neutralize Effect',
    description: 'If you fail a saving throw to avoid a status effect, you can use your Reaction to neutralize that effect.',
    cost: 3,
    prereqs: [
      'ability:Neutralize Effect:eq:false',
    ],
  },
  {
    name: 'Reflect',
    description: 'Spend three Action Points to automatically pass a saving throw for a status effect, and force the enemy that attempted to inflict it to make a saving throw themselves.',
    cost: 5,
    prereqs: [
      'ability:Reflect:eq:false',
    ],
  },
];

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
  actions,
  bonusActions,
  reactions,
};
