'use strict';

const Ranvier = require('ranvier');
const { Broadcast, Logger } = Ranvier;
const { EquipSlotTakenError } = Ranvier.EquipErrors;
const say = Broadcast.sayAt;
const ItemUtil = require('../../bundle-example-lib/lib/ItemUtil');
const ArgParser = require('../../bundle-example-lib/lib/ArgParser');

module.exports = {
  aliases: [ 'wield' ],
  usage: 'wear <item>',
  command : (state) => (arg, player) => {
    arg = arg.trim();

    if (!arg.length) {
      return say(player, 'Wear what?');
    }

    const item = ArgParser.parseDot(arg, player.inventory);

    if (!item) {
      return say(player, "You aren't carrying anything like that.");
    }

    if (!item.metadata.slot) {
      return say(player, `You can't wear ${ItemUtil.display(item)}.`);
    }

    if (item.level > player.level) {
      return say(player, "You can't use that yet.");
    }

    try {
      player.equip(item, item.metadata.slot);
    } catch (err) {
      if (err instanceof EquipSlotTakenError) {
        const conflict = player.equipment.get(item.metadata.slot);
        return say(player, `You will have to remove ${ItemUtil.display(conflict)} first.`);
      }

      return Logger.error(err);
    }

    say(player, `<green>You equip:</green> ${ItemUtil.display(item)}<green>.</green>`);
  }
};
