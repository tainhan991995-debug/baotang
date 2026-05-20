const API_TOKEN =
  "https://cqs.hue.gov.vn/taikhoan/getToken";

const API_DATA =
  "https://cqs.hue.gov.vn/data/dulieuso";

let token = "";

// ================= TOKEN =================

async function getToken(){

  const res = await fetch(API_TOKEN, {

    method:"POST",

    headers:{
      "Content-Type":"application/json"
    },

    body:JSON.stringify({

      username:"Baotang1",

      password:"Baotang123"

    })
  });

  const data = await res.json();

  token = data.accessToken;

  console.log("TOKEN:", token);
}

// ================= PLACES =================

async function getPlaces(){

  if(!token){
    await getToken();
  }

  const res = await fetch(API_DATA, {

    method:"POST",

    headers:{
      "Content-Type":"application/json",
      token:token
    },

    body:JSON.stringify({

      serviceid:"kNLicdSB8f5wyIpDGXIHwg==",

      thamso:{},

      page:1,

      perpage:50
    })
  });

  const result = await res.json();

  console.log("PLACES:", result);

  return result.data || [];
}

// ================= IMAGES =================

async function getImages(placeId){

  if(!token){
    await getToken();
  }

  const res = await fetch(
    "https://cqs.hue.gov.vn/data/danhsach",
    {

      method:"POST",

      headers:{
        "Content-Type":"application/json",
        token:token
      },

      body:JSON.stringify({

        serviceid:
          "Eurka/RmTXuwLAMXDe5fGA==",

        thamso:{
          tukhoa:"",
          eformid:"0"
        },

        page:"1",

        perpage:"50"
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
async function loadAllPlaces() {

  try {

    const res = await fetch(
      API_URL + "/places"
    );

    const data = await res.json();

    const places =
      data.data || data;

    localStorage.setItem(
      "places",
      JSON.stringify(places)
    );

  } catch (e) {

    console.log(e);
  }
}
