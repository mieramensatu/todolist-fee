document.addEventListener("DOMContentLoaded", async () => {
  try {
    const task = await getTaskById(); // Get the current task data to fill in the form
    if (task) {
      document.getElementById("judul").value = task.judul || "";
      document.getElementById("deskripsi").value = task.deskripsi || "";
      document.getElementById("due_date").value = task.due_date || "";
      document.getElementById("status").value = task.status || "";
    }
  } catch (error) {
    console.error("Error loading task data:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message,
    });
  }
});

async function getTaskById() {
  const taskId = localStorage.getItem("currentTaskId");
  if (!taskId) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No task ID found.",
    });
    return;
  }

  const url = `http://127.0.0.1:3000/task/get?id_task=${taskId}`;
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
      throw new Error(data.message || "Failed to fetch task");
    }
    return data.data; // Return the task data
  } catch (error) {
    console.error("Error fetching task data:", error);
    Swal.fire({
      icon: "error",
      title: "Failed to fetch task",
      text: error.message,
    });
  }
}

document
  .getElementById("addButton")
  .addEventListener("click", async function (event) {
    event.preventDefault();
    const judul = document.getElementById("judul").value;
    const deskripsi = document.getElementById("deskripsi").value;
    const due_date = document.getElementById("due_date").value;
    const getstatus = document.getElementById("status").value;
    const putstatus = JSON.parse(getstatus);

    try {
      await postData(judul, deskripsi, due_date, putstatus);
    } catch (error) {
      console.error("Error updating task:", error);
      Swal.fire({
        icon: "error",
        title: "Error updating task",
        text: error.message,
      });
    }
  });

async function postData(judul, deskripsi, due_date, status) {
  const taskId = localStorage.getItem("currentTaskId");
  const url = `http://127.0.0.1:3000/task/update?id_task=${taskId}`;
  const token = localStorage.getItem("LOGIN");

  const newData = {
    judul: judul,
    deskripsi: deskripsi,
    due_date: due_date,
    completed: status,
  };
  
  console.log(newData);
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
