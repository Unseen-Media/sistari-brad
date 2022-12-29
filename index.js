const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

const https = require("https");

var axios = require("axios");

var sistareIndex = { value: 192 };

var entireSting = "";

fs.readFile("./nrsistari.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
  sistareIndex.value = parseInt(data);
  console.log(sistareIndex.value);
  if (sistareIndex.value != 192) {
    getSistariData();
  } else {
    fs.writeFile("./nrsistari.txt", String(sistareIndex.value), (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
});

const getSistariData = () => {
  entireSting = "";
  https
    .get(
      "https://apaprod.ro/localitatea-brad-" + sistareIndex.value + "/",
      (res) => {
        console.log(res.statusCode);
        if (res.statusCode == 200) {
          sendMeAGadDamnMessage();
          sistareIndex.value += 1;
          fs.writeFile("./nrsistari.txt", String(sistareIndex.value), (err) => {
            if (err) {
              console.error(err);
            }
          });
        }
      }
    )
    .on("error", function (err) {
      console.log(err);
    });
};

setInterval(getSistariData, 300000);

sendMeAGadDamnMessage = () => {
  var data = JSON.stringify({
    messages: [
      {
        channel: "sms",
        recipients: ["+40742143131"],
        content:
          "Sistare pe localitatea Brad https://apaprod.ro/localitatea-brad-" +
          sistareIndex.value +
          "/",
        msg_type: "text",
        data_coding: "text",
      },
    ],
    message_globals: {
      originator: "SignOTP",
      report_url: "https://the_url_to_recieve_delivery_report.com",
    },
  });
  var config = {
    method: "post",
    url: "https://api.d7networks.com/messages/v1/send",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoLWJhY2tlbmQ6YXBwIiwic3ViIjoiYTM3OTNlN2YtNTdmZi00NmYxLTg0ZGMtNTU4Y2YyMGM0ZjhhIn0.zJLLqcd4QtZREjqgsaV63ERLPPItxS4IFXvxb0GuLaw",
    },
    data: data,
  };
  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
