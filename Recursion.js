/// *<reference path="./global.d.ts" />
//
// @ts-nocheck

/**
 * Determine the prize of the pizza given the pizza and optional extras
 *
 * @param {Pizza} pizza name of the pizza to be made
 * @param {Extra[]} extras list of extras
 *
 * @returns {number} the price of the pizza
 */
const pricePizza = {
    "Margherita": 7,
    "Caprese": 9,
    "Formaggio": 10,
}
const priceExtras = {
    "ExtraSauce": 1,
    "ExtraToppings": 2
}
export function pizzaPrice(pizza, ...extras) {
    if (extras.length === 0) {
        return pricePizza[pizza];
    }
    return priceExtras[extras[0]] + pizzaPrice(pizza, ...extras.slice(1));
}

/**
 * Calculate the price of the total order, given individual orders
 *
 * @param {PizzaOrder[]} pizzaOrders a list of pizza orders
 * @returns {number} the price of the total order
 */
export function orderPrice(pizzaOrders) {
    return pizzaOrders.reduce((sum, pizza) =>
        sum += pizzaPrice(pizza.pizza, ...pizza.extras), 0);
}