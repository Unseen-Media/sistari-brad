const express = require("express");
const app = express();
const port = 3000;

const https = require("https");
var telnyx = require("telnyx")(
  "XIXWLMD7DIAHQQ6TQOFMVS5JTBS6IXVFY4KHENNWQUWM7TL7GE27IW67JM"
);

var sistareIndex = 192;
var entireSting = "";

const getSistariData = () => {
  entireSting = "";
  https
    .get("https://apaprod.ro/localitatea-brad-" + sistareIndex + "/", (res) => {
      console.log(res.statusCode);
      if (res.statusCode == 200) {
        sendMeAGadDamnMessage();
      }
    })
    .on("error", function (err) {
      console.log(err);
    });
};

getSistariData();
setInterval(getSistariData, 300000);

sendMeAGadDamnMessage = () => {
  telnyx.messages.create(
    {
      from: "+18022327324", // Your Telnyx number
      to: "+40742143131",
      text:
        "Iara iau astia apa. https://apaprod.ro/localitatea-brad-" +
        sistareIndex +
        "/",
    },
    function (err, response) {
      // asynchronously called
      console.log(err.statusCode);
      console.log(response);
      if (err.statusCode !== 401 && response.data.to[0].status == "queued") {
        sistareIndex++;
      }
    }
  );
};

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
