const bcrypt = require("bcryptjs");
const hash = bcrypt.hashSync("test1", 10);
console.log(hash);