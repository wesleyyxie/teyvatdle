function activateModal() {
  let overlay = document.getElementById("modal-overlay");
  overlay.classList.remove("hidden");
}

function closeModal() {
  let overlay = document.getElementById("modal-overlay");
  overlay.classList.add("hidden");
}

window.onclick = function (event) {
  var modalOverlay = document.getElementById("modal-overlay");
  if (event.target == modalOverlay) {
    closeModal();
  }
};
