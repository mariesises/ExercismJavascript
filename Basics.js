const EXPECTED_MINUTES_IN_OVEN = 40;

//Calculate the remaining oven in minutes
function remainingMinutesInOven(min) {
    const remainTime = EXPECTED_MINUTES_IN_OVEN - min;
    return remainTime;
}

console.log(remainingMinutesInOven(30))

//Calculate the preparation time in minutes
function preparationTimeInMinutes(layers) {
    const timePreparing = layers * 2;
    return timePreparing;
}

console.log(preparationTimeInMinutes(2));

//Calculate the total working time in minutes
function totalTimeInMinutes(numberOfLayers, actualMinutesInOven) {

    const timeForLayers = numberOfLayers * 2;
    const timeCooking = EXPECTED_MINUTES_IN_OVEN - actualMinutesInOven;

    const totalTime = timeForLayers + timeCooking

    return totalTime
}

console.log(totalTimeInMinutes(3, 20))