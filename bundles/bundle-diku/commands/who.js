'use strict';

const { Broadcast: B } = require('ranvier');

module.exports = {
  usage: 'who',
  command: (state) => (args, player) => {
    B.sayAt(player, "<bold><red>                  Who's Online</bold></red>");

    B.sayAt(player, "Admins");
    B.sayAt(player, "<bold><red>===============================================</bold></red>");
    B.sayAt(player, '');

    state.PlayerManager.players.forEach((otherPlayer) => {

      if( otherPlayer.role == 2) {
        let otherPlayerTitle = otherPlayer.getMeta('title');
        otherPlayerTitle = otherPlayerTitle || "";

        B.sayAt(player, ` *  ${otherPlayer.name} ${otherPlayerTitle}`);
      }
    });
    B.sayAt(player, '');

    B.sayAt(player, "Players");
    B.sayAt(player, "<bold><red>===============================================</bold></red>");
    B.sayAt(player, '');

    state.PlayerManager.players.forEach((otherPlayer) => {

      if( otherPlayer.role != 2) {
        let otherPlayerTitle = otherPlayer.getMeta('title');
        otherPlayerTitle = otherPlayerTitle || "";

        B.sayAt(player, ` *  ${otherPlayer.name} ${otherPlayerTitle}`);
      }
    });

    B.sayAt(player, state.PlayerManager.players.size + ' total');

    function getRoleString(role = 0) {
      return [
        '',
        '<white>[Builder]</white>',
        '<b><white>[Admin]</white></b>'
      ][role] || '';
    }
  }
};
