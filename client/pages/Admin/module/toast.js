function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
  
    toast.textContent = message;
    toast.classList.remove("hidden");
    toast.classList.add("show");
  
    // Hủy animation cũ nếu có
    if (toast._fadeOut) {
      toast._fadeOut.cancel();
    }
  
    // Thực hiện animation mờ dần sau delay
    toast._fadeOut = toast.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 1000,
      easing: "ease-in-out",
      delay: 2000,
    });
  
    toast._fadeOut.onfinish = () => {
      toast.classList.remove("show");
      toast.classList.add("hidden");
      toast._fadeOut = null;
    };
  }
  
  export { showToast };
  