'use strict';

const { Broadcast: B } = require('ranvier');

module.exports = {
  usage: 'scan',
  command: state => (args, player) => {
    let directions = {
      north : "No Exit",
      east : "No Exit",
      south : "No Exit",
      west : "No Exit",
      up : "No Exit",
      down : "No Exit"
    };

    for (const exit of player.room.exits) {
      const room = state.RoomManager.getRoom(exit.roomId);
      let dir = exit.direction;
      directions[dir] = room.title;
    }

    B.sayAt(player, `[North]\n\t${directions.north}`);
    B.sayAt(player, `[East]\n\t${directions.east}`);
    B.sayAt(player, `[South]\n\t${directions.south}`);
    B.sayAt(player, `[West]\n\t${directions.west}`);
    B.sayAt(player, `[Up]\n\t${directions.up}`);
    B.sayAt(player, `[Down]\n\t${directions.down}`);
    
  }
};