'use strict';

const { Broadcast, SkillType } = require('ranvier');
const Combat = require('../../bundle-example-combat/lib/Combat');

// config placed here just for easy copy/paste of this skill later on
const cooldown = 10;
const cost = 50;
const duration = 20 * 1000;
const tickInterval = 3;
const damagePercent = 400;

const totalDamage = player => {
  return Combat.calculateWeaponDamage(player) * (damagePercent / 100);
};


/**
 * DoT (Damage over time) skill
 */
module.exports = {
  name: 'Rend',
  type: SkillType.SKILL,
  requiresTarget: true,
  initiatesCombat: true,
  resource: {
    attribute: 'energy',
    cost,
  },
  cooldown,

  run: state => function (args, player, target) {
    const effect = state.EffectFactory.create(
      'skill.rend',
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

    effect.on('effectDeactivated', _ => {
      Broadcast.sayAt(player, `<red><b>${target.name}</b> stops bleeding.</red>`);
    });

    Broadcast.sayAt(player, `<red>With a vicious attack you open a deep wound in <bold>${target.name}</bold>!</red>`);
    Broadcast.sayAtExcept(player.room, `<red>${player.name} viciously rends ${target.name}.</red>`, [target, player]);
    Broadcast.sayAt(target, `<red>${player.name} viciously rends you!</red>`);
    target.addEffect(effect);
  },

  info: (player) => {
    return `Tear a deep wound in your target's flesh dealing <bold>${damagePercent}%</bold> weapon damage over <bold>${duration / 1000}</bold> seconds.`;
  }
};
