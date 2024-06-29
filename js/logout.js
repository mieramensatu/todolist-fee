document.getElementById("logoutButton").addEventListener("click", function () {
  Swal.fire({
    title: "Anda Yakin?",
    text: "Anda Ingin Keluar!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Iya",
    cancelButtonText: "Tidak",
  }).then((result) => {
    if (result.isConfirmed) {
      logout();
    }
  });
});

function logout() {
  localStorage.removeItem("LOGIN");
  document.cookie = "LOGIN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.href = "index.html";
}
