'use strict';

const { Broadcast, Logger } = require('ranvier');
const ItemUtil = require('../../bundle-example-lib/lib/ItemUtil');
const eqSlots = require('../eqSlots');

module.exports = {
  aliases: ['worn'],
  usage: 'equipment',
  command: (state) => (args, player) => {

    if (!player.equipment.size) {
      return Broadcast.sayAt(player, "You are completely naked!");
    }

    Broadcast.sayAt(player, "Currently Equipped:");

    eqSlots.forEach(function(slot){
      let slotName = slot.name;

      if( player.equipment.slotName)
        Broadcast.sayAt(player, `  <${slot.display}> ${player.equipment.slotName.name}`);
      else
        Broadcast.sayAt(player, `  <${slot.display}> Nothing`);
    });
  }
};
