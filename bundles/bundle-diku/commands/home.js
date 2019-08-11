'use strict';

const { Broadcast, CommandManager } = require('ranvier');
const say = Broadcast.sayAt;

module.exports = {
  command : state => (args, player) => {

    let home = player.getMeta('home' );
    let noTravel = false;

    if (!args || !args.length || args !== "here") {
      return say(player, `Your current home is set to ${home}.`);
    }

    if (player.room.getMeta('norecall') === true) {
      //return say(player, 'You cannot make this room your home.');
    } else if (home === player.room) {
      return say(player, 'You are already home.');
    }

    player.setMeta('home', player.room.entityReference);
    say(player, "<b>Your new home is set.</b>");
  }
};