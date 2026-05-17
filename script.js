const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const sectionLinks = navLinks.filter((link) => link.getAttribute("href").startsWith("#") && link.getAttribute("href") !== "#inquiry");
const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const inquiryForm = document.getElementById("inquiryForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const serviceInput = document.getElementById("service");
const messageInput = document.getElementById("message");
const companyInput = document.getElementById("company");
const submitButton = inquiryForm.querySelector("button[type='submit']");
const inquiryEndpoint = "https://formsubmit.co/ajax/ispiretechnologies@gmail.com";

const fieldErrors = {
  name: document.getElementById("nameError"),
  email: document.getElementById("emailError"),
  service: document.getElementById("serviceError"),
  message: document.getElementById("messageError"),
};

const formStatus = document.getElementById("formStatus");
const revealItems = document.querySelectorAll(".reveal");
const year = document.getElementById("year");

year.textContent = new Date().getFullYear();

function setMenuState(isOpen) {
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  siteNav.classList.toggle("open", isOpen);
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  setMenuState(!isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.matchMedia("(max-width: 930px)").matches) {
      setMenuState(false);
    }
  });
});

function setActiveNav() {
  const scrollPoint = window.scrollY + 120;
  let activeId = "about";

  sections.forEach((section) => {
    if (section.offsetTop <= scrollPoint) {
      activeId = section.id;
    }
  });

  sectionLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${activeId}`;
    link.classList.toggle("active", isActive);
  });
}

function showFieldError(field, message) {
  fieldErrors[field].textContent = message;
}

function clearErrors() {
  Object.values(fieldErrors).forEach((node) => {
    node.textContent = "";
  });
  formStatus.textContent = "";
  formStatus.className = "form-status";
}

function isEmailValid(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

inquiryForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearErrors();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const service = serviceInput.value;
  const message = messageInput.value.trim();
  const company = companyInput.value.trim();

  let hasErrors = false;

  if (!name) {
    showFieldError("name", "Please enter your name.");
    hasErrors = true;
  }

  if (!email) {
    showFieldError("email", "Please enter your email address.");
    hasErrors = true;
  } else if (!isEmailValid(email)) {
    showFieldError("email", "Please enter a valid email address.");
    hasErrors = true;
  }

  if (!service) {
    showFieldError("service", "Please select a service.");
    hasErrors = true;
  }

  if (!message) {
    showFieldError("message", "Please enter your message.");
    hasErrors = true;
  }

  if (hasErrors) {
    formStatus.textContent = "Please correct the highlighted fields and try again.";
    formStatus.classList.add("error");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";
  formStatus.textContent = "Submitting your inquiry...";

  try {
    const response = await fetch(inquiryEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        company,
        service,
        message,
        _subject: "New Inquiry from Ispire Technologies Website",
        _template: "table",
        _captcha: "false",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send inquiry");
    }

    formStatus.textContent = "Thank you. Your inquiry has been sent to ispiretechnologies@gmail.com.";
    formStatus.classList.add("success");
    inquiryForm.reset();
  } catch (error) {
    formStatus.textContent = "We could not send your inquiry right now. Please try again in a moment.";
    formStatus.classList.add("error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit Inquiry";
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));

window.addEventListener("scroll", setActiveNav);
window.addEventListener("load", setActiveNav);
window.addEventListener("resize", setActiveNav);
