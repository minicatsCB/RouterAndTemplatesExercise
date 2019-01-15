// Application div
const appDiv = "app";

function renderRoot(){
    let myDiv = document.getElementById(appDiv);
    myDiv.innerHTML = "";
    let div = createRootMarkup();
    myDiv.innerHTML = div;
    return myDiv;
}

async function renderAllStations(){
    let myDiv = document.getElementById(appDiv);
    myDiv.innerHTML = "";

    var data = await getAllStations();
    var markup = createAllStationsMarkup(data);
    myDiv.innerHTML = markup;
    return myDiv;
}

async function renderOneStation(stationId) {
    let myDiv = document.getElementById(appDiv);
    myDiv.innerHTML = "";

    var data = await getOneStation(stationId);
    var markup = createOneStationMarkup(data);
    myDiv.innerHTML = markup;
    return myDiv;
}

function renderPageNotFound() {
  let myDiv = document.getElementById(appDiv);
  myDiv.innerHTML = "";
  let div = createPageNotFoundMarkup();
  myDiv.innerHTML = div;
  return myDiv;
}

let resolveRoute = (route) => {
  let re1 = /^\/?station\/?$/gmi;
  let re2 = /^\/?station\/[A-Z0-9]+$/gmi;
  if(re1.test(route)) {
    console.log("Going to all stations");
    renderAllStations();
  } else if (re2.test(route)) {
    // Retrieve station ID
    let stationId = route.slice(1).split("/")[1];
    console.log("Going to one station with ID: ", stationId);
    renderOneStation(stationId);
  }
  else if(route === "" || route === "/") {
    console.log("Going to root");
    renderRoot();
  }
  else {
    console.log("404. Route " + route + " not defined");
    renderPageNotFound();
  }
}

let router = (evt) => {
    const hash = window.location.hash.slice(1);
    resolveRoute(hash);
}

function createRootMarkup() {
  var markup = replaceNullData `
      <h1>This is root</h1>
      <p>Wherever you are in this site, try to
      add after <em>app.html</em> in the URL bar the following:</p>
      <ul>
          <li>
            <p><code>#/</code> to go to root</p>
          </li>
          <li>
            <p><code>#/station</code> to see all available stations</p>
          </li>
          <li>
            <p><code>#/station/id</code> to see the specified station (for example,
            the station <code>id</code> could be "S004")</p>
          </li>
      </ul>
  `;

  return markup;
}

function getAllStations() {
    var url = "http://airemad.com/api/v1/station/";
    return requestData(url);
}

function createAllStationsMarkup(stations) {
    // <a href='#'>Go Back to Index</a>

    var markup = replaceNullData `
        <h5 class="mb-1">All stations</h5>
        ${stations.map((station, i) => `
            <ul class="list-group list-group-flush">
              <li class="list-group-item">
                  <p class="font-weight-bold text-dark"></p><span>${station.id}</span>
                  <p class="font-weight-bold text-dark"></p><span>${station.nombre_estacion}</span>
              </li>
            </ul>
            `
        ).join("")}
    `;

    return markup;
}

function getOneStation(stationId) {
    var url = `http://airemad.com/api/v1/station/${stationId}`;
    return requestData(url);
}

function createOneStationMarkup(station) {
    var markup = replaceNullData `
            <h5 class="mb-1">One station</h5>
            <div>
                <p class="font-weight-bold text-dark"></p><span>${station.id}</span>
                <p class="font-weight-bold text-dark"></p><span>${station.nombre_estacion}</span>
            </div>
    `;

    return markup;
}

function createPageNotFoundMarkup() {
  var markup = replaceNullData `
      <div id="notfound">
        <div class="notfound">
          <div class="notfound-404">
            <h1>
              4<span></span>4
            </h1>
          </div>
          <h2>Oops! Page Not Be Found</h2>
          <p>Sorry but the page you are looking for does not exist, have been removed, name changed or is temporarily unavailable</p>
          <a href="#">Back to homepage</a>
        </div>
      </div>
  `;

  return markup;
}

function replaceNullData(strings, ...parts) {
    var checkedMarkup = "";
    parts.forEach((part, index) => {
        if (part === null) {
            part = "data not available";
        }

        checkedMarkup += strings[index] + part;
    });

    return checkedMarkup + strings[strings.length - 1];
}

window.addEventListener("load", router);
window.addEventListener("hashchange", router);
