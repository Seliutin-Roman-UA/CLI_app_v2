const contacts = require('./contacts.js');
const { Command } = require("commander");
const program = new Command();

program
  .option("-a, --action <type>", "choose action")
  
program.parse(process.argv);

function invokeAction({ action, id, name, email, phone }) {
    switch (action) {
      case "list":
        contacts.list();
        break;
  
      case "get":
        contacts.getById()
        break;
  
      case "add":
        contacts.add();           
        break;
  
      case "remove":        
        contacts.remove();           
        break;
  
      default:
        console.warn("\x1b[1;31;44mUnknown action type!\x1b[0m");
        contacts.rl.close();
    }
  }
  
  invokeAction(program.opts());
