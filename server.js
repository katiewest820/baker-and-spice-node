const express = require ('express');
const morgan = require ('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const {CLIENT_ORIGIN} = require('./config');
const app = express();
const mongoose = require('mongoose');
const {DATABASE_URL, PORT} = require ('./config');
const authRoutes = require('./routes/authRoute');
const recipeRoutes = require('./routes/recipeRoute');
const pantryRoutes = require('./routes/pantryRoute');
const apiRequest = require('./routes/apiCallRoutes');
const path = require('path');

app.use(morgan('common'));
app.use(bodyParser.json());

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
)

app.get('/', (req, res) => {
  res.sendFile(_dirname + '../baker-and-spice-react/public/index.html').status(200);
});

//app.use('/static', express.static(path.join('public')))
app.use('/images', express.static(path.join(__dirname, 'public')))
//app.use('/images', express.static(__dirname + '/public'))


app.all('/');
app.use('/auth', authRoutes);
app.use('/recipe', recipeRoutes);
app.use('/pantry', pantryRoutes);
app.use('/apiRequest', apiRequest);

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl); //{ useMongoClient: true });
    let db = mongoose.connection;
    db.on('error', err => {
      console.log(err)
      mongoose.disconnect();
      reject(err);

    });
    db.once('open', () => {
      console.log(`Connected to a database ${databaseUrl}`)
    });
    server = app.listen(port, () => {
      console.log(`your server is running on port: ${PORT}`);
      resolve();
    });
  });
}

function closeServer(){
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('closing server');
      server.close(err => {

        if(err) {
          return reject(err);
        }
        resolve();
        //process.exit(0)
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.log(`internal server error: ${err}`).status(500));
}

module.exports = { app, runServer, closeServer };
