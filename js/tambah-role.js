import { endpointInsertRoles } from "../js/url.js";
document
  .getElementById("addButton")
  .addEventListener("click", async function (event) {
    event.preventDefault();

    const id_role = document.getElementById("id_role").value;
    const nama = document.getElementById("nama").value;

    if (!id_role || !nama) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian!",
        text: "Harap isi semua field yang diperlukan.",
      });
      return;
    }

    try {
      postData(id_role, nama);
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  });

function postData(id_role, nama) {
  const url = endpointInsertRoles;
  const token = localStorage.getItem("LOGIN"); // Ambil token dari localStorage

  const newData = {
    id_role: parseInt(id_role),
    nama: nama,
  };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      LOGIN: ` ${token}`, // Gunakan Bearer token yang benar
    },
    body: JSON.stringify(newData),
  })
    .then(handleResponse) // Menangani response lebih baik di fungsi terpisah
    .catch(handleError); // Menangani error juga di fungsi terpisah
}

function handleResponse(response) {
  if (!response.ok) {
    return response.json().then((data) => {
      throw new Error(data.message || "Network response was not ok");
    });
  }
  return response.json().then((data) => {
    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Data berhasil ditambahkan",
      confirmButtonText: "Lihat Dashboard",
      showCancelButton: true,
      cancelButtonText: "Tetap di Halaman Ini",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "dashboard-role.html";
      }
    });
  });
}

function handleError(error) {
  console.error("Error:", error);
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: error.message,
  });
}

// async function getUserData() {
//   const token = localStorage.getItem("LOGIN"); // Gunakan localStorage jika memang token disimpan di sana
//   try {
//     const response = await fetch("http://127.0.0.1:3000/getme", {
//       method: "GET",
//       headers: {
//         LOGIN: ` ${token}`, // Gunakan Bearer standard untuk token
//         "Content-Type": "application/json",
//       },
//     });
//     const data = await response.json();
//     if (!response.ok) {
//       throw new Error(data.message); // Asumsikan response.json() termasuk message jika ada error
//     }
//     return data.user; // Asumsikan server mengembalikan objek di bawah properti 'user'
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     Swal.fire({
//       icon: "error",
//       title: "Gagal mengambil data",
//       text: error.message,
//     });
//     throw error;
//   }
// }
