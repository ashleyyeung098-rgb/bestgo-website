/*!
* Start Bootstrap - Creative v7.0.7 (https://startbootstrap.com/theme/creative)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-creative/blob/master/LICENSE)
*/
//
// Scripts
//

window.addEventListener("DOMContentLoaded", (event) => {
  // Navbar shrink function
  var navbarShrink = function () {
    const navbarCollapsible = document.body.querySelector("#mainNav");
    if (!navbarCollapsible) return;

    if (window.scrollY === 0) {
      navbarCollapsible.classList.remove("navbar-shrink");
    } else {
      navbarCollapsible.classList.add("navbar-shrink");
    }
  };

  // Shrink the navbar
  navbarShrink();

  // Shrink the navbar when page is scrolled
  document.addEventListener("scroll", navbarShrink);

  // Activate Bootstrap scrollspy on the main nav element
  const mainNav = document.body.querySelector("#mainNav");
  if (mainNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: "#mainNav",
      rootMargin: "0px 0px -40%",
    });
  }

  // Collapse responsive navbar when toggler is visible
  const navbarToggler = document.body.querySelector(".navbar-toggler");
  const responsiveNavItems = [].slice.call(
    document.querySelectorAll("#navbarResponsive .nav-link")
  );
  responsiveNavItems.map(function (responsiveNavItem) {
    responsiveNavItem.addEventListener("click", () => {
      if (navbarToggler && window.getComputedStyle(navbarToggler).display !== "none") {
        navbarToggler.click();
      }
    });
  });

  // Activate SimpleLightbox plugin for portfolio items
  try {
    new SimpleLightbox({
      elements: "#portfolio a.portfolio-box",
    });
  } catch (e) {
    // ignore if plugin not loaded on some pages
  }

  // =============================
  // Contact Form Submit (BestGo)
  // =============================
  const form = document.getElementById("contactForm");
  if (!form) return;

  // Your Cloudflare Worker endpoint
  const ENDPOINT =
    "https://bestgo-contact-form.ashley-yeung098.workers.dev/api/contact";

  const submitBtn = document.getElementById("submitButton");
  const successBox = document.getElementById("submitSuccessMessage");
  const errorBox = document.getElementById("submitErrorMessage");

  // If StartBootstrap sets disabled via class, remove it so it can click
  if (submitBtn) {
    submitBtn.classList.remove("disabled");
    submitBtn.disabled = false;
  }

  const setLoading = (isLoading) => {
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;
    submitBtn.textContent = isLoading ? "Sending..." : "Submit";
  };

  const showSuccess = () => {
    if (successBox) successBox.classList.remove("d-none");
    if (errorBox) errorBox.classList.add("d-none");
  };

  const showError = () => {
    if (errorBox) errorBox.classList.remove("d-none");
    if (successBox) successBox.classList.add("d-none");
  };

  // Use capture=true to intercept before sb-forms-latest.js (if present)
  form.addEventListener(
    "submit",
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const nameEl = document.getElementById("name");
      const emailEl = document.getElementById("email");
      const phoneEl = document.getElementById("phone");
      const messageEl = document.getElementById("message");

      const payload = {
        name: (nameEl?.value || "").trim(),
        email: (emailEl?.value || "").trim(),
        phone: (phoneEl?.value || "").trim(),
        message: (messageEl?.value || "").trim(),
      };

      // Basic validation
      if (!payload.name || !payload.email || !payload.message) {
        showError();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Submit";
        }
        alert("Please fill in Name, Email, and Message.");
        return;
      }

      setLoading(true);

      try {
        const resp = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await resp.json().catch(() => ({}));

        if (resp.ok && data.ok) {
          showSuccess();
          form.reset();
        } else {
          console.error("Worker error:", data);
          showError();
        }
      } catch (err) {
        console.error("Network error:", err);
        showError();
      } finally {
        setLoading(false);
      }
    },
    true
  );
});
