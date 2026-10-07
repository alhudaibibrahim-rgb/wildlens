(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = (id, cls = "ico") => `<svg class="${cls}"><use href="#i-${id}"/></svg>`;

  /* ---------- per-browser storage (best effort) ---------- */
  const KEY = "wildlens.v2";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  const persisted = load();
  const state = {
    saved: persisted.saved || [],
    recent: persisted.recent || [],          // [{id, at}]
    custom: persisted.custom || {},          // id -> generated profile
    photos: persisted.photos || {},          // id -> small data URL of the viewer's photo
    reports: persisted.reports || [],        // rescue reports, newest first
    scanCount: persisted.scanCount || 0,
    settings: Object.assign({ theme: "auto", history: true, motion: false, updates: true, email: false, lang: "English" }, persisted.settings),
    user: persisted.user || null,
    scans: {},                               // id -> {confidence} (this session only)
  };
  const save = () => {
    const data = { saved: state.saved, recent: state.recent, custom: state.custom, photos: state.photos, reports: state.reports, scanCount: state.scanCount, settings: state.settings, user: state.user };
    try { localStorage.setItem(KEY, JSON.stringify(data)); return true; }
    catch {
      // Storage full: drop report photos from older reports, then retry once.
      state.reports.slice(5).forEach((r) => (r.thumb = null));
      try { localStorage.setItem(KEY, JSON.stringify(data)); return true; } catch { return false; }
    }
  };

  const byId = (id) => ANIMALS.find((a) => a.id === id) || state.custom[id];
  const allAnimals = () => [...ANIMALS, ...Object.values(state.custom)];
  const statusClass = (s = "") => {
    const t = s.toLowerCase();
    if (t.includes("critically")) return "st-cr";
    if (t.includes("endangered")) return "st-en";
    if (t.includes("vulnerable")) return "st-vu";
    if (t.includes("near")) return "st-nt";
    if (t.includes("least")) return "st-lc";
    return "st-xx";
  };
  const stock = (id) => (typeof PHOTOS !== "undefined" && PHOTOS[id]) || null;
  const picHTML = (a) => state.photos[a.id] ? `<img src="${state.photos[a.id]}" alt="Your photo of ${esc(a.name)}">`
    : stock(a.id) ? `<img src="${stock(a.id).src}" alt="Photo of ${esc(a.name)}" loading="lazy">` : ART.get(a.id, a.name);
  const creditFor = (id) => state.photos[id] ? "Your photo" : stock(id) ? stock(id).credit : "Illustration";
  const words = (arr) => (arr || []).join(" ").split(/\s+/).filter(Boolean).length;
  const readMins = (arr) => Math.max(1, Math.round(words(arr) / 220));

  /* ---------- toast ---------- */
  let toastT;
  const toast = (t) => { const el = $("#toast"); el.textContent = t; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => (el.hidden = true), 2600); };

  /* ---------- routing ---------- */
  let current = "home", prevView = "home";
  const navFor = { lore: "guide" };
  function go(view, arg) {
    if (view === "lore" && current !== "lore") prevView = current;
    $$(".view").forEach((v) => (v.hidden = v.id !== "v-" + view));
    const active = navFor[view] || view;
    $$(".nav button, .tabbar button").forEach((b) => b.setAttribute("aria-current", b.dataset.go === active ? "page" : "false"));
    current = view;
    ({ home: renderHome, guide: renderGuide, lore: () => renderLore(arg), recent: renderRecent, saved: renderSaved, rescue: renderRescue, settings: renderSettings,
       login: () => ($("#loginArt").innerHTML = ART.get("great-horned-owl", "Great Horned Owl") + `<p class="quote">Every animal has a story. Start with a photo.</p>`) }[view] || (() => {}))();
    window.scrollTo({ top: 0 });
  }
  document.addEventListener("click", (e) => {
    const g = e.target.closest("[data-go]"); if (g) { e.preventDefault(); go(g.dataset.go); return; }
    const o = e.target.closest("[data-open]"); if (o) { openAnimal(o.dataset.open); return; }
    const a = e.target.closest("[data-act='identify']"); if (a) { go("home"); $("#fileIn").click(); }
  });
  function openAnimal(id) {
    if (!byId(id)) return;
    if (state.settings.history) { state.recent = [{ id, at: Date.now() }, ...state.recent.filter((r) => r.id !== id)].slice(0, 60); save(); }
    go("lore", id);
  }
  function renderCounts() {
    const set = (id, n) => ($("#" + id).textContent = n ? n : "");
    set("cGuide", allAnimals().length); set("cRecent", state.recent.length); set("cSaved", state.saved.length); set("cReports", state.reports.length);
  }

  /* ---------- account (demo) ---------- */
  function renderAcct() {
    if (state.user) {
      const n = state.user.split("@")[0];
      $("#sideAcct").innerHTML = `<div class="acct"><span class="avatar">${esc(n[0].toUpperCase())}</span><div class="who"><b>${esc(n)}</b><button class="linkbtn" id="logout" style="font-size:13px">Log out</button></div></div>`;
      $("#topAcct").innerHTML = `<span class="avatar" title="${esc(state.user)}">${esc(n[0].toUpperCase())}</span>`;
      $("#logout").onclick = () => { state.user = null; save(); renderAcct(); renderHome(); toast("Logged out"); };
    } else {
      $("#sideAcct").innerHTML = `<button class="btn block" data-go="login">Log in</button>`;
      $("#topAcct").innerHTML = `<button class="btn" data-go="login">Log in</button>`;
    }
  }
  $("#loginForm").addEventListener("submit", (e) => { e.preventDefault(); state.user = $("#loginEmail").value.trim() || "explorer@wildlens.demo"; save(); renderAcct(); toast("Logged in (demo)"); go("home"); });
  $("#googleBtn").onclick = () => { state.user = "google.user@wildlens.demo"; save(); renderAcct(); toast("Logged in (demo)"); go("home"); };

  /* ---------- shared pieces ---------- */
  const tile = (a, foot) => `<button class="tile" data-open="${a.id}">
      <div class="pic">${picHTML(a)}</div>
      <div class="over"><span class="pill ${statusClass(a.facts?.Status)}">${esc(a.facts?.Status || "Status unknown")}</span></div>
      ${state.saved.includes(a.id) ? `<span class="heart" title="Saved">${icon("heart")}</span>` : ""}
      <div class="body"><b>${esc(a.name)}</b><span class="sci">${esc(a.sci)}</span>
        <div class="foot"><span>${esc(a.cat || "Animal")}${a.generated ? " · New" : ""}</span><span>${foot || readMins([...(a.biology || []), ...(a.history || []), ...(a.symbolism || [])]) + " min read"}</span></div></div></button>`;
  const row = (a, meta) => `<button class="li" data-open="${a.id}"><span class="th">${picHTML(a)}</span><span><b>${esc(a.name)}</b><span class="meta">${meta}</span></span><span class="pill ${statusClass(a.facts?.Status)}">${esc(a.facts?.Status || "Unknown")}</span></button>`;
  const ago = (t) => { const m = Math.round((Date.now() - t) / 60000); if (m < 1) return "just now"; if (m < 60) return m + " min ago"; const h = Math.round(m / 60); if (h < 24) return h + " h ago"; const d = Math.round(h / 24); return d === 1 ? "yesterday" : d + " days ago"; };
  const fmtDate = (t, opts) => { try { return new Date(t).toLocaleString(undefined, opts); } catch { return new Date(t).toISOString(); } };
  const empty = (ic, h, p, btn) => `<div class="empty">${icon(ic)}<h3>${h}</h3><p>${p}</p>${btn || ""}</div>`;

  /* ---------- home ---------- */
  function renderHome() {
    const hr = new Date().getHours();
    const part = hr < 5 ? "Good night" : hr < 12 ? "Good morning" : hr < 18 ? "Good afternoon" : "Good evening";
    $("#greet").textContent = `${part}${state.user ? ", " + state.user.split("@")[0] : ""} · ${fmtDate(Date.now(), { weekday: "long", day: "numeric", month: "long" })}`;
    const sent = state.reports.filter((r) => r.status === "sent").length;
    const tiles = [
      ["scan", "Identified", state.scanCount, "photos scanned"],
      ["heart", "Saved", state.saved.length, "in your collection"],
      ["life", "Rescue reports", state.reports.length, state.reports.length ? `${sent} sent · ${state.reports.length - sent} not sent` : "none yet", "alert"],
      ["book", "Field guide", allAnimals().length, `${Object.keys(state.custom).length} added by you`],
    ];
    $("#stats").innerHTML = tiles.map(([ic, k, v, d, cls]) => `<div class="card stat ${cls || ""}"><span class="k">${icon(ic)}${k}</span><span class="v">${v}</span><span class="d">${d}</span></div>`).join("");
    const rec = state.recent.map((r) => ({ r, a: byId(r.id) })).filter((x) => x.a).slice(0, 5);
    $("#homeRecent").innerHTML = rec.length ? `<div class="list">${rec.map((x) => row(x.a, `<span class="sci">${esc(x.a.sci)}</span> · ${ago(x.r.at)}`)).join("")}</div>`
      : `<div class="card-pad" style="padding-top:6px">${empty("clock", "Nothing here yet", "Open a species from the field guide or identify a photo to start your research trail.", `<button class="btn primary" data-go="guide">Open the field guide</button>`)}</div>`;
    // status mix
    const groups = [["st-lc", "Least Concern", "c-lc"], ["st-nt", "Near Threatened", "c-nt"], ["st-vu", "Vulnerable", "c-vu"], ["st-en", "Endangered", "c-en"], ["st-xx", "Other / unknown", "c-xx"]];
    const all = allAnimals(); const counts = groups.map(([k]) => all.filter((a) => { const c = statusClass(a.facts?.Status); return k === "st-en" ? c === "st-en" || c === "st-cr" : c === k; }).length);
    $("#statusMix").innerHTML = `<div class="statusbar" role="img" aria-label="${groups.map((g, i) => `${g[1]}: ${counts[i]}`).join(", ")}">${groups.map((g, i) => counts[i] ? `<i class="${g[2]}" style="flex:${counts[i]}" title="${g[1]}: ${counts[i]}"></i>` : "").join("")}</div>
      <div class="legend">${groups.map((g, i) => counts[i] ? `<div><span class="sw ${g[2]}"></span>${g[1]}<span class="n">${counts[i]}</span></div>` : "").join("")}</div>`;
    const day = Math.floor(Date.now() / 864e5); const f = ANIMALS[day % ANIMALS.length];
    $("#featured").innerHTML = `<button class="feature" data-open="${f.id}"><span class="th">${picHTML(f)}</span><span><span class="eyebrow">Species of the day</span><b style="display:block;font-size:18px;margin-top:2px">${esc(f.name)}</b><span class="hint">${esc(f.biology[0].split(". ")[0])}.</span></span></button>`;
    renderCounts();
  }

  /* ---------- guide ---------- */
  let guideCat = "All";
  function renderGuide() {
    const all = allAnimals();
    const cats = ["All", ...new Set(all.map((a) => a.cat || "Animal"))];
    $("#guideCats").innerHTML = cats.map((c) => `<button class="chip" aria-pressed="${c === guideCat}" data-c="${esc(c)}">${esc(c)}</button>`).join("");
    $$("#guideCats .chip").forEach((b) => (b.onclick = () => { guideCat = b.dataset.c; renderGuide(); }));
    const q = $("#guideSearch").value.trim().toLowerCase(), st = $("#guideStatus").value;
    const shown = all.filter((a) => (guideCat === "All" || (a.cat || "Animal") === guideCat) && (!st || statusClass(a.facts?.Status) === st || (st === "st-en" && statusClass(a.facts?.Status) === "st-cr")) && (!q || (a.name + " " + a.sci).toLowerCase().includes(q)));
    $("#guideGrid").innerHTML = shown.length ? `<div class="grid">${shown.map((a) => tile(a)).join("")}</div>` : empty("search", "No matches", "Try another name, or clear the filters.");
  }
  $("#guideSearch").addEventListener("input", renderGuide);
  $("#guideStatus").addEventListener("change", renderGuide);

  /* ---------- lore ---------- */
  function renderLore(id) {
    const a = byId(id); if (!a) return go("home");
    const scan = state.scans[id], saved = state.saved.includes(id);
    const tabs = [["biology", "Biology"], ["history", "History"], ["symbolism", "Symbolism"]];
    const more = allAnimals().filter((x) => x.id !== id).sort((x, y) => ((x.cat === a.cat) ? -1 : 0) - ((y.cat === a.cat) ? -1 : 0)).slice(0, 4);
    $("#v-lore").innerHTML = `
      <div class="band"><div class="wrap">
        <button class="linkbtn" id="backBtn" style="color:var(--canopy-muted);display:inline-flex;gap:6px;align-items:center;margin-bottom:18px">${icon("back")}Back</button>
        <div class="lore-hero">
          <div class="pic">${picHTML(a)}<span class="credit">${esc(creditFor(id))}</span></div>
          <div>
            <p class="eyebrow">${esc(a.cat || "Animal")}${a.generated ? " · Identified by you" : ""}</p>
            <h1 style="margin-top:10px">${esc(a.name)}</h1>
            <p class="sci">${esc(a.sci)}</p>
            ${a.sub ? `<p class="subsp">Likely sub-species: ${esc(a.sub)}</p>` : ""}
            <div class="pills"><span class="pill ${statusClass(a.facts?.Status)}">${esc(a.facts?.Status || "Status unknown")}</span><span class="pill plain tag">${readMins([...a.biology || [], ...a.history || [], ...a.symbolism || []])} min read</span></div>
            ${scan ? `<div class="conf"><div style="display:flex;justify-content:space-between"><span>Match confidence</span><b>${scan.confidence}%</b></div><div class="meter"><i style="width:${Math.max(4, Math.min(100, scan.confidence))}%"></i></div></div>` : ""}
            <div class="btns">
              <button class="btn ${saved ? "saved" : ""}" id="saveBtn">${icon("heart")}${saved ? "Saved" : "Save animal"}</button>
              <button class="btn ember" id="rescueThis">${icon("life")}Report this animal in danger</button>
            </div>
          </div>
        </div>
      </div></div>
      <div class="wrap stack">
        <dl class="card facts" style="margin:0">${Object.entries(a.facts || {}).filter(([k]) => k !== "Status").map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
        <div class="reader">
          <article>
            <div class="tablist" role="tablist">${tabs.map(([k, l], i) => `<button role="tab" data-tab="${k}" aria-selected="${i === 0}">${l}<small>${readMins(a[k])} min</small></button>`).join("")}</div>
            <div class="prose" id="prose" role="tabpanel"></div>
            <p class="note">${a.generated ? "Written by Claude from your photo. Check key facts against a field guide before citing." : "Draft text for the demo. Needs subject-matter review before real use."}</p>
          </article>
          <aside><div class="card card-pad aside-card"><h3>More in your guide</h3><div>${more.map((m) => `<button class="li" data-open="${m.id}"><span class="th">${picHTML(m)}</span><span><b>${esc(m.name)}</b><span class="meta">${esc(m.cat || "")}</span></span></button>`).join("")}</div></div></aside>
        </div>
      </div>`;
    const showTab = (t) => {
      $$("#v-lore [role=tab]").forEach((b) => b.setAttribute("aria-selected", b.dataset.tab === t));
      $("#prose").innerHTML = (a[t] || []).map((p) => `<p>${esc(p)}</p>`).join("") || `<p>No notes yet.</p>`;
    };
    $$("#v-lore [role=tab]").forEach((b) => (b.onclick = () => showTab(b.dataset.tab)));
    showTab("biology");
    $("#backBtn").onclick = () => go(prevView || "home");
    $("#saveBtn").onclick = () => {
      if (state.saved.includes(id)) { state.saved = state.saved.filter((x) => x !== id); toast("Removed from saved"); }
      else { state.saved = [id, ...state.saved]; toast("Saved to your collection"); }
      save(); renderCounts(); renderLore(id);
    };
    $("#rescueThis").onclick = () => { draft.species = a.name; go("rescue"); };
  }

  /* ---------- recent ---------- */
  let recentFilter = "All";
  function renderRecent() {
    const items = state.recent.map((r) => ({ r, a: byId(r.id) })).filter((x) => x.a);
    const cats = ["All", ...new Set(items.map((x) => x.a.cat || "Animal"))];
    if (!cats.includes(recentFilter)) recentFilter = "All";
    $("#recentFilters").innerHTML = cats.map((c) => `<button class="chip" aria-pressed="${c === recentFilter}" data-f="${esc(c)}">${esc(c)}</button>`).join("");
    $$("#recentFilters .chip").forEach((b) => (b.onclick = () => { recentFilter = b.dataset.f; renderRecent(); }));
    const q = $("#recentSearch").value.trim().toLowerCase();
    const shown = items.filter((x) => (recentFilter === "All" || (x.a.cat || "Animal") === recentFilter) && (!q || (x.a.name + " " + x.a.sci).toLowerCase().includes(q)));
    $("#clearRecent").hidden = !items.length;
    if (!items.length) { $("#recentList").innerHTML = empty("clock", "No research yet", state.settings.history ? "Animals you identify or open will show up here." : "Research history is turned off in Settings.", `<button class="btn primary" data-act="identify">Identify an animal</button>`); return; }
    if (!shown.length) { $("#recentList").innerHTML = empty("search", "Nothing matches", "Try another search or filter."); return; }
    const label = (t) => { const d = new Date(t), n = new Date(); const y = new Date(n); y.setDate(n.getDate() - 1);
      return d.toDateString() === n.toDateString() ? "Today" : d.toDateString() === y.toDateString() ? "Yesterday" : fmtDate(t, { weekday: "long", day: "numeric", month: "long" }); };
    const groups = []; shown.forEach((x) => { const l = label(x.r.at); const g = groups.find((g) => g.l === l); g ? g.items.push(x) : groups.push({ l, items: [x] }); });
    $("#recentList").innerHTML = groups.map((g) => `<div class="day"><h3>${esc(g.l)}</h3><div class="card list">${g.items.map((x) => row(x.a, `<span class="sci">${esc(x.a.sci)}</span> · ${fmtDate(x.r.at, { hour: "2-digit", minute: "2-digit" })}`)).join("")}</div></div>`).join("");
  }
  $("#recentSearch").addEventListener("input", renderRecent);
  $("#clearRecent").onclick = () => { state.recent = []; save(); renderRecent(); renderCounts(); toast("History cleared"); };

  /* ---------- saved ---------- */
  function renderSaved() {
    const items = state.saved.map(byId).filter(Boolean);
    $("#savedSub").textContent = items.length ? `${items.length} animal${items.length > 1 ? "s" : ""} in your collection.` : "Your personal collection.";
    $("#savedGrid").innerHTML = items.length ? `<div class="grid">${items.map((a) => tile(a)).join("")}</div>`
      : empty("heart", "Your collection is empty", "Open any animal and press Save animal to keep it here.", `<button class="btn primary" data-open="snow-leopard">Start with the snow leopard</button>`);
  }

  /* ---------- settings ---------- */
  function applySettings() {
    const r = document.documentElement;
    if (state.settings.theme === "auto") r.removeAttribute("data-theme"); else r.setAttribute("data-theme", state.settings.theme);
    r.classList.toggle("reduce-motion", !!state.settings.motion);
  }
  function renderSettings() {
    $$("#themeSeg button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.v === state.settings.theme));
    $("#setHistory").checked = state.settings.history; $("#setMotion").checked = state.settings.motion;
    $("#setUpdates").checked = state.settings.updates; $("#setEmail").checked = state.settings.email; $("#setLang").value = state.settings.lang;
    const cfg = mailCfg();
    $("#cfgMail").textContent = cfg.ready ? (cfg.provider === "mailto" ? "Email app" : "Connected") : "Not set up";
    $("#cfgMail").className = "kv " + (cfg.ready ? "good" : "warn");
    $("#cfgMailHint").textContent = cfg.ready ? "Reports are delivered when you press Send." : "Reports are saved on this device and not sent yet.";
    $("#cfgTo").textContent = cfg.to.length ? cfg.to.join(", ") : "None yet";
    $("#wipeConfirm").hidden = true;
  }
  $$("#themeSeg button").forEach((b) => (b.onclick = () => { state.settings.theme = b.dataset.v; save(); applySettings(); renderSettings(); }));
  [["setHistory", "history"], ["setMotion", "motion"], ["setUpdates", "updates"], ["setEmail", "email"]].forEach(([el, k]) =>
    $("#" + el).addEventListener("change", (e) => { state.settings[k] = e.target.checked; save(); applySettings(); }));
  $("#setLang").addEventListener("change", (e) => { state.settings.lang = e.target.value; save(); toast("Language saved. Translations are coming later."); });
  $("#wipeBtn").onclick = () => ($("#wipeConfirm").hidden = false);
  $("#wipeNo").onclick = () => ($("#wipeConfirm").hidden = true);
  $("#wipeYes").onclick = () => {
    try { localStorage.removeItem(KEY); } catch {}
    Object.assign(state, { saved: [], recent: [], custom: {}, photos: {}, reports: [], scanCount: 0, user: null, scans: {} });
    state.settings = { theme: "auto", history: true, motion: false, updates: true, email: false, lang: "English" };
    applySettings(); renderAcct(); renderCounts(); renderSettings(); toast("All data deleted");
  };

  /* ---------- Claude (identification) ---------- */
  const samplePromise = (window.claude && typeof window.claude.use === "function") ? window.claude.use("sample").catch(() => null) : Promise.resolve(null);
  const ERR = {
    not_granted: "WildLens needs permission to use Claude for identification. Reload the page and allow it when asked.",
    sampling_disabled: "Claude isn't available on this account, so photos can't be identified here. You can still browse the field guide.",
    capability_disabled: "Identification isn't available in this view. Open the page on claude.ai to scan photos.",
    not_declared: "Identification isn't available in this view.",
    images_unavailable: "This view can't send photos to Claude. Try the page in a desktop browser.",
    image_rejected: "That image couldn't be read. Use a JPEG, PNG, WebP or GIF under 20 MB.",
    rate_limited: "Too many scans in a short time. Wait a minute, then try again.",
    session_expired: "Your session expired. Sign in to Claude again, then retry.",
    refused: "Claude couldn't identify this image. Try a different photo.",
    invalid_json: "The answer came back incomplete. Try the scan again.",
    empty_completion: "No answer came back. Try a clearer photo.",
    unavailable: "Photo identification works when this page is opened on claude.ai. You can still browse the field guide below.",
  };
  async function imageSampler() {
    const sample = await samplePromise; if (!sample) throw { code: "unavailable" };
    const lim = await sample.limits().catch(() => null); if (!lim?.images) throw { code: "images_unavailable" };
    return sample;
  }
  async function shrink(file, max, q = 0.82) {
    try {
      const bmp = await createImageBitmap(file);
      const s = Math.min(1, max / Math.max(bmp.width, bmp.height));
      const c = document.createElement("canvas"); c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s);
      c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
      return c.toDataURL("image/jpeg", q);
    } catch { return null; }
  }
  const slug = (s) => String(s || "animal").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);

  const drop = $("#drop"), dropEmpty = $("#dropEmpty"), msg = $("#scanMsg");
  let ctl = null, busy = false;
  const showMsg = (text, kind) => { msg.hidden = !text; msg.className = "msg" + (kind ? " " + kind : ""); msg.textContent = text || ""; };
  const resetDrop = () => { $$(".preview,.reticle,.status", drop).forEach((n) => n.remove()); dropEmpty.hidden = false; };

  async function identify(file) {
    if (busy || !file) return;
    if (!/^image\//.test(file.type)) { showMsg("That file isn't an image. Choose a photo.", "err"); return; }
    busy = true; showMsg("");
    const url = URL.createObjectURL(file);
    resetDrop(); dropEmpty.hidden = true;
    drop.insertAdjacentHTML("beforeend", `<img class="preview" alt="Your photo" src="${url}"><div class="reticle"><i></i><i></i><i></i><i></i></div><div class="status"><span style="display:flex;gap:8px;align-items:center"><span class="spin"></span>Identifying…</span><button class="linkbtn" id="stopBtn" type="button">Stop</button></div>`);
    ctl = new AbortController();
    $("#stopBtn").onclick = (e) => { e.stopPropagation(); ctl.abort(); };
    try {
      const sample = await imageSampler();
      const ids = ANIMALS.map((a) => `${a.id} (${a.name})`).join(", ");
      const prompt = `You are the identification engine of WildLens, a field-guide app for biology students, veterinarians and authors.
Look at the attached photo and identify the animal in it.

Known profile ids: ${ids}.

Reply with ONLY one JSON object, no other text:
{"isAnimal": boolean, "reason": string (only if isAnimal is false: one short sentence on what the photo shows),
 "matchId": one of the known ids above if the animal is that species, else null,
 "name": common name, "sci": scientific name, "sub": likely sub-species or population ("" if none can be told),
 "confidence": integer 0-100, "cat": one of "Mammal","Bird","Reptile","Amphibian","Fish","Insect","Other",
 "facts": {"Diet": string, "Size": string, "Lifespan": string, "Range": string, "Status": IUCN status in words},
 "biology": [4-5 paragraphs], "history": [4-5 paragraphs], "symbolism": [4-5 paragraphs]}
If matchId is not null, return empty arrays for biology, history and symbolism and an empty facts object.
Each paragraph is 3-4 plain sentences of accurate, specific information (anatomy, behavior, diet, reproduction; key dates and people; myths, national emblems, literature). If unsure of the exact species, name the most likely one and lower the confidence.`;
      const r = await sample.json(prompt, { images: [file], signal: ctl.signal, modelTier: "default" });
      if (!r || typeof r !== "object") throw { code: "invalid_json" };
      if (r.isAnimal === false) { resetDrop(); showMsg(`No animal found. ${r.reason || "Try a photo where the animal is clearly visible."}`, "err"); return; }
      let id = r.matchId && ANIMALS.some((a) => a.id === r.matchId) ? r.matchId : null;
      if (!id) {
        id = "x-" + slug(r.sci || r.name);
        const arr = (v) => (Array.isArray(v) ? v.map(String).filter(Boolean).slice(0, 6) : []);
        const f = r.facts && typeof r.facts === "object" ? r.facts : {};
        state.custom[id] = { id, generated: true, name: String(r.name || "Unknown animal"), sci: String(r.sci || ""), sub: String(r.sub || ""), cat: String(r.cat || "Other"),
          facts: Object.fromEntries(["Diet", "Size", "Lifespan", "Range", "Status"].filter((k) => f[k]).map((k) => [k, String(f[k])])),
          biology: arr(r.biology), history: arr(r.history), symbolism: arr(r.symbolism) };
      }
      const t = await shrink(file, 640); if (t) state.photos[id] = t;
      state.scans[id] = { confidence: Math.round(Number(r.confidence) || 0) };
      state.scanCount++;
      save(); resetDrop(); openAnimal(id);
    } catch (e) {
      resetDrop();
      if (e?.code !== "cancelled") showMsg(ERR[e?.code] || "Something went wrong while identifying. Try again in a moment.", "err");
    } finally { busy = false; URL.revokeObjectURL(url); }
  }
  ["fileIn", "camIn"].forEach((i) => $("#" + i).addEventListener("change", (e) => { identify(e.target.files[0]); e.target.value = ""; }));
  drop.addEventListener("click", () => { if (!busy) $("#fileIn").click(); });
  drop.addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && !busy) { e.preventDefault(); $("#fileIn").click(); } });
  ["dragenter", "dragover"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add("over"); }));
  ["dragleave", "drop"].forEach((t) => drop.addEventListener(t, () => drop.classList.remove("over")));
  drop.addEventListener("drop", (e) => { e.preventDefault(); identify(e.dataTransfer.files[0]); });

  /* ================= RESCUE ================= */
  const SITUATIONS = ["Injured", "Trapped or entangled", "Orphaned or alone", "Sick or weak", "On a road", "Oiled or polluted", "Attacked by a pet", "Other"];
  const blankDraft = () => ({ photo: null, species: "", situations: [], urgency: "", comment: "", name: "", phone: "", place: "", loc: null, locState: "idle", locError: "" });
  let draft = blankDraft();
  let sending = false;

  function mailCfg() {
    const c = typeof RESCUE_CONFIG === "object" && RESCUE_CONFIG ? RESCUE_CONFIG : {};
    const to = (Array.isArray(c.to) ? c.to : [c.to]).filter((x) => typeof x === "string" && x.includes("@"));
    const provider = ["mailto", "endpoint"].includes(c.provider) ? c.provider : "none";
    const ready = provider === "mailto" ? to.length > 0 : provider === "endpoint" ? !!c.endpoint : false;
    return { provider, to, ready, endpoint: c.endpoint || "", prefix: c.subjectPrefix || "[WildLens Rescue]", authority: c.authorityName || "local wildlife authorities" };
  }

  function renderRescue() {
    const d = draft;
    // 1. photo
    $("#rsPhotoBox").innerHTML = d.photo
      ? `<div class="rs-photo"><img src="${d.photo}" alt="Photo of the animal"><div class="x"><button class="btn" type="button" id="rsRemove">Remove</button></div></div>`
      : `<div class="drop photo-drop" id="rsDrop" role="button" tabindex="0" aria-label="Add a photo of the animal"><div class="drop-empty"><span class="ring">${icon("camera")}</span><h3>Add a photo</h3><p>Take one now, choose from your gallery, drop or paste it here.</p></div></div>`;
    if (d.photo) $("#rsRemove").onclick = () => { draft.photo = null; renderRescue(); };
    else {
      const rd = $("#rsDrop");
      rd.onclick = () => $("#rsCam").click();
      rd.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); $("#rsCam").click(); } };
      ["dragenter", "dragover"].forEach((t) => rd.addEventListener(t, (e) => { e.preventDefault(); rd.classList.add("over"); }));
      rd.addEventListener("dragleave", () => rd.classList.remove("over"));
      rd.addEventListener("drop", (e) => { e.preventDefault(); setRescuePhoto(e.dataTransfer.files[0]); });
    }
    $("#st1").classList.toggle("done", !!d.photo);
    // 2. condition
    $("#rsSpecies").value = d.species;
    $("#rsSituations").innerHTML = SITUATIONS.map((s) => `<button type="button" class="chip" aria-pressed="${d.situations.includes(s)}" data-s="${esc(s)}">${esc(s)}</button>`).join("");
    $$("#rsSituations .chip").forEach((b) => (b.onclick = () => { const s = b.dataset.s; draft.situations = draft.situations.includes(s) ? draft.situations.filter((x) => x !== s) : [...draft.situations, s]; b.setAttribute("aria-pressed", draft.situations.includes(s)); renderSummary(); }));
    $$("#rsUrgency button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.v === d.urgency));
    $("#rsComment").value = d.comment; $("#rsName").value = d.name; $("#rsPhone").value = d.phone; $("#rsPlace").value = d.place;
    $("#rsCount").textContent = `${d.comment.length} / 1000`;
    $("#st2").classList.toggle("done", condOk());
    // 3. location
    renderLoc();
    renderSummary();
    renderReports();
    samplePromise.then(async (s) => { const lim = s ? await s.limits().catch(() => null) : null; $("#rsIdentify").hidden = !(lim && lim.images && draft.photoFile); });
  }
  const condOk = () => draft.comment.trim().length >= 10 && !!draft.urgency;
  const locOk = () => !!draft.loc || draft.place.trim().length >= 4;

  function renderLoc() {
    const d = draft, box = $("#rsLocBox");
    if (d.loc) {
      const { lat, lon, acc, at } = d.loc;
      box.innerHTML = `<div class="loc-card"><span class="pin">${icon("pin")}</span><div style="min-width:0"><b class="mono">${lat.toFixed(5)}, ${lon.toFixed(5)}</b>
        <span class="hint">Accuracy about ±${Math.round(acc)} m · captured ${fmtDate(at, { hour: "2-digit", minute: "2-digit" })}</span>
        <div style="display:flex;gap:14px;margin-top:6px;flex-wrap:wrap"><a href="https://www.google.com/maps?q=${lat},${lon}" target="_blank" rel="noopener">Open in Maps</a><button type="button" class="linkbtn" id="rsLocAgain">Update location</button><button type="button" class="linkbtn" id="rsLocClear" style="color:var(--muted)">Remove</button></div></div></div>`;
      $("#rsLocAgain").onclick = getLocation; $("#rsLocClear").onclick = () => { draft.loc = null; draft.locState = "idle"; renderLoc(); renderSummary(); };
    } else if (d.locState === "busy") {
      box.innerHTML = `<div class="loc-card"><span class="pin">${icon("pin")}</span><div><b>Finding your location…</b><span class="hint">Allow location access if your browser asks.</span></div></div>`;
    } else {
      box.innerHTML = `${d.locState === "error" ? `<div class="msg err" style="margin-bottom:10px">${esc(d.locError)}</div>` : ""}
        <button type="button" class="btn primary lg block" id="rsLocBtn">${icon("pin")}Use my current location</button>`;
      $("#rsLocBtn").onclick = getLocation;
    }
    $("#st3").classList.toggle("done", locOk());
  }

  function getLocation() {
    if (!("geolocation" in navigator)) { draft.locState = "error"; draft.locError = "This browser can't share its location. Describe the place below instead."; renderLoc(); return; }
    draft.locState = "busy"; renderLoc();
    navigator.geolocation.getCurrentPosition(
      (p) => { draft.loc = { lat: p.coords.latitude, lon: p.coords.longitude, acc: Math.max(1, p.coords.accuracy || 1), at: Date.now() }; draft.locState = "ok"; renderLoc(); renderSummary(); toast("Location added"); },
      (err) => {
        draft.locState = "error";
        draft.locError = err && err.code === 1
          ? "Location access is blocked. Allow it in your browser settings, or describe the place below. (Inside claude.ai previews, location is always blocked.)"
          : err && err.code === 3 ? "Finding your location took too long. Try again outdoors, or describe the place below."
          : "Your location couldn't be found. Try again, or describe the place below.";
        renderLoc(); renderSummary();
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  }

  function renderSummary() {
    const cfg = mailCfg(), d = draft;
    const checks = [[!!d.photo, "Photo of the animal"], [d.comment.trim().length >= 10, "Description of its state"], [!!d.urgency, "Urgency level"], [locOk(), "Location or directions"]];
    const ready = checks.every((c) => c[0]);
    $("#rsSummary").innerHTML = `
      <div><p class="eyebrow">Step 4</p><h3 style="margin-top:4px">Review and send</h3></div>
      <ul class="check">${checks.map(([ok, l]) => `<li class="${ok ? "ok" : ""}"><span class="dot">${ok ? icon("check") : ""}</span>${l}</li>`).join("")}</ul>
      ${d.urgency ? `<p style="font-size:14px">Urgency: <span class="pill ${d.urgency === "Critical" ? "st-en" : d.urgency === "Urgent" ? "st-vu" : "st-lc"}">${esc(d.urgency)}</span></p>` : ""}
      <div class="sendto">${icon("mail")} Sends to <b>${cfg.to.length ? esc(cfg.to.join(", ")) : esc(cfg.authority)}</b>${cfg.ready ? "" : `<br><span style="color:var(--warn);font-weight:600">Email isn't set up yet. Your report will be saved on this device.</span>`}</div>
      <button class="btn ember lg block" id="rsSend" ${ready && !sending ? "" : "disabled"}>${sending ? `<span class="spin"></span>Sending…` : `${icon("send")}Send`}</button>
      <p class="hint">${ready ? "Check the details, then press Send." : "Complete the items above to send."}</p>`;
    $("#rsSend").onclick = sendReport;
    $("#st2").classList.toggle("done", condOk());
  }

  // inputs
  const bindText = (id, key, after) => $(id).addEventListener("input", (e) => { draft[key] = e.target.value; after && after(); renderSummary(); });
  bindText("#rsSpecies", "species"); bindText("#rsName", "name"); bindText("#rsPhone", "phone");
  bindText("#rsPlace", "place", () => $("#st3").classList.toggle("done", locOk()));
  $("#rsComment").setAttribute("maxlength", "1000");
  bindText("#rsComment", "comment", () => ($("#rsCount").textContent = `${draft.comment.length} / 1000`));
  $$("#rsUrgency button").forEach((b) => (b.onclick = () => { draft.urgency = b.dataset.v; $$("#rsUrgency button").forEach((x) => x.setAttribute("aria-pressed", x === b)); renderSummary(); }));
  $("#rescueForm").addEventListener("submit", (e) => e.preventDefault());

  async function setRescuePhoto(file) {
    if (!file || !/^image\//.test(file.type)) { toast("Choose an image file"); return; }
    const data = await shrink(file, 1280, 0.85);
    if (!data) { toast("That image couldn't be read"); return; }
    draft.photo = data; draft.photoFile = file; renderRescue();
  }
  ["rsCam", "rsFile"].forEach((i) => $("#" + i).addEventListener("change", (e) => { setRescuePhoto(e.target.files[0]); e.target.value = ""; }));

  $("#rsIdentify").onclick = async () => {
    const b = $("#rsIdentify"); b.disabled = true; b.innerHTML = `<span class="spin"></span>Identifying`;
    try {
      const sample = await imageSampler();
      const r = await sample.json('Name the animal in this photo. Reply with only JSON: {"name": common name, or "" if no animal is visible}', { images: [draft.photoFile], modelTier: "quick" });
      if (r && r.name) { draft.species = String(r.name).slice(0, 80); $("#rsSpecies").value = draft.species; toast("Animal identified: " + draft.species); }
      else toast("No animal recognized in the photo");
    } catch (e) { toast(ERR[e?.code] ? ERR[e.code].split(".")[0] : "Couldn't identify the animal"); }
    finally { b.disabled = false; b.innerHTML = `${icon("sparkle")}Identify`; }
  };

  function composeEmail(r) {
    const cfg = mailCfg();
    const where = r.place || (r.loc ? `${r.loc.lat.toFixed(4)}, ${r.loc.lon.toFixed(4)}` : "unknown location");
    const subject = `${cfg.prefix} ${r.urgency}: ${r.species || "Animal"} needs help near ${where}`.slice(0, 180);
    const L = [];
    L.push(`WildLens rescue report ${r.id}`, "");
    L.push(`Urgency:   ${r.urgency}`);
    L.push(`Animal:    ${r.species || "Not identified"}`);
    L.push(`Situation: ${r.situations.length ? r.situations.join(", ") : "Not specified"}`);
    L.push(`Reported:  ${fmtDate(r.createdAt, { dateStyle: "medium", timeStyle: "short" })}`, "");
    L.push("CONDITION", r.comment, "");
    L.push("LOCATION");
    if (r.loc) { L.push(`Coordinates: ${r.loc.lat.toFixed(5)}, ${r.loc.lon.toFixed(5)} (accuracy about ±${Math.round(r.loc.acc)} m)`); L.push(`Map: https://www.google.com/maps?q=${r.loc.lat.toFixed(6)},${r.loc.lon.toFixed(6)}`); }
    else L.push("Coordinates: not shared");
    if (r.place) L.push(`Directions: ${r.place}`);
    L.push("", "REPORTER", `Name:  ${r.name || "Not given"}`, `Phone: ${r.phone || "Not given"}`, "");
    L.push(cfg.provider === "mailto" ? "Photo: taken in the WildLens app (email apps can't attach it automatically)." : "Photo: attached.");
    L.push("", "Sent with WildLens. Please don't reply to the app; contact the reporter directly if details are given.");
    return { to: cfg.to, subject, body: L.join("\n") };
  }

  const newId = () => { const d = new Date(); const p = (n) => String(n).padStart(2, "0"); return `WL-${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`; };

  async function sendReport() {
    if (sending) return;
    const d = draft;
    const r = { id: newId(), createdAt: Date.now(), species: d.species.trim(), situations: [...d.situations], urgency: d.urgency, comment: d.comment.trim(), name: d.name.trim(), phone: d.phone.trim(), place: d.place.trim(), loc: d.loc, status: "saved", note: "" };
    const mail = composeEmail(r);
    const cfg = mailCfg();
    sending = true; renderSummary();
    try {
      if (cfg.provider === "endpoint" && cfg.ready) {
        const fd = new FormData();
        fd.append("_subject", mail.subject); fd.append("to", mail.to.join(",")); fd.append("message", mail.body);
        fd.append("report_id", r.id); fd.append("urgency", r.urgency); fd.append("species", r.species);
        if (r.loc) { fd.append("latitude", r.loc.lat); fd.append("longitude", r.loc.lon); fd.append("accuracy_m", Math.round(r.loc.acc)); }
        const blob = await (await fetch(d.photo)).blob(); fd.append("photo", blob, r.id + ".jpg");
        const res = await fetch(cfg.endpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error("HTTP " + res.status);
        r.status = "sent"; r.note = `Sent to ${cfg.to.join(", ") || cfg.authority}`;
      } else if (cfg.provider === "mailto" && cfg.ready) {
        const a = document.createElement("a");
        a.href = `mailto:${cfg.to.map(encodeURIComponent).join(",")}?subject=${encodeURIComponent(mail.subject)}&body=${encodeURIComponent(mail.body)}`;
        a.target = "_blank"; a.rel = "noopener"; document.body.appendChild(a); a.click(); a.remove();
        r.status = "draft"; r.note = "Opened in your email app. Check it was sent from there.";
      } else {
        r.status = "saved"; r.note = "Email isn't set up yet, so the report was saved on this device and not sent.";
      }
    } catch (e) {
      r.status = "failed"; r.note = "Sending failed (" + (e.message || "network error") + "). The report is saved; try again later.";
    }
    r.thumb = await (async () => { try { const img = new Image(); img.src = d.photo; await img.decode(); const c = document.createElement("canvas"); const s = 320 / Math.max(img.width, img.height); c.width = img.width * s; c.height = img.height * s; c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); return c.toDataURL("image/jpeg", 0.75); } catch { return null; } })();
    r.mail = { subject: mail.subject, body: mail.body, to: mail.to };
    state.reports = [r, ...state.reports].slice(0, 50);
    const stored = save();
    sending = false; draft = blankDraft();
    renderRescue(); renderCounts(); showResult(r, stored);
    $("#rsResult").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const statusPill = (s) => ({ sent: `<span class="pill st-lc">Sent</span>`, draft: `<span class="pill st-vu">In email app</span>`, failed: `<span class="pill st-en">Failed</span>`, saved: `<span class="pill st-xx">Saved · not sent</span>` }[s] || "");
  function showResult(r, stored = true) {
    const box = $("#rsResult");
    const head = { sent: ["check", "Report sent", "ok"], draft: ["mail", "Report opened in your email app", "ok"], failed: ["alert", "Report not sent", "err"], saved: ["check", "Report saved", ""] }[r.status];
    box.hidden = false;
    box.innerHTML = `<div class="card-pad" style="display:grid;gap:14px">
      <div class="sec-head" style="margin:0"><h2 style="display:flex;gap:10px;align-items:center">${icon(head[0])}${head[1]}</h2><span class="mono hint">${esc(r.id)}</span></div>
      <div class="msg ${head[2]}">${esc(r.note)}${stored ? "" : " This browser's storage is full, so the report may not survive a reload."}</div>
      <div><p class="eyebrow" style="margin-bottom:6px">Email preview</p>
        <div class="mail">To: ${esc((r.mail.to || []).join(", ") || "(not set up)")}\nSubject: ${esc(r.mail.subject)}\n\n${esc(r.mail.body)}</div></div>
      <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn" id="rsCopy">${icon("copy")}Copy report text</button><button class="btn" id="rsCloseRes">Close</button></div></div>`;
    $("#rsCopy").onclick = async () => {
      const text = `Subject: ${r.mail.subject}\n\n${r.mail.body}`;
      try { await navigator.clipboard.writeText(text); toast("Report copied"); }
      catch { const sel = window.getSelection(); const range = document.createRange(); range.selectNodeContents($("#rsResult .mail")); sel.removeAllRanges(); sel.addRange(range); toast("Press Ctrl+C or ⌘C to copy"); }
    };
    $("#rsCloseRes").onclick = () => (box.hidden = true);
  }

  function renderReports() {
    const list = state.reports;
    $("#rsReportsHint").textContent = list.length ? `${list.length} report${list.length > 1 ? "s" : ""} on this device` : "";
    $("#rsReports").innerHTML = list.length ? `<div class="card">${list.map((r) => `<div class="report">
        <span class="th">${r.thumb ? `<img src="${r.thumb}" alt="">` : ""}</span>
        <div style="min-width:0"><b>${esc(r.species || "Animal")} · ${esc(r.urgency)}</b><span class="meta">${esc(fmtDate(r.createdAt, { dateStyle: "medium", timeStyle: "short" }))} · ${esc(r.place || (r.loc ? r.loc.lat.toFixed(3) + ", " + r.loc.lon.toFixed(3) : ""))}</span><div style="margin-top:4px">${statusPill(r.status)}</div></div>
        <button class="btn" data-rep="${esc(r.id)}">View</button></div>`).join("")}</div>`
      : empty("life", "No reports yet", "Reports you send appear here so you can track them.");
    $$("[data-rep]").forEach((b) => (b.onclick = () => { const r = state.reports.find((x) => x.id === b.dataset.rep); if (r) { showResult(r); $("#rsResult").scrollIntoView({ behavior: "smooth", block: "start" }); } }));
  }

  /* ---------- paste anywhere ---------- */
  document.addEventListener("paste", (e) => {
    if (e.target.closest && e.target.closest("input,textarea")) return;
    const f = [...(e.clipboardData?.files || [])].find((x) => x.type.startsWith("image/"));
    if (!f) return;
    if (current === "rescue") setRescuePhoto(f); else { if (current !== "home") go("home"); identify(f); }
  });

  /* ---------- boot ---------- */
  applySettings(); renderAcct(); go("home");
  const h = location.hash.slice(1);
  if (h === "rescue") go("rescue"); else if (h && byId(h)) openAnimal(h);
})();
