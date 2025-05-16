import { Planet } from "./planetClass";
function runCompleteTestSuite() {
    // Initialize a fresh planet for testing
    const testPlanet = new Planet(10, 10);
    let testPassed = 0;
    let testFailed = 0;
    // Helper function to log test results
    function logTestResult(testName, passed, message) {
        if (passed) {
            console.log(`✅ ${testName}`);
            testPassed++;
        }
        else {
            console.log(`❌ ${testName}`, message || "");
            testFailed++;
        }
    }
    console.log("=== BASIC CHECKS ===");
    // Test 1: Initial state validation
    (() => {
        const passed = testPlanet.userMoney === 5000000000 &&
            testPlanet.totalPopulation === 0 &&
            testPlanet.totalPollution === 0;
        logTestResult("Initial state correct", passed);
    })();
    // Test 2: Power Plant construction
    (() => {
        const result = testPlanet.buildPP(2, 2);
        const facility = testPlanet.getFacilityAt(2, 2);
        const passed = result && (facility === null || facility === void 0 ? void 0 : facility.typeOf) === "PowerPlant";
        logTestResult("Power Plant construction", passed);
    })();
    console.log("\n=== INDUSTRIAL FACILITIES ===");
    // Test 3: Factory near Power Plant (should pass)
    (() => {
        var _a;
        const result = testPlanet.buildFactory(3, 3); // Adjacent to PP
        const passed = result && ((_a = testPlanet.getFacilityAt(3, 3)) === null || _a === void 0 ? void 0 : _a.typeOf) === "Factory";
        logTestResult("Factory near Power Plant", passed);
    })();
    // Test 4: Factory far from Power Plant (should fail)
    (() => {
        const result = testPlanet.buildFactory(8, 8); // Far from PP
        const passed = !result && testPlanet.getFacilityAt(8, 8) === null;
        logTestResult("Factory far from Power Plant should fail", passed);
    })();
    // Test 5: Environmental Facility
    (() => {
        var _a;
        const result = testPlanet.buildEnvFacility(4, 4);
        const passed = result &&
            ((_a = testPlanet.getFacilityAt(4, 4)) === null || _a === void 0 ? void 0 : _a.typeOf) === "EnvironmentalFacility";
        logTestResult("Environmental Facility construction", passed);
    })();
    console.log("\n=== POWER DISTRIBUTION ===");
    // Test 6: Monthly power update
    (() => {
        testPlanet.calculateMonthlyUpdates();
        const powerBalance = testPlanet.powerBalance;
        // Should have:
        // - 100 power generated
        // - 75 used by Env Facility
        // - 25 remaining
        const passed = powerBalance === 25;
        logTestResult("Power distribution calculation", passed, `Got ${powerBalance}, expected 25`);
    })();
    // Test 7: Power priority system
    (() => {
        const facilities = testPlanet.getAllFacilities();
        const factory = facilities.find((f) => f.typeOf === "Factory");
        const envFacility = facilities.find((f) => f.typeOf === "EnvironmentalFacility");
        // Env Facility should have power, Factory shouldn't (same priority but not enough power)
        const passed = (envFacility === null || envFacility === void 0 ? void 0 : envFacility.hasPower) && !(factory === null || factory === void 0 ? void 0 : factory.hasPower);
        logTestResult("Power priority respected", !!passed);
    })();
    console.log("\n=== POLLUTION SYSTEM ===");
    // Test 8: Pollution generation
    (() => {
        testPlanet.calculateMonthlyUpdates(); // Run another month
        const pollution = testPlanet.totalPollution;
        // Factory should generate 20,000 pollution
        // Env Facility reduces up to 30,000
        // Expected: 20,000 - 20,000 (full reduction) = 0
        const passed = pollution === 0;
        logTestResult("Pollution calculation with reduction", passed, `Got ${pollution}, expected 0`);
    })();
    // Test 9: Pollution without reduction
    (() => {
        // Build a factory outside reduction radius
        testPlanet.buildFactory(9, 9);
        testPlanet.calculateMonthlyUpdates();
        const pollution = testPlanet.totalPollution;
        // Should have:
        // - Factory at (3,3): 20,000 (reduced)
        // - Factory at (9,9): 20,000 (not reduced)
        const passed = pollution === 20000;
        logTestResult("Pollution without reduction", passed, `Got ${pollution}, expected 20000`);
    })();
    console.log("\n=== RESIDENTIAL AREAS ===");
    // Modify Test 10 to show which service failed:
    (() => {
        const services = [
            { name: "Emergency", result: testPlanet.buildEmergencyServ(5, 5) },
            { name: "Education", result: testPlanet.buildEduCenter(5, 6) },
            { name: "Medical", result: testPlanet.buildMedCenter(5, 7) },
            { name: "Government", result: testPlanet.buildGovernment(5, 8) },
            {
                name: "Environmental",
                result: testPlanet.buildEnvFacility(5, 9),
            },
            { name: "Store", result: testPlanet.buildStore(6, 5) },
            { name: "Restaurant", result: testPlanet.buildRestaurant(6, 6) },
        ];
        services.forEach((s) => {
            console.log(`${s.name} service built: ${s.result}`);
        });
        const allBuilt = services.every((s) => s.result);
        logTestResult("Required services construction", allBuilt);
    })();
    // Test 11: Residence construction
    (() => {
        var _a;
        const result = testPlanet.buildAffordable(7, 7);
        const passed = result &&
            ((_a = testPlanet.getFacilityAt(7, 7)) === null || _a === void 0 ? void 0 : _a.typeOf) === "AffordableResidence";
        logTestResult("Residence with requirements", passed);
    })();
    // Test 12: Population growth
    (() => {
        const initialPop = testPlanet.totalPopulation;
        // Simulate 5 months
        for (let i = 0; i < 5; i++) {
            testPlanet.calculateMonthlyUpdates();
        }
        const newPop = testPlanet.totalPopulation;
        const passed = newPop > initialPop;
        logTestResult("Population growth", passed, `From ${initialPop} to ${newPop}`);
    })();
    console.log("\n=== PLANETARY DEFENSE ===");
    // Test 13: Planetary Defense (with sufficient funds)
    (() => {
        // Temporarily increase funds
        testPlanet["_userMoney"] = 1000000000000;
        const result = testPlanet.buildPlanetaryDefense(0, 0);
        const passed = result && testPlanet.hasPlanetaryDefense;
        logTestResult("Planetary Defense with sufficient funds", passed);
    })();
    console.log("\n=== FINAL RESULTS ===");
    console.log(`Tests passed: ${testPassed}`);
    console.log(`Tests failed: ${testFailed}`);
    console.log(`Success rate: ${Math.round((testPassed / (testPassed + testFailed)) * 100)}%`);
    // Return the test planet for further inspection if needed
    return testPlanet;
}
// Run the complete test suite
runCompleteTestSuite();
//# sourceMappingURL=test.js.map