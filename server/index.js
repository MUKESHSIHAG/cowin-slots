const express = require('express')
var cors = require('cors')
var admin = require("firebase-admin");
const app = express()
const port = 3001
const serviceAccount = require("./permission.json");
const fetchData = require('./fetchData.js')
app.use(cors())


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:"https://cowin-22ca3.firebaseio.com/"
});

const db = admin.firestore();

const fetchUsers = () => (() => {
  try {
      let response = [];
      let query = db.collection('users');
      query.get().then(querySnapshot => {
      let docs = querySnapshot.docs;
      for (let doc of docs) {
          const selectedItem = {
              id: doc.id,
              name: doc._fieldsProto.name.stringValue,
              pincode: doc._fieldsProto.pincode.stringValue,
              email: doc._fieldsProto.email.stringValue
          };
          response.push(selectedItem);
        }
        fetchData(response)
        // console.log(response);
      });
    } catch (error) {
      console.log(error);
    }
  })();
fetchUsers()

app.get('', cors(), function (req, res, next) {
  res.json({msg: 'App is running'})
})

app.listen(port, () => {
  console.log(`nodemailerProject is listening at http://localhost:${port}`)
})