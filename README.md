## TORRENTBrute

### A script to brute force IPs collected from the Peer Client list 

Clients such as µTorrent and qBittorrent have WebUI enabled by default. This script crawls through the IPs and Detects if a client has a WebUI open or not which is accessible over the internet. 

A malicious actor can brute force the WebUI Login without any limitations or Restrictions and Download malware on the target system.

### Instructions (For Qbittorrent)

- Add a torrent for downloading.
- Click The Active Torrent File
- From the available options such as General, Trackers, and Peers. Select "Peer" 
- Press CTRL+A to select all the available peers in that list
- Right Click and Select "Copy IP:Port"
- Paste that into the `ips.txt` file
- run `npm install`
- run `node OpenIP.js`

### TODO

[] Auto Fetch from qBittorrent Client API
[] Live Listening to the Peer List

### Give a Thanks

- Considering adding a Star

<a href="https://www.buymeacoffee.com/eniamza"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a Lollipop&emoji=&slug=eniamza&button_colour=5F7FFF&font_colour=ffffff&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00" /></a>