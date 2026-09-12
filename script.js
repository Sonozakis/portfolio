/*****************/
/* SMOOTH SCROLL */
/*****************/
/* Lenis handles the momentum/smoothing; "anchors: true" makes the nav links
   and "next work" links scroll smoothly through Lenis instead of the browser's
   default jump. Loaded from unpkg in index.html, before this file. */
if (typeof Lenis !== "undefined") {
	new Lenis({
		autoRaf: true,
		anchors: true,
	});
}



/*******************/
/* WORK CAROUSELS */
/*******************/
/* Generic carousel controller — runs for every [data-carousel] element on the page */
document.querySelectorAll("[data-carousel]").forEach(function (carousel) {
	const track = carousel.querySelector(".carousel-track");
	const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
	const dotsWrap = carousel.querySelector(".carousel-dots");
	const prevBtn = carousel.querySelector(".carousel-arrow.prev");
	const nextBtn = carousel.querySelector(".carousel-arrow.next");
	let index = 0;

	// build one dot per slide
	slides.forEach(function (_, i) {
		const dot = document.createElement("button");
		dot.className = "carousel-dot" + (i === 0 ? " active" : "");
		dot.setAttribute("aria-label", "Go to image " + (i + 1));
		dot.addEventListener("click", function () {
			goTo(i);
		});
		dotsWrap.appendChild(dot);
	});

	const dots = Array.from(dotsWrap.querySelectorAll(".carousel-dot"));

	function goTo(i) {
		index = (i + slides.length) % slides.length;
		track.style.transform = "translateX(-" + index * 100 + "%)";
		dots.forEach(function (d, di) {
			d.classList.toggle("active", di === index);
		});
	}

	prevBtn.addEventListener("click", function () {
		goTo(index - 1);
	});

	nextBtn.addEventListener("click", function () {
		goTo(index + 1);
	});
});



/****************/
/* CONTACT FORM */
/****************/
/* Submits via fetch instead of a normal page POST, so the person stays on the
   site and sees an inline status message instead of being redirected to
   Web3Forms or seeing a native browser alert(). */
const contactForm = document.querySelector(".contact-form");

if (contactForm) {
	const submitBtn = contactForm.querySelector(".submit-btn");
	const status = contactForm.querySelector(".form-status");
	const originalBtnText = submitBtn.textContent;

	contactForm.addEventListener("submit", async function (e) {
		e.preventDefault();

		const formData = new FormData(contactForm);

		submitBtn.textContent = "sending...";
		submitBtn.disabled = true;
		status.textContent = "";
		status.classList.remove("form-status-error", "form-status-success");

		try {
			const response = await fetch(contactForm.action, {
				method: "POST",
				headers: { Accept: "application/json" },
				body: formData,
			});
			const data = await response.json();

			if (response.ok) {
				status.textContent = "Thanks — your message has been sent.";
				status.classList.add("form-status-success");
				contactForm.reset();
			} else {
				status.textContent = data.message || "Something went wrong. Please try again.";
				status.classList.add("form-status-error");
			}
		} catch (error) {
			status.textContent = "Something went wrong. Please try again.";
			status.classList.add("form-status-error");
		} finally {
			submitBtn.textContent = originalBtnText;
			submitBtn.disabled = false;
		}
	});
}