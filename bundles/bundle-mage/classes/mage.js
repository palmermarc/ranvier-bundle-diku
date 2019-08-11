'use strict';

/**
 * See warrior.js for more on classes.
 */
module.exports = {
  name: 'Mage',
  description: 'Mages spend years learning to harness arcane forces to impose their will on the world around them. Their powerful spells keep them alive and allow them to wreak havoc... as long as they have the mana to cast them.',
  abilityTable: {
    1: { spells: ['acidblast','armor','bless','blind','burninghands','charmperson','chilltouch','cureblindness','curepoison','curse','detectevil','detecthidden','detectinvis','detectmagic','detectpoison','dispelevil','dispelmagic','earthquake','enchantweapon','energydrain','faeriefire','fireball','flamestrike','giantstrength','heal','identify','infravision','invis','lightningbolt','locateobject','magicmissile','massinvis','protection','removecurse','sanctuary','shield','shockinggrasp','stoneskin','summon','teleport','weaken','wordofrecall','acidbreath','firebreath','frostbreath','gasbreath','lightningbreath','peek','guardian','frenzy','darkblessing','portal','voodoo','transport','regenerate','clot','mend','minorcreation','brew','scribe','carve','engrave','bake','mount','berserk','hunt','spellproof','clone','reveal'] },
  },

  setupPlayer: (state, player) => {
    const mana = state.AttributeFactory.create('mana', 100);
    player.addAttribute(mana);
    player.prompt = '[ %health.current%<b>hp</b> %mana.current%<b>mana</b> ]';
  }
};



