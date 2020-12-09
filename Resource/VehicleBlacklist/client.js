RegisterNetEvent("DonatorScript:KickFromVehicle");
AddEventHandler("DonatorScript:KickFromVehicle", () => {
    setTimeout(() => remove(), 500)
});

function remove() {
    ClearPedTasksImmediately(GetPlayerPed(-1));
};