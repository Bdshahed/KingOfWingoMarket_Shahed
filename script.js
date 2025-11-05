let cdTimer;
const periodEl = document.getElementById("period");
const cdEl = document.getElementById("countdown");
const pwModal = document.getElementById("pwModal");
const mainApp = document.getElementById("mainApp");

async function fetchIssue() {
  try {
    const res = await fetch("https://api.dkwinapi.com/api/webapi/GetUserInfo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request: "issue" })
    });
    const data = await res.json();
    return data?.data?.sign || null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

function appendLog(msg) {
  const box = document.getElementById("logBox");
  const p = document.createElement("p");
  p.textContent = msg;
  box.prepend(p);
}

function updateCd(sec) {
  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");
  cdEl.textContent = ${mm}:${ss};
}

function startCountdown(s) {
  clearInterval(cdTimer);
  let rem = s;
  updateCd(rem);
  cdTimer = setInterval(() => {
    rem--;
    updateCd(rem);
    if (rem <= 0) clearInterval(cdTimer);
  }, 1000);
}

async function startLoop() {
  const issue = await fetchIssue();
  periodEl.textContent = issue || "LOCAL-" + Date.now();
  startCountdown(40);

  setInterval(async () => {
    const ni = await fetchIssue();
    if (ni && ni !== periodEl.textContent) {
      periodEl.textContent = ni;
      appendLog("New period: " + ni);
      startCountdown(40);
    }
  }, 9000);
}

window.addEventListener("load", () => {
  pwModal.style.display = "flex";
});
