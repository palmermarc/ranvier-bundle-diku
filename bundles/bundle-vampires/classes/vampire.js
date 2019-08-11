'use strict';

/**
 * This example definition of a class file is a guideline. The class system is
 * left intentionally vague so as to not be too opinionated. Class files are
 * assumed to be js files instead of blank yaml files just to future proof the
 * bundle-loading of class files in case someone wants extra functionality in
 * their classes.
 */
module.exports = {
  name: 'Vampire',
  description: 'Vampires are immortal beings cursed with an unquenchable thirst for rage and vulnerability to sunlight. Vampires are forever bound to their inner Beast, and unable to control their animalistic urgers of hunger, fear, and rage)',

  abilityTable: {
    3: { skills: ['rend'] },
    5: { skills: ['lunge'] },
    7: { skills: ['shieldblock'] },
   10: { skills: ['secondwind'] },
  },

  setupPlayer: (state, player) => {
    const blood = state.AttributeFactory.create('blood', 100);
    player.addAttribute(blood);
    player.prompt = '[ %health.current%<b>hp</b> %move.current%<b>mv> %blood.current%/%blood.max%<b>bl</b> ]';
  }
};

/*
bite

*
*/