const express = require("express");
const { statusCode } = require("http");
const bodyParser = require("body-parser");

const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const query = req.body.cityName;
  const apikey = "47626f0250eadd8057bb50c66e2b7885";
  const units = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apikey +
    "&units=" +
    units;

  https.get(url, function (response) {
    console.log(response, response.statusCode);

    response.on("data", function (data) {
      const weatherdata = JSON.parse(data);
      const temp = weatherdata.main.temp;
      const weather = weatherdata.weather[0].description;
      const icon = weatherdata.weather[0].icon;
      const imageurl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.set("Content-Type", "text/html");

      res.write(
        " The temperature and weather in " +
          query +
          " is " +
          temp +
          " and " +
          weather
      );

      res.write("<img src=" + imageurl + ">");
      res.send();
    });
  });
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
