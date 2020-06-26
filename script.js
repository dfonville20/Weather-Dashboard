var cityList = JSON.parse(localStorage.getItem("cityName")) || [];
var cityListEl = $("list-group");

if (cityList.length == 0) {
  cityList = ["Greensboro"];
  makeAjaxCall(cityList);
} else {
  makeAjaxCall(cityList[cityList.length - 1]);
}
renderCityList();

function makeAjaxCall(citySearch) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    citySearch +
    "&appid=b5c1e045f3d4ca28cc69f6dbe4221e27";
  var query5day =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    citySearch +
    "&appid=b5c1e045f3d4ca28cc69f6dbe4221e27";

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    $("#currentData").empty();
    var realDate = new Date(response.dt * 1000);
    var yearCurr = realDate.getFullYear();
    var monthCurr = realDate.getMonth() + 1;
    var dayCurr = realDate.getDate();
    var dateCurr = monthCurr + "/" + dayCurr + "/" + yearCurr;
    var city = response.name;
    var tempF = ((response.main.temp - 273.15) * 1.8 + 32).toFixed(1);
    var humid = response.main.humidity;
    var windSpeed = response.wind.speed;
    var currCityEl = $("<h2>").addClass("card-title");
    var currTempEl = $("<h6>");
    var currHumidEl = $("<h6>");
    var currWindEl = $("<h6>");
    var currentRow = $("<div>").attr("class", "row");

    currCityEl.text(city + " " + dateCurr);
    currTempEl.text("Temperature: " + tempF + " \xB0F");
    currHumidEl.text("Humidity: " + humid + " %");
    currWindEl.text("Wind Speed: " + windSpeed + " MPH");

    var weathIcon = response.weather[0].icon;
    var weathIconSrc = "https://openweathermap.org/img/w/" + weathIcon + ".png";
    var iconImg = $("<img>").attr({
      src: weathIconSrc,
      alt: "Weather icon",
    });
    $("#currentData").append(currentRow);
    currentRow.append(currCityEl, iconImg);
    currentRow.after(currTempEl);
    currTempEl.after(currHumidEl);
    currHumidEl.after(currWindEl);

    var latNum = response.coord.lat;
    var longNum = response.coord.lon;
    var queryURLUV =
      "https://api.openweathermap.org/data/2.5/uvi?appid=b5c1e045f3d4ca28cc69f6dbe4221e27&lat=" +
      latNum +
      "&lon=" +
      longNum;

    $.ajax({
      url: queryURLUV,
      method: "GET",
    }).then(function (responseUV) {
      var UV = responseUV.value;
      var UVEl = $("<h6>");
      var UVdivEl = $("<div>");
      UVdivEl.attr("id", "UVdiv");
      UVdivEl.text(UV);
      UVEl.text("UV Index: ");
      UVEl.append(UVdivEl);
      currWindEl.after(UVEl);