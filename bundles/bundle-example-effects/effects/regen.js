'use strict';

const { Damage, EffectFlag, Heal } = require('ranvier');

module.exports = {
  config: {
    name: 'Regenerate',
    description: "You are regenerating over time.",
    type: 'regen',
    tickInterval: 3
  },
  flags: [EffectFlag.BUFF],
  state: {
    magnitude: 10,
  },
  listeners: {
    updateTick: function () {
      // pools that regenerate over time
      const regens = [
        { pool: 'health', modifier: this.target.isInCombat() ? 0 : 1 },
        // energy and mana recovers 50% faster than health
        { pool: 'energy', modifier: this.target.isInCombat() ? 0.25 : 1.5 },
        { pool: 'mana', modifier: this.target.isInCombat() ? 0.25 : 1.5 },
      ];

      for (const regen of regens) {
        if (!this.target.hasAttribute(regen.pool)) {
          continue;
        }

        const poolMax = this.target.getMaxAttribute(regen.pool);
        const amount = Math.round((poolMax / 10) * regen.modifier);
        const heal = new Heal(regen.pool, amount, this.target, this, {
          hidden: true,
        });
        heal.commit(this.target);
      }

      // favor is treated specially in that it drains over time
      if (this.target.hasAttribute('favor')) {
        if (this.target.getAttribute('favor') < 1 || this.target.isInCombat()) {
          return;
        }

        const amount = Math.ceil(this.target.getMaxAttribute('favor') / 10);
        const drain = new Damage('favor', amount, this.target, this, {
          hidden: true
        });
        drain.commit(this.target);
      }
    },
  }
};
