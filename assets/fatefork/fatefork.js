(() => {
  "use strict";

  const caseStudy = document.querySelector(".fate-case");
  if (!caseStudy) return;

  document.documentElement.classList.add("fate-js");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const chapters = Array.from(caseStudy.querySelectorAll("[data-fate-chapter]"));
  const routeButtons = Array.from(caseStudy.querySelectorAll("[data-fate-target]"));
  const routeIndex = caseStudy.querySelector(".fate-route-index");
  const routeCurrentLabel = caseStudy.querySelector("[data-fate-route-current]");
  const routeTitleLabel = caseStudy.querySelector("[data-fate-route-title]");
  const routeSubtitleLabel = caseStudy.querySelector("[data-fate-route-subtitle]");
  const routeMenuToggle = caseStudy.querySelector("[data-fate-menu-toggle]");
  const stage = caseStudy.querySelector(".fate-chapter-list");
  const previousButton = caseStudy.querySelector("[data-fate-prev]");
  const nextButton = caseStudy.querySelector("[data-fate-next]");
  const currentLabel = caseStudy.querySelector("[data-fate-current]");
  const statusLabel = caseStudy.querySelector("[data-fate-status]");
  const factButtons = Array.from(caseStudy.querySelectorAll(".fate-system-fact-info"));

  const chapterLabels = [
    "Problem framing · 问题定义",
    "Scenarios and states · 情景与状态",
    "Generation guardrails · 生成护栏",
    "Prototype testing · 原型测试",
    "Safety and control · 安全与可控",
    "Trust and mental models · 信任与心智模型",
    "Future UX · 后续体验",
  ];

  let activeIndex = 0;

  /** Compact chapter control used when seven desktop tabs would become cramped. */
  const closeRouteMenu = () => {
    if (!routeIndex || !routeMenuToggle) return;
    routeIndex.classList.remove("is-menu-open");
    routeMenuToggle.setAttribute("aria-expanded", "false");
    routeMenuToggle.setAttribute("aria-label", "Open case-study chapters");
  };

  /**
   * On wide screens the chapter atlas has two deliberate reading states:
   * it first lives in the document as a full map, then docks between the
   * persistent logo and Portfolio control once the reader passes it.
   */
  if (routeIndex) {
    const routeSentinel = document.createElement("span");
    const routeScrim = document.createElement("span");
    let routeIsDocked = false;
    let routeDockFrame = 0;

    routeSentinel.className = "fate-route-sentinel";
    routeSentinel.setAttribute("aria-hidden", "true");
    routeScrim.className = "fate-route-scrim";
    routeScrim.setAttribute("aria-hidden", "true");
    routeIndex.before(routeSentinel, routeScrim);

    const setRouteDock = (shouldDock, dockTop, dockProgress) => {
      if (shouldDock) {
        routeIndex.style.setProperty("--fate-route-dock-top", `${dockTop}px`);
        routeScrim.style.setProperty("--fate-route-scrim-opacity", String(dockProgress));
      }

      if (shouldDock === routeIsDocked) return;

      if (shouldDock) {
        // A fixed dock leaves document flow. Preserve its complete in-page
        // footprint so the chapter stage never jumps upward underneath it.
        const routeStyles = window.getComputedStyle(routeIndex);
        const routeFootprint =
          routeIndex.getBoundingClientRect().height +
          (Number.parseFloat(routeStyles.marginBottom) || 0);

        routeSentinel.style.height = `${Math.ceil(routeFootprint)}px`;
        routeSentinel.style.marginBottom = "0";
        routeIndex.classList.add("is-docked");
        routeScrim.classList.add("is-visible");
      } else {
        routeIndex.classList.remove("is-docked");
        routeScrim.classList.remove("is-visible");
        routeSentinel.style.height = "1px";
        routeSentinel.style.marginBottom = "-1px";
        routeIndex.style.removeProperty("--fate-route-dock-top");
        routeScrim.style.removeProperty("--fate-route-scrim-opacity");
        closeRouteMenu();
      }

      routeIsDocked = shouldDock;
    };

    const syncRouteDock = () => {
      // Dock only when the control's real document position reaches the final
      // header lane. On the way back it stays still until that same position
      // catches up, then rejoins the document with no visible return motion.
      const viewportWidth = window.innerWidth;
      const settledTop = viewportWidth <= 520 ? 14 : viewportWidth <= 760 ? 9 : viewportWidth <= 1120 ? 23 : 18;
      const sentinelTop = routeSentinel.getBoundingClientRect().top;
      const shouldDock = sentinelTop <= settledTop;

      setRouteDock(shouldDock, settledTop, 1);
    };

    const requestRouteDockSync = () => {
      if (routeDockFrame) return;
      routeDockFrame = window.requestAnimationFrame(() => {
        routeDockFrame = 0;
        syncRouteDock();
      });
    };

    window.addEventListener("scroll", requestRouteDockSync, { passive: true });
    window.addEventListener("resize", requestRouteDockSync);
    requestRouteDockSync();
  }

  /** Product facts can be previewed on hover and pinned open with a click. */
  const closeFact = (button, { dismissHover = false } = {}) => {
    const fact = button.closest(".fate-system-fact");
    if (!fact) return;

    fact.classList.remove("is-expanded");
    fact.classList.toggle("is-dismissed", dismissHover);
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", button.dataset.openLabel || "Show explanation");
  };

  factButtons.forEach((button) => {
    const fact = button.closest(".fate-system-fact");
    if (!fact) return;

    button.dataset.openLabel = button.getAttribute("aria-label") || "Show explanation";

    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const wasExpanded = fact.classList.contains("is-expanded");

      if (wasExpanded) {
        closeFact(button, { dismissHover: true });
        if (event.detail > 0) button.blur();
        return;
      }

      fact.classList.remove("is-dismissed");
      fact.classList.add("is-expanded");
      button.setAttribute("aria-expanded", "true");
      button.setAttribute("aria-label", "Hide this product fact explanation");
    });

    button.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closeFact(button, { dismissHover: true });
    });

    fact.addEventListener("pointerleave", () => {
      fact.classList.remove("is-dismissed");
    });
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest(".fate-system-fact")) return;
    factButtons.forEach((button) => closeFact(button));
  });

  /** Update the persistent chapter dock, single editorial stage and transport controls together. */
  const activateChapter = (
    index,
    { focusTab = false, focusHeading = false, scrollStage = true, updateHistory = true } = {},
  ) => {
    if (index < 0 || index >= chapters.length) return;
    activeIndex = index;

    chapters.forEach((chapter, chapterIndex) => {
      const isActive = chapterIndex === activeIndex;
      chapter.classList.toggle("is-selected", isActive);
      chapter.classList.toggle("is-open", isActive);
      chapter.hidden = !isActive;
      if (isActive) chapter.classList.add("is-visible");
    });

    routeButtons.forEach((button, buttonIndex) => {
      const isActive = buttonIndex === activeIndex;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
      button.tabIndex = isActive ? 0 : -1;
    });

    if (currentLabel) currentLabel.textContent = String(activeIndex + 1).padStart(2, "0");
    if (statusLabel) statusLabel.textContent = chapterLabels[activeIndex] || "";
    if (routeCurrentLabel) routeCurrentLabel.textContent = String(activeIndex + 1).padStart(2, "0");
    if (routeTitleLabel) routeTitleLabel.textContent = routeButtons[activeIndex]?.querySelector("b")?.textContent || "";
    if (routeSubtitleLabel) routeSubtitleLabel.textContent = routeButtons[activeIndex]?.querySelector("small")?.textContent || "";
    if (previousButton) previousButton.disabled = activeIndex === 0;
    if (nextButton) nextButton.disabled = activeIndex === chapters.length - 1;

    const chapterNumber = chapters[activeIndex]?.dataset.fateChapter;
    if (updateHistory && chapterNumber) {
      history.replaceState(null, "", `#fatefork-chapter-${chapterNumber}`);
    }

    closeRouteMenu();

    if (focusTab) routeButtons[activeIndex]?.focus({ preventScroll: true });
    if (focusHeading) {
      chapters[activeIndex]
        ?.querySelector(".fate-chapter-trigger")
        ?.focus({ preventScroll: true });
    }

    if (scrollStage && stage) {
      window.requestAnimationFrame(() => {
        stage.scrollIntoView({
          behavior: reduceMotion.matches ? "auto" : "smooth",
          block: "start",
        });
      });
    }
  };

  chapters.forEach((chapter, index) => {
    const chapterNumber = chapter.dataset.fateChapter;
    const heading = chapter.querySelector(".fate-chapter-trigger");
    const routeButton = routeButtons[index];
    if (!chapterNumber || !heading || !routeButton) return;

    const chapterId = `fatefork-chapter-${chapterNumber}`;
    const routeId = `fate-route-tab-${chapterNumber}`;
    chapter.id = chapterId;
    chapter.setAttribute("role", "tabpanel");
    chapter.setAttribute("aria-labelledby", routeId);
    routeButton.id = routeId;
    routeButton.setAttribute("aria-controls", chapterId);
  });

  routeButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      // The in-page atlas already sits beside the chapter stage, so changing
      // chapters there should not move the reader. Once the atlas is docked,
      // align the newly selected chapter beneath the fixed header instead.
      const shouldAlignStage = routeIndex?.classList.contains("is-docked") ?? false;
      activateChapter(index, { scrollStage: shouldAlignStage });
    });
    button.addEventListener("keydown", (event) => {
      let nextIndex = null;
      if (event.key === "ArrowRight") {
        nextIndex = (index + 1) % routeButtons.length;
      }
      if (event.key === "ArrowLeft") {
        nextIndex = (index - 1 + routeButtons.length) % routeButtons.length;
      }
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = routeButtons.length - 1;
      if (nextIndex === null) return;

      event.preventDefault();
      activateChapter(nextIndex, {
        focusTab: true,
        scrollStage: false,
      });
    });
  });

  routeMenuToggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!routeIndex) return;
    const willOpen = !routeIndex.classList.contains("is-menu-open");
    routeIndex.classList.toggle("is-menu-open", willOpen);
    routeMenuToggle.setAttribute("aria-expanded", String(willOpen));
    routeMenuToggle.setAttribute(
      "aria-label",
      willOpen ? "Close case-study chapters" : "Open case-study chapters",
    );
  });

  document.addEventListener("click", (event) => {
    if (!routeIndex || routeIndex.contains(event.target)) return;
    closeRouteMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeRouteMenu();
  });

  previousButton?.addEventListener("click", () => {
    activateChapter(activeIndex - 1, { focusHeading: true });
  });

  nextButton?.addEventListener("click", () => {
    activateChapter(activeIndex + 1, { focusHeading: true });
  });

  /** State lab: a compact, keyboard-operable model of the product flow. */
  const stateNodes = Array.from(caseStudy.querySelectorAll(".fate-state-node"));
  const statePanels = Array.from(caseStudy.querySelectorAll("[data-state-panel]"));

  const activateState = (node, focus = false) => {
    const state = node.dataset.state;
    if (!state) return;

    stateNodes.forEach((item) => {
      const isActive = item === node;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
      item.tabIndex = isActive ? 0 : -1;
    });

    statePanels.forEach((panel) => {
      panel.hidden = panel.dataset.statePanel !== state;
    });

    if (focus) node.focus();
  };

  stateNodes.forEach((node, index) => {
    const state = node.dataset.state;
    const panel = statePanels.find((item) => item.dataset.statePanel === state);
    if (state && panel) {
      const nodeId = `fate-state-tab-${state}`;
      const panelId = `fate-state-panel-${state}`;
      node.id = nodeId;
      node.setAttribute("aria-controls", panelId);
      panel.id = panelId;
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", nodeId);
    }

    node.addEventListener("click", () => activateState(node));
    node.addEventListener("keydown", (event) => {
      let nextIndex = null;
      if (event.key === "ArrowRight") {
        nextIndex = (index + 1) % stateNodes.length;
      }
      if (event.key === "ArrowLeft") {
        nextIndex = (index - 1 + stateNodes.length) % stateNodes.length;
      }
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = stateNodes.length - 1;
      if (nextIndex === null) return;

      event.preventDefault();
      activateState(stateNodes[nextIndex], true);
    });
  });

  if (stateNodes[0]) {
    activateState(stateNodes.find((node) => node.classList.contains("is-active")) || stateNodes[0]);
  }

  /** Let the quiet lower panel beneath each divider open its own disclosure. */
  caseStudy.querySelectorAll(".fate-lane-grid > div").forEach((laneCard) => {
    const routeDetail = laneCard.querySelector(".fate-lane-details");
    if (!routeDetail) return;

    laneCard.addEventListener("click", (event) => {
      // Native summary interaction remains intact; expanded narrative stays
      // read-only so a user can select text without closing it by accident.
      if (routeDetail.open || event.target.closest("summary")) return;

      const dividerTop = routeDetail.getBoundingClientRect().top;
      if (event.clientY >= dividerTop) routeDetail.open = true;
    });

    laneCard.addEventListener("pointermove", (event) => {
      if (routeDetail.open) return;
      const dividerTop = routeDetail.getBoundingClientRect().top;
      laneCard.classList.toggle("is-route-trigger", event.clientY >= dividerTop);
    });

    laneCard.addEventListener("pointerleave", () => {
      laneCard.classList.remove("is-route-trigger");
    });

    routeDetail.addEventListener("toggle", () => {
      laneCard.classList.remove("is-route-trigger");
    });
  });

  /** Match the shared case-study reveal: 20px rise, 0.6s fade and one-time entry. */
  const revealItems = Array.from(document.querySelectorAll(".reveal-on-scroll"));
  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.18 },
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const chapterIndexFromHash = () => {
    const match = window.location.hash.match(/^#(?:fatefork|fate)-chapter-(0[1-7])$/);
    if (!match) return 0;
    const index = chapters.findIndex((item) => item.dataset.fateChapter === match[1]);
    return index >= 0 ? index : 0;
  };

  activateChapter(chapterIndexFromHash(), {
    scrollStage: /^#fate-chapter-/.test(window.location.hash),
    updateHistory: false,
  });

  window.addEventListener("hashchange", () => {
    activateChapter(chapterIndexFromHash(), {
      scrollStage: true,
      updateHistory: false,
    });
  });

  const footerYear = document.querySelector(".portfolio-footer-year");
  if (footerYear) footerYear.textContent = String(new Date().getFullYear());

  const backToTopButton = document.querySelector(".back-to-top");
  const syncBackToTopButton = () => {
    backToTopButton?.classList.toggle("is-visible", window.scrollY > 360);
  };

  window.addEventListener("scroll", syncBackToTopButton, { passive: true });
  backToTopButton?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion.matches ? "auto" : "smooth",
    });
  });
  syncBackToTopButton();
})();
