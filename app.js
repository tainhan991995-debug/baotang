const API_TOKEN = "https://cqs.hue.gov.vn/taikhoan/getToken";
const API_DATA = "https://cqs.hue.gov.vn/data/dulieuso";

let token = "";

/* ===== LẤY TOKEN ===== */
async function getToken() {
  try {
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

    if (data.statusCode !== "00") {
      console.error("❌ Lỗi lấy token:", data);
      return null;
    }

    token = data.accessToken;
    return token;

  } catch (err) {
    console.error("❌ Lỗi kết nối token:", err);
    return null;
  }
}

/* ===== LẤY DATA ===== */
async function fetchData() {
  try {
    const res = await fetch(API_DATA, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token
      },
      body: JSON.stringify({
        serviceid: "kNLicdSB8f5wyIpDGXIHwg==",
        thamso: {
          tukhoa: "",
          taikhoantao: ""
        },
        page: "1",
        perpage: "50"
      })
    });

    const result = await res.json();

    // token hết hạn hoặc lỗi
    if (result.code !== 0) {
      console.warn("⚠️ Token lỗi, thử lấy lại...");
      token = "";
      return null;
    }

    return result.data || [];

  } catch (err) {
    console.error("❌ Lỗi lấy dữ liệu:", err);
    return null;
  }
}

/* ===== HÀM CHÍNH ===== */
async function getPlaces() {

  // lấy token nếu chưa có
  if (!token) {
    await getToken();
  }

  // gọi data
  let data = await fetchData();

  // nếu fail → retry 1 lần
  if (!data) {
    console.log("🔄 Retry lấy lại token...");
    await getToken();
    data = await fetchData();
  }

  // nếu vẫn fail
  if (!data) {
    alert("Không lấy được dữ liệu từ API!");
    return [];
  }

  // chuẩn hóa dữ liệu (tránh lỗi undefined)
  return data.map(item => ({
    id: item.id,
    tendiadiem: item.tendiadiem || "Chưa có tên",
    anhdaidien: item.anhdaidien || "bia.jpg",
    thuyetminh: item.thuyetminh || "",
    thuyetminhtienganh: item.thuyetminhtienganh || "",
    audiotiengviet: item.audiotiengviet || "",
    audiotienganh: item.audiotienganh || ""
  }));
}
