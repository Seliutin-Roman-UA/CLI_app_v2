const fs = require('fs').promises;
const readline =require('readline').promises;

const rl =readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})


const PATH = './db/contacts.json';

async function getDataFromFile() {
    try {        
        const data = await fs.readFile(PATH, 'utf8');
        const contacts = JSON.parse(data);
        return contacts;
	} catch (err) {
		console.log('\x1b[1;31;44mне могу прочитать файл контактов\x1b[0m', err);
	}
}
async function writeDataInFile(data) {
    try {  
        const contacts = JSON.stringify(data);      
        await fs.writeFile(PATH, contacts);        
	} catch (err) {
		console.log('\x1b[1;31;44mне смог записать контакты\x1b[0m', err);
	}
}


async function listContacts() {
  	try {        
        const contacts = await getDataFromFile();
        console.table(contacts);  
        rl.close();

	} catch (err) {
		console.log('\x1b[1;31;44mчто-то не читается файл контактов или он отсутствует\x1b[0m', err);
	}
}

 async function getContactById(id) {
    try {  
        const value = await rl.question('Введите ID контакта: ');     
        rl.close();
        const contacts = await getDataFromFile();
        const result = [contacts.find(el=>el.id===value)];
        if (result[0] !== undefined) {
            console.table (result)
        } else {
            console.log (`\x1b[1;31;44mзаписей с id:${id} не найденно\x1b[0m`)
        }
    } catch (err) {
		console.log('\x1b[1;31;44mпроблемки....\x1b[0m', err);
	}
   
}

async function removeContact() {
    try {  
        const value = await rl.question('Введите ID контакта: '); 
        rl.close();
        const contacts = await getDataFromFile();
        const index = contacts.findIndex(el => el.id === value);
        if (index!== -1){
            contacts.splice(index,1);
            writeDataInFile(contacts);
        }else { 
            console.log(`\x1b[1;31;44mконтак с id:${value} не существует\x1b[0m`)
        }
        
    } catch (err) {
        console.log('\x1b[1;31;44mпроблемки....\x1b[0m', err);
    }
}

async function addContact() {
    try {  
        let name, email, phone;
        do {
            name = await rl.question('Введите name контакта: '); 
            email = await rl.question('Введите email контакта: '); 
            phone = await rl.question('Введите phone контакта: ');
            if (!(name && email && phone)) console.log ('\x1b[1;31;44mНедостаточно данных. Корректно введите значения\x1b[0m');
        } while (!(name && email && phone));
         
        rl.close();
        const contacts = await getDataFromFile();
        const ids = contacts.map(el => el.id).sort((a, b) => a - b).reverse();
        const id = String(+ids[0] + 1);
        contacts.push({id, name, email, phone});
        writeDataInFile(contacts);    
        
    } catch (err) {
        console.log('\x1b[1;31;44mпроблемки....\x1b[0m', err);
    }
}

module.exports = {
    list: listContacts,
    getById: getContactById,
    remove: removeContact,
    add: addContact,
    rl,
}