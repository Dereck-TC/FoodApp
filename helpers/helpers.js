const bcrypt = require("bcrypt");

async function encrypt(string) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(string,salt);

    return hash;
}
//funcion para comparar las contraseñas con bcrypt
async function compare(string,hash){
    try {
        return await bcrypt.compare(string,hash); 
    } catch (error) {
        return false;
    }
}

function parseDate(string) {
    const date = new Date(string);

    let day = date.getDate();
    day = day < 10 ? "0"+day : day;
    let month = date.getMonth()+1;
    month = month < 10 ? "0"+month : month;
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
}

module.exports = {
    encrypt,
    compare,
    parseDate
}; 