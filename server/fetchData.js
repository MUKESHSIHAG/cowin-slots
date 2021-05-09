const https = require('https');
const sendMail = require('./sendMail.js')

let dataToSend = []

const APICall = () => {

}

const fetchUserDataAndSendMail = (user) => {
    let today = new Date();
    let nextDate = new Date(today);
    console.log(user);
    nextDate.setDate(today.getDate()+1)
    const date = nextDate.getDate()+'-'+nextDate.getMonth()+'-'+nextDate.getFullYear();
    https.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${user.pincode}&date=${date}`,(res) => {
        let body = "";
        res.on("data", (chunk) => {
            body += chunk;
        });
        res.on("end", () => {
            try {
                let json = JSON.parse(body);
                sendMail(user, json)
            } catch (error) {
                console.error(error.message);
            };
        });
    }).on("error", (error) => {
    console.error(error.message);
    });
}
const fetchData = (users) => {
    users.forEach(user => {
        fetchUserDataAndSendMail(user)
    });
}

module.exports=fetchData