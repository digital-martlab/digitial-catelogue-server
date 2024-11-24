function generateStoreID() {
    const prefix = "STORE";
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomString = Math.random().toString(36).substr(2, 5).toUpperCase();

    return `${prefix}-${timestamp}${randomString}`;
}

function expiryDateGenerator(months) {
    if (!months || typeof months !== "number" || months <= 0) {
        throw new Error("Invalid input. Please provide a positive number of months.");
    }

    const currentDate = new Date();

    if (months === 150) {
        currentDate.setDate(currentDate.getDate() + 15);
    } else {
        currentDate.setMonth(currentDate.getMonth() + months);
    }

    return currentDate;
}


module.exports = { generateStoreID, expiryDateGenerator };