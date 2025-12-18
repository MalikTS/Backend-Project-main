const nodemailer = require('nodemailer');

const defaultConfig = "smtp://domenico1@ethereal.email:tD8NmCfSHXRpuun38X@smtp.ethereal.email"
const poolConfig = "smtp://domenico1@ethereal.email:tD8NmCfSHXRpuun38X@smtp.ethereal.email/?pool=true"

const transporter = nodemailer.createTransport(
    {
        pool: true,
        // service: 'Gmail',
        // maxConnections: 8,
        // socketTimeout: 1000000,
        // maxMessages: 'infinity',
        // rateLimit: 2,
        // rateDelta: 2000,
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            // type: 'OAuth2',
            user: process.env.EMAIL,
            pass: 'tD8NmCfSHXRpuun38X'
            // refreshToken: process.env.EMAIL_REFRESH_TOKEN,
            // clientId: process.env.EMAIL_CLIENT_ID,
            // clientSecret: process.env.EMAIL_CLIENT_SECRET=,
        }
    },

    {
        from: `Mailer Test <${process.env.EMAIL}>`,
    }
)

transporter.verify((error, success) => {
    if(error) console.log(error) 
    console.log('Server is ready to take our messages: ', success)

    // transporter.on('token', token => {
    //     console.log('A new access token was generated');
    //     console.log('User: %s', token.user);
    //     console.log('Access Token %s', token.accessToken);
    //     console.log('Expires: %s', new Date(token.expires));
    // })
})

const mailer = message => {
    transporter.sendMail(message, (err, info) => {
        if(err) return console.log(err)
        console.log('Email sent: ', info)

        // transporter.close()
    })
}


module.exports = mailer
