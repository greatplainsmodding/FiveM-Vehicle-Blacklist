const fetch = require("node-fetch");
const config = require("./config");

let database;
async function updateDatabase() {
    database = await fetch(config.url).then(res => res.json())
    setTimeout(() => updateDatabase(), 10000)
};

updateDatabase()

RegisterNetEvent("baseevents:enteringVehicle")
AddEventHandler("baseevents:enteringVehicle", (targetVehicle, vehicleSeat, vehicleDisplayName) => {
    const src = source;
    const discord = getDiscord(src) || undefined

    for (let veh of database) {
        if (veh.vehicle.toLowerCase() === vehicleDisplayName.toLowerCase() && vehicleSeat == 0) {
            if (!veh.access.includes(discord) || !veh.owner === discord) {
                TriggerClientEvent("DonatorScript:KickFromVehicle", src);

                TriggerClientEvent('t-notify:client:Custom', src, {
                    style: 'error',
                    duration: 7000,
                    message: "You aren't authorized to use this vehicle!",
                    sound: true
                });
            };
        };
    };
});

RegisterNetEvent("baseevents:enteredVehicle");
AddEventHandler("baseevents:enteredVehicle", (currentVehicle, currentSeat, vehicleDisplayName) => {
    const src = source;
    const discord = getDiscord(src) || undefined

    for (let veh of database) {
        if (veh.vehicle.toLowerCase() === vehicleDisplayName.toLowerCase() && vehicleSeat == 0) {
            if (!veh.access.includes(discord) || !veh.owner === discord) {
                TriggerClientEvent("DonatorScript:KickFromVehicle", src);

                TriggerClientEvent('t-notify:client:Custom', src, {
                    style: 'error',
                    duration: 7000,
                    message: "You aren't authorized to use this vehicle!",
                    sound: true
                });
            };
        };
    };
})

RegisterNetEvent("entityCreating");
AddEventHandler("entityCreating", (entity) => {
    const model = GetEntityModel(entity);
    const owner = NetworkGetEntityOwner(entity);
    const discord = getDiscord(owner) || undefined

    for (let veh of database) {
        if (GetHashKey(veh.vehicle) === model) {
            if (!veh.access.includes(discord) || !veh.owner === discord) {
                CancelEvent();

                TriggerClientEvent('t-notify:client:Custom', owner, {
                    style: 'error',
                    duration: 7000,
                    message: "You aren't authorized to use this vehicle!",
                    sound: true
                });
            };
        };
    };
});

RegisterNetEvent("DonatorScript:checkVehicle")
AddEventHandler("DonatorScript:checkVehicle", (model) => {
    const owner = source
    const discord = getDiscord(owner) || undefined

    for (let veh of database) {
        if (GetHashKey(veh.vehicle) === model) {
            if (!veh.access.includes(discord) || !veh.owner === discord) {
                TriggerClientEvent("DonatorScript:KickFromVehicle", owner);

                TriggerClientEvent('t-notify:client:Custom', owner, {
                    style: 'error',
                    duration: 7000,
                    message: "You aren't authorized to use this vehicle!",
                    sound: true
                });
            };
        };
    };
})

function getDiscord(source) {
    for (let i = 0; i < GetNumPlayerIdentifiers(source); i++) {
        const identifier = GetPlayerIdentifier(source, i);
        if (identifier && identifier.startsWith("discord:")) return identifier.split(":")[1];
    };
};