'use strict';

const { Random } = require('rando-js');
const { Broadcast: B } = require('ranvier');
const ArgParser = require('../../bundle-example-lib/lib/ArgParser');
const ItemUtil = require('../../bundle-example-lib/lib/ItemUtil');
const Crafting = require('../lib/Crafting');

module.exports = {
  command: state => (args, player) => {
    if (!args || !args.length) {
      return B.sayAt(player, "Gather what?");
    }

    let node = ArgParser.parseDot(args, player.room.items);

    if (!node) {
      return B.sayAt(player, "You don't see anything like that here.");
    }

    const resource = node.getMeta('resource');
    if (!resource) {
      return B.sayAt(player, "You can't gather anything from that.");
    }

    if (!player.getMeta('resources')) {
      player.setMeta('resources', {});
    }

    for (const material in resource.materials) {
      const entry = resource.materials[material];
      const amount = Random.inRange(entry.min, entry.max);
      if (amount) {
        const resItem = Crafting.getResourceItem(material);
        const metaKey = `resources.${material}`;
        player.setMeta(metaKey, (player.getMeta(metaKey) || 0) + amount);
        B.sayAt(player, `<green>You gather: ${ItemUtil.display(resItem)} x${amount}.`);
      }
    }

    // destroy node, will be respawned
    state.ItemManager.remove(node);
    B.sayAt(player, `${ItemUtil.display(node)} ${resource.depletedMessage}`);
    node = null;
  }
};
