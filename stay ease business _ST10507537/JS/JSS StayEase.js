document.addEventListener("DOMContentLoaded", function () {
  initAutoDate();
  initLightbox();
  initListings();
  initEnquiryForm();
  initContactForm();
});


/* ---- 1. Automatic date ---------------------------------------------------- */
function initAutoDate() {
  const dateSpan = document.getElementById("todayDate");
  if (!dateSpan) return;
  const today = new Date();
  dateSpan.textContent = today.toLocaleDateString("en-ZA", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
}


/* ---- 2. Image lightbox (click to enlarge) --------------------------------- */
function initLightbox() {
  const thumbs = document.querySelectorAll(".lightbox-img");
  if (thumbs.length === 0) return;

  const overlay = document.createElement("div");
  overlay.id = "lightboxOverlay";
  overlay.style.cssText =
    "display:none; position:fixed; inset:0; background:rgba(0,0,0,.85);" +
    "align-items:center; justify-content:center; cursor:zoom-out; z-index:1000;";

  const bigImg = document.createElement("img");
  bigImg.alt = "Enlarged image";
  bigImg.style.cssText = "max-width:90%; max-height:90%; border-radius:6px;";
  overlay.appendChild(bigImg);
  document.body.appendChild(overlay);

  thumbs.forEach(function (thumb) {
    thumb.style.cursor = "zoom-in";
    thumb.addEventListener("click", function () {
      bigImg.src = thumb.src;
      bigImg.alt = thumb.alt || "Enlarged image";
      overlay.style.display = "flex";
    });
  });

  overlay.addEventListener("click", function () { overlay.style.display = "none"; });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") overlay.style.display = "none";
  });
}


/* ---- 3. Dynamic listings with search / sort ------------------------------- */
function initListings() {
  const itemList = document.getElementById("itemList");
  if (!itemList) return;

  // TODO: replace with Stay Ease's real listings.
  const items = [
    { name: "Sea-facing studio, Sea Point", price: 850, category: "Cape Town" },
    { name: "Garden cottage, Stellenbosch", price: 650, category: "Winelands" },
    { name: "Loft apartment, Maboneng",     price: 720, category: "Johannesburg" },
    { name: "Beach bungalow, Ballito",      price: 990, category: "KZN" },
    { name: "City studio, Pretoria CBD",    price: 550, category: "Pretoria" },
    { name: "Mountain chalet, Hogsback",    price: 780, category: "Eastern Cape" }
  ];

  const searchBox = document.getElementById("searchBox");
  const sortBox   = document.getElementById("sortBox");

  function itemToCard(item) {
    return (
      '<div class="item-card" style="border:1px solid #ddd; border-radius:6px; padding:.75rem; margin:.5rem 0;">' +
        '<strong>' + item.name + '</strong>' +
        '<span style="float:right;">R' + item.price + '/night</span>' +
        '<div style="font-size:.8rem; color:#666;">' + item.category + '</div>' +
      '</div>'
    );
  }

  function renderItems() {
    const searchText = searchBox ? searchBox.value.toLowerCase().trim() : "";
    const sortBy     = sortBox ? sortBox.value : "name";

    let visible = items.filter(function (item) {
      return item.name.toLowerCase().includes(searchText);
    });
    visible.sort(function (a, b) {
      if (sortBy === "priceLow")  return a.price - b.price;
      if (sortBy === "priceHigh") return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

    itemList.innerHTML = visible.length === 0
      ? '<p>No listings match your search. Try a different word.</p>'
      : visible.map(itemToCard).join("");
  }

  if (searchBox) searchBox.addEventListener("input", renderItems);
  if (sortBox)   sortBox.addEventListener("change", renderItems);
  renderItems();
}


/* ---- 4. Enquiry form (enquiry.html) --------------------------------------- */
function initEnquiryForm() {
  const form = document.getElementById("enquiryForm");
  if (!form) return;
  const responseBox = document.getElementById("responseBox");

  // Show or clear the error message for one field.
  function showError(fieldId, errorId, message) {
    document.getElementById(fieldId).classList.add("invalid");
    document.getElementById(errorId).textContent = message;
  }
  function clearError(fieldId, errorId) {
    document.getElementById(fieldId).classList.remove("invalid");
    document.getElementById(errorId).textContent = "";
  }

  // Check every field; return true only if all pass.
  function validate() {
    let valid = true;

    const name = document.getElementById("name").value.trim();
    if (name.length < 2) { showError("field-name", "error-name", "Enter your full name."); valid = false; }
    else { clearError("field-name", "error-name"); }

    const email = document.getElementById("email").value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError("field-email", "error-email", "Enter a valid email, like name@example.com."); valid = false; }
    else { clearError("field-email", "error-email"); }

    const phone = document.getElementById("phone").value.replace(/\D/g, "");
    if (phone.length < 10) { showError("field-phone", "error-phone", "Enter a phone number with at least 10 digits."); valid = false; }
    else { clearError("field-phone", "error-phone"); }

    const type = document.getElementById("enquiryType").value;
    if (type === "") { showError("field-type", "error-type", "Choose what your enquiry is about."); valid = false; }
    else { clearError("field-type", "error-type"); }

    const message = document.getElementById("message").value.trim();
    if (message.length < 10) { showError("field-message", "error-message", "Message must be at least 10 characters."); valid = false; }
    else { clearError("field-message", "error-message"); }

    return valid;
  }

  // Pick a relevant reply based on the type of enquiry.
  function buildResponse(type, name) {
    if (type === "stay")         return "Thanks " + name + "! Our stays start from R650 per night and we have availability on most dates. We'll email you options shortly.";
    if (type === "availability") return "Thanks " + name + "! We'll confirm availability for your dates by email within a few hours. Most listings start from R650 per night.";
    return "Thanks " + name + "! Listing your place with Stay Ease is free \u2014 we only take a small fee per booking. We'll email you the next steps.";
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();             // don't reload the page
    if (!validate()) return;            // stop if anything is invalid

    const name = document.getElementById("name").value.trim();
    const type = document.getElementById("enquiryType").value;

    responseBox.textContent = buildResponse(type, name);
    responseBox.classList.add("show");
    form.reset();
  });
}


/* ---- 5. Contact form (Contacts.html) -------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const responseBox = document.getElementById("responseBox");

  const RECIPIENT_EMAIL = "stayease@gmail.com";

  function showError(fieldId, errorId, message) {
    document.getElementById(fieldId).classList.add("invalid");
    document.getElementById(errorId).textContent = message;
  }
  function clearError(fieldId, errorId) {
    document.getElementById(fieldId).classList.remove("invalid");
    document.getElementById(errorId).textContent = "";
  }

  function validate() {
    let valid = true;

    const name = document.getElementById("name").value.trim();
    if (name.length < 2) { showError("field-name", "error-name", "Enter your full name."); valid = false; }
    else { clearError("field-name", "error-name"); }

    const email = document.getElementById("email").value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError("field-email", "error-email", "Enter a valid email, like name@example.com."); valid = false; }
    else { clearError("field-email", "error-email"); }

    const subject = document.getElementById("subject").value;
    if (subject === "") { showError("field-subject", "error-subject", "Choose what your message is about."); valid = false; }
    else { clearError("field-subject", "error-subject"); }

    const message = document.getElementById("message").value.trim();
    if (message.length < 10) { showError("field-message", "error-message", "Message must be at least 10 characters."); valid = false; }
    else { clearError("field-message", "error-message"); }

    return valid;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validate()) return;

    const name    = document.getElementById("name").value.trim();
    const email   = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value.trim();

    // Compile the message into an email and open the user's mail program.
    const body = "Name: " + name + "\nEmail: " + email + "\n\n" + message;
    window.location.href = "mailto:" + RECIPIENT_EMAIL +
      "?subject=" + encodeURIComponent("[" + subject + "] Message from " + name) +
      "&body=" + encodeURIComponent(body);

    responseBox.textContent = "Thanks " + name + "! Your email program will open with your message ready to send to us.";
    responseBox.classList.add("show");
    form.reset();
  });
}