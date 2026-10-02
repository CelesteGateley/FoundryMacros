// Small script to automate wild magic surges
// Usage: Pulls the player character for the logged in user
//        Resets their tides of chaos effect
//        Rolls on the wild magic table
//        Grants them a feature usage back on tides of chaos
// Setup required outside the script:
//   - Update/add activity to Tides of Chaos
//   - Activity must grant an effect of the same name
//     Effect can have no effect, just used to trach
// Once you've used Tides of Chaos, this macro rolls the table,
// restores the feature usage, and clears the effect for next time

let tableId = ""; // Internal ID for the table with the wild magic
let tidesName = "Tides of Chaos"; // Name of the tides of chaos feature/effect

let table = game.tables.get(tableId);
table.draw();

actor.effects.getName(tidesName)?.delete();

actor.items.getName(tidesName)?.update({
  "system.uses.spent": Math.max(0, tides.system.uses.spent - 1),
  "system.uses.value": tides.system.uses.value + 1,
});
