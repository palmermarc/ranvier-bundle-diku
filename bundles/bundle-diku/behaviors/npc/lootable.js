'use strict';

const LootTable = require('../../lib/LootTable');
const { Player, Item } = require('ranvier');

module.exports = {
  listeners: {
    killed: state => async function (config, killer) {
      const { room, name, area, keywords } = this;

      const lootTable = new LootTable(state, config);
      const currencies = lootTable.currencies();
      const roll = await lootTable.roll();
      const items = roll.map(
        item => state.ItemFactory.create(state.AreaManager.getAreaByReference(item), item)
      );

      const corpse = new Item(area, {
        id: 'corpse',
        name: `corpse of ${name}`,
        roomDesc: `The rotting corpse of ${name}`,
        description: `the rotting corpse of ${name}`,
        keywords: keywords.concat(['corpse']),
        type: 'CONTAINER',
        metadata: {
          noPickup: true,
          value: 5
        },
        maxItems: items.length,
        behaviors: {
          decay: {
            duration: 300
          }
        },
      });

      corpse.hydrate(state);

      items.forEach(item => {
        item.hydrate(state);
        corpse.addItem(item);
      });
      room.addItem(corpse);
      state.ItemManager.add(corpse);

      if (killer && killer instanceof Player) {
        let autoloot = killer.getMeta('config.autoloot');
        autoloot = autoloot || false;
        let autosac = killer.getMeta('config.autosac');
        autosac = autosac || false;


        if (currencies) {
          currencies.forEach(currency => {
            // distribute currency among group members in the same room
            const recipients = (killer.party ? [...killer.party] : [killer]).filter(recipient => {
              return recipient.room === killer.room;
            });

            let remaining = currency.amount;
            for (const recipient of recipients) {
              // Split currently evenly amount recipients.  The way the math works out the leader
              // of the party will get any remainder if the currency isn't divisible evenly
              const amount = Math.floor(remaining / recipients.length) + (remaining % recipients.length);
              remaining -= amount;

              recipient.emit('currency', currency.name, amount);
            }
          });
        }

        if(items && autoloot) {
          state.CommandManager.get('get').execute('all corpse', killer);
        } else if (items && !autosac) {
          // Don't waste time showing the items if we're just going to sac the corpse anyway
          state.CommandManager.get('look').execute('corpse', killer);
        }

        if(autosac) {
          state.CommandManager.get('sacrifice').execute('corpse', killer);
        }
      }
    }
  }
};
