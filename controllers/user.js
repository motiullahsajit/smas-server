const moment = require('moment');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const User = require("../models/user");
const Subscription = require("../models/subscription");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const options = {
  viewEngine: {
    extName: '.handlebars',
    partialsDir: 'templates',
    layoutsDir: 'templates',
    defaultLayout: false,
  },
  viewPath: 'templates',
};

transporter.use('compile', hbs(options));

const sendEmailOnBoarding = async (
  name,
  emailID,
) => {
  const mailOptions = {
    from: '"SMAS" <smasxofficial@gmail.com>',
    to: emailID,
    subject: 'Subscription Confirmation',
    template: 'on-boarding',
    context: {
      fullName: name
    },
  };

  return transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('error', error.message);
    }
  });
};



exports.checkserver = (req, res, next) => {
  return res.json({ success: true, message: 'server running success from user' });
}


exports.register = async (req, res) => {
  try {
    const alredyUsed = await User.find({ email: req.body.email });
    if (alredyUsed.length > 0) {
      return res.status(201).json({ success: false, message: 'Email already used in another account' });
    } else {
      const user = await new User(req.body);
      user.save();

      return res.status(200).json({
        success: true,
        user: user
      });
    }
  }
  catch (err) {
    return res.json({ success: false, err });
  }
};


exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    // console.log('user', user)
    if (user && user.password === req.body.password) {
      return res.status(200).json({
        success: true,
        user: user
      })
    } else {
      return res.status(201).json({ success: false, message: 'Wrong Password' });
    }
  } catch (err) {
    return res.status(403).json({ loginSuccess: false, err: err });
  }
};

exports.allUsers = async (req, res) => {
  try {
    const users = await User.find({})
    return res.status(200).json({
      success: true,
      users: users
    })

  } catch (err) {
    return res.json({ success: false, err });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId })
    return res.status(200).json({
      success: true,
      user: user
    })

  } catch (err) {
    return res.json({ success: false, err });
  }
};



exports.subscriptionReq = async (req, res) => {
  try {
    const subscription = await new Subscription(req.body);
    subscription.save();

    return res.status(200).json({
      success: true,
    });
  }
  catch (err) {
    return res.json({ success: false, err });
  }
};


exports.getSubscription = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ hasResponded: false });
    return res.status(200).json(subscriptions)
  }
  catch (err) {
    return res.status(400).json({ err })
  }
};

exports.subAction = async (req, res, next) => {
  // id, action
  const sub = await Subscription.findById(req.body.subId);
  if (req.body.action === 'pos') {
    sub.hasResponded = true;
    const user = await User.findById(req.body.userId);

    user.subExpirationDate = moment(user.subExpirationDate).add(30, 'days');
    await user.save();
    await sub.save();
    await sendEmailOnBoarding(user.name, user.email);
  } else {
    sub.hasResponded = true;
    await sub.save();
  }
  return res.json({ success: true });
};

