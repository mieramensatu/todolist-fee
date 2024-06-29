import { endpointLogin } from "../js/url.js";

document
  .getElementById("signInButton")
  .addEventListener("click", function (event) {
    event.preventDefault();

    const emailOrUsername = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const data = {
      username: emailOrUsername,
      password: password,
    };

    fetch(endpointLogin, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Password salah. Silakan coba lagi.");
          } else {
            throw new Error(
              "Terjadi kesalahan pada server. Silakan coba lagi nanti."
            );
          }
        }
        return response.json();
      })
      .then((data) => {
        if (data.token) {
          localStorage.setItem("LOGIN", data.token);
          document.cookie = `LOGIN=${data.token};path=/;max-age=3600`;
          return getUserDetails(data.token); // Get user details with the token
        } else {
          throw new Error("Token tidak diterima");
        }
      })
      .then((user) => {
        if (user.id_role === 1) {
          window.location.href = "dashboard-admin.html";
        } else if (user.id_role === 2) {
          window.location.href = "dashboard.html";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Error Login",
          text: error.message,
        });
      });
  });

function getUserDetails(token) {
  return fetch("http://127.0.0.1:3000/getme", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      LOGIN: ` ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      return response.json();
    })
    .then((data) => data.user)
    .catch((error) => {
      console.error("Error fetching user data:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to fetch user data",
        text: error.message,
      });
      throw error;
    });
}
