class Message {
  constructor(platformName, user, message, metadata) {
    this.platformName = platformName;
    this.user = user;
    this.metadata = metadata;
    this.message = message;
  }
}
module.exports = Message;
