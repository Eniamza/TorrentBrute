const fs = require('fs');
const readline = require('readline');
const axios = require('axios');
const {webui,username,password} = require('./config.json');
const {login,getIPs} = require('./qb.js');

async function evaluatebyWebAPI() {
    const cookie = await login(webui, username, password);
    const response = await getIPs('b5d3c4f6b0e4f1b9f4e9d7a5f1b1e2e5b7a9f0e6');
    let peerList = Object.keys(response.peers);
    console.log(peerList);
    console.log(cookie);
    return response;
}


async function processLineByLine() {
  const fileStream = fs.createReadStream('ips.txt');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {

    axios.get(`http://${line}`,{
        timeout: 5000
    })
    .then(function (response) {
      console.log(`IP: ${line}  |   ${response.status}`);
    })
    .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(`IP: ${line}  |   ${error.response.status}`);
          fs.appendFile('filteredIPs.txt', `${line}\n`, (err) => {console.log(err)});
        } else if (error.request) {
          // The request was made but no response was received
          console.log(`IP: ${line}  |   No response`);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      });



  }
}

processLineByLine();
