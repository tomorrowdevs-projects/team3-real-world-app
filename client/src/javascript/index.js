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

const fetchAuthConfig = () => fetch("http://localhost:3000/auth_config.json");

const configureClient = async () => {
  const response = await fetchAuthConfig();
  const config = await response.json();

  auth0 = await createAuth0Client({
    domain: config.domain,
    client_id: config.clientId,
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
  console.log(auth0);
  const isAuthenticated = await auth0.isAuthenticated();
  console.log(isAuthenticated);

  document.getElementById("btn-logout").disabled = !isAuthenticated;
  document.getElementById("btn-login").disabled = isAuthenticated;

  if (isAuthenticated) {
    document.getElementById("gated-content").classList.remove("hidden");

    document.getElementById(
      "ipt-access-token"
    ).innerHTML = await auth0.getTokenSilently();

    document.getElementById("ipt-user-profile").textContent = JSON.stringify(
      await auth0.getUser()
    );

  } else {
    document.getElementById("gated-content").classList.add("hidden");
  }
};

const login = async () => {
  await auth0.loginWithRedirect({
    // redirect_uri: window.location.origin,
    redirect_uri: "http://localhost:8081/upload.html"
  });
};

const logout = () => {
  auth0.logout({
    returnTo: window.location.origin
  });
};
