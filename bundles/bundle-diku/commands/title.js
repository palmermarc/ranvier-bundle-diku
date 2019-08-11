'use strict';

const { Broadcast: B, Player } = require('ranvier');

module.exports = {
  usage: "title",
  command: state => (args, player) => {
    player.setMeta('title', args);
    B.sayAt(player, "Your title has been updated.");
  }
};