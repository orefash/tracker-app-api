const { MongoClient } = require("mongodb");
const connectionString = "";
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = {

  getDb: function () {
    return client;
  },
};
