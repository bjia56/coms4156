const config = require('../config')
const twilio = require('twilio')(
    config.TWILIO_CLIENT_ID,
    config.TWILIO_CLIENT_SECRET
)

const logger = require('../logger')
const Database = require('../sql')

const Follow = Database.Follow
const User = Database.User

var apiCallEnabled = true

async function sendNotifications(author) {
    logger.info('Sending notifications')

    var followers = await Follow.findAll({ where: { followee: author.uuid } })
    for (var i = 0; i < followers.length; i++) {
        var followerInfo = await User.findAll({
            where: { uuid: followers[i].follower },
        })
        if (followerInfo[0].phone == null) {
            logger.info(
                `No phone number for follower ${followerInfo[0].name}, skipping`
            )
            continue
        }

        if (apiCallEnabled) {
            twilio.messages
                .create({
                    body:
                        'Hello, a new blog post from ' +
                        author.name +
                        ' has been posted and is ready for you to read.',
                    to: followerInfo[0].phone, // Text this number
                    from: config.TWILIO_PHONE_NUMBER, // From a valid Twilio number
                })
                .then((message) => console.log(message.sid))

            logger.info(`Created Message for: ${followerInfo[0].name}`)
        } else {
            logger.info(
                `API call disabled, cannot send for: ${followerInfo[0].name}`
            )
        }
    }
}

module.exports = {
    sendNotifications,
    setAPIEnabled: (enabled) => {
        console.log(`Setting Twilio 'apiCallEnabled' to: ${enabled}`)
        apiCallEnabled = enabled
    },
}
