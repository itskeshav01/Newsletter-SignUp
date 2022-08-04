//Requiring mailchimp's module
//For this we need to install the npm module @mailchimp/mailchimp_marketing. To do that we write:
//npm install @mailchimp/mailchimp_marketing
const mailchimp = require("@mailchimp/mailchimp_marketing");
//Requiring express and body parser and initializing the constant "app"
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
//Using bod-parser
app.use(bodyParser.urlencoded({ extended: true }));
//The public folder which holds the CSS
app.use(express.static("public"));
//Sending the signup.html file to the browser as soon as a request is made on localhost:3000
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});
//Setting up MailChimp
mailchimp.setConfig({
    //*****************************ENTER YOUR API KEY HERE******************************
    apiKey: "417c43c940d8e4da7359ec6b064102cd-us18",
    //*****************************ENTER YOUR API KEY PREFIX HERE i.e.THE SERVER******************************
    server: "us18"
});
//As soon as the sign in button is pressed execute this
app.post("/", function (req, res) {
    //*****************************CHANGE THIS ACCORDING TO THE VALUES YOU HAVE ENTERED IN THE INPUT ATTRIBUTE IN HTML******************************
    const firstName = req.body.firstName;
    const secondName = req.body.lastName;
    const email = req.body.email;
    //*****************************ENTER YOU LIST ID HERE******************************
    const listId = "6d72189d08";
    //Creating an object with the users data
    const subscribingUser = {
        firstName: firstName,
        lastName: secondName,
        email: email
    };
    //Uploading the data to the server
    async function run() {
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
            }
        });
        res.sendFile(__dirname + "/success.html")
        console.log(
       `Successfully added contact as an audience member. The contact's id is ${
        response.id
        }.`);
    }
    run().catch(e => res.sendFile(__dirname + "/failure.html"));
});

app.post("/failure", function(req, res){
    res.redirect("/");
})


app.listen(process.env.PORT || 3000, function () {
    console.log("server is running on port 3000");
})


// api key = 417c43c940d8e4da7359ec6b064102cd-us18
// list key = 6d72189d08