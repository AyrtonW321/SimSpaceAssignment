"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userClass_1 = require("./userClass");
function runTests() {
    // Initialize a grid of 10x10 and a new User
    const user = new userClass_1.User(10, 10);
    // Test initial values
    console.log("Initial User Money:", user.userMoney);
    console.log("Initial Population:", user.totalPopulation);
    console.log("Initial Pollution:", user.totalPollution);
    console.log("Initial Time:", user.currentTime);
    // Test building a facility: PowerPlant
    const buildPPResult = user.buildPP(2, 2); // Try building PowerPlant at (2, 2)
    console.log("Building PowerPlant (2, 2):", buildPPResult);
    console.log("Buildings Built After PP:", user.buildingsBuilt);
    console.log("Remaining User Money After PP:", user.userMoney);
    // Test building a Factory
    const buildFactoryResult = user.buildFactory(3, 3); // Try building Factory at (3, 3)
    console.log("Building Factory (3, 3):", buildFactoryResult);
    console.log("Buildings Built After Factory:", user.buildingsBuilt);
    // Test power balance before monthly update
    console.log("Power Balance Before Monthly Update:", user.powerBalance);
    // Test building an Environmental Facility
    const buildEnvResult = user.buildEnvFacility(4, 4);
    console.log("Building Environmental Facility (4, 4):", buildEnvResult);
    console.log("Total Pollution After Env Facility:", user.totalPollution);
    // Test monthly updates: this should calculate revenues, update population, and pollution, etc.
    user.calculateMonthlyUpdates();
    console.log("User Money After Monthly Update:", user.userMoney);
    console.log("Total Population After Monthly Update:", user.totalPopulation);
    console.log("Total Pollution After Monthly Update:", user.totalPollution);
    console.log("Power Balance After Monthly Update:", user.powerBalance);
    console.log("Is Game Over:", user.isGameOver);
    // Test adding a Residence
    const buildResidenceResult = user.buildLuxury(5, 5);
    console.log("Building Luxury Residence (5, 5):", buildResidenceResult);
    // Test getting all facilities
    const allFacilities = user.getAllFacilities();
    console.log("All Facilities After Building:", allFacilities);
    // Test score calculation
    const score = user.calculateScore();
    console.log("User Score:", score);
    // Test canAfford method
    const canAffordPP = user.canAfford(500000000);
    console.log("Can afford PowerPlant:", canAffordPP);
    // Test grid functionality: Checking facilities at coordinates (2, 2)
    const facilityAt22 = user.getFacilityAt(2, 2);
    console.log("Facility at (2, 2):", facilityAt22);
    // Test building in an already occupied location
    const buildPPFail = user.buildPP(2, 2); // Try to build on an already occupied spot
    console.log("Try to Build PP on (2, 2) Again:", buildPPFail);
    console.log(user.grid);
}
runTests();
//# sourceMappingURL=test.js.map