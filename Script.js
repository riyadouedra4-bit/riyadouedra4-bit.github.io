const app = document.getElementById("app");

const state = {
  noClicks: 0,
  answer: null,
  date: "",
  time: "",
  place: "",
  startedAt: new Date().toISOString()
};

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#039;"
  }[ch]));
}

function screen(inner) {
  app.innerHTML = `<section class="screen"><div class="content">${inner}</div></section>`;
}

function next(renderFn) {
  app.firstElementChild?.animate(
    [
      {opacity:1, transform:"translateY(0)"},
      {opacity:0, transform:"translateY(-10px)"}
    ],
    {
      duration:220,
      easing:"ease-in",
      fill:"forwards"
    }
  );

  setTimeout(renderFn, 180);
}

function renderEnvelope() {
  screen(`
    <div class="envelope-wrap fade-in">

      <div class="hint">
        Clique sur le ❤️ pour ouvrir l’enveloppe
      </div>

      <div
        class="envelope"
        id="envelope"
        aria-label="Enveloppe"
      >

        <div class="back"></div>

        <div class="paper">
          <div class="paper-content">

            <h1 class="title serif">
              Riyad et Nafi ?<br>
              Pourquoi pas…?🥲🙃
            </h1>

            <button class="btn btn-green btn-large" id="continueBtn">
              continuer
            </button>

          </div>
        </div>

        <div class="flap"></div>

        <div class="front"></div>

        <!-- ❤️ SEUL ÉLÉMENT QUI OUVRE L'ENVELOPPE -->
        <button
          class="heart-open"
          id="heartOpen"
          aria-label="Ouvrir l'enveloppe"
        >
          ❤️
        </button>

      </div>

    </div>
  `);

  let opened = false;

  const heart = document.getElementById("heartOpen");
  const envelope = document.getElementById("envelope");

  heart.addEventListener("click", (event) => {

    event.stopPropagation();

    if (opened) return;

    opened = true;

    envelope.classList.add("open");

  });

  document.getElementById("continueBtn").addEventListener("click", (event) => {

    event.stopPropagation();

    next(renderQuestion);

  });
}
function renderQuestion() {
  screen(`
    <div class="fade-in">

      <div class="sticker">🌚</div>

      <p class="question">
        🌸Tu veux sortir avec moi et être ma copine pour que je puisse te chérir davantage ?🌸
      </p>

      <div class="btn-row" id="answers">

        <button class="btn btn-green btn-large" id="yesBtn">
          oui💘
        </button>

        <button class="btn btn-red btn-large" id="noBtn">
          non😔
        </button>

      </div>

    </div>
  `);

  const yes = document.getElementById("yesBtn");
  const no = document.getElementById("noBtn");

  yes.addEventListener("click", () => {
    state.answer = "Oui";
    next(renderYesReaction);
  });

  no.addEventListener("click", () => {
    state.noClicks++;

    if (state.noClicks === 1) {
      no.classList.add("no-small");
      yes.classList.add("yes-grow");
    } else if (state.noClicks >= 2) {
      no.remove();
      yes.classList.add("yes-grow");
    }
  });
}

function renderYesReaction() {
  screen(`
    <div class="fade-in">

      <div class="sticker pop">😲</div>

      <h1 class="final-title" style="color:#e85d9e">
        ATTENDS T’AS<br>
        VRAIMENT DIT OUI ?
      </h1>

      <p class="subtitle">
        j’étais tellement stressé !
      </p>

      <br>

      <button class="btn btn-pink btn-large" id="dateStart">
        d’accord d’accord !
      </button>

    </div>
  `);

  document.getElementById("dateStart").addEventListener("click", () => {
    next(renderDate);
  });
}

function renderDate() {
  const minDate = new Date();

  minDate.setHours(0, 0, 0, 0);

  const min = minDate.toISOString().slice(0, 10);

  screen(`
    <div class="fade-in">

      <h1 class="final-title">
        Alors… quand es-tu libre pour un date ?
      </h1>

      <div class="form-card">

        <div class="field">

          <label for="dateInput">
            choisir un jour
          </label>

          <input
            id="dateInput"
            type="date"
            min="${min}"
          >

        </div>

        <div class="field">

          <label for="timeInput">
            L’heure ?
          </label>

          <input
            id="timeInput"
            type="time"
          >

        </div>

        <p class="error" id="formError">
          Choisis une date et une heure avant de continuer.
        </p>

        <button class="btn btn-purple btn-large" id="fixBtn">
          fixer la date ! ♥
        </button>

      </div>

    </div>
  `);

  document.getElementById("fixBtn").addEventListener("click", () => {

    const date = document.getElementById("dateInput").value;
    const time = document.getElementById("timeInput").value;

    if (!date || !time) {
      document.getElementById("formError").style.display = "block";
      return;
    }

    state.date = date;
    state.time = time;

    next(renderPlaces);
  });
}

function formatDate(iso) {
  const [y, m, d] = iso.split("-");

  return `${d}/${m}/${y}`;
}

function renderPlaces() {
  screen(`
    <div class="fade-in">

      <h1 class="final-title">
        ALORS ON VA OÙ?
      </h1>

      <div class="place-list">

        <button class="place" data-place="Chez Alex">
          Chez Alex🥞
        </button>

        <button
          class="place"
          data-place="Café Pyramide diarradougou"
        >
          Café Pyramide diarradougou🥐
        </button>

        <button class="place" data-place="Yargho">
          Yargho🥂
        </button>

      </div>

    </div>
  `);

  document.querySelectorAll(".place").forEach(btn => {

    btn.addEventListener("click", () => {

      state.place = btn.dataset.place;

      next(renderFinal);

    });

  });
}

function renderFinal() {

  const date = formatDate(state.date);

  const placeText = {
    "Chez Alex": "chez Alex",
    "Café Pyramide diarradougou":
      "au Café Pyramide de diarradougou",
    "Yargho":
      "au Yargho"
  }[state.place];

  screen(`
    <div class="fade-in">

      <div class="sticker">
        🥰
      </div>

      <p class="final-message">

        je suis content que tu n’aies pas dit non.
        Donc on se retrouve
        ${escapeHTML(placeText)}
        le
        <strong>${escapeHTML(date)}</strong>
        à
        <strong>${escapeHTML(state.time)}</strong>.
        <br>

        Bisous😘💋…

      </p>

      <p class="small">
        ♥ Date fixée.
      </p>

    </div>
  `);

  launchConfetti();

  submitResponse();
}

function launchConfetti() {

  const box = document.createElement("div");

  box.className = "confetti";

  const symbols = ["♥", "✦", "•", "♡"];

  for (let i = 0; i < 35; i++) {

    const s = document.createElement("span");

    s.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    s.style.left =
      Math.random() * 100 + "%";

    s.style.animationDelay =
      Math.random() * 1.1 + "s";

    s.style.fontSize =
      (10 + Math.random() * 13) + "px";

    box.appendChild(s);
  }

  document.body.appendChild(box);

  setTimeout(() => {
    box.remove();
  }, 4200);
}

async function submitResponse() {

  // Pour l'instant, l'envoi automatique n'est pas encore configuré.
  // Nous le connecterons ensuite à un service comme Formspree.

  const endpoint =
    localStorage.getItem("responseEndpoint");

  if (!endpoint) return;

  const payload = {

    subject:
      "Nouvelle réponse — Riyad et Nafi ❤️",

    answer:
      state.answer,

    noClicks:
      state.noClicks,

    date:
      formatDate(state.date),

    time:
      state.time,

    place:
      state.place,

    submittedAt:
      new Date().toLocaleString(
        "fr-FR",
        {
          dateStyle: "full",
          timeStyle: "short"
        }
      )
  };

  try {

    await fetch(endpoint, {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },

      body: JSON.stringify(payload)

    });

  } catch (err) {

    console.warn(
      "Envoi de la réponse impossible pour le moment.",
      err
    );

  }
}

