const axios = require("axios")
const input = document.querySelector("#input")

input.addEventListener("change", (e) => {
  const dataToSend = e.target.files[0]
  const formData = new FormData()

  formData.append("file", dataToSend)

  callBackend(formData)
})

// func to call backend
function callBackend(formData) {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
  axios
    .post("http://localhost:3000/upload", formData, config)
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {
      console.log(error)
    })
}
