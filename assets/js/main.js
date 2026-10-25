
/* ========================================
   YOUR ANSWER — MAIN JAVASCRIPT
   ======================================== */

(() => {
  "use strict";

  const root = document.documentElement;

  const themeStorageKey = "your-answer-theme";
  const recentSubjectStorageKey = "your-answer-recent-subject";

  /* ========================================
     SUBJECT INFORMATION
     ======================================== */

  const subjects = {
    mathematics: {
      name: "Mathematics",
      description:
        "Explore numbers, patterns, algebra, geometry, probability, and more.",
      symbol: "∑",
      url: "mathematics/"
    },

    physics: {
      name: "Physics",
      description:
        "Understand motion, forces, energy, waves, electricity, and the universe.",
      symbol: "⚛",
      url: "physics/"
    },

    chemistry: {
      name: "Chemistry",
      description:
        "Explore atoms, molecules, reactions, bonding, matter, and chemical systems.",
      symbol: "⚗",
      url: "chemistry/"
    },

    "computer-science": {
      name: "Computer Science",
      description:
        "Learn programming, algorithms, data structures, logic, and computational thinking.",
      symbol: "</>",
      url: "computer-science/"
    }
  };

  /* ========================================
     RANDOM QUOTES
     ======================================== */

  const quotes = [
    {
      text: "The important thing is to never stop questioning.",
      author: "Albert Einstein"
    },
    {
      text: "Somewhere, something incredible is waiting to be known.",
      author: "Carl Sagan"
    },
    {
      text:
        "The art and science of asking questions is the source of all knowledge.",
      author: "Thomas Berger"
    },
    {
      text: "The important thing is not to stop questioning.",
      author: "Albert Einstein"
    }
  ];

  function showRandomQuote() {
    const quoteText = document.querySelector("#quote-text");
    const quoteAuthor = document.querySelector("#quote-author");

    if (!quoteText || !quoteAuthor || quotes.length === 0) {
      return;
    }

    const currentQuote = quoteText.dataset.quoteIndex;

    let nextIndex = Math.floor(Math.random() * quotes.length);

    // Avoid showing the same quote twice in a row.
    if (
      quotes.length > 1 &&
      String(nextIndex) === currentQuote
    ) {
      nextIndex = (nextIndex + 1) % quotes.length;
    }

    quoteText.textContent = quotes[nextIndex].text;
    quoteAuthor.textContent = `— ${quotes[nextIndex].author}`;
    quoteText.dataset.quoteIndex = String(nextIndex);
  }

  function initializeQuotes() {
    const quoteButton = document.querySelector("#new-quote");

    if (!quoteButton) {
      return;
    }

    showRandomQuote();
    quoteButton.addEventListener("click", showRandomQuote);
  }

  /* ========================================
     THEME MANAGEMENT
     ======================================== */

  function getSavedTheme() {
    try {
      const savedTheme = localStorage.getItem(themeStorageKey);

      if (["light", "dark", "system"].includes(savedTheme)) {
        return savedTheme;
      }
    } catch (error) {
      console.warn("Theme preference storage is unavailable.");
    }

    return "system";
  }

  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(preference) {
    const theme =
      preference === "system" ? getSystemTheme() : preference;

    root.dataset.theme = theme;
    root.dataset.themePreference = preference;

    // Update every theme button, if the page has more than one.
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      const isDark = theme === "dark";

      button.setAttribute(
        "aria-label",
        `Switch to ${isDark ? "light" : "dark"} mode`
      );

      button.setAttribute("aria-pressed", String(isDark));

      const label = button.querySelector("[data-theme-label]");

      if (label) {
        label.textContent = isDark ? "Dark mode" : "Light mode";
      }
    });
  }

  function saveTheme(preference) {
    try {
      localStorage.setItem(themeStorageKey, preference);
    } catch (error) {
      console.warn("Theme preference could not be saved.");
    }
  }

  function toggleTheme() {
    const currentTheme = root.dataset.theme || getSystemTheme();

    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    saveTheme(nextTheme);
    applyTheme(nextTheme);
  }

  function initializeTheme() {
    applyTheme(getSavedTheme());

    // Respond to device theme changes when using system preference.
    const systemTheme = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    systemTheme.addEventListener("change", () => {
      if (root.dataset.themePreference === "system") {
        applyTheme("system");
      }
    });

    // One listener handles theme buttons across the page.
    document.addEventListener("click", (event) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const button = target.closest("[data-theme-toggle]");

      if (button) {
        toggleTheme();
      }
    });
  }

  /* ========================================
     RECENTLY OPENED SUBJECT
     ======================================== */

  function initializeSubjectOrder() {
    const grid = document.querySelector(".subjects-grid");

    // Do nothing on pages without the subjects grid.
    if (!grid) {
      return;
    }

    const subjectCards = [
      ...grid.querySelectorAll("[data-subject]")
    ];

    // Remember the subject when its card is opened.
    subjectCards.forEach((card) => {
      card.addEventListener("click", () => {
        const subjectId = card.dataset.subject;

        if (!subjects[subjectId]) {
          return;
        }

        try {
          localStorage.setItem(
            recentSubjectStorageKey,
            subjectId
          );
        } catch (error) {
          console.warn("Recent subject could not be saved.");
        }
      });
    });

    // Move the last-opened subject to the first position.
    let recentSubject;

    try {
      recentSubject = localStorage.getItem(
        recentSubjectStorageKey
      );
    } catch (error) {
      console.warn("Recent subject could not be retrieved.");
      return;
    }

    const recentCard = subjectCards.find(
      (card) => card.dataset.subject === recentSubject
    );

    if (recentCard) {
      grid.prepend(recentCard);
    }
  }

  /* ========================================
     MOBILE NAVIGATION
     ======================================== */

  function initializeMobileMenu() {
    const menuButton = document.querySelector("[data-menu-toggle]");
    const mobileNav = document.querySelector("#mobile-nav");

    if (!menuButton || !mobileNav) {
      return;
    }

    menuButton.addEventListener("click", () => {
      const isExpanded =
        menuButton.getAttribute("aria-expanded") === "true";

      menuButton.setAttribute(
        "aria-expanded",
        String(!isExpanded)
      );

      mobileNav.hidden = isExpanded;
    });

    // Close the menu after selecting a navigation link.
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.hidden = true;
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ========================================
     INITIALIZE APPLICATION
     ======================================== */

  function initializeApp() {
    initializeTheme();
    initializeQuotes();
    initializeSubjectOrder();
    initializeMobileMenu();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeApp);
  } else {
    initializeApp();
  }
})();
