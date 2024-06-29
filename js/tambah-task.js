import { endpointTambahData } from "../js/url.js";
document
  .getElementById("addButton")
  .addEventListener("click", async function (event) {
    event.preventDefault();

    const judul = document.getElementById("judul").value;
    const deskripsi = document.getElementById("deskripsi").value;
    const due_date = document.getElementById("due_date").value;

    if (!judul || !deskripsi || !due_date) {
      Swal.fire({
        icon: "warning",
        title: "Perhatian!",
        text: "Harap isi semua field yang diperlukan.",
      });
      return;
    }

    try {
      const user = await getUserData(); // Dapatkan data pengguna yang sudah login
      if (!user || !user.id_user) {
        throw new Error("User ID tidak ditemukan");
      }
      // Memanggil postData dengan id_user
      postData(judul, deskripsi, due_date, user.id_user);
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  });

function postData(judul, deskripsi, due_date, id_user) {
  const url = endpointTambahData;
  const token = localStorage.getItem("LOGIN"); // Ambil token dari localStorage

  const newData = {
    judul: judul,
    deskripsi: deskripsi,
    due_date: due_date,
    id_user: id_user, // Sertakan id_user di data yang dikirim
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
        window.location.href = "dashboard.html";
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

async function getUserData() {
  const token = localStorage.getItem("LOGIN"); // Gunakan localStorage jika memang token disimpan di sana
  try {
    const response = await fetch("http://127.0.0.1:3000/getme", {
      method: "GET",
      headers: {
        LOGIN: ` ${token}`, // Gunakan Bearer standard untuk token
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message); // Asumsikan response.json() termasuk message jika ada error
    }
    return data.user; // Asumsikan server mengembalikan objek di bawah properti 'user'
  } catch (error) {
    console.error("Error fetching user data:", error);
    Swal.fire({
      icon: "error",
      title: "Gagal mengambil data",
      text: error.message,
    });
    throw error;
  }
}
