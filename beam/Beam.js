const beamRest = require('./BeamRest');
const beamConnection = require('./BeamConnectionInfo');
const beamSocket = require('./BeamSocket');
const Message = require('../common/Message');

class Beam {
    constructor(accessKey) {
        this.BeamClientConnection = new beamConnection(accessKey, Date.now() + (365 * 24 * 60 * 60 * 1000), 'replaceme, enpoint');
        this.BeamClient = new beamRest(this.BeamClientConnection);
        this.UserInfo = this.BeamClient.getCurrentUserInfo();
        this.BeamSocketPromise = this.UserInfo.then(info => {
            return new beamSocket(this.BeamClient, info);
        });

    }

    registerCommand(name, callback) {
        if (!this.Commands) {
            console.log("No Commands, initing database");
            this.Commands = {};

            this.BeamSocketPromise.then(beamSocket => {
                console.log("Adding message callback");
                beamSocket.ReactOn('ChatMessage', data => {
                    let message = this.UnpackMessage(data);
                    this.CheckCommands(this.Commands, message);
                }).bind(this);
            });
        }
        this.Commands[name] = callback;
    }

    RegisterMessageCallBack(callback) {
        this.BeamSocketPromise.then(beamSocket => {
            console.log("Adding message callback");
            beamSocket.ReactOn('ChatMessage', data => {
                console.log(`Raw Chat Message ${data}`);
                let message = this.UnpackMessage(data);
                callback(message);
            }).bind(this);
        });
    }

    SendMessage(message) {
        this.BeamSocketPromise.then(beamSocket => {
            beamSocket.SendMessage(message);
        });
    }

    GetUsers()
    {
        return this.UserInfo.then(info => {
            return this.BeamClient.getUsers(info);
        });
    }

    UnpackMessage(BeamRawMessageData) {
      console.log(`Got beam raw message data ${BeamRawMessageData}`)
        return new Message("Beam", BeamRawMessageData.user_name, BeamRawMessageData.message.message[0].data, "");
    }

    CheckCommands(commandsDictionary, message) {

        let command = message.message.split(" ")[0];
        if (command.includes("!")) {
          console.log(`Hi I Got ${message}`);
            //execute the stored callback with the message associated with the message.
            commandsDictionary[command](message);
        }
    }

}
module.exports = Beam;
