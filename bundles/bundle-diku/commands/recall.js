'use strict';

const { Broadcast, CommandManager } = require('ranvier');
const say = Broadcast.sayAt;

module.exports = {
  command : state => (args, player) => {
    const oldRoom = player.room;
    let targetRoom = state.RoomManager.getRoom(player.getMeta('home' ));
    let noTravel = player.room.getMeta('norecall');

    if (!targetRoom) {
      return Broadcast.sayAt(player, 'Are you sure you set your home?');
    } else if (targetRoom === player.room) {
      return Broadcast.sayAt(player, 'You are already home.');
    } else if ( noTravel === true ) {
      return Broadcast.sayAt(player, 'Something is blocking your recall.');
    }

    player.moveTo(targetRoom, () => {
      Broadcast.sayAt(player, '<b><green>You snap your finger and instantly appear in a new room.</green></b>\r\n');
      state.CommandManager.get('look').execute('', player);
    });

    Broadcast.sayAt(oldRoom, `${player.name}'s skin flickered and they vanished.`);
    Broadcast.sayAtExcept(targetRoom, `${player.name} magically appears before you.`, player);
  }
};