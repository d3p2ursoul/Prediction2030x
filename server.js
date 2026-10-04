const express = require("express");

const app = express();
const PORT = process.env.PORT || 8080;

let roundNumber = 1;
let roundStart = Date.now();
let crashPoint = createCrashPoint();

function createCrashPoint() {
// TEST DATA ONLY.
// This is NOT real Spribe Aviator data.
return Number((1.20 + Math.random() * 8.80).toFixed(2));
}

function getLiveData() {

const elapsed =
    (Date.now() - roundStart) / 1000;

// Betting phase
if (elapsed < 5) {

    return {
        source: "TEST_FEED",
        status: "BETTING",
        roundId: `TEST-${roundNumber}`,
        currentMultiplier: null,
        nextRound: null,
        timestamp: Date.now()
    };
}

// Simulated flying multiplier
const flyingTime = elapsed - 5;

const multiplier =
    Number(
        Math.exp(flyingTime * 0.12)
            .toFixed(2)
    );

// Simulated crash
if (multiplier >= crashPoint) {

    const result = {
        source: "TEST_FEED",
        status: "CRASHED",
        roundId: `TEST-${roundNumber}`,
        currentMultiplier: crashPoint,
        nextRound: null,
        timestamp: Date.now()
    };

    if (elapsed > 7) {
        roundNumber++;
        roundStart = Date.now();
        crashPoint = createCrashPoint();
    }

    return result;
}

return {
    source: "TEST_FEED",
    status: "FLYING",
    roundId: `TEST-${roundNumber}`,
    currentMultiplier: multiplier,
    nextRound: null,
    timestamp: Date.now()
};

}

app.get("/", (req, res) => {

res.json({
    server: "Aviator Predictor Test Feed",
    status: "ONLINE",
    source: "TEST_FEED",
    warning:
        "This is simulated data. It is NOT real Spribe Aviator data."
});

});

app.get("/api/live", (req, res) => {

res.json(getLiveData());

});

app.listen(PORT, "0.0.0.0", () => {

console.log(
    `Aviator test server running on port ${PORT}`
);

});
