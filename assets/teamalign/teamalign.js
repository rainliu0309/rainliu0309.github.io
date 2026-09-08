const backToTopButton = document.querySelector(".back-to-top");
const footerYear = document.querySelector(".portfolio-footer-year");

if (footerYear) footerYear.textContent = String(new Date().getFullYear());

const journeySteps = document.querySelectorAll(".journey-step");
const chapterStage = document.querySelector(".teamalign-chapter-stage");
const journeyDock = document.querySelector(".teamalign-journey-dock");
const journeyNav = document.querySelector(".teamalign-journey-nav");
const journeyProgress = document.querySelector(".teamalign-journey-scroll-progress");
const journeyProgressBar = document.querySelector(".teamalign-journey-scroll-progress-bar");
const chapterDetails = document.querySelectorAll("[data-chapter-detail]");
const painItems = document.querySelectorAll("[data-pain-point]");
const gapFlipCards = document.querySelectorAll(".module-two-gap-flip");
const workflowTabs = document.querySelectorAll("[data-workflow-phase]");
const workflowNodes = document.querySelectorAll("[data-workflow-node]");
const workflowPopover = document.querySelector(".module-three-node-popover");
const workflowTimelineWrap = document.querySelector(".module-three-timeline-wrap");
const workflowTimelineProgress = document.querySelector(".module-three-timeline-progress");
const workflowTimelineProgressBar = document.querySelector(".module-three-timeline-progress-bar");
const informationArchitectureMaps = document.querySelectorAll(".module-four-ia-map");
const horizontalJourneyQuery = window.matchMedia("(max-width: 680px)");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

const syncChapterDetails = (activeIndex) => {
  let activeDetail = null;

  chapterDetails.forEach((detail) => {
    const isActive = detail.dataset.chapterDetail === activeIndex;
    detail.hidden = !isActive;
    if (isActive) activeDetail = detail;
  });

  // Hidden chapters are not reliably reported by IntersectionObserver at the
  // exact moment they become visible. Prime the selected chapter's lead block
  // so its content appears immediately; later blocks still reveal on scroll.
  if (activeDetail) {
    window.requestAnimationFrame(() => {
      activeDetail.querySelector(":scope > .reveal-on-scroll")?.classList.add("is-visible");
    });
  }
};

const scrollToChapterStart = () => {
  if (!chapterStage) return;

  const dockBottom = journeyDock?.classList.contains("is-docked")
    ? journeyDock.getBoundingClientRect().bottom + 16
    : 0;
  const headerOffset = Math.max(112, dockBottom);
  const chapterTop = window.scrollY + chapterStage.getBoundingClientRect().top - headerOffset;
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

  window.scrollTo({ top: Math.max(0, chapterTop), behavior });
};

const syncJourneyProgress = () => {
  if (!journeyNav || !journeyProgress || !journeyProgressBar) return;

  const scrollableWidth = journeyNav.scrollWidth - journeyNav.clientWidth;
  const hasOverflow = scrollableWidth > 1;
  journeyProgress.hidden = !hasOverflow;
  if (!hasOverflow) return;

  const thumbRatio = Math.max(0.2, journeyNav.clientWidth / journeyNav.scrollWidth);
  const offsetRatio = (journeyNav.scrollLeft / scrollableWidth) * (1 - thumbRatio);
  journeyProgressBar.style.width = `${thumbRatio * 100}%`;
  journeyProgressBar.style.left = `${offsetRatio * 100}%`;
};

/** Keep the selected chapter at the visual centre of the horizontal rail. */
const centerActiveJourneyStep = (behavior = "smooth") => {
  if (!horizontalJourneyQuery.matches || !journeyNav) return;

  const activeStep = journeyNav.querySelector(".journey-step.is-active");
  if (!activeStep) return;

  // Centre from the rendered rectangles instead of offsetLeft so the original
  // active-state translation remains part of the calculation. This keeps the
  // selected chapter visually centred while the rail extends beneath the
  // persistent logo and Portfolio control.
  const navRect = journeyNav.getBoundingClientRect();
  const activeRect = activeStep.getBoundingClientRect();
  const centreDelta =
    activeRect.left + activeRect.width / 2 - (navRect.left + navRect.width / 2);
  const maxScrollLeft = Math.max(0, journeyNav.scrollWidth - journeyNav.clientWidth);
  const targetLeft = journeyNav.scrollLeft + centreDelta;
  journeyNav.scrollTo({
    left: Math.min(maxScrollLeft, Math.max(0, targetLeft)),
    behavior: reducedMotionQuery.matches ? "auto" : behavior,
  });
};

const syncWorkflowTimelineProgress = () => {
  if (!workflowTimelineWrap || !workflowTimelineProgress || !workflowTimelineProgressBar) return;

  const scrollableWidth = workflowTimelineWrap.scrollWidth - workflowTimelineWrap.clientWidth;
  const hasOverflow = scrollableWidth > 1;
  if (!hasOverflow) return;

  const thumbRatio = Math.max(0.18, workflowTimelineWrap.clientWidth / workflowTimelineWrap.scrollWidth);
  const offsetRatio = (workflowTimelineWrap.scrollLeft / scrollableWidth) * (1 - thumbRatio);
  workflowTimelineProgressBar.style.width = `${thumbRatio * 100}%`;
  workflowTimelineProgressBar.style.left = `${offsetRatio * 100}%`;
};

const selectJourneyStep = (
  step,
  { updateHistory = true, scrollToChapter = true, forceScroll = false } = {},
) => {
  journeySteps.forEach((item) => {
    const isActive = item === step;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });

  syncChapterDetails(step.dataset.index);

  if (updateHistory && step.dataset.index) {
    history.replaceState(null, "", `#teamalign-chapter-${step.dataset.index}`);
  }

  if (!chapterStage) return;
  chapterStage.querySelector(".teamalign-chapter-stage-index").textContent = step.dataset.index;
  chapterStage.querySelector("h3").textContent = step.dataset.title;
  chapterStage.querySelector(".teamalign-chapter-stage-zh").textContent = step.dataset.titleZh;
  chapterStage.querySelector(".teamalign-chapter-stage-summary-en").textContent = step.dataset.summary;
  chapterStage.querySelector(".teamalign-chapter-stage-summary-zh").textContent = step.dataset.summaryZh;
  chapterStage.classList.toggle(
    "has-placeholder-rule",
    !document.querySelector(`[data-chapter-detail="${step.dataset.index}"]`),
  );
  chapterStage.animate(
    [
      { opacity: 0.3, transform: "translateY(10px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    { duration: 360, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
  );

  window.requestAnimationFrame(() => {
    centerActiveJourneyStep();
    // The desktop sidebar is a chapter navigator, so every selection returns
    // to the new chapter's beginning. On small screens the in-flow horizontal
    // rail already sits beside the content and preserves the viewport; it only
    // aligns the chapter after becoming the fixed progress rail.
    const shouldAlignChapter =
      !horizontalJourneyQuery.matches || journeyDock?.classList.contains("is-docked");

    if (scrollToChapter && (forceScroll || shouldAlignChapter)) {
      scrollToChapterStart();
    }
  });
};

journeySteps.forEach((step) => {
  step.addEventListener("click", () => selectJourneyStep(step));
});

const selectPainItem = (item) => {
  const shouldSelect = !item.classList.contains("is-selected");
  if (!shouldSelect) {
    item.classList.remove("is-selected");
    item.classList.add("is-deselecting");
    item.setAttribute("aria-pressed", "false");
    window.setTimeout(() => item.classList.remove("is-deselecting"), 460);
    return;
  }

  painItems.forEach((painItem) => {
    const selected = painItem === item;
    painItem.classList.toggle("is-selected", selected);
    painItem.setAttribute("aria-pressed", String(selected));
  });
  item.classList.remove("is-pressed");
  window.requestAnimationFrame(() => item.classList.add("is-pressed"));
  window.setTimeout(() => item.classList.remove("is-pressed"), 460);
};

painItems.forEach((item) => {
  item.setAttribute("aria-pressed", "false");
  item.addEventListener("click", () => selectPainItem(item));
  item.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    selectPainItem(item);
  });
});

gapFlipCards.forEach((card) => {
  card.addEventListener("click", () => {
    const isFlipped = card.classList.toggle("is-flipped");
    card.setAttribute("aria-pressed", String(isFlipped));
    const label = card.getAttribute("aria-label")?.replace(/^(Show|Hide) /, "") || "card details";
    card.setAttribute("aria-label", `${isFlipped ? "Hide" : "Show"} ${label}`);
  });
});

const showWorkflowNode = (node) => {
  if (!node || !workflowPopover) return;

  workflowNodes.forEach((item) => {
    const isActive = item === node;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });

  workflowPopover.querySelector(".module-three-popover-step").textContent = node.dataset.step;
  workflowPopover.querySelector(".module-three-popover-title").textContent = node.dataset.title;
  workflowPopover.querySelector(".module-three-popover-title-zh").textContent = node.dataset.titleZh;
  workflowPopover.querySelector(".module-three-popover-user").textContent = node.dataset.user;
  workflowPopover.querySelector(".module-three-popover-user-zh").textContent = node.dataset.userZh;
  workflowPopover.querySelector(".module-three-popover-ai").textContent = node.dataset.ai;
  workflowPopover.querySelector(".module-three-popover-ai-zh").textContent = node.dataset.aiZh;
  workflowPopover.querySelector(".module-three-popover-output").textContent = node.dataset.output;
  workflowPopover.querySelector(".module-three-popover-output-zh").textContent = node.dataset.outputZh;
};

let activeWorkflowPhase = null;
const filterWorkflowPhase = (phase) => {
  activeWorkflowPhase = activeWorkflowPhase === phase ? null : phase;

  workflowTabs.forEach((tab) => {
    const isActive = tab.dataset.workflowPhase === activeWorkflowPhase;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-pressed", String(isActive));
  });

  workflowNodes.forEach((node) => {
    node.classList.toggle("is-dimmed", Boolean(activeWorkflowPhase && node.dataset.phase !== activeWorkflowPhase));
  });

  const firstVisibleNode = [...workflowNodes].find((node) => !node.classList.contains("is-dimmed"));
  showWorkflowNode(firstVisibleNode);
};

workflowNodes.forEach((node) => {
  node.setAttribute("aria-pressed", String(node.classList.contains("is-active")));
  node.addEventListener("mouseenter", () => showWorkflowNode(node));
  node.addEventListener("focus", () => showWorkflowNode(node));
  node.addEventListener("click", () => showWorkflowNode(node));
});

workflowTabs.forEach((tab) => {
  tab.addEventListener("click", () => filterWorkflowPhase(tab.dataset.workflowPhase));
});

informationArchitectureMaps.forEach((map) => {
  const branches = [...map.querySelectorAll(".module-four-ia-branch")];
  if (!branches.length) return;

  const setSelectedBranch = (branch) => {
    const shouldSelect = Boolean(branch && !branch.classList.contains("is-ia-selected"));

    branches.forEach((item) => {
      const isSelected = shouldSelect && item === branch;
      item.classList.toggle("is-ia-selected", isSelected);
      item.setAttribute("aria-pressed", String(isSelected));
    });

    map.classList.toggle("has-ia-selection", shouldSelect);
  };

  branches.forEach((branch) => {
    const primaryLabel = branch.querySelector(".module-four-ia-primary strong")?.textContent?.trim() || "information architecture branch";
    branch.tabIndex = 0;
    branch.setAttribute("role", "button");
    branch.setAttribute("aria-pressed", "false");
    branch.setAttribute("aria-label", `Highlight ${primaryLabel}`);

    branch.addEventListener("mouseenter", () => {
      branch.classList.add("is-ia-hovered");
    });
    branch.addEventListener("mouseleave", () => {
      branch.classList.remove("is-ia-hovered");
    });
    branch.addEventListener("focus", () => {
      branch.classList.add("is-ia-hovered");
    });
    branch.addEventListener("blur", () => {
      branch.classList.remove("is-ia-hovered");
    });
    branch.addEventListener("click", () => setSelectedBranch(branch));
    branch.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      setSelectedBranch(branch);
    });
  });

  map.addEventListener("click", (event) => {
    if (!event.target.closest(".module-four-ia-branch")) setSelectedBranch(null);
  });

  document.addEventListener("click", (event) => {
    if (!map.contains(event.target)) setSelectedBranch(null);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setSelectedBranch(null);
  });
});

const dashboardMetrics = [...document.querySelectorAll(".module-five-dashboard-metric")];
const dashboardMetricControls = [...document.querySelectorAll(".module-five-metric-info")];

const setDashboardMetricTooltip = (metric, shouldOpen) => {
  metric.classList.toggle("is-tooltip-open", shouldOpen);
  metric.querySelector(".module-five-metric-info")?.setAttribute("aria-expanded", String(shouldOpen));
};

dashboardMetricControls.forEach((control) => {
  const metric = control.closest(".module-five-dashboard-metric");
  if (!metric) return;

  control.addEventListener("click", () => {
    const shouldOpen = !metric.classList.contains("is-tooltip-open");

    dashboardMetrics.forEach((item) => {
      setDashboardMetricTooltip(item, item === metric && shouldOpen);
    });
  });
});

document.addEventListener("click", (event) => {
  if (event.target.closest(".module-five-metric-info")) return;
  dashboardMetrics.forEach((metric) => setDashboardMetricTooltip(metric, false));
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  dashboardMetrics.forEach((metric) => setDashboardMetricTooltip(metric, false));
});

/**
 * Dock only the horizontal progress navigation. The desktop journey sidebar
 * remains governed entirely by its existing sticky CSS.
 */
if (journeyDock && journeyNav) {
  const dockSentinel = document.createElement("span");
  const dockScrim = document.createElement("span");
  let isJourneyDocked = false;
  let journeyDockFrame = 0;
  let journeyRestScrollLeft = journeyNav.scrollLeft;
  let journeyRailAnimation = null;

  dockSentinel.className = "teamalign-journey-dock-sentinel";
  dockSentinel.setAttribute("aria-hidden", "true");
  dockScrim.className = "teamalign-journey-dock-scrim";
  dockScrim.setAttribute("aria-hidden", "true");
  journeyDock.before(dockSentinel, dockScrim);

  /**
   * Preserve the active chapter's visual position across a layout-mode change,
   * then let the original rail glide from that position into its new one.
   * This avoids the one-frame jump caused by switching fixed positioning and
   * centre-enabling side padding before a native smooth scroll can begin.
   */
  const animateJourneyRailFrom = (activeRectBefore) => {
    const activeStep = journeyNav.querySelector(".journey-step.is-active");
    if (!activeStep || reducedMotionQuery.matches) return;

    const activeRectAfter = activeStep.getBoundingClientRect();
    const deltaX =
      activeRectBefore.left + activeRectBefore.width / 2 -
      (activeRectAfter.left + activeRectAfter.width / 2);
    const deltaY =
      activeRectBefore.top + activeRectBefore.height / 2 -
      (activeRectAfter.top + activeRectAfter.height / 2);

    if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5) return;

    journeyRailAnimation?.cancel();
    journeyRailAnimation = journeyNav.animate(
      [
        { transform: `translate3d(${deltaX}px, ${deltaY}px, 0)` },
        { transform: "translate3d(0, 0, 0)" },
      ],
      {
        duration: 560,
        easing: "cubic-bezier(0.22, 0.78, 0.26, 1)",
      },
    );
    journeyRailAnimation.addEventListener(
      "finish",
      () => {
        journeyRailAnimation = null;
      },
      { once: true },
    );
  };

  const setJourneyDock = (shouldDock, settledTop) => {
    if (shouldDock) {
      journeyDock.style.setProperty("--teamalign-journey-dock-top", `${settledTop}px`);
    }

    if (shouldDock === isJourneyDocked) return;

    if (shouldDock) {
      const activeRectBefore = journeyNav
        .querySelector(".journey-step.is-active")
        ?.getBoundingClientRect();

      // Remember the rail's in-flow position so leaving the fixed state can
      // glide the active chapter back instead of snapping the rail sideways.
      journeyRestScrollLeft = journeyNav.scrollLeft;
      const dockStyles = window.getComputedStyle(journeyDock);
      const dockFootprint =
        journeyDock.getBoundingClientRect().height +
        (Number.parseFloat(dockStyles.marginBottom) || 0);

      dockSentinel.style.height = `${Math.ceil(dockFootprint)}px`;
      dockSentinel.style.marginBottom = "0";
      journeyDock.classList.add("is-docked");
      dockScrim.classList.add("is-visible");

      // Resolve the final centred state before the browser paints it, then
      // visually interpolate from the in-flow position captured above.
      centerActiveJourneyStep("auto");
      if (activeRectBefore) animateJourneyRailFrom(activeRectBefore);
      syncJourneyProgress();
    } else {
      const activeRectBefore = journeyNav
        .querySelector(".journey-step.is-active")
        ?.getBoundingClientRect();

      journeyDock.classList.remove("is-docked");
      dockScrim.classList.remove("is-visible");
      dockSentinel.style.height = "1px";
      dockSentinel.style.marginBottom = "-1px";
      journeyDock.style.removeProperty("--teamalign-journey-dock-top");

      // Restore the in-flow scroll state immediately, while FLIP preserves the
      // previous on-screen position and animates the rail back without a snap.
      const maxRestScrollLeft = Math.max(0, journeyNav.scrollWidth - journeyNav.clientWidth);
      journeyNav.scrollLeft = Math.min(
        maxRestScrollLeft,
        Math.max(0, journeyRestScrollLeft),
      );

      // The selected chapter may have changed while the rail was fixed. Do
      // not restore a stale scroll position that can leave the current active
      // item off-screen (for example, returning to 04–06 after selecting 01).
      const activeStepAfter = journeyNav.querySelector(".journey-step.is-active");
      if (activeStepAfter) {
        const navRectAfter = journeyNav.getBoundingClientRect();
        const activeRectAfter = activeStepAfter.getBoundingClientRect();
        const activeIsOutside =
          activeRectAfter.left < navRectAfter.left ||
          activeRectAfter.right > navRectAfter.right;

        if (activeIsOutside) {
          const centreDelta =
            activeRectAfter.left + activeRectAfter.width / 2 -
            (navRectAfter.left + navRectAfter.width / 2);
          journeyNav.scrollLeft = Math.min(
            maxRestScrollLeft,
            Math.max(0, journeyNav.scrollLeft + centreDelta),
          );
        }
      }

      if (activeRectBefore) animateJourneyRailFrom(activeRectBefore);
      syncJourneyProgress();
    }

    isJourneyDocked = shouldDock;
  };

  const syncJourneyDock = () => {
    if (!horizontalJourneyQuery.matches) {
      setJourneyDock(false, 0);
      return;
    }

    // The original progress rail spans the viewport and sits beneath the
    // persistent global controls; those controls may naturally cover its ends.
    const settledTop = 7;
    const shouldDock = dockSentinel.getBoundingClientRect().top <= settledTop;
    setJourneyDock(shouldDock, settledTop);
  };

  const requestJourneyDockSync = () => {
    if (journeyDockFrame) return;
    journeyDockFrame = window.requestAnimationFrame(() => {
      journeyDockFrame = 0;
      syncJourneyDock();
    });
  };

  window.addEventListener("scroll", requestJourneyDockSync, { passive: true });
  window.addEventListener("resize", () => {
    requestJourneyDockSync();
    window.requestAnimationFrame(() => {
      centerActiveJourneyStep("auto");
      syncJourneyProgress();
    });
  });
  requestJourneyDockSync();
}

const journeyStepFromHash = () => {
  const match = window.location.hash.match(/^#teamalign-chapter-(0[1-6])$/);
  if (!match) return null;
  return Array.from(journeySteps).find((step) => step.dataset.index === match[1]) || null;
};

const initialJourneyStep = journeyStepFromHash();
if (initialJourneyStep) {
  selectJourneyStep(initialJourneyStep, {
    updateHistory: false,
    scrollToChapter: true,
    forceScroll: true,
  });
} else {
  syncChapterDetails(document.querySelector(".journey-step.is-active")?.dataset.index);
}

window.addEventListener("hashchange", () => {
  const journeyStep = journeyStepFromHash();
  if (!journeyStep) return;
  selectJourneyStep(journeyStep, {
    updateHistory: false,
    scrollToChapter: true,
    forceScroll: true,
  });
});

journeyNav?.addEventListener("scroll", syncJourneyProgress, { passive: true });
workflowTimelineWrap?.addEventListener("scroll", syncWorkflowTimelineProgress, { passive: true });
window.addEventListener("resize", syncJourneyProgress);
window.addEventListener("resize", syncWorkflowTimelineProgress);
syncJourneyProgress();
window.requestAnimationFrame(() => centerActiveJourneyStep("auto"));
syncWorkflowTimelineProgress();
requestAnimationFrame(syncWorkflowTimelineProgress);
window.addEventListener("load", syncWorkflowTimelineProgress, { once: true });
document.fonts?.ready.then(syncWorkflowTimelineProgress);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.18 },
);

document.querySelectorAll(".reveal-on-scroll").forEach((element) => revealObserver.observe(element));

const syncBackToTopButton = () => {
  backToTopButton?.classList.toggle("is-visible", window.scrollY > 360);
};

window.addEventListener("scroll", syncBackToTopButton, { passive: true });
backToTopButton?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
syncBackToTopButton();
