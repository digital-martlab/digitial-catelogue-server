export default function generateStoreID() {
    const prefix = "STORE";
    const randomString = Math.random().toString(36).substr(2, 6).toUpperCase();
    const randomNumber = Math.floor(1000 + Math.random() * 9000);

    return `${prefix}-${randomNumber}${randomString}`;
}

