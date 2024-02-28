
/**
 * The day rate, given a rate per hour
 *
 * @param {number} ratePerHour
 * @returns {number} the rate per day
 */
export function dayRate(ratePerHour) {
    return ratePerHour * 8
}

/**
 * Calculates the number of days in a budget, rounded down
 *
 * @param {number} budget: the total budget
 * @param {number} ratePerHour: the rate per hour
 * @returns {number} the number of days
 */
export function daysInBudget(budget, ratePerHour) {
    return Math.floor(budget / dayRate(ratePerHour))
}

/**
 * Calculates the discounted rate for large projects, rounded up
 *
 * @param {number} ratePerHour
 * @param {number} numDays: number of days the project spans
 * @param {number} discount: for example 20% written as 0.2
 * @returns {number} the rounded up discounted rate
 */
export function priceWithMonthlyDiscount(ratePerHour, numDays, discount) {
    const billableDaysPerMonth = 22;
    const workingHoursPerDay = 8;

    const monthlyRate = billableDaysPerMonth * workingHoursPerDay * ratePerHour;
    // Calculate total months required for the project
    const totalMonths = Math.floor(numDays / billableDaysPerMonth);

    // Calculate the remaining days after full months
    const remainingDays = numDays % billableDaysPerMonth;

    // Calculate the cost for full months with discount applied
    const discountedMonthsCost = totalMonths * monthlyRate * (1 - discount);

    // Calculate the cost for remaining days without discount
    const remainingDaysCost = remainingDays * workingHoursPerDay * ratePerHour;

    const totalPrice = Math.ceil(discountedMonthsCost + remainingDaysCost);
    return totalPrice;
}