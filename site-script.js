// site-script.js
// Handles both forms + sends to your Node /send-email endpoint

const API_URL = "https://mania-print-backend.onrender.com/send-email";

(function () {
  const uploadForm = document.getElementById("uploadForm");
  const contactForm = document.getElementById("contactForm");
  const uploadSubmit = document.getElementById("uploadSubmit");
  const contactSubmit = document.getElementById("contactSubmit");

  function showToast(msg, timeout = 1800) {
    let t = document.querySelector(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._to);
    t._to = setTimeout(() => t.classList.remove("show"), timeout);
  }

  // ------------------- CONTACT FORM -------------------
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      contactSubmit.disabled = true;
      contactSubmit.textContent = "Sending...";

      const fd = new FormData(contactForm);
      const data = Object.fromEntries(fd.entries());

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (json.success) {
          showToast("Message sent successfully!");
          contactForm.reset();
        } else {
          showToast("Failed to send — check server logs.");
        }
      } catch (err) {
        console.error(err);
        showToast("Error sending message.");
      } finally {
        contactSubmit.disabled = false;
        contactSubmit.textContent = "Send";
      }
    });
  }

  // ------------------- QUICK ORDER FORM -------------------
  if (uploadForm) {
    uploadForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      uploadSubmit.disabled = true;
      uploadSubmit.textContent = "Sending...";

      const fd = new FormData(uploadForm);
      // convert FormData to a JSON-like object (no files)
      const data = {};
      fd.forEach((value, key) => (data[key] = value));

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (json.success) {
          showToast("Order request sent!");
          uploadForm.reset();
        } else {
          showToast("Failed to send — check server logs.");
        }
      } catch (err) {
        console.error(err);
        showToast("Error sending order.");
      } finally {
        uploadSubmit.disabled = false;
        uploadSubmit.textContent = "Send request";
      }
    });
  }

  // ------------------- SIMPLE FILE NAME DISPLAY -------------------
  const uploadFile = document.getElementById("uploadFile");
  if (uploadFile) {
    uploadFile.addEventListener("change", (e) => {
      const f = e.currentTarget.files?.[0];
      if (f) {
        showToast(`Attached: ${f.name}`);
      }
    });
  }
})();
