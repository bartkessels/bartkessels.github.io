/** Converts kilometers to miles, rounded to one decimal place. */
export function kmToMiles(km: number): number {
    return Math.round(km * 0.621371 * 10) / 10;
}

/** Converts Celsius to Fahrenheit, rounded to one decimal place. */
export function celsiusToFahrenheit(c: number): number {
    return Math.round((c * 9/5 + 32) * 10) / 10;
}