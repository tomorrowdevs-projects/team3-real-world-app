import createAuth0Client from "@auth0/auth0-spa-js";

// The Auth0 client, initialized in configureClient()
let auth0 = null;

const loginButton = document.getElementById("btn-login");
const logoutButton = document.getElementById("btn-logout");

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
  console.log("updateUI");
  const isAuthenticated = await auth0.isAuthenticated();
  console.log(isAuthenticated);

  document.getElementById("btn-logout").disabled = !isAuthenticated;
  document.getElementById("btn-login").disabled = isAuthenticated;

  if (isAuthenticated) {
    // document.getElementById("gated-content").classList.remove("hidden");
    document.getElementById("upload-content").classList.remove("hidden");
    // document.getElementById("ipt-access-token").innerHTML = await auth0.getTokenSilently();
    document.getElementById("btn-container-login").classList.add("hidden");
    document.getElementById("btn-container-logout").classList.remove("hidden");
    // document.getElementById("ipt-user-profile").textContent = JSON.stringify(await auth0.getUser());
  } else {
    // document.getElementById("gated-content").classList.add("hidden");
    document.getElementById("upload-content").classList.add("hidden");

    document.getElementById("btn-container-login").classList.remove("hidden");
    document.getElementById("btn-container-logout").classList.add("hidden");
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
  file = e.target.files[0];
  const filename = file.name;

  chunks = Math.ceil(file.size / chunkSize);
  fileInfo.innerHTML = "There will be " + chunks + " chunks uploaded";

  await uploadFile(0);
});

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

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
});

function writeData(chunkNumber, token) {
  loading.style.display = "block";

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  axios
    .get(`http://localhost:3000/data/${file.name}/${chunkNumber}`, config)
    .then((response) => {
      console.log(response);
      loading.innerHTML = "Ended";
    })
    .catch((error) => {
      console.log(error);
    });
}
