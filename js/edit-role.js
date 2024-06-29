import { endpointGetByIdRoles, endpointUpdateByIdRoles } from "../js/url.js";
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const role = await getroleById(); // Get the current role data to fill in the form
    if (role) {
      document.getElementById("id_role").value = role.id_role || "";
      document.getElementById("nama").value = role.nama || "";
    }
  } catch (error) {
    console.error("Error loading role data:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message,
    });
  }
});

async function getroleById() {
  const roleId = localStorage.getItem("currentroleId");
  if (!roleId) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No role ID found.",
    });
    return;
  }

  const url = endpointGetByIdRoles + `id_role=${roleId}`;
  const token = localStorage.getItem("LOGIN");

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        LOGIN: ` ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch role");
    }
    return data.data; // Return the role data
  } catch (error) {
    console.error("Error fetching role data:", error);
    Swal.fire({
      icon: "error",
      title: "Failed to fetch role",
      text: error.message,
    });
  }
}

document
  .getElementById("addButton")
  .addEventListener("click", async function (event) {
    event.preventDefault();
    const id_role = document.getElementById("id_role").value;
    const nama = document.getElementById("nama").value;

    try {
      await postData(id_role, nama);
    } catch (error) {
      console.error("Error updating role:", error);
      Swal.fire({
        icon: "error",
        title: "Error updating role",
        text: error.message,
      });
    }
  });

async function postData(id_role, nama) {
  const roleId = localStorage.getItem("currentroleId");
  const url = endpointUpdateByIdRoles + `${roleId}`;
  const token = localStorage.getItem("LOGIN");

  const newData = {
    id_role: parseInt(id_role),
    nama: nama,
  };

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      LOGIN: ` ${token}`,
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
