'use strict';

const { Broadcast: B, PlayerRoles } = require('ranvier');

/**
 * Command to allow you to reload a command's definition from disk without restarting the server
 */

const subcommands = new CommandManager();

/* -- Placeholder
subcommands.add({
  name: 'add'
});
*/

subcommands.add({
  name: 'modify',
  usage: 'hotfix modify <command name>',
  command: state => (commandName, player) => {

    if (!commandName || !commandName.length) {
      return B.sayAt(player, 'Modify which command?');
    }

    const command = state.CommandManager.get(commandName);
    
    if (!command) {
      return B.sayAt(player, 'There is no such command, use hotfix add');
    }

    delete require.cache[require.resolve(command.file)];
    B.sayAt(player, `<b><red>HOTFIX</red></b>: Reloading [${commandName}]...`);

    const newCommand = state.BundleManager.createCommand(command.file, command.name, command.bundle);
    state.CommandManager.add(newCommand);
    B.sayAt(player, `<b><red>HOTFIX</red></b>: Done!`);

  }
});

module.exports = {
  requiredRole: PlayerRoles.ADMIN,
  usage: 'hotfix <modify/add> <command>',
  command: state => (args, player) => {

    if(!args || !args.length) {
      return B.sayAt(player, "Hotfix which command?");
    }

    const [ command, ...commandArgs ] = args.split(' ');
    const subCommand = subcommands.find(command);

    
    if(!subcommand) {
      return B.sayAt(player, "Not a valid hotfix command");
    }

    subcommand.command(state)(commandArgs.join(' '), player);
  }
};