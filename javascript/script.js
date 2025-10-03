document.addEventListener("DOMContentLoaded", () => {
  const pages = document.querySelectorAll(".page");

  // ------------------- Hàm hiển thị page -------------------
  function showPage(id) {
    pages.forEach((p) => p.classList.remove("active"));
    const el = document.getElementById(id);
    if (el) el.classList.add("active");
    createBirthdayBubbles(el); // tạo bong bóng cho page active
  }

  // ------------------- Welcome -------------------
  const welcomeBtn = document.querySelector("#page-welcome h1");
  if (welcomeBtn) {
    welcomeBtn.addEventListener("click", () => {
      showPage("page-slideshow");
      setupSlideshow();
    });
  }

  // ------------------- Slideshow (GIỮ NGUYÊN LOGIC CŨ) -------------------
  let slideshow, photos, totalImages, seenCount, isAnimating;

  function setupSlideshow() {
    slideshow = document.querySelector(".slide-container");
    if (!slideshow) return console.error("No .slide-container found");
    photos = Array.from(slideshow.querySelectorAll(".slide"));
    totalImages = photos.length;
    seenCount = 0;
    isAnimating = false;

    photos.forEach((img, i) => {
      img.style.position = "absolute";
      img.style.left = "50%";
      img.style.top = "50%";
      const angle = Math.random() * 22 - 11;
      img.style.transform = `translate(-50%,-50%) rotate(${angle}deg) scale(0.95)`;
      img.style.zIndex = totalImages - i;
      img.style.opacity = "1";
      img.style.display = "";
      img.style.pointerEvents = "";
      img.style.transition =
        "transform 0.6s cubic-bezier(.2,.9,.3,1), opacity 0.6s";
    });

    slideshow.addEventListener("click", onSlideClick);
    let sx = 0;
    slideshow.addEventListener("touchstart", (e) => {
      sx = e.touches[0].clientX;
    });
    slideshow.addEventListener("touchend", (e) => {
      const ex = e.changedTouches[0].clientX;
      if (Math.abs(ex - sx) > 40) onSlideClick(); // swipe → next
    });
  }

  function onSlideClick() {
    if (!slideshow || isAnimating) return;
    photos = Array.from(slideshow.querySelectorAll(".slide"));
    if (photos.length === 0) {
      showPage("page-gift");
      startCakeAnim();
      return;
    }

    isAnimating = true;
    const top = photos[0];
    const dir = Math.random() > 0.5 ? 1 : -1;
    const tx = dir * (120 + Math.random() * 40);
    const rotate = dir * (12 + Math.random() * 8);

    top.style.transition =
      "transform 0.6s cubic-bezier(.2,.9,.3,1), opacity 0.6s";
    top.style.transform = `translate(${tx}%, -50%) rotate(${rotate}deg) scale(0.7)`;
    top.style.opacity = "0";
    top.style.pointerEvents = "none";

    seenCount++;

    setTimeout(() => {
      slideshow.appendChild(top);
      top.style.transition = "none";
      const angle = Math.random() * 22 - 11;
      top.style.transform = `translate(-50%,-50%) rotate(${angle}deg) scale(0.95)`;
      top.style.opacity = "1";
      top.style.pointerEvents = "";
      void top.offsetWidth;
      top.style.transition =
        "transform 0.6s cubic-bezier(.2,.9,.3,1), opacity 0.6s";

      photos = Array.from(slideshow.querySelectorAll(".slide"));
      photos.forEach((img, i) => (img.style.zIndex = photos.length - i));

      isAnimating = false;

      if (seenCount >= totalImages) fadeOutAndGoGift();
    }, 650);
  }

  function fadeOutAndGoGift() {
    if (!slideshow) {
      showPage("page-gift");
      openGiftAnim();
      return;
    }
    slideshow.style.transition = "opacity 0.9s ease";
    slideshow.style.opacity = "0";
    slideshow.style.pointerEvents = "none";
    setTimeout(() => {
      const imgs = Array.from(slideshow.querySelectorAll(".slide"));
      imgs.forEach((img) => {
        img.style.transition = "none";
        img.style.opacity = "0";
        img.style.display = "none";
      });
      slideshow.style.display = "none";
      slideshow.style.opacity = "1";
      showPage("page-gift");
      openGiftAnim();
    }, 950);
  }

  // Kim tuyến
  function createGlitters(container, count = 50) {
    const colors = [
      "#fff",
      "#ffe0f0",
      "#ffb6c1",
      "#ffd700",
      "#a0e7e5",
      "#caffbf",
    ];
    for (let i = 0; i < count; i++) {
      const glitter = document.createElement("div");
      glitter.className = "cake-glitter";
      const size = 4 + Math.random() * 6;
      const x = (Math.random() - 0.5) * 100;
      const color = colors[Math.floor(Math.random() * colors.length)];
      glitter.style.width = glitter.style.height = size + "px";
      glitter.style.background = color;
      glitter.style.setProperty("--x", x + "px");
      container.appendChild(glitter);
      setTimeout(() => glitter.remove(), 1500);
    }
  }

  // ------------------- Gift -------------------
  function openGiftAnim() {
    const gift = document.querySelector(".gift");
    if (gift) gift.classList.add("open");
    setTimeout(() => showCardThenMassage(), 2000);
  }

  // ------------------- Card → Massage -------------------
  function showCardThenMassage() {
    // Hiển thị card
    showPage("page-card");

    // Massage xuất hiện sau 2.5s
    setTimeout(() => {
      const massagePage = document.getElementById("page-massage");
      if (!massagePage) return;

      // append massage xuống cuối DOM
      massagePage.parentNode.appendChild(massagePage);

      // chỉ thêm class active cho massage (card vẫn hiển thị)
      massagePage.classList.add("active");
    }, 2500);
  }

  // ------------------- Bong bóng sinh nhật -------------------
  function createBirthdayBubbles(container, count = 25) {
    if (!container) return;
    const existing = container.querySelectorAll(".birthday-bubble");
    if (existing.length > 0) return; // tránh tạo trùng

    const colors = ["#ffe0f0", "#ffb6c1", "#ffd700", "#a0e7e5", "#caffbf"];
    for (let i = 0; i < count; i++) {
      const bubble = document.createElement("div");
      bubble.className = "birthday-bubble";
      const left = Math.random() * 100;
      const size = 12 + Math.random() * 20;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const duration = 5 + Math.random() * 5;
      const delay = Math.random() * 5;

      bubble.style.left = `${left}%`;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.background = color;
      bubble.style.animationDuration = `${duration}s`;
      bubble.style.animationDelay = `${delay}s`;

      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      bubble.appendChild(sparkle);
      container.appendChild(bubble);
    }
  }

  // ------------------- Kim tuyến -------------------
  function createGlitters(container, count = 40) {
    if (!container) return;
    const colors = [
      "#fff",
      "#ffe0f0",
      "#ffb6c1",
      "#ffd700",
      "#a0e7e5",
      "#caffbf",
    ];
    for (let i = 0; i < count; i++) {
      const glitter = document.createElement("div");
      glitter.className = "birthday-glitter";
      const size = 4 + Math.random() * 6;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = 45 + Math.random() * 20;
      const duration = 1.5 + Math.random();
      const angle = Math.random() * 360;
      const x = (Math.random() - 0.5) * 60;

      glitter.style.width = `${size}px`;
      glitter.style.height = `${size}px`;
      glitter.style.left = `${left}%`;
      glitter.style.background = color;
      glitter.style.setProperty("--r", angle);
      glitter.style.setProperty("--x", x);
      glitter.style.animationDuration = `${duration}s`;
      container.appendChild(glitter);

      setTimeout(() => glitter.remove(), duration * 1000);
    }
  }

  // ------------------- Init -------------------
  // tạo bong bóng cho các page đã active
  pages.forEach((p) => {
    if (p.classList.contains("active")) createBirthdayBubbles(p);
    const observer = new MutationObserver(() => {
      if (p.classList.contains("active")) createBirthdayBubbles(p);
    });
    observer.observe(p, { attributes: true, attributeFilter: ["class"] });
  });

  // nếu refresh mà đang ở slideshow
  if (document.getElementById("page-slideshow").classList.contains("active")) {
    setupSlideshow();
  }
});

let datetxt = "8/10/1977";
let datatxtletter =
  "Happy birthday! Wishing you a day filled with joy, laughter, and wonderful memories 💕";
let titleLetter = "Dear em :)))";
let charArrDate = datetxt.split("");
let charArrDateLetter = datatxtletter.split("");
let charArrTitle = titleLetter.split("");
let currentIndex = 0;
let currentIndexLetter = 0;
let currentIndexTitle = 0;
let date__of__birth = document.querySelector(".date__of__birth span");
let text__letter = document.querySelector(".text__letter p");
setTimeout(function () {
  timeDatetxt = setInterval(function () {
    if (currentIndex < charArrDate.length) {
      date__of__birth.textContent += charArrDate[currentIndex];
      currentIndex++;
    } else {
      let i = document.createElement("i");
      i.className = "fa-solid fa-star";
      document.querySelector(".date__of__birth").prepend(i);
      document.querySelector(".date__of__birth").appendChild(i.cloneNode(true));
      clearInterval(timeDatetxt);
    }
  }, 100);
}, 12000);

var intervalContent;
var intervalTitle;
$("#btn__letter").on("click", function () {
  $(".box__letter").slideDown();
  setTimeout(function () {
    $(".letter__border").slideDown();
  }, 1000);
  setTimeout(function () {
    intervalTitle = setInterval(function () {
      if (currentIndexTitle < charArrTitle.length) {
        document.querySelector(".title__letter").textContent +=
          charArrTitle[currentIndexTitle];
        let i = document.createElement("i");
        i.className = "fa-solid fa-heart";
        document.querySelector(".title__letter").appendChild(i);
        currentIndexTitle++;
      } else {
        clearInterval(intervalTitle);
      }
    }, 100);
  }, 2000);
  setTimeout(function () {
    document.querySelector("#heart__letter").classList.add("animationOp");
    document.querySelector(".love__img").classList.add("animationOp");
    document.querySelector("#mewmew").classList.add("animationOp");
  }, 2800);
  setTimeout(function () {
    document.querySelectorAll(".heart").forEach((item) => {
      item.classList.add("animation");
    });
  }, 3500);
  setTimeout(function () {
    intervalContent = setInterval(function () {
      if (currentIndexLetter < charArrDateLetter.length) {
        text__letter.textContent += charArrDateLetter[currentIndexLetter];
        currentIndexLetter++;
      } else {
        clearInterval(intervalContent);
      }
    }, 50);
  }, 6000);
});
$(".close").on("click", function () {
  clearInterval(intervalContent);
  document.querySelector(".title__letter").textContent = "";
  text__letter.textContent = "";
  currentIndexLetter = 0;
  currentIndexTitle = 0;
  document.querySelector("#heart__letter").classList.remove("animationOp");
  document.querySelector(".love__img").classList.remove("animationOp");
  document.querySelector("#mewmew").classList.remove("animationOp");
  document.querySelectorAll(".heart").forEach((item) => {
    item.classList.remove("animation");
  });
  $(".box__letter").slideUp();
  $(".letter__border").slideUp();
});

//mobile

function mobile() {
  const app = {
    timeout: function (txt, dom) {
      let currentIndex = 0;
      let charArr = txt.split("");
      intervalMobile = setInterval(function () {
        if (currentIndex < charArr.length) {
          dom.textContent += charArr[currentIndex];
          currentIndex++;
        } else {
          clearInterval(intervalMobile);
        }
      }, 200);
    },
  };
  return app;
}
const fcMobile = mobile();
if (window.innerWidth < 768) {
  setTimeout(() => {
    fcMobile.timeout("08", document.querySelector(".day"));
  }, 5000);
  setTimeout(() => {
    fcMobile.timeout("10", document.querySelector(".month"));
  }, 6000);
}
