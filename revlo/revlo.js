
class revlo {
    constructor(revloKey) {
        this.revloLibrary = require('node-revlobot-api')(revloKey);
    }

    GiveUserPoints(username, points) {
        let userString = username.toLowerCase();
        console.log(`Giving ${userString} ${points} points.`);
        this.revloLibrary.post.bonus(userString, {amount: points}).then(data => {
            console.log(data);
            // Do stuff
        }, console.error);
    }

    GetCurrentUserPoints(username)
    {
        return this.revloLibrary.get.points(username.toLowerCase()).then(data => {
          return data.loyalty.current_points;
        });
    }
}

module.exports = revlo;
