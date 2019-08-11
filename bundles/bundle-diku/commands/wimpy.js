'use strict';

const { Broadcast: B, Player } = require('ranvier');
const ArgParser = require('../../bundle-example-lib/lib/ArgParser');

module.exports = {
  usage: "wimpy [0-100]",
  command: state => (args, player) => {
    let wimpy = 0;

    if (!args.length) {
      wimpy = player.getMeta('wimpy');
      wimpy = parseInt(wimpy) || 0;
      return B.sayAt(player, `Your wimpy is currently set at: ${wimpy}%`);
    }

    wimpy = parseInt(args);

    if (wimpy < 0 || wimpy > 100) {
      return B.sayAt(player, "Your wimpy must be set to a number between 0 and 100.");
    }

    player.setMeta('wimpy', wimpy);

    if( wimpy == 0)
      return B.sayAt(player, `You no longer run at the sight of your own blood.`);

    return B.sayAt(player, `Your wimpy has been set to ${wimpy}%`);
  }
};