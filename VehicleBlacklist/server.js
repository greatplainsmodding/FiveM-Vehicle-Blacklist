const fetch = require("node-fetch");
const config = require("./config");

const users = {};
const authorization = `Bot ${config.discordToken}`;

let database;
async function updateDatabase() {
    database = await fetch(config.url).then(res => res.json())
    setTimeout(() => updateDatabase(), 10000);
};

updateDatabase();

AddEventHandler("playerConnecting", async () => {
    const source = global.source;
    const license = getLicense(source) || undefined;
    const discord = getDiscord(source) || undefined;

    if (discord) {
        const roles = await getRoles(source);
        users[license] = roles;
        users[license].push(discord)
    };
});

RegisterCommand("vehBlacklist", async (source) => {
    const license = getLicense(source) || undefined;
    const discord = getDiscord(source) || undefined;

    if (discord) {
        const roles = await getRoles(source);
        users[license] = roles;
        users[license].push(discord)
    };
});

RegisterNetEvent("baseevents:enteredVehicle");
AddEventHandler("baseevents:enteredVehicle", async (currentVehicle, currentSeat, vehicleDisplayName) => {
    const owner = source;
    database = await fetch(config.url).then(res => res.json());

    for (let veh of database) {
        if (veh.vehicle.toLowerCase() === vehicleDisplayName.toLowerCase() && currentSeat == -1) {
            if (await hasPermission(owner, veh.access) == false) {
                TriggerClientEvent("DonatorScript:KickFromVehicle", owner);
            }
        };
    };
});

RegisterNetEvent("entityCreating");
AddEventHandler("entityCreating", async (entity) => {
    const model = GetEntityModel(entity);
    const owner = NetworkGetEntityOwner(entity);

    for (let veh of database) {
        if (GetHashKey(veh.vehicle) === model) {
            if (await hasPermission(owner, veh.access) == false) {
                CancelEvent();
            }
        };
    };
});

RegisterNetEvent("DonatorScript:checkVehicle")
AddEventHandler("DonatorScript:checkVehicle", async (model) => {
    const owner = source;
    
    for (let veh of database) {
        if (GetHashKey(veh.vehicle) === model) {
            if (await hasPermission(owner, veh.access) == false) {
                TriggerClientEvent("DonatorScript:KickFromVehicle", owner);
            }
        };
    };
});

function getDiscord(source) {
    for (let i = 0; i < GetNumPlayerIdentifiers(source); i++) {
        const identifier = GetPlayerIdentifier(source, i);
        if (identifier && identifier.startsWith("discord:")) return identifier.split(":")[1];
    };

    return undefined;
};

function getLicense(source) {
    for (let i = 0; i < GetNumPlayerIdentifiers(source); i++) {
        const identifier = GetPlayerIdentifier(source, i);
        if (identifier && identifier.startsWith("license:")) return identifier.split(":")[1];
    };
};

async function hasPermission(source, allowsAccess) {
    let hasAccess = false;
    const license = getLicense(source);
    const discord = getDiscord(source);

    if (!users[license]) {
        if (getDiscord(source)) {
            const roles = await getRoles(source);
            users[license] = roles;
            users[license].push(discord)
        } else users[license] = [];
    };

    for (let access of allowsAccess) {
        for (let role of users[license]) {
            if (access === role) {
                hasAccess = true;
            };
        };
    };

    return hasAccess;
};

async function getRoles(source) {
    const discord = getDiscord(source) || undefined;
    
    if (discord) {
        const info = await fetch(`https://discordapp.com/api/guilds/${config.guildID}/members/${discord}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": authorization
            }
        }).then(res => res.json());

        return info.roles;
    } else return undefined;
};