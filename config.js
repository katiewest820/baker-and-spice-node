exports.PORT = process.env.PORT || 8080;

exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

exports.DATABASE_URL = process.env.DATABASE_URL || 
                      global.DATABASE_URL || 
                      'mongodb://Admin:password123@ds119088.mlab.com:19088/baker-and-spice';

exports.JWT_SECRET = process.env.JWT_SECRET || 'izzy west';

exports.TESTING_DATABASE_URL = process.env.TESTING_DATABASE_URL || 
                                global.TESTING_DATABASE_URL ||
                                'mongodb://Admin:password123@ds239988.mlab.com:39988/testing-baker-and-spice';
