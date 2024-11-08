// Reclip Ammo Macro

let player = game.actors.get("Cq113uhBgIjxCMhk");

let ammoTypes = [
    {
        name: "Bolt Action Rifle Ammo",
        count: 7,
        clips: "jNLSVcVopKkmZcL3",
        bullets: "LiRObd9DxdqAJ7jj",
        housing: "YjAgkozywoiG6OpP", // Unused at the moment, will contain mags/clips that are empty maybe?
    },
]

function getButtons() {
    let buttons = [];
    ammoTypes.forEach(type => {
        let clips = player.items.get(type.clips);
        let bullets = player.items.get(type.bullets);
        let housing = null;
        if (type.housing !== null) {
            housing = player.items.get(type.housing);
        }

        buttons.push({
            label: `${type.name}`,
            callback: () => {
                reclip(type.name, clips, bullets, type.count, housing)
            }
        });
    });

    buttons.push({
        label: `Reclip All Ammo`,
        callback: () => {
            ammoTypes.forEach((type => {
                let clips = player.items.get(type.clips);
                let bullets = player.items.get(type.bullets);
                let housing = null;
                if (type.housing !== null) {
                    housing = player.items.get(type.housing);
                }
                reclip(type.name, clips, bullets, type.count, housing)
            }));
        }
    })

    return buttons;
}

// Popup the dialog box, with the built weapons
new Dialog({
    title: "Reclip your Ammunition",
    content: "Which ammunition would you like to reclip?",
    buttons: getButtons(),
}).render(true);

function reclip(name, clips, bullets, count, housing = null) {
    let clippable = Math.floor(bullets.system.quantity / count);
    if (housing !== null) {
        // If we're using housing then we want either the amount of mags we can make with the bullets, or the total number of spare mags
        clippable = Math.min(clippable, housing.system.quantity);
    }
    if (clippable > 0) {
        updateItem(bullets, "system.quantity", bullets.system.quantity - (clippable * count));
        updateItem(clips, "system.quantity", clips.system.quantity + clippable);
        if (housing !== null) {
            updateItem(housing, "system.quantity", housing.system.quantity - clippable);
        }
        ui.notifications.info(`Successfully Reclipped ${clippable * count} into ${clippable} Magazines for ${name}!`)
    } else {
        if (housing !== null && housing.system.quantity <= 0) {
            ui.notifications.warn(`You do not have enough spare magazines for ${name} to put bullets in!`)
        } else {
            ui.notifications.warn(`You do not have enough bullets for ${name} to make a full clip!`)
        }
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
