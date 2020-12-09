const fetch = require("node-fetch");

const database = [
    { vehicle: "tug", owners: ["384187414584754176"] },
    { vehicle: "bus", owners: ["384187414584754176-old"] }
]

RegisterNetEvent("baseevents:enteringVehicle")
AddEventHandler("baseevents:enteringVehicle", (targetVehicle, vehicleSeat, vehicleDisplayName) => {
    const src = source;
    const discord = getDiscord(src) || undefined

    for (let veh of database) {
        if (veh.vehicle.toLowerCase() == vehicleDisplayName.toLowerCase()) {
            if (!veh.owners.includes(discord)) {
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
AddEventHandler("baseevents:enteredVehicle", () => {
    const src = source;
    const discord = getDiscord(src) || undefined

    for (let veh of database) {
        if (veh.vehicle.toLowerCase() == vehicleDisplayName.toLowerCase()) {
            if (!veh.owners.includes(discord)) {
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
        if (GetHashKey(veh.vehicle) == model) {
            if (!veh.owners.includes(discord)) {
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

function getDiscord(source) {
    for (let i = 0; i < GetNumPlayerIdentifiers(source); i++) {
        const identifier = GetPlayerIdentifier(source, i);
        if (identifier && identifier.startsWith("discord:")) return identifier.split(":")[1];
    };
};