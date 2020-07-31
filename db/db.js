const mongoose = require("mongoose")

const connectionString = 'mongodb://localhost/letsTalk';

//connect node to mongoose
mongoose.connect(connectionString, { useNewUrlParser: true,
                                     useUnifiedTopology: true,
                                     useCreateIndex: true
                                     });


//connection event
mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to ${connectionString}`);
});

//error event
mongoose.connection.on('error', (err) => {
  console.log(`Mongoose connected error ${err}`);
});

//disconnect event
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

mongoose.set('useUnifiedTopology', true)