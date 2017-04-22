class UserAlias {
    constructor(username, platformName, twitchName, lastgivenPoints, revision) {
        this._id = `alias.${username}`;
        this.userName = username;
        this.platformName = platformName;
        this.twitchName = twitchName;
        this.lastgivenPoints = lastgivenPoints;
        if (revision) {
            this._rev = revision;
        }

    }
    static JsonUserFactory(jsonObject) {
        if (jsonObject.revision) {
            return new User(jsonObject.userName, jsonObject.platformName, jsonObject.twitchName, jsonObject.lastgivenPoints, jsonObject.revision);
        } else {
            return new User(jsonObject.userName, jsonObject.platformName, jsonObject.twitchName, jsonObject.lastgivenPoints);
        }
    }
}

module.exports = UserAlias;
