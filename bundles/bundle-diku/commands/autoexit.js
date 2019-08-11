'use strict';

const { Broadcast: B } = require('ranvier');

module.exports = {
  usage: 'autoexit',
  command: (state) => (args, player) => {

    if (!player.getMeta('config')) {
      player.setMeta('config', {});
    }

    let autoexit = player.getMeta('config.autoexit');

    // If it's not explicitly turned off, then turn it on
    if (!autoexit) {
      player.setMeta('config.autoexit', true);
      return B.sayAt(player, "autoexit is now turned on.");
    }

    // If we made it here, then turn it off
    player.setMeta('config.autoexit' , false);
    return B.sayAt(player, "autoexit is now turned off.");

  }
};