'use strict';

const { Broadcast: B } = require('ranvier');

module.exports = {
  usage: 'autoloot',
  command: (state) => (args, player) => {

    if (!player.getMeta('config')) {
      player.setMeta('config', {});
    }

    let autoloot = player.getMeta('config.autoloot');

    // If it's not explicitly turned off, then turn it on
    if (!autoloot) {
      player.setMeta('config.autoloot', true);
      return B.sayAt(player, "autoloot is now turned on.");
    }

    // If we made it here, then turn it off
    player.setMeta('config.autoloot', false);
    return B.sayAt(player, "autoloot is now turned off.");
  }
};