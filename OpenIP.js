const fs = require('fs');
const readline = require('readline');
const axios = require('axios');
const {webui,username,password} = require('./config.json');
const {login,getIPs} = require('./qb.js');
const prompt = require('prompt-sync')();    


async function checkAuthPage(ip) {

    axios.get(`http://${ip}/auth`,{
        timeout: 5000
    })
    .then(function (response) {
      console.log(`IP: ${ip}  |   ${response.status}`);
    })
    .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(`IP: ${ip}  |   ${error.response.status}`);
          fs.appendFile('filteredIPs.txt', `${ip}\n`, (err) => {console.log(err)});
        } else if (error.request) {
          // The request was made but no response was received
          console.log(`IP: ${ip}  |   No response`);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      });

}

async function evaluatebyWebAPI(torrentHash) {

    const response = await getIPs(torrentHash);
    
    try {
        for (const ip of response) {
            await checkAuthPage(ip);
        }
        } catch (error) {
    
        console.error(error);
    }


}


async function processLineByLine() {
  const fileStream = fs.createReadStream('ips.txt');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const ip of rl) {

    try {
            await checkAuthPage(ip);
        } catch (error) {
    
        console.error(error);
    }



  }
}

async function main() {

    console.clear();

    let chalk;
    await import('chalk').then((module) => {
        chalk = module.default;
    });
    
    console.log(chalk.greenBright(`
    
████████╗ ██████╗ ██████╗ ██████╗ ███████╗███╗   ██╗████████╗██████╗ ██████╗ ██╗   ██╗████████╗███████╗
╚══██╔══╝██╔═══██╗██╔══██╗██╔══██╗██╔════╝████╗  ██║╚══██╔══╝██╔══██╗██╔══██╗██║   ██║╚══██╔══╝██╔════╝
   ██║   ██║   ██║██████╔╝██████╔╝█████╗  ██╔██╗ ██║   ██║   ██████╔╝██████╔╝██║   ██║   ██║   █████╗  
   ██║   ██║   ██║██╔══██╗██╔══██╗██╔══╝  ██║╚██╗██║   ██║   ██╔══██╗██╔══██╗██║   ██║   ██║   ██╔══╝  
   ██║   ╚██████╔╝██║  ██║██║  ██║███████╗██║ ╚████║   ██║   ██████╔╝██║  ██║╚██████╔╝   ██║   ███████╗
   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═════╝ ╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚══════╝
                                                                                                       
`));

    console.log(chalk.greenBright(`Welcome to TorrentBrute v1.1\nby https://github.com/eniamza`))
    console.log(chalk.greenBright(`================================`))
    console.log(chalk.greenBright(`Select an option:`))
    console.log(chalk.greenBright(`1. Evaluate IPs from a file`))
    console.log(chalk.greenBright(`2. Evaluate IPs from Web API`))
    console.log(chalk.greenBright(`0. Exit`))
    console.log(chalk.greenBright(`================================`))

    let option

    while (option !== '1' && option !== '2') {
        option = prompt(chalk.red.bold('Enter an option: '));
        console.log(chalk.greenBright(`================================`))
        if (option === '0') {
          console.log(chalk.greenBright(`Goodbye! Don't be Naughty!`))
          process.exit(0);
      }
        if (option !== '1' && option !== '2') {
            console.log(chalk.red.bold('Invalid option. Please enter a valid option.'))
        }

    }
    
    if (option === '1') {
        await processLineByLine();
    } else {
        let torrenthash = prompt(chalk.yellow.bold('Enter the torrent hash: '));
        console.log(chalk.greenBright(`================================`))
        console.log(chalk.blue(`Evaluating IPs for torrent hash: ${torrenthash}`))
        console.log(chalk.greenBright(`================================`))
        await evaluatebyWebAPI(torrenthash);
    }

}

main();