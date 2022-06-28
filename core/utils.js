
const axios = require('axios').default;


module.exports = {

  getDb: function () {
    return dbConnection;
  },
};

module.exports = {

    sendPostRequest: async (params) => {        
          try {
              const resp = await axios.post('http://135.148.118.96/cba/webservices/integral.php/', params);
              // console.log(resp.data);
            return resp.data;
          } catch (err) {
              // Handle Error Here
              console.error(err);
            return null;
          }
    },

    otpGenerate: async (n) => {
        var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   
      
        if ( n > max ) {
                return generate(max) + generate(n - max);
        }
      
        max        = Math.pow(10, n+add);
        var min    = max/10; // Math.pow(10, n) basically
        var number = Math.floor( Math.random() * (max - min + 1) ) + min;
      
        return ("" + number).substring(add); 
    }
};