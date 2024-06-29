import { endpointGetTasks, endpointGetIdTask } from "../js/url.js";
function fetchDataFromEndpoint() {
  const url = endpointGetTasks;
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
        updateTable(data.data);
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
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function updateTable(tasks) {
  const tableBody = document.querySelector(".table tbody");
  tableBody.innerHTML = "";
  tasks.forEach((task) => {
    const formattedDueDate = formatDate(task.due_date);

    const row = `<tr>
      <td><i class="fab fa-bootstrap fa-lg text-primary me-3"></i><strong>${
        task.judul
      }</strong></td>
      <td>${task.deskripsi}</td>
      <td>${formattedDueDate}</td>
      <td><span class="badge bg-label-${
        task.completed ? "success" : "warning"
      } me-1">${task.completed ? "Selesai" : "Pending"}</span></td>

      <td>
        <div class="dropdown">
          <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
            <i class="bx bx-dots-vertical-rounded"></i>
          </button>
          <div class="dropdown-menu">
          <a class="dropdown-item" href="javascript:void(0);" onclick="editTask('${
            task.id_task
          }')"><i class="bx bx-edit-alt me-1"></i> Edit</a>
          <a class="dropdown-item" href="javascript:void(0);" onclick="deleteTask('${
            task.id_task
          }')"><i class="bx bx-trash me-1"></i> Delete</a>
          </div>
        </div>
      </td>
    </tr>`;
    tableBody.innerHTML += row;
  });
  window.deleteTask = function (taskId) {
    const url = `${endpointGetIdTask}/delete?id_task=${taskId}`; // Sesuaikan dengan basis URL API Anda
    const token = localStorage.getItem("LOGIN");

    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Tugas ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus saja!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            LOGIN: ` ${token}`,
          },
          body: JSON.stringify({ id_task: taskId }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok.");
            }
            return response.json();
          })
          .then(() => {
            Swal.fire("Dihapus!", "Tugas Anda telah dihapus.", "success");
            window.location.reload(true);
          })
          .catch((error) => {
            console.error("Error:", error);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: error.message,
            });
          });
      }
    });
  };
}
window.editTask = function (taskId) {
  localStorage.setItem("currentTaskId", taskId);
  window.location.href = "edit-task.html";
};

fetchDataFromEndpoint();
