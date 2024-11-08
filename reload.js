// Reload Gun Macro

let player = game.actors.get("Cq113uhBgIjxCMhk");

// Array of available weapons to be reloaded. Must include name, weapon, clips.
let weapons = [
    {
        name: "Bolt Action Rifle",   // Name of the weapon, can be anything you want
        weapon: "HVClcimAEQEu9xDn",  // ID of the weapon itself
        clips: "jNLSVcVopKkmZcL3",   // ID of the clips/mags to reload from
        bullets: "LiRObd9DxdqAJ7jj", // ID of individual bullets. Can be left out if unused rounds aren't returned
        housing: "YjAgkozywoiG6OpP", // ID of the housing for bullets. Can be left out if you do not want magazines returned
    },
]

function getButtons() {
    let buttons = [];
    // Iterate through the list of weapons, for each one, build a menu button that can be pressed
    weapons.forEach(weapon => {
        // Get the specific items by ID from the players inventory
        let gun = player.items.get(weapon.weapon);
        let clips = player.items.get(weapon.clips);
        let bullets = null;
        if (weapon.hasOwnProperty('bullets')) {
            bullets = player.items.get(weapon.bullets);
        }

        // Add the button to the list, with a label showing the bullets/max, and that calls reload for the weapon
        buttons.push({
           label: `${weapon.name} (${gun.system.uses.value}/${gun.system.uses.max})`,
            callback: () => {
               reload(gun, clips, bullets)
            }
        });
    });
    return buttons;
}

// Popup the dialog box, with the built weapons
new Dialog({
    title: "Reload Your Guns",
    content: "Which gun would you like to reload?",
    buttons: getButtons(),
}).render(true);

function reload(weapon, magazines, bullets = null, housing = null) {
    // Check if the weapon is missing any charges
    if (weapon.system.uses.value < weapon.system.uses.max) {
        // Check if you have any mags to use
        if (magazines.system.quantity > 0) {

            // Calculate how many bullets, if any, to return
            let returned = null;
            if (bullets !== null) {
                returned = weapon.system.uses.value;
                if (returned > 0) {
                    updateItem(bullets, "system.quantity", bullets.system.quantity + returned);
                }
            }
            if (housing !== null) {
                updateItem(housing, "system.quantity", housing.system.quantity + 1);
            }

            updateItem(weapon, "system.uses.value", weapon.system.uses.max);
            updateItem(magazines, "system.quantity", magazines.system.quantity - 1);

            // Send a different message if you had bullets returned vs no bullets to return
            if (returned !== null) {
                ui.notifications.info("Reloaded Successfully! Returned " + returned + " bullets!");
            } else {
                ui.notifications.info("Reloaded Successfully!");
            }
        // You don't have any spare ammo
        } else {
            ui.notifications.warn("You do not have enough ammo in your inventory to reload!");
        }
    // You're fully reloaded
    } else {
        ui.notifications.warn("You're already fully reloaded!");
    }
}

/**
 * Update an item. Must be done async to properly update the server
 * @param item The item you want to update
 * @param key The key on the item you want to update
 * @param value The value you want to set it to
 */
function updateItem(item, key, value) {
    // You need to pass item.update an object, containing the ID of the specific object, and any values you want to update
    let obj = {"_id": item.id,};
    obj[key] = value; // Must be done this way, since I want to set a key whose name is stored in a variable
    item.update(obj);
}
