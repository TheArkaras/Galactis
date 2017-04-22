const Socket = require('beam-client-node/lib/ws');

class BeamSocket {
    constructor(beamRest, beamUserInfo) {
        this.authedSocket = beamRest.joinChat(beamUserInfo).then(chatinfo => {
            this.socket = new Socket(chatinfo.endpoints);
            this.socket.boot()
            return this.socket.auth(beamUserInfo.channel.id, beamUserInfo.channel.userId, chatinfo.authkey);
          });

        //Setup Error Handling of socket
        this.authedSocket.then(() => {
          this.socket.on('error', error => {
              console.error('Socket error', error);
          });
        });
    }

    SendMessage(message) {
        console.log(`Sending ${message} to beam`);
        return this.authedSocket.then(() => {
            let msgSocket = this.socket.call('msg', [message]);
            msgSocket.catch(reason =>
            {
              // Couldnt send message to beam, retry sending the message with a 3 second wait.
              // This way we can infinitlty retry to send the message until it succeeds.
              setTimeout(() =>
              {
                this.SendMessage(message);
              }, 3000);
            });
        });
    }

    SendMessageOn(event, message) {
        console.log(`Sending ${message} on ${event} to beam`);
        return  this.authedSocket.then(() => {
          return this.socket.on(event, data => {
            return this.SendMessage(message);
        });
      });
    }

    ReactOn(event, callback) {
        console.log(`Setting up reaction to ${event} for ${callback.name}`);
        return this.authedSocket.then(() => {
          this.socket.on(event, data => {
            console.log(`${event} fired, running ${callback.name} with ${data}`);
            return callback(data);
          });
      });

    }
}

module.exports = BeamSocket;
