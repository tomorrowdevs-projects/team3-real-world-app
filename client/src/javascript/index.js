import createAuth0Client from "@auth0/auth0-spa-js";

// The Auth0 client, initialized in configureClient()
let auth0 = null;

const loginButton = document.getElementById("btn-login");
const logoutButton = document.getElementById("btn-logout");
const button = document.querySelector(".btn");
const heading = document.querySelector(".heading");
const mainApp = document.querySelector(".main-app");
const uploadContent = document.getElementById("upload-content");

loginButton.addEventListener("click", async () => {
  await login();
});

logoutButton.addEventListener("click", () => {
  logout();
});

const fetchAuthConfig = () => fetch("./auth_config.json");

const configureClient = async () => {
  const response = await fetchAuthConfig();
  const config = await response.json();

  auth0 = await createAuth0Client({
    domain: config.domain,
    client_id: config.clientId,
    audience: config.audience,
  });
};

window.onload = async () => {
  await configureClient();

  // NEW - update the UI state
  updateUI();

  const isAuthenticated = await auth0.isAuthenticated();

  if (isAuthenticated) {
    // show the gated content
    return;
  }

  // NEW - check for the code and state parameters
  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    // Process the login state
    await auth0.handleRedirectCallback();

    updateUI();

    // Use replaceState to redirect the user away and remove the querystring parameters
    window.history.replaceState({}, document.title, "/");
  }
};

const updateUI = async () => {
  const isAuthenticated = await auth0.isAuthenticated();
  console.log(isAuthenticated);

  document.getElementById("btn-logout").disabled = !isAuthenticated;
  document.getElementById("btn-login").disabled = isAuthenticated;

  if (isAuthenticated) {
    document.getElementById("btn-container-login").classList.add("hidden");
    document.getElementById("btn-container-logout").classList.remove("hidden");

    // hide button
    button.classList.add("hidden");
    heading.classList.add("hidden");
    mainApp.classList.remove("hidden");
  } else {

    document.getElementById("btn-container-login").classList.remove("hidden");
    document.getElementById("btn-container-logout").classList.add("hidden");

    button.classList.remove("hidden");
    heading.classList.remove("hidden");
    mainApp.classList.add("hidden");
  }
};

const login = async () => {
  await auth0.loginWithRedirect({
    redirect_uri: window.location.origin,
    // redirect_uri: "http://localhost:8080/upload.html",
  });
};

const logout = () => {
  auth0.logout({
    returnTo: window.location.origin,
  });
};

import "../assets/styles/index.css";

const axios = require("axios");
const input = document.querySelector("#input");
const fileInfo = document.querySelector("#file-info");
const loading = document.querySelector("#loading");

//break into 10 MB chunks
const chunkSize = 1024 * 1024 * 10;
var chunks = 0;
var file = "";

input.addEventListener("change", async (e) => {
  uploadContent.classList.remove("hidden");
  file = e.target.files[0];

  chunks = Math.ceil(file.size / chunkSize);
  fileInfo.innerHTML = "There will be " + chunks + " chunks uploaded";

  await uploadFile(0);
});

const CancelToken = axios.CancelToken;
// const source = CancelToken.source();

let source;

var chunkNumber = 0;

async function uploadFile(start) {
  chunkNumber++;
  const formData = new FormData();
  const nextChunk = start + chunkSize + 1;
  const currentChunk = file.slice(start, nextChunk);
  const uploadedChunck = start + currentChunk.size;

  formData.append("file", currentChunk);
  formData.append("filename", file.name);
  formData.append("nextSlice", nextChunk);

  const token = await auth0.getTokenSilently();

  console.log("uploadFile");
  source = CancelToken.source();

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
    //Listen for the onuploadprogress event
    onUploadProgress: function (progressEvent) {
      if (file.size < chunkSize + 1) {
        var percent = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        );
      } else {
        var percent = Math.round((uploadedChunck / file.size) * 100);
      }
      document.querySelector("#progress").setAttribute("value", percent);
    },
    cancelToken: source.token,
  };
  
  axios
    .post(
      `http://localhost:3000/upload/${file.name}/${chunkNumber}`,
      formData,
      config
    )
    .then((response) => {
      if (nextChunk < file.size) {
        uploadFile(nextChunk);
      } else {
        console.log("terminato");
        console.log(response);
        // Calls the API to write the data in the DB
        writeData(response.data.chunkNumber, token);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

const cancelUploadBtn = document.querySelector("#cancelUploadBtn");
cancelUploadBtn.addEventListener("click", (e) => {
  e.preventDefault();
  source.cancel("Upload cancelled");
  input.value = "";
  document.querySelector("#progress").value = 0;
  document.querySelector("#progress").max = 100;
  fileInfo.innerHTML = "";
});

function writeData(chunkNumber, token) {
  // loading.style.display = "block";

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  axios
    .get(`http://localhost:3000/data/${file.name}/${chunkNumber}`, config)
    .then((response) => {
      console.log(response);
      // loading.innerHTML = "Ended";
    })
    .catch((error) => {
      console.log(error);
    });
}

const filterOrders = document.getElementById("filterOrders");
const dateFrom = document.getElementById("dateFrom");
const dateTo = document.getElementById("dateTo");
const error = document.getElementById("error");

const validateDate = (from, to) => {
  let validate = "";

  if (from === "" || to === "") {
    validate = "Check input fields";
  } else if (from > to) {
    validate = "The first date has to be grater than the second one";
  }

  return validate;
};

const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const from = dateFrom.value;
  const to = dateTo.value;
  const message = validateDate(from, to);

  if (message === "") {
    await getOrders(from, to);
    await getUsers(from, to);
    await getTotalOrders(from, to);
  } else {
    error.innerHTML = message;
  }
});

filterOrders.addEventListener("click", async (e) => {
  e.preventDefault();

  const from = dateFrom.value;
  const to = dateTo.value;
  const message = validateDate(from, to);

  if (message === "") {
    await getOrders(from, to);
  } else {
    error.innerHTML = message;
  }

});

async function getOrders(dateMin, dateMax) {
  const token = await auth0.getTokenSilently();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  axios
    .get(`http://localhost:3000/orders/${dateMin}/${dateMax}`, config)
    .then((response) => {
      console.log(response.data);
      document.getElementById("numberOrders").innerHTML = response.data.ordersCount;
      document.getElementById("turnover").innerHTML = response.data.total + " $";
    })
    .catch((error) => {
      console.log(error);
    });
}

// const filterUsers = document.getElementById("filterUsers");
// filterUsers.addEventListener("click", async (e) => {
//   e.preventDefault();
//   await getUsers("2022-03-12", "2022-03-13");
// });

async function getUsers(dateMin, dateMax) {
  const token = await auth0.getTokenSilently();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  axios
    .get(`http://localhost:3000/users/${dateMin}/${dateMax}`, config)
    .then((response) => {
      console.log(response.data);
      document.getElementById("numberUsers").innerHTML = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

// const filterTotalOrders = document.getElementById("filterTotalOrders");
// filterTotalOrders.addEventListener("click", async (e) => {
//   e.preventDefault();
//   await getTotalOrders("2022-03-12", "2022-03-13");
// });

async function getTotalOrders(dateMin, dateMax) {
  const token = await auth0.getTokenSilently();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  axios
    .get(`http://localhost:3000/total-orders/${dateMin}/${dateMax}`, config)
    .then((response) => {
      console.log(response.data);
      document.getElementById("totalOrders").innerHTML = response.data + " $";
    })
    .catch((error) => {
      console.log(error);
    });
}
