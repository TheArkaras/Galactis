class BeamConnectionInfo {
    constructor(accessKey, expiration, endpoints) {
        this.accessKey = accessKey;
        this.expiration = expiration;
        this.endpoints = endpoints;
    }
}

module.exports = BeamConnectionInfo;
