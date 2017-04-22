const config = require('./config/index.json');
const UserAlias = require('./database/useralias');
const database = require('./database/database');
const beam = require('./beam/Beam');
const revlo = require('./revlo/revlo')
// const Gamewisp = require('./gamewisp/gamewisp')

// var gamewisp = Gamewisp();
// gamewisp.GetSubscribers();

//Load object with config values.
var db = new database(config.DatabaseName);
var Beam = new beam(config.BeamAccessKey);
var revloClient = new revlo(config.RevloApiKey);


Beam.registerCommand("!points", SendCurrentRevloPoints);
Beam.registerCommand("!addalias", AddAlias);
Beam.registerCommand("!removealias", RemoveAlias);

dowork();

setInterval(interval => {
    dowork();
},
// 5 min interval.&
300000);

function dowork() {
    Beam.GetUsers().then(users => {
        for (let user of users) {
          console.log(`checking db for user ${user.userName}`);
            db.get(`alias.${user.userName}`)
            .then(GiveUserPoints)
            .catch(FailedToFindUser);
        }
    });
}

function GiveUserPoints(user)
{
  revloClient.GiveUserPoints(user.userName, 5);
}

function FailedToFindUser(user)
{
  console.log(`Couldn't Find ${user} to give pointS!`)
}

function SendCurrentRevloPoints(message)
{
  let currentpoints = revloClient.GetCurrentUserPoints(message.user).then(points =>
  {
    Beam.SendMessage(`${message.user} has ${points}`);
  });

}

function AddAlias(message)
{
  var alias = message.message.split(" ")[1];

  console.log(`Adding alias for ${message.user} to twitch name ${alias}`);
  var localUser = new UserAlias(message.user, message.platformName, alias, Date.Now);
  db.put(localUser).then(() =>{
    Beam.SendMessage(`Added Twitch Alias ${alias} for ${message.user}`);
  }).catch(() => {
    Beam.SendMessage(`Alias Already Exists!`);
  });
}

function RemoveAlias(message)
{
  console.log(`removing alias for ${message.user}`);
  db.remove(`alias.${message.user}`).then( () =>
  {
    Beam.SendMessage(`Removed Alias for ${message.user}`);
  });
}
