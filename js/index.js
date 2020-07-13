const link = document.getElementById("shortenInput");
const shortenBtn = document.getElementById("shorten");
const msgError = document.getElementById("msg-error");
const links = document.querySelector(".renderLinks");

shortenBtn.addEventListener("click", function () {
  if (!validateUlr(link.value)) {
    renderMessage("Debe ingresar una URL valida");
    return;
  }
  clearElement(links);

  //hacer la peticion
  fetch("https://rel.ink/api/links/", {
    method: "POST",
    body: JSON.stringify({
      url: link.value,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .catch((error) => {
      console.error(error);
    })
    .then((res) => res.json())
    .then((json) => {
      if (json.hashid == undefined) {
        renderMessage("Invalid URL: use este formato: https://www.example.com");
      } else {
        renderShortenedLink(link.value, json.hashid);
      }
    });
});

function validateUlr(url) {
  const regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

  const result = url.match(regex);

  if (result) {
    return true;
  }
  return false;
}

function clearElement(element) {
  element.innerHTML = "";
}

function renderMessage(msg) {
  const morkup = `<p class="p-3 bg-danger text-white">${msg}</p>`;
  msgError.insertAdjacentHTML("beforeend", morkup);

  setTimeout(() => {
    clearElement(msgError);
  }, 4000);
}
function renderShortenedLink(url, hashid) {
  const morkup = `<div class="links">
            <p>${url}</p>
            <div class="links__action">
              <p class="d-inline links__action--link" id="output">
                https://rel.ink/${hashid}
              </p>
              <button class="btn links__action--copy" id="copy" onclick="copyToClickboard()">Copy!</button>
            </div>
          </div>`;

  links.insertAdjacentHTML("beforeend", morkup);
}

function copyToClickboard() {
  const copyText = document.getElementById("output");
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(copyText);

  selection.removeAllRanges();
  selection.addRange(range);
  document.execCommand("copy");
}
