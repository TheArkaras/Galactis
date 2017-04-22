class gamewisp() {
    constructor() {}

    GetSubscribers(callback)
    {
        var params = {
            access_token: "CHANNEL_ACCESS_TOKEN",
            limit: 1,
            order: 'desc',
            status: 'active',
            include: 'user'
        };

        $.getJSON('https://api.gamewisp.com/pub/v1/channel/subscribers/', params, function(json) {
            console.log(json);
        });
    }
}

module.exports = gamewisp;
