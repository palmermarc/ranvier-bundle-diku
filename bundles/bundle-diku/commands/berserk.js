'use strict';

const Ranvier = require('../../../ranvier');
const B = Ranvier.Broadcast;
const Logger = Ranvier.Logger;
const Combat = require('../../bundle-example-combat/lib/Combat');
const CombatErrors = require('../../bundle-example-combat/lib/CombatErrors');

module.exports = {
  command : (state) => (args, player) => {
    const room = player.room;

    room.npcs.forEach(npc => {
      player.initiateCombat(npc);
      Combat.makeAttack(player, npc);
    });
  }
};
