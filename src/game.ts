import { Planet } from "./planetClass";


let setX = (document.getElementById("x") as HTMLInputElement).value;
let setY = (document.getElementById("y") as HTMLInputElement).value;
let user = new Planet(parseInt(setX), parseInt(setY));
let monthTickRate = 10000; // 10 seconds = one month in game

setInterval(() => {
    user.calculateMonthlyUpdates();
}, monthTickRate);

