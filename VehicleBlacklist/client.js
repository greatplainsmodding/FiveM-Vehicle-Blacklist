RegisterNetEvent("DonatorScript:KickFromVehicle");
AddEventHandler("DonatorScript:KickFromVehicle", () => {
    setTimeout(() => remove(), 500)
});

function remove() {
    ClearPedTasksImmediately(GetPlayerPed(-1));
};

checkPlayer()
function checkPlayer() {
    if (GetPedInVehicleSeat(GetVehiclePedIsIn(GetPlayerPed(-1), false), -1) === GetPlayerPed(-1)) {
        TriggerServerEvent("DonatorScript:checkVehicle", GetEntityModel(GetVehiclePedIsIn(GetPlayerPed(-1), false)))
    };

    setTimeout(() => checkPlayer(), 5000);
};