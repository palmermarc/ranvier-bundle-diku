'use strict';

const humanize = (sec) => { return require('humanize-duration')(sec, { round: true }); };
const sprintf = require('sprintf-js').sprintf;
const { Broadcast: B, Item, ItemType, Logger, Player } = require('ranvier');
const ArgParser = require('../../bundle-example-lib/lib/ArgParser');
const ItemUtil = require('../../bundle-example-lib/lib/ItemUtil');

module.exports = {
  usage: "look [thing]",
  command: state => (args, player) => {
    if (!player.room) {
      Logger.error(player.getName() + ' is in limbo.');
      return B.sayAt(player, 'You are in a deep, dark void.');
    }

    if (args) {
      return lookEntity(state, player, args);
    }

    lookRoom(state, player);
  }
};

function getCompass(player) {
  const room = player.room;

  const exitMap = new Map();
  exitMap.set('east', 'E');
  exitMap.set('west', 'W');
  exitMap.set('south', 'S');
  exitMap.set('north', 'N');
  exitMap.set('up', 'U');
  exitMap.set('down', 'D');
  exitMap.set('southwest', 'SW');
  exitMap.set('southeast', 'SE');
  exitMap.set('northwest', 'NW');
  exitMap.set('northeast', 'NE');

  const directionsAvailable = room.exits.map(exit => exitMap.get(exit.direction));

  const exits = Array.from(exitMap.values()).map(exit => {
    if (directionsAvailable.includes(exit)) {
      return exit;
    }
    //If we are either SE or NE, pre-pad
    if (exit.length === 2 && exit.includes('E')) {
      return ' -';
    }

    //If we are either SW or NW, post-pad
    if (exit.length === 2 && exit.includes('W')) {
      return '- ';
    }
    return '-';
  });

  let [E, W, S, N, U, D, SW, SE, NW, NE] = exits;
  U = U === 'U' ? '<yellow><b>U</yellow></b>' : U;
  D = D === 'D' ? '<yellow><b>D</yellow></b>' : D;

  const line1 = `${NW}     ${N}     ${NE}`;
  const line2 = `<yellow><b>${W}</b></yellow> <-${U}-(@)-${D}-> <yellow><b>${E}</b></yellow>`;
  const line3 = `${SW}     ${S}     ${SE}\r\n`;

  return [line1, line2, line3];
}

function lookRoom(state, player) {
  const room = player.room;

  B.sayAt(player, '<yellow><b>' + sprintf('%-65s', room.title) + '</b></yellow>');
  let autoexit = player.getMeta('config.autoexit');

  if(autoexit) {
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

  // Add a space between the title and the description
  B.sayAt(player, " ");

  if (!player.getMeta('config.brief')) {
    B.sayAt(player, room.description, 80);
  }

  B.sayAt(player, '');

  // show all players
  room.players.forEach(otherPlayer => {
    if (otherPlayer === player) {
      return;
    }
    let combatantsDisplay = '';
    if (otherPlayer.isInCombat()) {
      combatantsDisplay = getCombatantsDisplay(otherPlayer);
    }
    B.sayAt(player, '[Player] ' + otherPlayer.name + combatantsDisplay);
  });

  // show all the items in the rom
  room.items.forEach(item => {
    if (item.hasBehavior('resource')) {
      B.sayAt(player, `[${ItemUtil.qualityColorize(item, 'Resource')}] <magenta>${item.roomDesc}</magenta>`);
    } else {
      B.sayAt(player, `[${ItemUtil.qualityColorize(item, 'Item')}] <magenta>${item.roomDesc}</magenta>`);
    }
  });

  // show all npcs
  room.npcs.forEach(npc => {
    // show quest state as [!], [%], [?] for available, in progress, ready to complete respectively
    let hasNewQuest, hasActiveQuest, hasReadyQuest;
    if (npc.quests) {
      hasNewQuest = npc.quests.find(questRef => state.QuestFactory.canStart(player, questRef));
      hasReadyQuest = npc.quests.find(questRef => {
          return player.questTracker.isActive(questRef) &&
            player.questTracker.get(questRef).getProgress().percent >= 100;
      });
      hasActiveQuest = npc.quests.find(questRef => {
          return player.questTracker.isActive(questRef) &&
            player.questTracker.get(questRef).getProgress().percent < 100;
      });

      let questString = '';
      if (hasNewQuest || hasActiveQuest || hasReadyQuest) {
        questString += hasNewQuest ? '[<b><yellow>!</yellow></b>]' : '';
        questString += hasActiveQuest ? '[<b><yellow>%</yellow></b>]' : '';
        questString += hasReadyQuest ? '[<b><yellow>?</yellow></b>]' : '';
        B.at(player, questString + ' ');
      }
    }

    let combatantsDisplay = '';
    if (npc.isInCombat()) {
      combatantsDisplay = getCombatantsDisplay(npc);
    }

    // color NPC label by difficulty
    let npcLabel = 'NPC';
    switch (true) {
      case (player.level  - npc.level > 4):
        npcLabel = '<cyan>NPC</cyan>';
        break;
      case (npc.level - player.level > 9):
        npcLabel = '<b><black>NPC</black></b>';
        break;
      case (npc.level - player.level > 5):
        npcLabel = '<red>NPC</red>';
        break;
      case (npc.level - player.level > 3):
        npcLabel = '<yellow>NPC</red>';
        break;
      default:
        npcLabel = '<green>NPC</green>';
        break;
    }
    B.sayAt(player, `[${npcLabel}] ` + npc.name + combatantsDisplay);
  });
}

function lookEntity(state, player, args) {
  const room = player.room;

  args = args.split(' ');
  let search = null;

  if (args.length > 1) {
    search = args[0] === 'in' ? args[1] : args[0];
  } else {
    search = args[0];
  }

  let entity = ArgParser.parseDot(search, room.items);
  entity = entity || ArgParser.parseDot(search, room.players);
  entity = entity || ArgParser.parseDot(search, room.npcs);
  entity = entity || ArgParser.parseDot(search, player.inventory);

  if (!entity) {
    return B.sayAt(player, "You don't see anything like that here.");
  }

  Logger.error(entity);

  if (entity instanceof Player) {
    B.sayAt(player, `You see fellow player ${entity.name}.`);
    if( entity.items) {
      entity.items.forEach(item => {
        B.sayAt(player, `${item.name}`);
      });
    }
    return;
  }

  B.sayAt(player, entity.description, 80);

  if (entity.timeUntilDecay) {
    B.sayAt(player, `You estimate that ${entity.name} will rot away in ${humanize(entity.timeUntilDecay)}.`);
  }

  const usable = entity.getBehavior('usable');
  if (usable) {
    if (usable.spell) {
      const useSpell = state.SpellManager.get(usable.spell);
      if (useSpell) {
        useSpell.options = usable.options;
        B.sayAt(player, useSpell.info(player));
      }
    }

    if (usable.effect && usable.config.description) {
      B.sayAt(player, usable.config.description);
    }

    if (usable.charges) {
      B.sayAt(player, `There are ${usable.charges} charges remaining.`);
    }
  }

  if (entity instanceof Item) {
    switch (entity.type) {
      case ItemType.WEAPON:
      case ItemType.ARMOR:
        return B.sayAt(player, ItemUtil.renderItem(state, entity, player));
      case ItemType.CONTAINER: {
        if (!entity.inventory || !entity.inventory.size) {
          return B.sayAt(player, `${entity.name} is empty.`);
        }

        if (entity.closed) {
          return B.sayAt(player, `It is closed.`);
        }

        B.at(player, 'Contents');
        if (isFinite(entity.inventory.getMax())) {
          B.at(player, ` (${entity.inventory.size}/${entity.inventory.getMax()})`);
        }
        B.sayAt(player, ':');

        for (const [, item ] of entity.inventory) {
          B.sayAt(player, '  ' + ItemUtil.display(item));
        }
        break;
      }
    }
  }
}

function getCombatantsDisplay(entity) {
  const combatantsList = [...entity.combatants.values()].map(combatant => combatant.name);
  return `, <red>fighting </red>${combatantsList.join("<red>,</red> ")}`;
}
