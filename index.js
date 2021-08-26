const express = require('express');
const authRoutes = require('./routes/authRoutes');
require('./models/User');
require('./services/passport');
require('./models/Survey');
const surveyRoutes = require('./routes/surveyRoutes');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
const app = express();
const mongoose = require('mongoose');
const billingRoutes = require('./routes/billingRoutes');
const bodyParser = require('body-parser');

mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);
app.use(passport.initialize());
app.use(passport.session());
authRoutes(app);
billingRoutes(app);
surveyRoutes(app);
mongoose.connect(keys.mongoURI);

if ((process.env.NODE_ENV = 'production')) {
  app.use(express.static('client/build'));
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
const PORT = process.env.PORT || 5000;
app.listen(PORT);
