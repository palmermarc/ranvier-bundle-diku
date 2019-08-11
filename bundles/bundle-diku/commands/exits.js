'use strict';

const { Broadcast: B, Player } = require('ranvier');

module.exports = {
  usage: "exits",
  command: state => (args, player) => {

    lookExits(state, player);
  }
};

function lookExits(state, player) {
  const room = player.room;

  B.at(player, '[<yellow><b>Exits</yellow></b>: ');

  const exits = room.getExits();
  const foundExits = [];

  // prioritize explicit over inferred exits with the same name
  for (const exit of exits) {
    if (foundExits.find(fe => fe.direction === exit.direction)) {
      continue;
    }

    foundExits.push(exit);
  }

  B.at(player, foundExits.map(exit => {
    const exitRoom = state.RoomManager.getRoom(exit.roomId);
    const door = room.getDoor(exitRoom) || exitRoom.getDoor(room);
    if (door && (door.locked || door.closed)) {
      return '(' + exit.direction + ')';
    }

    return exit.direction;
  }).join(' '));

  if (!foundExits.length) {
    B.at(player, 'None');
  }

  B.sayAt(player, ']');


}