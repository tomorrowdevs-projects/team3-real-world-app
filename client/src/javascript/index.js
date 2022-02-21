import "../assets/styles/general.css";

const axios = require("axios");
const input = document.querySelector("#input");
const fileInfo = document.querySelector("#file-info");
const loading = document.querySelector("#loading");

//break into 10 MB chunks
const chunkSize = 1024 * 1024 * 10;
var chunks = 0;
var file = "";

input.addEventListener("change", (e) => {
  file = e.target.files[0];
  const filename = file.name;

  chunks = Math.ceil(file.size / chunkSize);
  fileInfo.innerHTML = "There will be " + chunks + " chunks uploaded";

  uploadFile(0);
});

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

var chunkNumber = 0;

function uploadFile(start) {
  chunkNumber++;
  const formData = new FormData();
  const nextChunk = start + chunkSize + 1;
  const currentChunk = file.slice(start, nextChunk);
  const uploadedChunck = start + currentChunk.size;

  formData.append("file", currentChunk);
  formData.append("filename", file.name);
  formData.append("nextSlice", nextChunk);

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    //Listen for the onuploadprogress event
    onUploadProgress: function (progressEvent) {
      if (file.size < chunkSize + 1) {
        var percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
      } else {
        var percent = Math.round((uploadedChunck / file.size) * 100);
      }
      document.querySelector("#progress").setAttribute("value", percent);
    },
    cancelToken: source.token,
  };

  axios
    .post(`http://localhost:3000/upload/${file.name}/${chunkNumber}`, formData, config)
    .then((response) => {
      if (nextChunk < file.size) {
        uploadFile(nextChunk);
      } else {
        console.log("terminato");
        console.log(response);
        // Calls the API to write the data in the DB
        writeData(response.data.chunkNumber);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

const cancelUploadBtn = document.querySelector("#cancelUploadBtn");
cancelUploadBtn.addEventListener("click", () => {
  source.cancel();
});

function writeData(chunkNumber) {
  loading.style.display = "block";

  axios
    .get(`http://localhost:3000/data/${file.name}/${chunkNumber}`)
    .then((response) => {
      console.log(response);
      loading.innerHTML = "Ended";
    })
    .catch((error) => {
      console.log(error);
    });
}
