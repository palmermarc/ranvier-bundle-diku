'use strict';

module.exports = [
  { name: 'health', base: 500 },
  { name: 'mana', base: 500 },
  { name: 'move', base: 500 },
  { name: 'strength', base: 17 },
  { name: 'agility', base: 17 },
  { name: 'intellect', base: 17 },
  { name: 'wisdom', base: 17 },
  { name: 'constitution', base: 17 },
  { name: 'stamina', base: 17 },
  { name: 'armor', base: 10 },
  { name: 'critical', base: 5 },
  { name: 'dodge', base: 5 },
  { name: 'parry', base: 5 },
  /*
  {
    name: 'health',
    base: 100,
    formula: {
      requires: [],
      fn: function (character, health) {
        return health + (character.level ** 2);
      },
    },
  },
  */

];
