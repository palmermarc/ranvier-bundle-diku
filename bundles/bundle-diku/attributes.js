'use strict';

module.exports = [
  { name: 'speed', base: 2.5 },
  { name: 'blood', base: 100 },
  { name: 'energy', base: 0 },
  { name: 'dodge', base: 0, },
  { name: 'parry', base: 0, },
  { name: 'block', base: 0, },
  { name: 'resistance', base: 1, },
  { name: 'spellpower', base: 0 },
  { name: 'hitroll', base: 5 },
  { name: 'damroll', base: 5 },
  { name: 'critChance', base: 5,
    formula: {
      requires: [],
      fn: function (character, health, dex) {
        return health + (dex/2);
      },
    },
  },
  { name: 'critDamage', base: 50 },
  { name: 'alignment', base: 0 },
  {
    name: 'armor',
    base: 500,
    formula: {
      requires: [],
      fn: function (character, health, str) {
        return health + (str * 10);
      },
    },
  },
  {
    name: 'health',
    base: 500,
    formula: {
      requires: [],
      fn: function (character, health, str) {
        return health + (str * 10) + (character.level * 100);
      },
    },
  },
  {
    name: 'mana',
    base: 1000,
    formula: {
      requires: ['intellect'],
      fn: function (character, mana, intellect) {
        return mana + (intellect * 100);
      }
    },
  },
  {
    name: 'str',
    base: 18,
    formula: {
      requires: [],
      fn: function (character, str) {
        return str + (character.level * 2);
      },
    },
  },
  {
    name: 'int',
    base: 18,
    formula: {
      requires: [],
      fn: function (character, int) {
        return int + (character.level * 2);
      },
    },
  },
  {
    name: 'wis',
    base: 18,
    formula: {
      requires: [],
      fn: function (character, health) {
        return health + (character.level * 2);
      },
    },
  },
  {
    name: 'dex',
    base: 18,
    formula: {
      requires: [],
      fn: function (character, health) {
        return health + (character.level * 2);
      },
    },
  },
  {
    name: 'con',
    base: 18,
    formula: {
      requires: [],
      fn: function (character, health) {
        return health + (character.level * 2);
      },
    },
  },
];