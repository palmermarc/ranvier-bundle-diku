'use strict';

const { Broadcast: B } = require('ranvier');

module.exports = {
  usage: 'autogold',
  command: (state) => (args, player) => {

    if (!player.getMeta('config')) {
      player.setMeta('config', {});
    }

    let autogold = player.getMeta('config.autogold');

    // If it's not explicitly turned off, then turn it on
    if (!autogold) {
      player.setMeta('config.autogold', true);
      return B.sayAt(player, "Autogold is now turned on.");
    }

    // If we made it here, then turn it off
    player.setMeta('config.autogold', false);
    return B.sayAt(player, "Autogold is now turned off.");

  }
};