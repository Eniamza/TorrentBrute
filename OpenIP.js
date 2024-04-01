const fs = require('fs');
const readline = require('readline');
const axios = require('axios');
const {webui,username,password} = require('./config.json');
const {login,getIPs} = require('./qb.js');

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

async function evaluatebyWebAPI() {
    const cookie = await login(webui, username, password);
    const response = await getIPs('d57591f78926c12dded15adb7f38511ef571d703');
    
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

//processLineByLine();
// processLineByLine()
