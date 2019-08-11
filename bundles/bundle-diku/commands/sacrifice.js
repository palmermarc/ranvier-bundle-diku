'use strict';

const humanize = (sec) => { return require('humanize-duration')(sec, { round: true }); };
const sprintf = require('sprintf-js').sprintf;
const { Broadcast: B, Item, ItemType, Logger, Player } = require('ranvier');
const ArgParser = require('../../bundle-example-lib/lib/ArgParser');
const ItemUtil = require('../../bundle-example-lib/lib/ItemUtil');

module.exports = {
  usage: "sacrifice [thing]",
  command: state => (args, player) => {

    if (args) {
      return lookEntity(state, player, args);
    }

    B.sayAt(player, "Sacrifice what?");
  }
};

function lookEntity(state, player, args) {
  const room = player.room;

  args = args.split(' ');

  let entity = ArgParser.parseDot(args[0], room.items);

  if (!entity) {
    return B.sayAt(player, "You don't see anything like that here.");
  }

  if (entity instanceof Item) {

    // Set a default value of the item
    let value = entity.getMeta('value');
    value = value || 5;

    // Grab the value out of all of the items in the corpse and calculate their value as well
    if( entity.items) {
      entity.items.forEach(item => {
        let thisValue = item.getMeta('value');
        thisValue = thisValue || 5;
        value += thisValue;
      });
    }

    // If the meta isn't created for the character yet, create it
    if (!player.getMeta('currencies')) {
      player.setMeta('currencies', { gold: 0 });
    }

    const currencyKey = 'currencies.gold';
    if (!player.getMeta('currencies')) {
      player.setMeta('currencies', {});
    }

    player.setMeta(currencyKey, (player.getMeta(currencyKey) || 0) + value);
    B.sayAt(player, `You have sacrificed the ${entity.description} and gained ${value} gold.`);

    state.ItemManager.remove(entity);
    return;
  }

  B.sayAt(player, "You cannot sacrifice that.");
}