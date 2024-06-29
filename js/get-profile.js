import { endpointGetProfile } from "../js/url.js";
function fetchDataFromEndpoint() {
  const url = endpointGetProfile;
  const token = localStorage.getItem("LOGIN") || "";

  if (token) {
    fetch(url, {
      method: "GET",
      headers: {
        LOGIN: `${token}`,
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Terjadi kesalahan saat mengambil data. Silakan coba lagi."
          );
        }
        return response.json();
      })
      .then((data) => {
        updateUI(data.user);
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          icon: "warning",
          title: "Perhatian!",
          text: error.message,
        });
      });
  } else {
    Swal.fire({
      icon: "warning",
      title: "Perhatian!",
      text: "Anda belum login. Silakan login terlebih dahulu.",
    }).then(() => {
      window.location.href = "index.html";
    });
  }
}
function updateUI(profile) {
  const nama = document.querySelector(".fw-semibold");
  const email = document.querySelector(".text-muted");

  const welcomeText = document.querySelector(".text-body");
  if (welcomeText) {
    welcomeText.textContent = ` ${profile.nama}` || ""; // Menambahkan nama pengguna
  }

  if (nama) {
    nama.textContent = ` ${profile.nama}` || ""; // Menambahkan nama pengguna
  }
  if (email) {
    email.textContent = ` ${profile.email}` || ""; // Menambahkan nama pengguna
  }
  // Opsional: Tambahkan email jika diperlukan di tempat lain
}

fetchDataFromEndpoint();
