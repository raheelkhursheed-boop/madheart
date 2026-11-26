// silkroute.art: two-step sign-up and sign-in (email → six-digit code) for any <form data-auth="join|signin">.
// The form holds a .step1 block (email and any profile fields) and a .step2 block (the code).
// Without JavaScript, a join form still posts to its action (the waitlist), so nobody is turned away.
(() => {
  const post = async (path, body) => {
    const r = await fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body), credentials: "same-origin" });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || "Something went wrong. Please try again.");
    return d;
  };

  document.querySelectorAll("form[data-auth]").forEach((form) => {
    const mode = form.dataset.auth;
    const q = (s) => form.querySelector(s);
    const step1 = q(".step1"), step2 = q(".step2"), err = q(".auth-err"), btn = q("button[type=submit]");
    const codeIn = q("input[name=code]");
    const label = btn.innerHTML;
    let email = "", stage = 1, busy = false;

    const say = (m) => { if (!err) return alert(m); err.textContent = m || ""; err.hidden = !m; };
    const wait = (on, text) => { busy = on; btn.disabled = on; btn.innerHTML = on ? text : stage === 1 ? label : 'Confirm <span class="a" aria-hidden="true">&rarr;</span>'; };

    const toStep2 = () => {
      stage = 2;
      step1.hidden = true; step2.hidden = false;
      q(".sent-to").textContent = email;
      codeIn.value = ""; codeIn.required = true;
      step1.querySelectorAll("[required]").forEach((el) => { el.dataset.req = "1"; el.required = false; });
      wait(false);
      codeIn.focus();
    };
    const toStep1 = () => {
      stage = 1;
      step2.hidden = true; step1.hidden = false; codeIn.required = false;
      step1.querySelectorAll("[data-req]").forEach((el) => (el.required = true));
      say(""); wait(false);
      q("input[type=email]").focus();
    };

    const start = async () => {
      const f = new FormData(form);
      email = (f.get("email") || "").toString().trim();
      const body = { mode, email, website: f.get("company-website") || "" };
      if (mode === "join") {
        body.name = f.get("name") || ""; body.country = f.get("country") || "";
        body.interest = f.get("interest") || ""; body.updates = f.get("consent") === "yes";
      }
      await post("/api/auth/start", body);
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (busy) return;
      say("");
      try {
        if (stage === 1) {
          wait(true, "Sending a code…");
          await start();
          toStep2();
        } else {
          wait(true, "Checking…");
          const d = await post("/api/auth/verify", { email, code: codeIn.value });
          location.href = form.dataset.next || d.next || "/account";
        }
      } catch (x) { say(x.message); wait(false); }
    });

    // Paste or type six digits and it submits itself.
    codeIn.addEventListener("input", () => {
      codeIn.value = codeIn.value.replace(/\D/g, "").slice(0, 6);
      if (codeIn.value.length === 6 && !busy) form.requestSubmit();
    });
    q(".again")?.addEventListener("click", async () => {
      say("");
      try { await start(); say(""); q(".again").textContent = "New code sent"; setTimeout(() => (q(".again").textContent = "Send a new code"), 4000); }
      catch (x) { say(x.message); }
    });
    q(".other")?.addEventListener("click", toStep1);

    // Pre-fill from ?email= (links in emails, or the homepage handing over).
    const pre = new URLSearchParams(location.search).get("email");
    if (pre && q("input[type=email]")) q("input[type=email]").value = pre;
  });
})();
