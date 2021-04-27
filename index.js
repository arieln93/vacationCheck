const request = require('request')
const twilio = require('twilio')
const express = require('express')
const app = express()
const port = 8080
const lastCheck = '...'
app.listen(port, () => {
    console.log('app is listening on port', port)
})
app.get('/', (req, res) => {
    console.log('dd')
    res.send('last check' + lastCheck)
})
const sendSMS = async (text) => {
    var client = new twilio("AC40dc8233547dc2aca2a408fa84d8543a", "bc06c4ac3996238bda08c992a2284103")
    const resp1 = await client.messages.create({
        to: '+9720507890770',
        from: '+13522898944',
        body: text,
    })
    console.log(resp1)
    const resp2 = await client.messages.create({
        to: '+972544437629',
        from: '+13522898944',
        body: text,
    })
    console.log(resp2)
}
const getDatesFromAPI = () => {
  return new Promise(function (resolve, reject) {
    request('https://borderpay.metropolinet.co.il/umbraco/surface/OrderFormSurface/GetDisabledOutDates?borderId=3&maxOutForDay=450', function (error, res, body) {
      if (!error && res.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}
const checkDatesUpdate = async () => {
    const time = new Date()
    const desiredDate = "2021-04-30T00:00:00"
    console.log('check for dates update', time.toString())
    try {
        const resp = await getDatesFromAPI()
        const datesArray = JSON.parse(resp).replace('[','').replace(']','').replace(/"/g,'').split(',')
        if (!datesArray.includes(desiredDate)){
            console.log('found!')
            await sendSMS('2021-04-30 is available! go get your pass card to Sinai!')
            clearInterval(i)
            return
        } else {
            const datePos = datesArray.indexOf(desiredDate)
            console.log('Not yet', datesArray[datePos])
        }
    } catch (ex) {
        console.log(ex)
        clearInterval(i)
        sendSMS('Error in script!')
        return
    }
}
//sendSMS("Hello! you've been subscribed to Get Sinai Updates! You'll get an SMS once the 2021-04-30 will be available. Meowwwwww")
const i = setInterval(() => checkDatesUpdate(), 180000)