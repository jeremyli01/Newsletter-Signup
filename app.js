const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/",function(req, res){
  res.sendFile(__dirname + "/signup.html");
})

mailchimp.setConfig({
  apiKey: "2729e75e8ec2a372923811df5a7c0571-us13",
  server: "us13",
});

app.post("/",function(req, res){
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  const listId = "fa6da746fb";
  const subscribingUser = {
  firstName: firstName,
  lastName: lastName,
  email: email
};

  async function run() {
  const response = await mailchimp.lists.addListMember(listId, {
    email_address: subscribingUser.email,
    status: "subscribed",
    merge_fields: {
      FNAME: subscribingUser.firstName,
      LNAME: subscribingUser.lastName
    }
  });
  res.sendFile(__dirname + "/success.html");
  console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);
}

run().catch(e => res.sendFile(__dirname + "/failure.html"));

});

app.post("/failure",function(req, res){
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
  console.log("server is running on port 3000");
});
//
// 2729e75e8ec2a372923811df5a7c0571-us13
// fa6da746fb
