"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userClass_1 = require("./userClass");
let setX = document.getElementById("x").value;
let setY = document.getElementById("y").value;
let user = new userClass_1.User(parseInt(setX), parseInt(setY));
let monthTickRate = 10000; // 10 seconds = one month in game
setInterval(() => {
    user.calculateMonthlyUpdates();
}, monthTickRate);
//# sourceMappingURL=game.js.map