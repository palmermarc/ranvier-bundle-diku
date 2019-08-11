'use strict';

const { Broadcast } = require('ranvier');
const ArgParser = require('../../bundle-example-lib/lib/ArgParser');
const ItemUtil = require('../../bundle-example-lib/lib/ItemUtil');

module.exports = {
  usage: 'claim <item>',
  command : (state) => (args, player) => {
    args = args.trim();

    if (!args.length) {
      return Broadcast.sayAt(player, 'Claim what?');
    }

    const item = ArgParser.parseDot(args, player.inventory);

    if (!item) {
      return Broadcast.sayAt(player, "You aren't carrying anything like that.");
    }

    let owner = item.getMeta('owner');
    if (!owner) {
      item.setMeta('owner', player.name);
      return Broadcast.sayAt(player, `You are now the proud owner of ${item.name}.`);
    }

    return Broadcast.sayAt(player, `Someone already owns ${item.name}.`);

  }
};
