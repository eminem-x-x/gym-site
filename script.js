// ══════════════════════════════════════════
//  IRONLAB — Main Script
// ══════════════════════════════════════════

let allExercises = [];
let filteredExercises = [];
let currentIndex = 0;
let currentLanguage = "en";
let currentFilter = "all";
let selectedGender = "male";

// ── EXERCISE ACTIVITIES (MET values) ──
const activities = {
    en: [
        { label: "── Your Exercises ──", disabled: true },
        { label: "Push-up",          met: 8.0  },
        { label: "Bench Press",      met: 6.0  },
        { label: "Shoulder Press",   met: 6.0  },
        { label: "Triceps Dips",     met: 8.0  },
        { label: "Pull-up",          met: 8.0  },
        { label: "Barbell Row",      met: 6.0  },
        { label: "Lat Pulldown",     met: 6.0  },
        { label: "Bicep Curls",      met: 5.0  },
        { label: "Barbell Squat",    met: 8.0  },
        { label: "Deadlift",         met: 8.0  },
        { label: "Lunges",           met: 7.0  },
        { label: "── General Activities ──", disabled: true },
        { label: "Running (8 km/h)", met: 8.3  },
        { label: "Running (12 km/h)",met: 11.5 },
        { label: "Cycling (moderate)",met: 8.0 },
        { label: "Cycling (fast)",   met: 12.0 },
        { label: "Swimming",         met: 8.0  },
        { label: "Jump Rope",        met: 12.3 },
        { label: "Walking",          met: 3.5  },
        { label: "HIIT",             met: 12.0 },
        { label: "Yoga",             met: 3.0  },
        { label: "Stretching",       met: 2.5  },
    ],
    ru: [
        { label: "── Ваши упражнения ──", disabled: true },
        { label: "Отжимания",            met: 8.0  },
        { label: "Жим штанги лёжа",      met: 6.0  },
        { label: "Армейский жим",        met: 6.0  },
        { label: "Отжимания на брусьях", met: 8.0  },
        { label: "Подтягивания",         met: 8.0  },
        { label: "Тяга штанги в наклоне",met: 6.0  },
        { label: "Тяга верхнего блока",  met: 6.0  },
        { label: "Сгибания на бицепс",   met: 5.0  },
        { label: "Приседания со штангой",met: 8.0  },
        { label: "Становая тяга",        met: 8.0  },
        { label: "Выпады",               met: 7.0  },
        { label: "── Общие активности ──", disabled: true },
        { label: "Бег (8 км/ч)",         met: 8.3  },
        { label: "Бег (12 км/ч)",        met: 11.5 },
        { label: "Велосипед (умеренно)", met: 8.0  },
        { label: "Велосипед (быстро)",   met: 12.0 },
        { label: "Плавание",             met: 8.0  },
        { label: "Прыжки со скакалкой",  met: 12.3 },
        { label: "Ходьба",               met: 3.5  },
        { label: "ВИИТ",                 met: 12.0 },
        { label: "Йога",                 met: 3.0  },
        { label: "Растяжка",             met: 2.5  },
    ]
};

// ── BMI categories ──
const bmiCategories = {
    en: [
        { max: 18.5, label: "Underweight",   color: "#4ECDC4", note: "You are below the healthy weight range. Consider consulting a nutritionist." },
        { max: 25.0, label: "Normal weight",  color: "#A78BFA", note: "Great! You are within the healthy weight range. Keep it up!" },
        { max: 30.0, label: "Overweight",     color: "#FF6B35", note: "You are slightly above the healthy range. Regular exercise can help." },
        { max: 999,  label: "Obese",          color: "#E24B4A", note: "Please consult a doctor or nutritionist for a personalised plan." },
    ],
    ru: [
        { max: 18.5, label: "Недостаточный вес", color: "#4ECDC4", note: "Ваш вес ниже нормы. Рекомендуется проконсультироваться с диетологом." },
        { max: 25.0, label: "Нормальный вес",     color: "#A78BFA", note: "Отлично! Ваш вес в норме. Продолжайте в том же духе!" },
        { max: 30.0, label: "Избыточный вес",     color: "#FF6B35", note: "Ваш вес немного выше нормы. Регулярные тренировки помогут." },
        { max: 999,  label: "Ожирение",            color: "#E24B4A", note: "Обратитесь к врачу или диетологу для индивидуального плана." },
    ]
};

// ══════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════

document.getElementById("enter-btn").addEventListener("click", () => {
    const screen = document.getElementById("start-screen");
    const app    = document.getElementById("app");
    screen.classList.add("fade-out");
    setTimeout(() => {
        screen.style.display = "none";
        app.style.display = "flex";
        requestAnimationFrame(() => app.classList.add("visible"));
        loadXML();
        populateCalorieSelect();
    }, 600);
});

// ── LANGUAGE ──
document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentLanguage = btn.dataset.lang;
        applyLanguage();
    });
});

function applyLanguage() {
    // All elements with data-en / data-ru
    document.querySelectorAll("[data-en]").forEach(el => {
        el.textContent = el.dataset[currentLanguage] || el.dataset.en;
    });
    updateCategoryLabels();
    updatePageBtnLabels();
    populateCalorieSelect();
    updateExercise();
}

function updatePageBtnLabels() {
    document.querySelectorAll(".page-btn").forEach(btn => {
        btn.textContent = btn.dataset[currentLanguage] || btn.dataset.en;
    });
}

function updateCategoryLabels() {
    document.querySelectorAll(".cat-btn").forEach(btn => {
        btn.textContent = btn.dataset[currentLanguage] || btn.dataset.en;
    });
}

// ── PAGE TABS ──
document.querySelectorAll(".page-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".page-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
        document.getElementById("page-" + btn.dataset.page).classList.remove("hidden");
    });
});

// ── CATEGORY FILTER ──
document.querySelectorAll(".cat-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.type;
        applyFilter();
    });
});

// ── EXERCISE NAVIGATION ──
document.getElementById("prev-btn").addEventListener("click", () => navigate(-1));
document.getElementById("next-btn").addEventListener("click", () => navigate(1));

document.addEventListener("keydown", (e) => {
    const active = document.querySelector(".page-btn.active");
    if (active && active.dataset.page === "exercises") {
        if (e.key === "ArrowLeft")  navigate(-1);
        if (e.key === "ArrowRight") navigate(1);
    }
});

let touchStartX = 0;
document.getElementById("exercise-card").addEventListener("touchstart", e => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });
document.getElementById("exercise-card").addEventListener("touchend", e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
});

function navigate(direction) {
    if (!filteredExercises.length) return;
    currentIndex = (currentIndex + direction + filteredExercises.length) % filteredExercises.length;
    animateCard(direction);
}

// ── GENDER TOGGLE ──
document.querySelectorAll(".gender-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".gender-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedGender = btn.dataset.val;
    });
});

// ══════════════════════════════════════════
//  EXERCISES
// ══════════════════════════════════════════

function loadXML() {
    fetch("exercises.xml")
        .then(r => r.text())
        .then(data => {
            const xml = new DOMParser().parseFromString(data, "text/xml");
            allExercises = [...xml.getElementsByTagName("exercise")];
            applyFilter();
        })
        .catch(() => {
            document.getElementById("exercise-name").textContent = "Could not load exercises.xml";
        });
}

function applyFilter() {
    filteredExercises = currentFilter === "all"
        ? allExercises
        : allExercises.filter(ex => ex.getAttribute("type") === currentFilter);
    currentIndex = 0;
    buildDots();
    updateExercise();
}

function buildDots() {
    const wrap = document.getElementById("counter-dots");
    wrap.innerHTML = "";
    filteredExercises.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.className = "dot" + (i === 0 ? " active" : "");
        dot.addEventListener("click", () => { currentIndex = i; updateExercise(); });
        wrap.appendChild(dot);
    });
}

function updateDots() {
    document.querySelectorAll(".dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex);
    });
}

function animateCard(direction) {
    const card = document.getElementById("exercise-card");
    card.style.transition = "transform 0.25s ease, opacity 0.25s ease";
    card.style.transform = direction > 0 ? "translateX(-50px)" : "translateX(50px)";
    card.style.opacity = "0";
    setTimeout(() => {
        updateExercise();
        card.style.transition = "none";
        card.style.transform = direction > 0 ? "translateX(50px)" : "translateX(-50px)";
        card.style.opacity = "0";
        requestAnimationFrame(() => {
            card.style.transition = "transform 0.3s ease, opacity 0.3s ease";
            card.style.transform = "translateX(0)";
            card.style.opacity = "1";
        });
    }, 240);
}

function updateExercise() {
    if (!filteredExercises.length) {
        document.getElementById("exercise-name").textContent = currentLanguage === "ru" ? "Нет упражнений" : "No exercises";
        document.getElementById("exercise-desc").textContent = "";
        document.getElementById("exercise-image").src = "";
        document.getElementById("type-badge").textContent = "";
        document.getElementById("exercise-count").textContent = "";
        return;
    }

    const ex   = filteredExercises[currentIndex];
    const type = ex.getAttribute("type");

    const img = document.getElementById("exercise-image");
    img.classList.add("loading");
    const newSrc = ex.getElementsByTagName("image")[0].textContent.trim().replace(/\\/g, "/");
    img.onload  = () => img.classList.remove("loading");
    img.onerror = () => img.classList.remove("loading");
    img.src = newSrc;

    document.getElementById("exercise-name").textContent =
        ex.getElementsByTagName("name")[0].getElementsByTagName(currentLanguage)[0].textContent;

    document.getElementById("exercise-desc").textContent =
        ex.getElementsByTagName("desc")[0].getElementsByTagName(currentLanguage)[0].textContent;

    const badge = document.getElementById("type-badge");
    badge.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    badge.className = "card-type-badge badge-" + type;

    document.getElementById("exercise-count").textContent =
        `${currentIndex + 1} / ${filteredExercises.length}`;

    updateDots();
}

// ══════════════════════════════════════════
//  CALORIE CALCULATOR
// ══════════════════════════════════════════

function populateCalorieSelect() {
    const sel  = document.getElementById("cal-exercise");
    const list = activities[currentLanguage];
    const prev = sel.selectedIndex;
    sel.innerHTML = "";
    list.forEach((item, i) => {
        const opt = document.createElement("option");
        opt.textContent = item.label;
        if (item.disabled) { opt.disabled = true; opt.style.color = "#555"; }
        sel.appendChild(opt);
    });
    // Restore selection position if possible
    if (prev > 0 && prev < sel.options.length) sel.selectedIndex = prev;
}

document.getElementById("cal-submit").addEventListener("click", () => {
    const weight   = parseFloat(document.getElementById("cal-weight").value);
    const duration = parseFloat(document.getElementById("cal-duration").value);
    const selIndex = document.getElementById("cal-exercise").selectedIndex;
    const list     = activities[currentLanguage];
    const activity = list[selIndex];

    if (!weight || !duration || !activity || activity.disabled) {
        shakeInput("cal-submit");
        return;
    }

    // Formula: Calories = MET × weight(kg) × duration(hours)
    const calories = Math.round(activity.met * weight * (duration / 60));

    document.getElementById("cal-number").textContent = calories;

    const notes = {
        en: `Based on ${Math.round(weight)} kg body weight over ${Math.round(duration)} minutes of "${activity.label}".`,
        ru: `На основе веса ${Math.round(weight)} кг за ${Math.round(duration)} минут "${activity.label}".`
    };
    document.getElementById("cal-note").textContent = notes[currentLanguage];

    document.getElementById("cal-result").classList.remove("hidden");
});

// ══════════════════════════════════════════
//  BMI CALCULATOR
// ══════════════════════════════════════════

document.getElementById("bmi-submit").addEventListener("click", () => {
    const weight = parseFloat(document.getElementById("bmi-weight").value);
    const height = parseFloat(document.getElementById("bmi-height").value);
    const age    = parseFloat(document.getElementById("bmi-age").value);

    if (!weight || !height || !age) {
        shakeInput("bmi-submit");
        return;
    }

    const heightM = height / 100;
    const bmi     = weight / (heightM * heightM);
    const bmiStr  = bmi.toFixed(1);

    document.getElementById("bmi-number").textContent = bmiStr;

    // Find category
    const cats = bmiCategories[currentLanguage];
    const cat  = cats.find(c => bmi < c.max);

    const catEl = document.getElementById("bmi-category");
    catEl.textContent  = cat.label;
    catEl.style.color  = cat.color;

    document.getElementById("bmi-note").textContent = cat.note;

    // Position marker: BMI 15 = 0%, BMI 40 = 100%
    const pct = Math.min(Math.max((bmi - 15) / (40 - 15) * 100, 2), 98);
    document.getElementById("scale-marker").style.left = pct + "%";

    // Update scale labels language
    const labelEls  = document.querySelectorAll(".scale-labels span");
    const labelKeys = ["Underweight","Normal","Overweight","Obese"];
    const labelRu   = ["Недовес","Норма","Избыток","Ожирение"];
    labelEls.forEach((el, i) => {
        el.textContent = currentLanguage === "ru" ? labelRu[i] : labelKeys[i];
    });

    document.getElementById("bmi-result").classList.remove("hidden");
});

// ── Shake animation for invalid input ──
function shakeInput(id) {
    const el = document.getElementById(id);
    el.style.animation = "none";
    el.offsetHeight;
    el.style.animation = "shake 0.4s ease";
    setTimeout(() => el.style.animation = "", 400);
}

// Add shake keyframes dynamically
const shakeStyle = document.createElement("style");
shakeStyle.textContent = `
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%      { transform: translateX(-8px); }
  40%      { transform: translateX(8px); }
  60%      { transform: translateX(-6px); }
  80%      { transform: translateX(4px); }
}`;
document.head.appendChild(shakeStyle);