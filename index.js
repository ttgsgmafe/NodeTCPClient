'use strict';

const config = require('./config');
const readLine = require('readline');
const Socket = require('./socket');

const socket = new Socket(config.host, config.port);
let clientSocket = socket.connect();
//clientSocket.pause();

let user = {'name': 'ttgsgmafe'};
let isAuth = false;
let hbLast = 0;

let rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

clientSocket.on('data', (data) => {

    let payload = {};
    //Validate JSON
    if(jsonVerify(data.toString())) {
        try{
            payload = JSON.parse(data.toString());
            if(payload.type === "welcome") {
                //console.log(payload.msg);
            } else if(payload.type === "heartbeat") {
                if ( (payload.epoch - hbLast) > 2 && hbLast !== 0){
                    if(isAuth) {
                        clientSocket.destroy();
                    }
                } else {
                    //testing results
                    //console.log(payload.type);
                }
                hbLast = payload.epoch;
            }
        } catch(err) {
            //console.log("jsonerr");
        }
    } else {
        //console.log("Inval");
    }

    // try{
    //     payload = JSON.parse(data.toString());
    //     if(payload.type === 'welcome') {
    //         logger(payload.msg);
    //     } else if(payload.type === 'heartbeat') {
    //         if ( (payload.epoch - hbLast) > 2 && hbLast !== 0){
    //             clientSocket.destroy();
    //         } else {
    //             //testing results
    //             //console.log(payload);
    //         }
    //         hbLast = payload.epoch;
    //     }
    // } catch(err) {
    //     console.log(`\nInvalid JSON. Skipping`);
    // } finally {
    // }
});

clientSocket.on('close', () => {
    //logger('Connection has been closed. Reauthenticating.');
    clientSocket = socket.connect();
    authenticate();
    //auth();
});

let logger = function (msg) {
    // process.stdout.clearLine();
    // process.stdout.cursorTo(0);
    process.stdout.write(msg);
}

// rl.on('json', (json) => {
//     let data;
//     try{
//         data = JSON.parse(json);
//         clientSocket.write(JSON.stringify(data), (err)=> {
//             console.log("senderr");
//         });

//     } catch (err) {
//         console.log("invaljson");
//     }
// });

let userInput = function() { 
    rl.question("Enter a JSON formatted command: ", (jsoncmd) => {
        try {

        } catch(err) {

        }
        
        if(jsonVerify(jsoncmd)) {
            console.log("Valid");
        } else {
            console.log(`JSON invalid`);
            userInput();
        }
    });
}

//If allowing automatic authentication
let authenticate = function() {
    clientSocket.write(JSON.stringify(user), (err)=> {
        if(err) {
            console.log(err);
        } else {
            isAuth = true;
            userInput();
        }
    });
}
authenticate();

//If allowing user to authenticate via console
// let auth = function() { 
//     rl.question("Enter a username: ", (uname) => {
//         if(uname.length > 1) {
//             //resume and send user info to the server
//             console.log(`Connecting as ${uname}`);
//             user.name = uname;
//             clientSocket.resume();
//             clientSocket.write(JSON.stringify(user));
//         } else {
//             console.log(`User invalid. Please try again.`);
//             auth();
//         }
//     });
// }
// auth();

let jsonVerify = function(jsonstr) {
    return (/^[\],:{}\s]*$/.test(jsonstr));
}
