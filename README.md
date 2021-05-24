# cowin-slots
## Cowin folder stores the code of frontend. I have developed this using Reactjs. To get the details user have to either enter the pincode or district and data field is mandatory
<h5>For the email notification part, I have created a form where user have to enter, name, email and pincode to get the notification</h5>
<p>This user information is stored in firebase, so if you try it on your system, then it may give error beacause I have added the firebase credentail file in .gitignore</p>
<p>To send email I have used nodejs, it's code is in server folder. here first I have connected my application to firebase and fetch all users</p>
<p>After fethching users, each user's data is fetched by their respective pincode and send to their email.</p>

<p>If pincode is entered the data will be fetched by pincode</p>
<p>If you want to fetch the data by disctrict than make sure pincode input is empty and you can select your district and date. the data will be fethed</p>
<p>I have used axios to fetch the data</p>

<h4>How to run</h4>

>**pip install -r requirements.txt**

>**Clone this repo using command: git clone https://github.com/MUKESHSIHAG/cowin-slots.git**

> **After clone chnage directory to cowin-slots: cd cowin-slots**

> **After this install the modules using command: npm install**

>Now run the app using command: npm start

> **App will be started on <a href="https://localohost:3000">https://localohost:3000</a>**

<h3>Below image shows the main page, here information is fetched by pincode, because the toggel "fetch data by district" is not selected/h3>
<br></br>
<img src="https://user-images.githubusercontent.com/33174056/119399144-25f93d80-bcf6-11eb-9b7b-773fc2390c3b.png" />
<br></br>
<h3>Below image shows slots information fetched by district, because toggel is selected now/h3>
 <br></br>
<img src="https://user-images.githubusercontent.com/33174056/119399198-3ad5d100-bcf6-11eb-9f29-371b5a9bf202.png" />

<h3>Below image show the form where user can enter their details for email notification</h3>

<img src="https://user-images.githubusercontent.com/33174056/117564958-82d8df00-b0cc-11eb-931d-eaf15950f95a.png" />
