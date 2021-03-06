const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const config = require('./config')

const User = require('./sql').User

passport.use(
    new GoogleStrategy(
        {
            clientID: config.OAUTH20_CLIENT_ID,
            clientSecret: config.OAUTH20_CLIENT_SECRET,
            callbackURL: config.OAUTH20_CALLBACK,
        },
        function (accessToken, refreshToken, profile, cb) {
            var email = profile.emails[0].value
            var name = profile.displayName

            User.findOrCreate({
                where: { email: email },
                defaults: {
                    email: email,
                    name: name,
                    notificationPreference: '',
                },
            }).then((user) => {
                cb(null, { uuid: user[0].uuid })
            })
        }
    )
)

passport.serializeUser((user, cb) => {
    cb(null, JSON.stringify(user))
})

passport.deserializeUser((user, cb) => {
    cb(null, JSON.parse(user))
})

module.exports = passport
