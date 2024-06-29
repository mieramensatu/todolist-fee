import { endpointRegister } from "../js/url.js";
document
  .getElementById("signInButton")
  .addEventListener("click", function (event) {
    event.preventDefault();

    const fullName = document.getElementById("nama").value;
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const data = {
      nama: fullName,
      email: email,
      username: username,
      password: password,
    };

    fetch(endpointRegister, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Berhasil Register!") {
          Swal.fire({
            icon: "success",
            title: "Pendaftaran Berhasil",
            text: "Anda berhasil mendaftar. Silakan login untuk melanjutkan.",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "index.html";
            }
          });
        } else {
          throw new Error(
            data.message || "Pendaftaran gagal. Silakan coba lagi."
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal Mendaftar",
          text: error.message,
        });
      });
  });
