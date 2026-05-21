const API_TOKEN =
  "https://cqs.hue.gov.vn/taikhoan/getToken";

const API_DATA =
  "https://cqs.hue.gov.vn/data/dulieuso";

let token = "";

// ================= TOKEN =================

async function getToken() {

  const res = await fetch(API_TOKEN, {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({

      username: "Baotang1",

      password: "Baotang123"

    })
  });

  const data = await res.json();

  token = data.accessToken;

  console.log("TOKEN:", token);
}

// ================= PLACES =================

async function getPlaces() {

  if (!token) {
    await getToken();
  }

  const res = await fetch(API_DATA, {

    method: "POST",

    headers: {
      "Content-Type": "application/json",
      token: token
    },

    body: JSON.stringify({

      serviceid: "kNLicdSB8f5wyIpDGXIHwg==",

      thamso: {},

      page: 1,

      perpage: 50
    })
  });

  const result = await res.json();

  console.log("PLACES:", result);

  return result.data || [];
}

// ================= IMAGES =================

async function getImages(placeId) {

  if (!token) {
    await getToken();
  }

  const res = await fetch(
    "https://cqs.hue.gov.vn/data/danhsach",
    {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        token: token
      },

      body: JSON.stringify({

        serviceid:
          "Eurka/RmTXuwLAMXDe5fGA==",

        thamso: {
          tukhoa: "",
          eformid: "0"
        },

        page: "1",

        perpage: "50"
      })
    }
  );

  const result = await res.json();

  console.log("API ẢNH:", result);

  const images =
    (result.data || []).filter(item => {

      return String(item.teneformid) ===
        String(placeId);
    });

  console.log("ẢNH:", images);

  return images;
}

// ================= LOAD ALL PLACES =================

async function loadAllPlaces() {

  try {

    const places = await getPlaces();

    localStorage.setItem(
      "places",
      JSON.stringify(places)
    );

    return places;

  } catch (e) {

    console.log(
      "LOAD PLACES ERROR:",
      e
    );

    return [];
  }
}

// ================= OPTIMIZE IMAGE =================

async function optimizeImage(url) {

  return new Promise(resolve => {

    const img = new Image();

    img.crossOrigin = "anonymous";

    img.decoding = "async";

    img.loading = "lazy";

    img.onload = () => {

      // ===== GIẢM SIZE MẠNH =====
      const maxWidth = 480;

      let width = img.width;
      let height = img.height;

      // resize nhỏ mạnh
      if (width > maxWidth) {

        const ratio = maxWidth / width;

        width = maxWidth;

        height = height * ratio;
      }

      const canvas =
        document.createElement("canvas");

      canvas.width = width;

      canvas.height = height;

      const ctx =
        canvas.getContext("2d", {
          alpha: false
        });

      // render nhẹ
      ctx.imageSmoothingEnabled = true;

      ctx.imageSmoothingQuality = "low";

      ctx.drawImage(
        img,
        0,
        0,
        width,
        height
      );

      // ===== NÉN RẤT MẠNH =====
      const compressed =
        canvas.toDataURL(
          "image/webp",
          0.35
        );

      // cleanup
      canvas.width = 0;
      canvas.height = 0;

      resolve(compressed);
    };

    img.onerror = () => {

      resolve(url);
    };

    img.src = url;
  });
}

      // ===== TỐI ƯU RENDER =====
      ctx.imageSmoothingEnabled = true;

      ctx.imageSmoothingQuality =
        "medium";

      ctx.drawImage(
        img,
        0,
        0,
        width,
        height
      );

      // ===== WEBP NÉN MẠNH =====
      const compressed =
        canvas.toDataURL(
          "image/webp",
          0.55
        );

      // cleanup RAM
      canvas.width = 0;
      canvas.height = 0;

      resolve(compressed);
    };

    img.onerror = () => {

      resolve(url);
    };

    img.src = url;
  });
}



// ================= LAZY LOAD =================

function initLazyLoad() {

  const lazyImages =
    document.querySelectorAll(".lazy-img");

  const observer =
    new IntersectionObserver(

      async entries => {

        for (const entry of entries) {

          if (entry.isIntersecting) {

            const img = entry.target;

            // tránh load lại
            if (!img.dataset.src) {
              continue;
            }

            // ===== optimize ảnh =====
            const optimized =
              await optimizeImage(
                img.dataset.src
              );

            // ===== render nhẹ =====
            img.loading = "lazy";

            img.decoding = "async";

            img.draggable = false;

            // ===== FIX iPHONE =====
            img.style.pointerEvents =
              "none";

            img.style.userSelect =
              "none";

            img.style.webkitUserDrag =
              "none";

            img.style.webkitTouchCallout =
              "none";

            // ===== FIX KHUNG ẢNH =====
            img.style.width = "100%";

            img.style.height = "220px";

            img.style.maxHeight =
              "220px";

            img.style.objectFit =
              "cover";

            img.style.display =
              "block";

            img.style.flexShrink = "0";

            // ===== set src =====
            img.src = optimized;

            img.onload = () => {

              img.classList.add(
                "loaded"
              );

              img.removeAttribute(
                "data-src"
              );
            };

            observer.unobserve(img);
          }
        }

      },

      {
        rootMargin: "100px"
      }
    );

  lazyImages.forEach(img => {

    observer.observe(img);
  });
}

// ================= FIX SLIDER =================

function fixSlider() {

  const sliders =
    document.querySelectorAll(
      ".slides"
    );

  sliders.forEach(slide => {

    slide.style.overflow =
      "hidden";

    slide.style.height =
      "220px";

    slide.style.maxHeight =
      "220px";
  });
}

// ================= AUDIO CLEANUP =================

window.addEventListener(
  "beforeunload",
  () => {

    const audio =
      document.getElementById(
        "audio"
      );

    if (audio) {

      audio.pause();

      audio.src = "";

      audio.load();
    }
  }
);

// ================= FIX IOS SCROLL =================

document.body.style.overflowX =
  "hidden";

document.documentElement.style
  .overflowX = "hidden";

// ================= INIT =================

window.addEventListener(
  "DOMContentLoaded",
  () => {

    initLazyLoad();

    fixSlider();
  }
);
