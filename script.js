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
      if (UV <= 4) {
        UVdivEl.removeClass();
        UVdivEl.addClass("bg-success");
      }
      if (UV <= 8 && UV > 4) {
        UVdivEl.removeClass();
        UVdivEl.addClass("bg-warning");
      }
      if (UV > 8) {
        UVdivEl.removeClass();
        UVdivEl.addClass("bg-danger");
      }
    });
  });

  $.ajax({
    url: query5day,
    method: "GET",
  }).then(function (responseForecast) {
    $("#forecast5Day").empty();
    var title = $("<h2>").addClass("card-title");
    title.text("5 Day Forecast");
    $("#forecast5Day").prepend(title);
    var dateRow = $("<div>").addClass("row date-row");
    title.after(dateRow);

    for (var i = 6; i <= 39; i = i + 8) {
      var a = new Date(responseForecast.list[i].dt * 1000);
      var yearForecast = a.getFullYear();
      var monthForecast = a.getMonth() + 1;
      var dayForecast = a.getDate();
      var tempForecast = (
        (responseForecast.list[i].main.temp - 273.15) * 1.8 +
        32
      ).toFixed(1);
      var humidForecast = responseForecast.list[i].main.humidity;
      var weathIconForecast = responseForecast.list[i].weather[0].icon;
      var weathIconSrcForecast =
        "http://openweathermap.org/img/w/" + weathIconForecast + ".png";
      var dateForecast = monthForecast + "/" + dayForecast + "/" + yearForecast;
      var cardDiv = $("<div>").addClass(
        "card bg-primary date lg-col-2 med-col-4 sm-col-6"
      );
      var dateForecastEl = $("<h5>").addClass("card-title");
      var iconImgForecast = $("<img>").attr({
        src: weathIconSrcForecast,
        alt: "Weather icon",
      });
      var tempForecastEl = $("<p>").addClass("text5day");
      var humidForecastEl = $("<p>").addClass("text5day");
      cardDiv.append(
        dateForecastEl,
        iconImgForecast,
        tempForecastEl,
        humidForecastEl
      );
      $(".date-row").append(cardDiv);
      dateForecastEl.text(dateForecast);
      tempForecastEl.text("Temp: " + tempForecast + " \xB0F");
      humidForecastEl.text("Humidity: " + humidForecast + " %");
    }
  });
}

function renderCityList() {
  $(".list-group").empty();
  for (var i = 0; i < cityList.length; i++) {
    cityListEl = cityList.join();
    var cityListItemEl = $("<li>").addClass("list-group-item");
    cityListItemEl.text(cityList[i]);
    $(".list-group").prepend(cityListItemEl);
  }
}
$(".list-group").on("click", "li", function (event) {
  event.preventDefault();
  $(".date-row").empty();
  makeAjaxCall($(this).text());
});
$(".fa-search").on("click", function (event) {
  event.preventDefault();
  $(".date-row").empty();
  citySearch = $(".form-control").val();
  if (cityList.indexOf(citySearch) === -1) {
    //for when there is no citylist
    cityList.push(citySearch); //append to list
    localStorage.setItem("cityName", JSON.stringify(cityList));
  }
  renderCityList();
  makeAjaxCall(citySearch);
});
