//TCP socket connection

'use strict'

const net = require('net');
const socket = new net.Socket();

class Socket {

    constructor(host, port) {
        this.host = host;
        this.port = port;
    }

    connect() {
        return socket.connect(this.port, this.host, (err) => {
            if(err) {
                console.error(err);
            }
        });
    }

}

module.exports = Socket;