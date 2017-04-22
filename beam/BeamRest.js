const BeamClient = require('beam-client-node');

class BeamRest {
    constructor(beamConnectionInfo) {

        this.client = new BeamClient();
        this.client.use('oauth', {
            tokens: {
                access: beamConnectionInfo.accessKey,
                expires: beamConnectionInfo.expiration,
            },
        });


    }

    getCurrentUserInfo() {
        // get current user
        return this.client.request('GET', `users/current`)
            .then(response => {
                return response.body;
            })
            .catch(error => {
                console.log('Something went wrong:', error);
            });;
    }

    getUsers(userInfo) {
        return this.client.request('GET', `chats/${userInfo.channel.id}/users`)
            .then(response => {
                return response.body;
            })
            .catch(error => {
                console.log('Something went wrong:', error);
            });

    }

    joinChat(userInfo) {
        return this.client.chat.join(userInfo.channel.id)
            .then(response => {
                return response.body;
            })
            .catch(error => {
                console.log('Something went wrong:', error);
            });
    }

}

module.exports = BeamRest;
