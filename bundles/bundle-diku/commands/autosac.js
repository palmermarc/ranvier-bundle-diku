'use strict';

const { Broadcast: B } = require('ranvier');

module.exports = {
  usage: 'autosac',
  command: (state) => (args, player) => {

    if (!player.getMeta('config')) {
      player.setMeta('config', {});
    }

    let autosac = player.getMeta('config.autosac');

    // If it's not explicitly turned off, then turn it on
    if (!autosac) {
      player.setMeta('config.autosac', true);
      return B.sayAt(player, "autosac is now turned on.");
    }

    // If we made it here, then turn it off
    player.setMeta('config.autosac', false);
    return B.sayAt(player, "autosac is now turned off.");

  }
};