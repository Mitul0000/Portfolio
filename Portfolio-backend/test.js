const bcrypt = require("bcrypt");

(async()=>{

const a="hello";
const b="world";

const hash=await bcrypt.hash(a,12);

console.log(await bcrypt.compare(a,hash));
console.log(await bcrypt.compare(b,hash));

})();