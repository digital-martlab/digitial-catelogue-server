const bcrypt = require('bcrypt');

const password = "digitalmahendra"

async function genPassword() {
    const hash = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, hash);
    console.log(hashPassword);
}
console.log(genPassword());

