exports.PORT = process.env.PORT || 8080;

exports.DATABASE_URL = process.env.DATABASE_URL || 
                      global.DATABASE_URL || 
                      'mongodb://Admin:password123@ds119088.mlab.com:19088/baker-and-spice';