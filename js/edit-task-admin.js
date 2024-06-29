document.addEventListener("DOMContentLoaded", async () => {
  loadTaskData().catch((error) => {
    console.error("Error loading task data:", error);
    displayError("Error loading task data", error.message);
  });
});

async function loadTaskData() {
  const task = await getTaskById();
  if (task) {
    document.getElementById("judul").value = task.judul || "";
    document.getElementById("deskripsi").value = task.deskripsi || "";
    document.getElementById("due_date").value = task.due_date || "";
    document.getElementById("status").value = task.status || ""; // Ensure this is 'completed' if reflecting completion status
  }
}

async function getTaskById() {
  const taskId = localStorage.getItem("currentTaskId");
  if (!taskId) {
    throw new Error("No task ID found.");
  }

  const url = `http://127.0.0.1:3000/task/get?id_task=${taskId}`;
  const token = localStorage.getItem("LOGIN");
  const response = await fetch(url, {
    method: "GET",
    headers: {
      LOGIN: `${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch task");
  }
  return data.data;
}

document
  .getElementById("updateButton")
  .addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      const judul = document.getElementById("judul").value;
      const deskripsi = document.getElementById("deskripsi").value;
      const due_date = document.getElementById("due_date").value;
      const status = document.getElementById("status").value;

      await postData(judul, deskripsi, due_date, status);
    } catch (error) {
      console.error("Error updating task:", error);
      displayError("Error updating task", error.message);
    }
  });

async function postData(judul, deskripsi, due_date, status) {
  const taskId = localStorage.getItem("currentTaskId");
  const url = `http://127.0.0.1:3000/task/update?id_task=${taskId}`;
  const token = localStorage.getItem("LOGIN");
  const newData = {
    judul,
    deskripsi,
    due_date,
    completed: status,
  };

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      LOGIN: ` ${token}`,
    },
    body: JSON.stringify(newData),
  });

  handleResponse(response);
}

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Network response was not ok");
  }
  if (data.success) {
    await displaySuccess("Data berhasil diupdate");
  }
}

function displaySuccess(message) {
  Swal.fire({
    icon: "success",
    title: "Berhasil!",
    text: message,
    confirmButtonText: "Lihat Dashboard",
    showCancelButton: true,
    cancelButtonText: "Tetap di Halaman Ini",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "dashboard-admin.html";
    }
  });
}

function displayError(title, text) {
  Swal.fire({
    icon: "error",
    title: title,
    text: text,
  });
}
