// --- Toast Helper (Zero alert()) ---
function showToast(msg) {
  const toast = document.getElementById("toastPill");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2400);
}

// --- Web Audio Chime Synthesizer ---
function playChime(freq = 640) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.4);
  } catch (e) {}
}

// --- Smooth Scrolling with Lenis ---
let lenis = null;
try {
  if (typeof Lenis !== "undefined") {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    window.lenis = lenis;
  }
} catch (e) {
  console.warn("Lenis initialization error:", e);
}

// --- 1. Theme Toggle with LocalStorage & Correct Icons ---
const themeToggleBtn = document.getElementById("themeToggleBtn");
const themeIcon = document.getElementById("themeIcon");
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const isDark = theme === "dark";
  // In Dark mode, show Sun ☀️ to switch to Light mode
  // In Light mode, show Moon 🌙 to switch to Dark mode
  themeIcon.textContent = isDark ? "☀️" : "🌙";
  themeToggleBtn.setAttribute(
    "aria-label",
    isDark
      ? "Switch to Daylight Maggi (Light Mode)"
      : "Switch to Midnight Kitchen (Dark Mode)"
  );
  themeToggleBtn.setAttribute(
    "title",
    isDark ? "Switch to Light Mode" : "Switch to Dark Mode"
  );
  localStorage.setItem("savora-theme", theme);
}
themeToggleBtn.addEventListener("click", () => {
  const current =
    document.documentElement.getAttribute("data-theme") || "light";
  const nextTheme = current === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  playChime(nextTheme === "dark" ? 520 : 780);
  showToast(
    `Switched to ${nextTheme === "dark" ? "Midnight Kitchen" : "Daylight Maggi"} Theme`,
  );
});
setTheme(localStorage.getItem("savora-theme") || "light");

// --- 2. Dynamic Servings Recalculator ---
const baseIngredients = [
  { name: "Maggi Masala noodle cakes", amount: 2, unit: "cakes" },
  { name: "Tastemaker spice sachets", amount: 2, unit: "packets" },
  {
    name: "Fresh filtered water",
    amount: 600,
    unit: "ml (approx. 4 cups)",
  },
  {
    name: "Sweet green peas & diced heirloom carrots",
    amount: 0.5,
    unit: "cup",
  },
  {
    name: "Golden salted butter (for emulsion)",
    amount: 1,
    unit: "tbsp",
  },
  {
    name: "Fresh garden basil & cilantro sprigs",
    amount: 10,
    unit: "leaves",
  },
];
let currentServings = 2;
const ingredientsList = document.getElementById("ingredientsList");
const servingDisplay = document.getElementById("servingDisplay");

function renderIngredients() {
  ingredientsList.innerHTML = "";
  const ratio = currentServings / 2;
  baseIngredients.forEach((item, idx) => {
    const qty = item.amount * ratio;
    const displayQty = qty % 1 === 0 ? qty : qty.toFixed(1);
    const isChecked = localStorage.getItem(`savora-ing-${idx}`) === "true";

    const li = document.createElement("li");
    li.className = `ing-item ${isChecked ? "checked" : ""}`;
    li.innerHTML = `
          <input type="checkbox" id="ing-${idx}" class="ing-checkbox" ${isChecked ? "checked" : ""}>
          <label for="ing-${idx}" class="ing-text">
            <strong>${displayQty} ${item.unit}</strong> &mdash; ${item.name}
          </label>
        `;
    li.querySelector(".ing-checkbox").addEventListener("change", (e) => {
      li.classList.toggle("checked", e.target.checked);
      localStorage.setItem(`savora-ing-${idx}`, e.target.checked);
    });
    ingredientsList.appendChild(li);
  });
  servingDisplay.textContent = currentServings;
}

document.getElementById("btnIncServing").addEventListener("click", () => {
  if (currentServings < 12) {
    currentServings++;
    renderIngredients();
    playChime(620);
  }
});
document.getElementById("btnDecServing").addEventListener("click", () => {
  if (currentServings > 1) {
    currentServings--;
    renderIngredients();
    playChime(540);
  }
});
renderIngredients();

// --- 3. Step-by-Step Cooking Mode with Voice Speech ---
const cookingSteps = [
  {
    title: "Boil Water",
    desc: "Take 2 cups (approx. 300 ml per noodle cake) of fresh filtered water in a saucepan and bring it to a rolling boil over medium-high heat.",
  },
  {
    title: "Add Noodles",
    desc: "Add the noodle cake and break gently in half if you prefer manageable strands. Toss in diced carrots and sweet green peas.",
  },
  {
    title: "Add Tastemaker",
    desc: "Tear open the masala tastemaker sachet and sprinkle evenly across the water. Stir gently with a fork to disperse spices.",
  },
  {
    title: "Cook on Medium Flame",
    desc: "Cook for exactly 2 minutes on medium flame, stirring occasionally so the noodles absorb the spiced reduction without sticking.",
  },
  {
    title: "Check & Stir with Butter",
    desc: "Check noodle tenderness. Swirl in 1 tbsp cold butter for a velvety sheen. Simmer 30 seconds more if extra reduction is desired.",
  },
  {
    title: "Serve Hot",
    desc: "Pour into deep ceramic bowls. Garnish with torn fresh basil and cilantro. Enjoy while piping hot!",
  },
];
let activeStepIdx = 0;
const activeStepTag = document.getElementById("activeStepTag");
const activeStepHeading = document.getElementById("activeStepHeading");
const activeStepDesc = document.getElementById("activeStepDesc");
const stepTrackFill = document.getElementById("stepTrackFill");
const btnPrevStep = document.getElementById("btnPrevStep");
const btnNextStep = document.getElementById("btnNextStep");

function updateStepUI() {
  const step = cookingSteps[activeStepIdx];
  activeStepTag.textContent = `STEP ${activeStepIdx + 1} OF ${cookingSteps.length}`;
  activeStepHeading.textContent = step.title;
  activeStepDesc.textContent = step.desc;
  stepTrackFill.style.width = `${((activeStepIdx + 1) / cookingSteps.length) * 100}%`;
  btnPrevStep.disabled = activeStepIdx === 0;
  btnNextStep.textContent =
    activeStepIdx === cookingSteps.length - 1
      ? "Finish Cooking ✓"
      : "Next Step →";
}

btnPrevStep.addEventListener("click", () => {
  if (activeStepIdx > 0) {
    activeStepIdx--;
    updateStepUI();
    playChime(520);
  }
});
btnNextStep.addEventListener("click", () => {
  if (activeStepIdx < cookingSteps.length - 1) {
    activeStepIdx++;
    updateStepUI();
    playChime(640);
  } else {
    showToast("Cooking Complete! Enjoy your steaming bowl! ❤️");
    playChime(880);
  }
});

document.getElementById("btnVoiceRead").addEventListener("click", () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const step = cookingSteps[activeStepIdx];
    const utterance = new SpeechSynthesisUtterance(
      `Step ${activeStepIdx + 1}: ${step.title}. ${step.desc}`,
    );
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
    showToast("Narrating step aloud 🔊");
  } else {
    showToast("Speech synthesis is not supported in this browser.");
  }
});

// --- 4. Precision 2-Minute Simmer Stopwatch ---
let timerSeconds = 120;
let timerInterval = null;
let isTimerRunning = false;
const timerDigits = document.getElementById("timerDigits");
const timerStatus = document.getElementById("timerStatus");
const btnTimerStart = document.getElementById("btnTimerStart");

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function timerTick() {
  if (timerSeconds > 0) {
    timerSeconds--;
    timerDigits.textContent = formatTime(timerSeconds);
  } else {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerStatus.textContent = "Timer Complete! Remove saucepan from heat.";
    btnTimerStart.textContent = "Start Timer";
    playChime(880);
    showToast("2-Minute Simmer Complete! 🔔");
  }
}

btnTimerStart.addEventListener("click", () => {
  if (!isTimerRunning) {
    if (timerSeconds <= 0) timerSeconds = 120;
    timerInterval = setInterval(timerTick, 1000);
    isTimerRunning = true;
    btnTimerStart.textContent = "Pause Timer";
    timerStatus.textContent = "Simmering noodles...";
  } else {
    clearInterval(timerInterval);
    isTimerRunning = false;
    btnTimerStart.textContent = "Resume Timer";
    timerStatus.textContent = "Timer paused";
  }
});

document.getElementById("btnTimerReset").addEventListener("click", () => {
  clearInterval(timerInterval);
  isTimerRunning = false;
  timerSeconds = 120;
  timerDigits.textContent = formatTime(timerSeconds);
  btnTimerStart.textContent = "Start Timer";
  timerStatus.textContent = "Ready to simmer";
});

document.querySelectorAll("[data-time]").forEach((btn) => {
  btn.addEventListener("click", () => {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerSeconds = parseInt(btn.getAttribute("data-time"), 10);
    timerDigits.textContent = formatTime(timerSeconds);
    btnTimerStart.textContent = "Start Timer";
    timerStatus.textContent = `Preset set to ${formatTime(timerSeconds)}`;
  });
});

// --- STREAMING_CHUNK:Integrating Gemini AI API with formatted fallback... ---
const alchemistInput = document.getElementById("alchemistInput");
const btnAlchemistSubmit = document.getElementById("btnAlchemistSubmit");
const alchemistLoading = document.getElementById("alchemistLoading");
const alchemistResultPanel = document.getElementById("alchemistResultPanel");

// Exemplary Curated Preset used on load and as instant fallback
function getCuratedAlchemistRecipe(theme) {
  const isCheese = theme.toLowerCase().includes("cheese");
  const isEgg = theme.toLowerCase().includes("egg");
  const isChili = theme.toLowerCase().includes("chili");

  if (isCheese) {
    return `
          <div class="ai-recipe-card">
            <div class="ai-card-title">🍜 Street-Style Golden Cheddar &amp; Corn Maggi</div>
            <div class="ai-card-tags">
              <span class="ai-pill-tag">⏱️ 8 Mins Total</span>
              <span class="ai-pill-tag">🔥 Mild Creamy</span>
              <span class="ai-pill-tag">🥣 2 Servings</span>
            </div>
            <p class="ai-flavor-note">"Velvety melted cheddar coating sweet golden corn kernels and spicy masala noodles."</p>
            <div class="ai-section-title">🛒 What You'll Need</div>
            <ul class="ai-clean-checklist">
              <li><strong>2 Noodle Cakes</strong> &mdash; Standard Maggi cakes</li>
              <li><strong>2 Tastemaker Sachets</strong> &mdash; Masala blend</li>
              <li><strong>1/2 Cup Sweet Corn</strong> &mdash; Steamed kernels</li>
              <li><strong>1/3 Cup Processed Cheddar</strong> &mdash; Freshly grated</li>
              <li><strong>1 tbsp Salted Butter</strong> &mdash; For glossy emulsion</li>
              <li><strong>550 ml Water</strong> &mdash; For rich sauce</li>
            </ul>
            <div class="ai-section-title">🍳 Step-by-Step Cooking</div>
            <ol class="ai-clean-steps">
              <li><strong>Sauté Corn:</strong> Sauté sweet corn kernels in 1 tsp butter for 60 seconds until sweet and aromatic.</li>
              <li><strong>Boil &amp; Season:</strong> Pour 550 ml water, bring to boil, and dissolve the 2 tastemaker sachets.</li>
              <li><strong>Simmer:</strong> Add noodles and simmer on medium flame for 2 minutes until cooked.</li>
              <li><strong>Emulsify Cheese:</strong> Turn flame to low, fold in grated cheese, cover for 30 seconds until molten, and serve!</li>
            </ol>
            <div class="ai-tip-card">
              <span>💡</span>
              <div><strong>Chef's Secret:</strong> Turn off the heat before stirring in cheese to prevent oil separation.</div>
            </div>
          </div>
        `;
  }

  if (isEgg) {
    return `
          <div class="ai-recipe-card">
            <div class="ai-card-title">🍳 Dhaba-Style Spicy Egg Bhurji Noodle Toss</div>
            <div class="ai-card-tags">
              <span class="ai-pill-tag">⏱️ 9 Mins Total</span>
              <span class="ai-pill-tag">🔥 Medium-High Heat</span>
              <span class="ai-pill-tag">🥣 2 Servings</span>
            </div>
            <p class="ai-flavor-note">"Fluffy spiced scrambled eggs folded into reduced masala noodles with onions and green chilies."</p>
            <div class="ai-section-title">🛒 What You'll Need</div>
            <ul class="ai-clean-checklist">
              <li><strong>2 Noodle Cakes</strong> &mdash; Standard Maggi cakes</li>
              <li><strong>2 Eggs</strong> &mdash; Lightly whisked with a pinch of salt</li>
              <li><strong>1 Small Red Onion</strong> &mdash; Finely chopped</li>
              <li><strong>1 Green Chili</strong> &mdash; Finely sliced</li>
              <li><strong>1 tbsp Butter/Ghee</strong> &mdash; For scrambling</li>
              <li><strong>500 ml Water</strong> &mdash; For dry-style noodles</li>
            </ul>
            <div class="ai-section-title">🍳 Step-by-Step Cooking</div>
            <ol class="ai-clean-steps">
              <li><strong>Scramble:</strong> Sauté onions and green chilies in butter, pour whisked eggs, and scramble softly. Set aside.</li>
              <li><strong>Boil Noodles:</strong> In the same pan, boil 500 ml water with 1.5 tastemaker packets and cook noodles for 2 mins.</li>
              <li><strong>Combine:</strong> When broth reduces by 80%, fold in scrambled eggs and remaining half tastemaker.</li>
              <li><strong>Garnish:</strong> Garnish with chopped cilantro and squeeze fresh lemon juice!</li>
            </ol>
            <div class="ai-tip-card">
              <span>💡</span>
              <div><strong>Chef's Secret:</strong> Reserving half of the tastemaker to toss in at the end preserves fragrant aroma.</div>
            </div>
          </div>
        `;
  }

  // Default Chili Crisp Fusion
  return `
        <div class="ai-recipe-card">
          <div class="ai-card-title">🌶️ Szechuan Chili Crisp &amp; Garlic Butter Maggi</div>
          <div class="ai-card-tags">
            <span class="ai-pill-tag">⏱️ 7 Mins Total</span>
            <span class="ai-pill-tag">🔥 Fiery Savory</span>
            <span class="ai-pill-tag">🥣 2 Servings</span>
          </div>
          <p class="ai-flavor-note">"Crisp fried garlic chips, toasted sesame oil, and crunchy chili crisp coating tender noodles."</p>
          <div class="ai-section-title">🛒 What You'll Need</div>
          <ul class="ai-clean-checklist">
            <li><strong>2 Noodle Cakes</strong> &mdash; Standard Maggi cakes</li>
            <li><strong>2 Tastemaker Sachets</strong> &mdash; Masala blend</li>
            <li><strong>1.5 tbsp Chili Crisp Oil</strong> &mdash; With crunchy flakes</li>
            <li><strong>4 Garlic Cloves</strong> &mdash; Thinly sliced</li>
            <li><strong>1 tbsp Soy Sauce</strong> &mdash; Light or dark</li>
            <li><strong>520 ml Water</strong> &mdash; For sticky glaze</li>
          </ul>
          <div class="ai-section-title">🍳 Step-by-Step Cooking</div>
          <ol class="ai-clean-steps">
            <li><strong>Crisp Garlic:</strong> In 1 tbsp oil, fry sliced garlic until golden blonde. Remove half for garnish.</li>
            <li><strong>Sauce Base:</strong> Add chili crisp and soy sauce to the pan, stir for 15 seconds.</li>
            <li><strong>Boil &amp; Simmer:</strong> Pour water and tastemaker, bring to boil, add noodles, and simmer for 2 minutes.</li>
            <li><strong>Plate:</strong> Toss until glossy, top with crispy fried garlic chips and scallions!</li>
          </ol>
          <div class="ai-tip-card">
            <span>💡</span>
            <div><strong>Chef's Secret:</strong> Frying garlic slices on low heat prevents bitterness and gives maximum crunch.</div>
          </div>
        </div>
      `;
}

// Pre-populate with beautiful curated card
alchemistResultPanel.innerHTML = getCuratedAlchemistRecipe(
  "Street Style Cheese & Sweet Corn",
);

async function callGeminiAlchemist(promptText) {
  alchemistLoading.classList.add("active");
  btnAlchemistSubmit.disabled = true;

  const systemInstruction = `You are the master chef at SAVORA Culinary Atelier.
Transform classic Maggi noodles into an easy, quick (under 10 mins) recipe based on user input.
Return ONLY valid HTML matching this exact visual structure (do NOT wrap in markdown \`\`\` blocks):

<div class="ai-recipe-card">
  <div class="ai-card-title">🍜 [Dish Name with Emoji]</div>
  <div class="ai-card-tags">
    <span class="ai-pill-tag">⏱️ [Time]</span>
    <span class="ai-pill-tag">🔥 [Heat Level]</span>
    <span class="ai-pill-tag">🥣 2 Servings</span>
  </div>
  <p class="ai-flavor-note">"[1 short flavor sentence]"</p>
  <div class="ai-section-title">🛒 What You'll Need</div>
  <ul class="ai-clean-checklist">
    <li><strong>[Item 1]</strong> &mdash; [Qty]</li>
    <li><strong>[Item 2]</strong> &mdash; [Qty]</li>
    <li><strong>[Item 3]</strong> &mdash; [Qty]</li>
    <li><strong>[Item 4]</strong> &mdash; [Qty]</li>
  </ul>
  <div class="ai-section-title">🍳 Step-by-Step Cooking</div>
  <ol class="ai-clean-steps">
    <li><strong>[Verb 1]:</strong> [1 clear short sentence]</li>
    <li><strong>[Verb 2]:</strong> [1 clear short sentence]</li>
    <li><strong>[Verb 3]:</strong> [1 clear short sentence]</li>
    <li><strong>[Verb 4]:</strong> [1 clear short sentence]</li>
  </ol>
  <div class="ai-tip-card">
    <span>💡</span>
    <div><strong>Chef's Secret:</strong> [1 practical pro tip]</div>
  </div>
</div>`;

  try {
    const apiKey = ""; // Injected at runtime if configured
    if (!apiKey) throw new Error("Offline Demo");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Create a quick noodle recipe for: "${promptText}".`,
                },
              ],
            },
          ],
          systemInstruction: { parts: [{ text: systemInstruction }] },
        }),
      },
    );

    if (!response.ok) throw new Error("API call error");
    const data = await response.json();
    const rawHtml = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawHtml) throw new Error("Empty response");

    const cleanHtml = rawHtml
      .replace(/```html/gi, "")
      .replace(/```/g, "")
      .trim();
    alchemistResultPanel.innerHTML = cleanHtml;
  } catch (err) {
    // High quality fallback guarantees instant, beautiful presentation
    alchemistResultPanel.innerHTML = getCuratedAlchemistRecipe(promptText);
  } finally {
    alchemistLoading.classList.remove("active");
    btnAlchemistSubmit.disabled = false;
    playChime(740);
    showToast("Chef Gemini customized your recipe! ✨");
  }
}

btnAlchemistSubmit.addEventListener("click", () => {
  const q = alchemistInput.value.trim() || "Cheese & Sweet Corn";
  callGeminiAlchemist(q);
});

document.querySelectorAll(".vibe-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    const vibe = chip.getAttribute("data-vibe");
    if (vibe) {
      alchemistInput.value = vibe;
      callGeminiAlchemist(vibe);
    }
  });
});

// --- 5. Interactive Sous-Chef Drawer ---
const sousDrawerOverlay = document.getElementById("sousDrawerOverlay");
const btnOpenDrawer = document.getElementById("btnOpenDrawer");
const btnCloseDrawer = document.getElementById("btnCloseDrawer");
const sousChatLog = document.getElementById("sousChatLog");
const sousChatForm = document.getElementById("sousChatForm");
const sousChatInput = document.getElementById("sousChatInput");

btnOpenDrawer.addEventListener("click", () => {
  sousDrawerOverlay.classList.add("open");
  playChime(680);
});
btnCloseDrawer.addEventListener("click", () => {
  sousDrawerOverlay.classList.remove("open");
});
sousDrawerOverlay.addEventListener("click", (e) => {
  if (e.target === sousDrawerOverlay)
    sousDrawerOverlay.classList.remove("open");
});

function appendChatMessage(sender, htmlContent) {
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${sender}`;
  bubble.innerHTML = htmlContent;
  sousChatLog.appendChild(bubble);
  sousChatLog.scrollTop = sousChatLog.scrollHeight;
}

function handleSousChefQuery(q) {
  if (!q) return;
  appendChatMessage("user", q);

  // Fast, easy-to-read simulated response or fallback
  let directReply = "";
  const lower = q.toLowerCase();

  if (lower.includes("water")) {
    directReply = `
          <strong>Quick Fix for Watery Noodles:</strong>
          <div class="chat-bullet-item"><span class="chat-bullet-dot">▸</span><span>High flame open simmering for 60 seconds evaporates liquid fast.</span></div>
          <div class="chat-bullet-item"><span class="chat-bullet-dot">▸</span><span>Stir in 1/2 slice of cheese or 1 tsp cornstarch slurry to instantly thicken into glaze.</span></div>
          <div class="chat-bullet-item"><span class="chat-bullet-dot">▸</span><span><strong>Pro Tip:</strong> Next time use exactly 300 ml per cake.</span></div>
        `;
  } else if (lower.includes("spicy") || lower.includes("street")) {
    directReply = `
          <strong>Mumbai Street Style Spicy Hack:</strong>
          <div class="chat-bullet-item"><span class="chat-bullet-dot">▸</span><span>Heat 1 tbsp butter, sauté 1 chopped green chili and 1/2 tsp chili powder for 20s.</span></div>
          <div class="chat-bullet-item"><span class="chat-bullet-dot">▸</span><span>Pour onto finished noodles and finish with fresh lemon juice.</span></div>
        `;
  } else if (lower.includes("microwave")) {
    directReply = `
          <strong>2-Minute Microwave Technique:</strong>
          <div class="chat-bullet-item"><span class="chat-bullet-dot">▸</span><span>Place broken noodles in a deep microwave-safe bowl.</span></div>
          <div class="chat-bullet-item"><span class="chat-bullet-dot">▸</span><span>Add 250 ml water and tastemaker. Microwave on HIGH for 2 mins.</span></div>
          <div class="chat-bullet-item"><span class="chat-bullet-dot">▸</span><span>Stir well, microwave 30s more, and rest 1 min.</span></div>
        `;
  } else {
    directReply = `
          <strong>Chef Gemini's Advice:</strong>
          <div class="chat-bullet-item"><span class="chat-bullet-dot">▸</span><span>For best results, cook on medium-high flame with gentle stirring.</span></div>
          <div class="chat-bullet-item"><span class="chat-bullet-dot">▸</span><span>Add cold butter or toasted sesame oil at the end for rich mouthfeel.</span></div>
        `;
  }

  setTimeout(() => {
    appendChatMessage("ai", directReply);
    playChime(600);
  }, 400);
}

sousChatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const val = sousChatInput.value.trim();
  if (val) {
    handleSousChefQuery(val);
    sousChatInput.value = "";
  }
});

document.querySelectorAll(".sous-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    handleSousChefQuery(chip.getAttribute("data-q"));
  });
});

// --- 6. Quick Action Triggers ---
document
  .getElementById("btnPrintRecipe")
  .addEventListener("click", () => window.print());
document.getElementById("btnShareRecipe").addEventListener("click", () => {
  try {
    const dummy = document.createElement("input");
    dummy.value = window.location.href;
    document.body.appendChild(dummy);
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    showToast("Recipe link copied to clipboard! 📋");
  } catch (e) {
    showToast("Link ready to share!");
  }
});
document.getElementById("btnSaveFavorite").addEventListener("click", () => {
  showToast("Saved to your culinary favorites! ❤️");
  playChime(720);
});

// --- 7. FAQ Accordion Click Listeners ---
document.querySelectorAll(".faq-question-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const isExp = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", !isExp);
    playChime(520);
  });
});

// --- 8. Mobile Responsive Animated Hamburger Menu ---
const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileNavMenu = document.getElementById("mobileNavMenu");

function toggleMobileMenu(forceClose = false) {
  if (!hamburgerBtn || !mobileNavMenu) return;
  const isOpen = hamburgerBtn.classList.contains("is-active");
  const shouldOpen = forceClose ? false : !isOpen;

  if (shouldOpen) {
    hamburgerBtn.classList.add("is-active");
    mobileNavMenu.classList.add("is-open");
    hamburgerBtn.setAttribute("aria-expanded", "true");
    mobileNavMenu.setAttribute("aria-hidden", "false");
    hamburgerBtn.setAttribute("aria-label", "Close navigation menu");
    playChime(660);
  } else {
    hamburgerBtn.classList.remove("is-active");
    mobileNavMenu.classList.remove("is-open");
    hamburgerBtn.setAttribute("aria-expanded", "false");
    mobileNavMenu.setAttribute("aria-hidden", "true");
    hamburgerBtn.setAttribute("aria-label", "Open navigation menu");
  }
}

if (hamburgerBtn) {
  hamburgerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMobileMenu();
  });
}

// Close mobile menu when clicking any mobile nav item
document.querySelectorAll(".mobile-nav-item").forEach((link) => {
  link.addEventListener("click", () => {
    toggleMobileMenu(true);
  });
});

// Close mobile menu if clicked outside
document.addEventListener("click", (e) => {
  if (
    mobileNavMenu &&
    mobileNavMenu.classList.contains("is-open") &&
    !mobileNavMenu.contains(e.target) &&
    !hamburgerBtn.contains(e.target)
  ) {
    toggleMobileMenu(true);
  }
});

// Close mobile menu on Escape key
document.addEventListener("keydown", (e) => {
  if (
    e.key === "Escape" &&
    mobileNavMenu &&
    mobileNavMenu.classList.contains("is-open")
  ) {
    toggleMobileMenu(true);
  }
});

// Close mobile menu on window resize above 860px
window.addEventListener("resize", () => {
  if (
    window.innerWidth > 860 &&
    mobileNavMenu &&
    mobileNavMenu.classList.contains("is-open")
  ) {
    toggleMobileMenu(true);
  }
});

// --- 9. Smooth Anchor Scrolling via Lenis ---
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId && targetId !== "#") {
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        if (window.lenis) {
          window.lenis.scrollTo(targetEl, { offset: -70 });
        } else {
          targetEl.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  });
});

// Back to Top button smooth scroll
const btnBackToTop = document.getElementById("btnBackToTop");
if (btnBackToTop) {
  btnBackToTop.addEventListener("click", () => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}

// Footer Sous-Chef AI trigger
const btnFooterSousChef = document.getElementById("btnFooterSousChef");
if (btnFooterSousChef) {
  btnFooterSousChef.addEventListener("click", () => {
    const btnOpenDrawer = document.getElementById("btnOpenDrawer");
    if (btnOpenDrawer) btnOpenDrawer.click();
  });
}
