export function getRandomInt(max:number):number {
    return Math.floor(Math.random() * max);
}

export function getRandomIntIterval(min:number, max:number):number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

export function convertDaysToAge(days:number) {
    if (isNaN(days) || days < 0) {
        return "Invalid input";
    }

    let years = Math.floor(days / 365);
    let remainingDays = days % 365;

    let months = Math.floor(remainingDays / 30);
    remainingDays = remainingDays % 30;

    let result = "";
    if (years > 0) {
        result += years + (years === 1 ? " year" : " years");
    }

    if (months > 0) {
        if (result.length > 0) {
            result += ", ";
        }
        result += months + (months === 1 ? " month" : " months");
    }

    if (remainingDays > 0) {
        if (result.length > 0) {
            result += ", ";
        }
        result += remainingDays + (remainingDays === 1 ? " day" : " days");
    }

    return result.length > 0 ? result : "0 days";
}