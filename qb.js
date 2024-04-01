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



module.exports = {login,getIPs}