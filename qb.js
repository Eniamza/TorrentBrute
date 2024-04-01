const axios = require('axios');
const fs = require('fs');
const {webui,username,password} = require('./config.json');

const login = async (webui, username, password) => {

    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    let response = await axios.post(`${webui}/api/v2/auth/login`, params)
    let cookie = response.headers['set-cookie'][0].split('; ')[0]
    return cookie;

};

const getIPs = async (torrentHash) => {
    const cookie = await login(webui, username, password);
    
    const response = await axios.get(`${webui}/api/v2/sync/torrentPeers?hash=${torrentHash}`, {
        headers: {
            'cookie': cookie
        }
    });
    let peerList = Object.keys(response.data.peers);

    fs.writeFile('ips.txt', peerList.join('\n'), (err) => { if(err){console.log(err)}});

    return peerList
};

const torrentListing = async () => {

    let peerHashes = [];

    let chalk;
    await import('chalk').then((module) => {
        chalk = module.default;
    });
    
    console.log(chalk.greenBright('Detecting Current Torrents...'));
    console.log(chalk.greenBright(`====================================`));
    const listingUrl = `${webui}/api/v2/torrents/info?sort=num_leechs`;
    console.log(chalk.greenBright.bold(`Detected Torrents`));
    console.log(chalk.greenBright(`====================================`));

    const cookie = await login(webui, username, password);
    const response = await axios.get(listingUrl, {
        headers: {
            'cookie': cookie
        }
    })

    let torrents = response.data

    for (let torrent of torrents) {

        let name = torrent.name
        let hash = torrent.hash

        let getPeerCount = await axios.get(`${webui}/api/v2/torrents/properties?hash=${hash}`, {
            headers: {
                'cookie': cookie
            }
        })

        let peerCount = getPeerCount.data.seeds

        let log = chalk.greenBright(`${peerHashes.length}: Seeders: ${peerCount} | Hash: ${hash} | Name: ${name}`)
        console.log(log);

        peerHashes.push(hash);

    };

    return peerHashes;
    
};



module.exports = {login,getIPs,torrentListing}