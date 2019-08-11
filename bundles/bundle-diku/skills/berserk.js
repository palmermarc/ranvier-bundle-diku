'use strict';

const { Broadcast, SkillType } = require('ranvier');
const Combat = require('../../bundle-example-combat/lib/Combat');

// config placed here just for easy copy/paste of this skill later on
const cooldown = 3;
const cost = 0;
const duration = 0;
const tickInterval = 0;
const damagePercent = 100;

const totalDamage = player => {
  return Combat.calculateWeaponDamage(player) * (damagePercent / 100);
};

/**
 * DoT (Damage over time) skill
 */
module.exports = {
  name: 'Berserk',
  type: SkillType.SKILL,
  requiresTarget: false,
  initiatesCombat: true,
  resource: {
    attribute: 'hp',
    cost,
  },
  cooldown,

  run: state => function (args, player, target) {
    const effect = state.EffectFactory.create(
        'skill.berserk',
        {
          duration,
          description: this.info(player),
          tickInterval,
        },
        {
          totalDamage: totalDamage(player),
        }
    );
    effect.skill = this;
    effect.attacker = player;

    Broadcast.sayAt(player, `<red>You go berserk and attack <bold>${target.name}</bold>!</red>`);
    Broadcast.sayAtExcept(player.room, `<red>${player.name} goes berserk and attacks ${target.name}.</red>`, [target, player]);
    Broadcast.sayAt(target, `<red>${player.name} goes berserk!</red>`);
    target.addEffect(effect);
  },

  info: (player) => {
    return `Let your inner beast consume you dealing <bold>${damagePercent}%</bold> weapon damage to all targets in the room.`;
  }
};
