(() => {
  "use strict";

  const footerYear = document.querySelector(".portfolio-footer-year");
  if (footerYear) footerYear.textContent = String(new Date().getFullYear());

  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    const updateBackToTop = () => {
      backToTop.classList.toggle("is-visible", window.scrollY > 360);
    };

    window.addEventListener("scroll", updateBackToTop, { passive: true });
    updateBackToTop();
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
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

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  const moduleButtons = Array.from(document.querySelectorAll("[data-fairbench-module]"));
  const fileLayers = Array.from(document.querySelectorAll("[data-fairbench-sheet]"));
  const moduleStage = document.querySelector("#fairbench-module-stage");
  const stageIndex = document.querySelector("[data-fairbench-stage-index]");
  const stagePhase = document.querySelector("[data-fairbench-stage-phase]");
  const stageTitle = document.querySelector("[data-fairbench-stage-title]");
  const stageTitleZh = document.querySelector("[data-fairbench-stage-title-zh]");
  const stageSummary = document.querySelector("[data-fairbench-stage-summary]");
  const stageSummaryZh = document.querySelector("[data-fairbench-stage-summary-zh]");
  const stageArt = document.querySelector("[data-fairbench-stage-art]");
  const stageOverview = document.querySelector("[data-fairbench-overview]");
  const modulePanels = Array.from(document.querySelectorAll("[data-fairbench-panel]"));
  const overviewSteps = Array.from(document.querySelectorAll("[data-fairbench-overview-step]"));
  const overviewStage = document.querySelector("[data-fairbench-overview-stage]");
  const overviewTitle = document.querySelector("[data-fairbench-overview-title]");
  const overviewTitleZh = document.querySelector("[data-fairbench-overview-title-zh]");
  const overviewCopy = document.querySelector("[data-fairbench-overview-copy]");
  const overviewCopyZh = document.querySelector("[data-fairbench-overview-copy-zh]");
  const contextToggles = Array.from(document.querySelectorAll("[data-fairbench-context-toggle]"));
  const nativeDisclosureSummaries = Array.from(document.querySelectorAll(".fairbench-cabinet-cover details > summary"));
  const obligationToggles = Array.from(document.querySelectorAll("[data-fairbench-obligation-toggle]"));
  const obligationCards = Array.from(document.querySelectorAll(".fairbench-obligation-card"));
  const modelToggles = Array.from(document.querySelectorAll("[data-fairbench-model-toggle]"));
  const riskToggles = Array.from(document.querySelectorAll("[data-fairbench-risk-toggle]"));
  const pipelineSteps = Array.from(document.querySelectorAll("[data-fairbench-pipeline-step]"));
  const pipelinePanels = Array.from(document.querySelectorAll("[data-fairbench-pipeline-panel]"));
  const riskScoreboard = document.querySelector("[data-fairbench-risk-score]");
  const riskScoreInputs = Array.from(document.querySelectorAll("[data-fairbench-risk-input]"));
  const riskInfoToggles = Array.from(document.querySelectorAll(".fairbench-risk-info-toggle"));
  const riskInfoHeadings = Array.from(document.querySelectorAll(".fairbench-risk-dimension-summary h3"));
  const riskScoreTotal = document.querySelector("[data-fairbench-risk-total]");
  const riskScoreBand = document.querySelector("[data-fairbench-risk-band]");
  const riskScoreBandZh = document.querySelector("[data-fairbench-risk-band-zh]");
  const riskMeterBands = Array.from(document.querySelectorAll("[data-fairbench-risk-meter-band]"));
  const riskLevelCards = Array.from(document.querySelectorAll("[data-fairbench-risk-level]"));
  const alignmentJurisdictionButtons = Array.from(document.querySelectorAll("[data-fairbench-jurisdiction]"));
  const alignmentJurisdictionPanels = Array.from(document.querySelectorAll("[data-fairbench-jurisdiction-panel]"));
  const alignmentSteps = Array.from(document.querySelectorAll("[data-fairbench-alignment-step]"));
  const alignmentStage = document.querySelector("[data-fairbench-alignment-stage]");
  const alignmentTitle = document.querySelector("[data-fairbench-alignment-title]");
  const alignmentTitleZh = document.querySelector("[data-fairbench-alignment-title-zh]");
  const alignmentCopy = document.querySelector("[data-fairbench-alignment-copy]");
  const alignmentCopyZh = document.querySelector("[data-fairbench-alignment-copy-zh]");
  const alignmentOwner = document.querySelector("[data-fairbench-alignment-owner]");
  const alignmentOwnerZh = document.querySelector("[data-fairbench-alignment-owner-zh]");
  const alignmentEvidence = document.querySelector("[data-fairbench-alignment-evidence]");
  const alignmentEvidenceZh = document.querySelector("[data-fairbench-alignment-evidence-zh]");
  const alignmentInspector = document.querySelector("#fairbench-alignment-review-inspector");
  const alignmentRouteBranches = document.querySelector("[data-fairbench-route-branches]");
  const reportSteps = Array.from(document.querySelectorAll("[data-fairbench-report-step]"));
  const reportInspector = document.querySelector("#fairbench-report-workflow-inspector");
  const reportStage = document.querySelector("[data-fairbench-report-stage]");
  const reportTitle = document.querySelector("[data-fairbench-report-title]");
  const reportTitleZh = document.querySelector("[data-fairbench-report-title-zh]");
  const reportCopy = document.querySelector("[data-fairbench-report-copy]");
  const reportCopyZh = document.querySelector("[data-fairbench-report-copy-zh]");
  const reportAction = document.querySelector("[data-fairbench-report-action]");
  const reportActionZh = document.querySelector("[data-fairbench-report-action-zh]");
  const reportSystem = document.querySelector("[data-fairbench-report-system]");
  const reportSystemZh = document.querySelector("[data-fairbench-report-system-zh]");
  const reportProof = document.querySelector("[data-fairbench-report-proof]");
  const reportProofZh = document.querySelector("[data-fairbench-report-proof-zh]");
  const reportDrillButtons = Array.from(document.querySelectorAll("[data-fairbench-report-drill]"));
  const reportDrillPanels = Array.from(document.querySelectorAll("[data-fairbench-report-drill-panel]"));
  const validationConfidenceButtons = Array.from(document.querySelectorAll("[data-fairbench-validation-confidence]"));
  const validationConfidencePanel = document.querySelector("#fairbench-validation-confidence-panel");
  const validationLevel = document.querySelector("[data-fairbench-validation-level]");
  const validationLevelZh = document.querySelector("[data-fairbench-validation-level-zh]");
  const validationTitle = document.querySelector("[data-fairbench-validation-title]");
  const validationTitleZh = document.querySelector("[data-fairbench-validation-title-zh]");
  const validationCan = document.querySelector("[data-fairbench-validation-can]");
  const validationCanZh = document.querySelector("[data-fairbench-validation-can-zh]");
  const validationCannot = document.querySelector("[data-fairbench-validation-cannot]");
  const validationCannotZh = document.querySelector("[data-fairbench-validation-cannot-zh]");
  const validationNext = document.querySelector("[data-fairbench-validation-next]");
  const validationNextZh = document.querySelector("[data-fairbench-validation-next-zh]");
  const validationStressDetails = Array.from(document.querySelectorAll(".fairbench-validation-stress > details"));
  const validationStressSupportsHover = window.matchMedia("(hover: hover)");
  const governanceStageButtons = Array.from(document.querySelectorAll("[data-fairbench-governance-stage]"));
  const governanceLoopPanel = document.querySelector("#fairbench-governance-loop-panel");
  const governanceKicker = document.querySelector("[data-fairbench-governance-kicker]");
  const governanceKickerZh = document.querySelector("[data-fairbench-governance-kicker-zh]");
  const governanceTitle = document.querySelector("[data-fairbench-governance-title]");
  const governanceTitleZh = document.querySelector("[data-fairbench-governance-title-zh]");
  const governanceTrigger = document.querySelector("[data-fairbench-governance-trigger]");
  const governanceTriggerZh = document.querySelector("[data-fairbench-governance-trigger-zh]");
  const governanceAction = document.querySelector("[data-fairbench-governance-action]");
  const governanceActionZh = document.querySelector("[data-fairbench-governance-action-zh]");
  const governanceOutput = document.querySelector("[data-fairbench-governance-output]");
  const governanceOutputZh = document.querySelector("[data-fairbench-governance-output-zh]");
  const governanceCurrent = document.querySelector("[data-fairbench-governance-current]");
  const governanceCurrentZh = document.querySelector("[data-fairbench-governance-current-zh]");
  const roadmapButtons = Array.from(document.querySelectorAll("[data-fairbench-roadmap]"));
  const roadmapPanel = document.querySelector("#fairbench-roadmap-panel");
  const roadmapPhase = document.querySelector("[data-fairbench-roadmap-phase]");
  const roadmapPhaseZh = document.querySelector("[data-fairbench-roadmap-phase-zh]");
  const roadmapTitle = document.querySelector("[data-fairbench-roadmap-title]");
  const roadmapTitleZh = document.querySelector("[data-fairbench-roadmap-title-zh]");
  const roadmapOutcome = document.querySelector("[data-fairbench-roadmap-outcome]");
  const roadmapBuild = document.querySelector("[data-fairbench-roadmap-build]");
  const roadmapBoundary = document.querySelector("[data-fairbench-roadmap-boundary]");
  let stageAnimationTimer;
  let tabAnimationTimer;
  let sheetSyncTimer;

  const activateOverviewStep = (selectedStep) => {
    if (!selectedStep) return;

    overviewSteps.forEach((step) => {
      const isSelected = step === selectedStep;
      step.classList.toggle("is-active", isSelected);
      step.setAttribute("aria-pressed", String(isSelected));
    });

    if (overviewStage) overviewStage.textContent = selectedStep.dataset.stage || "";
    if (overviewTitle) overviewTitle.textContent = selectedStep.dataset.title || "";
    if (overviewTitleZh) overviewTitleZh.textContent = selectedStep.dataset.titleZh || "";
    if (overviewCopy) overviewCopy.textContent = selectedStep.dataset.copy || "";
    if (overviewCopyZh) overviewCopyZh.textContent = selectedStep.dataset.copyZh || "";
  };

  const syncSheetTabs = () => {
    fileLayers.forEach((layer) => {
      const matchingButton = moduleButtons.find(
        (button) => button.dataset.index === layer.dataset.sheetIndex,
      );
      if (!matchingButton) return;

      const layerRect = layer.getBoundingClientRect();
      const buttonRect = matchingButton.getBoundingClientRect();
      const transform = new DOMMatrixReadOnly(getComputedStyle(matchingButton).transform);
      const buttonBaseTop = buttonRect.top - transform.m42;
      const buttonBaseLeft = buttonRect.left - transform.m41;
      const sheetTabWidth = Math.max(0, layerRect.left - buttonBaseLeft + 2);
      layer.style.setProperty("--sheet-tab-top", `${buttonBaseTop - layerRect.top}px`);
      layer.style.setProperty("--sheet-tab-width", `${sheetTabWidth}px`);
      layer.style.setProperty("--sheet-tab-height", `${buttonRect.height}px`);
      matchingButton.style.setProperty("--fairbench-sheet-tab-width", `${sheetTabWidth}px`);
    });
  };

  let stageArtHeightFrame;
  const syncStageArtHeight = () => {
    if (!moduleStage || !stageSummary) return;

    const activePanel = modulePanels.find((panel) => !panel.hidden);
    if (!activePanel) return;

    const stageRect = moduleStage.getBoundingClientRect();
    const summaryRect = stageSummary.getBoundingClientRect();
    const panelRect = activePanel.getBoundingClientRect();
    const summaryBottom = summaryRect.bottom - stageRect.top;
    const whitespace = Math.max(0, panelRect.top - summaryRect.bottom);

    moduleStage.style.setProperty(
      "--fairbench-cover-art-height",
      `${Math.round(summaryBottom + whitespace / 2)}px`,
    );
  };

  const queueStageArtHeight = () => {
    window.cancelAnimationFrame(stageArtHeightFrame);
    stageArtHeightFrame = window.requestAnimationFrame(syncStageArtHeight);
  };

  const activateModule = (
    selectedButton,
    { focusStage = false, scrollToStage = false, updateHistory = true, scrollBehavior } = {},
  ) => {
    if (!selectedButton || !moduleStage) return;

    moduleButtons.forEach((button) => {
      const isSelected = button === selectedButton;
      button.classList.remove("is-tab-changing");
      button.classList.toggle("is-active", isSelected);
      button.setAttribute("aria-selected", String(isSelected));
    });

    if (stageIndex) stageIndex.textContent = selectedButton.dataset.index || "";
    if (stagePhase) stagePhase.textContent = selectedButton.dataset.phase || "";
    if (stageTitle) stageTitle.textContent = selectedButton.dataset.title || "";
    if (stageTitleZh) stageTitleZh.textContent = selectedButton.dataset.titleZh || "";
    if (stageSummary) stageSummary.firstChild.textContent = selectedButton.dataset.summary || "";
    if (stageSummaryZh) stageSummaryZh.textContent = selectedButton.dataset.summaryZh || "";
    if (stageArt) stageArt.src = selectedButton.dataset.art || "";
    modulePanels.forEach((panel) => {
      panel.hidden = panel.dataset.fairbenchPanel !== selectedButton.dataset.index;
    });
    if (stageOverview && !stageOverview.dataset.fairbenchPanel) {
      stageOverview.hidden = selectedButton.dataset.index !== "01";
    }

    queueStageArtHeight();

    moduleStage.dataset.activeModule = selectedButton.dataset.index || "";
    if (updateHistory && selectedButton.dataset.index) {
      history.replaceState(null, "", `#fairbench-chapter-${selectedButton.dataset.index}`);
    }
    const inactiveIndexes = moduleButtons
      .map((button) => button.dataset.index)
      .filter((moduleIndex) => moduleIndex !== selectedButton.dataset.index)
      .reverse();
    fileLayers.forEach((layer, layerIndex) => {
      const sheetIndex = inactiveIndexes[layerIndex] || "";
      const sheetDepth = String(fileLayers.length - layerIndex);
      layer.dataset.sheetIndex = sheetIndex;
      layer.classList.remove("is-tab-hovered");
      layer.style.setProperty("--sheet-depth", sheetDepth);
      const matchingButton = moduleButtons.find((button) => button.dataset.index === sheetIndex);
      if (matchingButton) matchingButton.style.setProperty("--tab-depth", sheetDepth);
    });
    selectedButton.style.setProperty("--tab-depth", "8");
    window.requestAnimationFrame(syncSheetTabs);
    void selectedButton.offsetWidth;
    selectedButton.classList.add("is-tab-changing");
    moduleStage.classList.remove("is-file-changing");
    void moduleStage.offsetWidth;
    moduleStage.classList.add("is-file-changing");
    window.clearTimeout(stageAnimationTimer);
    stageAnimationTimer = window.setTimeout(() => {
      moduleStage.classList.remove("is-file-changing");
    }, 560);
    window.clearTimeout(tabAnimationTimer);
    tabAnimationTimer = window.setTimeout(() => {
      selectedButton.classList.remove("is-tab-changing");
    }, 560);
    window.clearTimeout(sheetSyncTimer);
    sheetSyncTimer = window.setTimeout(syncSheetTabs, 300);
    if (focusStage) moduleStage.focus({ preventScroll: true });
    if (scrollToStage) {
      window.requestAnimationFrame(() => {
        moduleStage.scrollIntoView({
          behavior:
            scrollBehavior ||
            (window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"),
          block: "start",
        });
      });
    }
  };

  moduleButtons.forEach((button, index) => {
    button.addEventListener("click", () => activateModule(button, { scrollToStage: true }));

    const setTabHover = (isHovered) => {
      const matchingLayer = fileLayers.find(
        (layer) => layer.dataset.sheetIndex === button.dataset.index,
      );
      if (matchingLayer) matchingLayer.classList.toggle("is-tab-hovered", isHovered);
    };

    button.addEventListener("pointerenter", () => setTabHover(true));
    button.addEventListener("pointerleave", () => setTabHover(false));
    button.addEventListener("focus", () => setTabHover(true));
    button.addEventListener("blur", () => setTabHover(false));

    button.addEventListener("keydown", (event) => {
      const isNext = ["ArrowDown", "ArrowRight"].includes(event.key);
      const isPrevious = ["ArrowUp", "ArrowLeft"].includes(event.key);
      const isBoundary = ["Home", "End"].includes(event.key);
      if (!isNext && !isPrevious && !isBoundary) return;

      event.preventDefault();
      const nextIndex = event.key === "Home"
        ? 0
        : event.key === "End"
          ? moduleButtons.length - 1
          : (index + (isNext ? 1 : -1) + moduleButtons.length) % moduleButtons.length;
      const nextButton = moduleButtons[nextIndex];
      nextButton.focus();
      activateModule(nextButton);
    });
  });

  overviewSteps.forEach((step) => {
    step.addEventListener("click", () => activateOverviewStep(step));
  });

  const activateJurisdiction = (selectedButton, { focus = false } = {}) => {
    if (!selectedButton) return;
    const selectedRegion = selectedButton.dataset.fairbenchJurisdiction;
    alignmentJurisdictionButtons.forEach((button) => {
      const isSelected = button === selectedButton;
      button.classList.toggle("is-active", isSelected);
      button.setAttribute("aria-selected", String(isSelected));
      button.tabIndex = isSelected ? 0 : -1;
    });
    alignmentJurisdictionPanels.forEach((panel) => {
      panel.hidden = panel.dataset.fairbenchJurisdictionPanel !== selectedRegion;
    });
    if (focus) selectedButton.focus();
  };

  alignmentJurisdictionButtons.forEach((button, index) => {
    button.addEventListener("click", () => activateJurisdiction(button));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const nextIndex = event.key === "Home"
        ? 0
        : event.key === "End"
          ? alignmentJurisdictionButtons.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + alignmentJurisdictionButtons.length) % alignmentJurisdictionButtons.length;
      activateJurisdiction(alignmentJurisdictionButtons[nextIndex], { focus: true });
    });
  });

  const replaceLeadingText = (element, value) => {
    if (!element) return;
    const textNode = Array.from(element.childNodes).find((node) => node.nodeType === Node.TEXT_NODE);
    if (textNode) textNode.nodeValue = value;
    else element.prepend(document.createTextNode(value));
  };

  const replaceRoadmapPoints = (element, values, valuesZh) => {
    if (!element) return;
    const points = (values || "").split("|").filter(Boolean);
    const pointsZh = (valuesZh || "").split("|");
    const withoutTerminalPunctuation = (value) => value.replace(/[。.]$/u, "");
    const fragment = document.createDocumentFragment();

    points.forEach((point, index) => {
      const item = document.createElement("li");
      item.append(document.createTextNode(withoutTerminalPunctuation(point)));
      if (pointsZh[index]) {
        const translation = document.createElement("small");
        translation.textContent = withoutTerminalPunctuation(pointsZh[index]);
        item.append(translation);
      }
      fragment.append(item);
    });

    element.replaceChildren(fragment);
  };

  const activateAlignmentStep = (selectedStep, { focus = false } = {}) => {
    if (!selectedStep) return;
    alignmentSteps.forEach((step) => {
      const isSelected = step === selectedStep;
      step.classList.toggle("is-active", isSelected);
      step.setAttribute("aria-selected", String(isSelected));
      step.tabIndex = isSelected ? 0 : -1;
    });
    if (alignmentStage) alignmentStage.textContent = selectedStep.dataset.stage || "";
    if (alignmentTitle) alignmentTitle.textContent = selectedStep.dataset.title || "";
    if (alignmentTitleZh) alignmentTitleZh.textContent = selectedStep.dataset.titleZh || "";
    if (alignmentCopy) alignmentCopy.textContent = selectedStep.dataset.copy || "";
    if (alignmentCopyZh) alignmentCopyZh.textContent = selectedStep.dataset.copyZh || "";
    replaceLeadingText(alignmentOwner, selectedStep.dataset.owner || "");
    if (alignmentOwnerZh) alignmentOwnerZh.textContent = selectedStep.dataset.ownerZh || "";
    replaceLeadingText(alignmentEvidence, selectedStep.dataset.evidence || "");
    if (alignmentEvidenceZh) alignmentEvidenceZh.textContent = selectedStep.dataset.evidenceZh || "";
    const isRouteStage = selectedStep.dataset.stage === "04";
    if (alignmentInspector) alignmentInspector.hidden = false;
    if (alignmentRouteBranches) alignmentRouteBranches.hidden = !isRouteStage;
    if (focus) selectedStep.focus();
  };

  alignmentSteps.forEach((step, index) => {
    step.addEventListener("click", () => activateAlignmentStep(step));
    step.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const isNext = ["ArrowRight", "ArrowDown"].includes(event.key);
      const nextIndex = event.key === "Home"
        ? 0
        : event.key === "End"
          ? alignmentSteps.length - 1
          : (index + (isNext ? 1 : -1) + alignmentSteps.length) % alignmentSteps.length;
      activateAlignmentStep(alignmentSteps[nextIndex], { focus: true });
    });
  });

  if (alignmentSteps[0]) activateAlignmentStep(alignmentSteps[0]);

  const activateReportStep = (selectedStep, { focus = false } = {}) => {
    if (!selectedStep) return;
    reportSteps.forEach((step) => {
      const isSelected = step === selectedStep;
      step.classList.toggle("is-active", isSelected);
      step.setAttribute("aria-selected", String(isSelected));
      step.tabIndex = isSelected ? 0 : -1;
    });
    if (reportInspector) reportInspector.setAttribute("aria-labelledby", selectedStep.id);
    if (reportStage) reportStage.textContent = selectedStep.dataset.step || "";
    if (reportTitle) reportTitle.textContent = selectedStep.dataset.title || "";
    if (reportTitleZh) reportTitleZh.textContent = selectedStep.dataset.titleZh || "";
    if (reportCopy) reportCopy.textContent = selectedStep.dataset.copy || "";
    if (reportCopyZh) reportCopyZh.textContent = selectedStep.dataset.copyZh || "";
    replaceLeadingText(reportAction, selectedStep.dataset.action || "");
    if (reportActionZh) reportActionZh.textContent = selectedStep.dataset.actionZh || "";
    replaceLeadingText(reportSystem, selectedStep.dataset.system || "");
    if (reportSystemZh) reportSystemZh.textContent = selectedStep.dataset.systemZh || "";
    replaceLeadingText(reportProof, selectedStep.dataset.proof || "");
    if (reportProofZh) reportProofZh.textContent = selectedStep.dataset.proofZh || "";
    if (focus) selectedStep.focus();
  };

  reportSteps.forEach((step, index) => {
    step.addEventListener("click", () => activateReportStep(step));
    step.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const isNext = ["ArrowRight", "ArrowDown"].includes(event.key);
      const nextIndex = event.key === "Home"
        ? 0
        : event.key === "End"
          ? reportSteps.length - 1
          : (index + (isNext ? 1 : -1) + reportSteps.length) % reportSteps.length;
      activateReportStep(reportSteps[nextIndex], { focus: true });
    });
  });

  const activateReportDrill = (selectedButton, { focus = false } = {}) => {
    if (!selectedButton) return;
    const selectedDimension = selectedButton.dataset.fairbenchReportDrill;
    reportDrillButtons.forEach((button) => {
      const isSelected = button === selectedButton;
      button.classList.toggle("is-active", isSelected);
      button.setAttribute("aria-selected", String(isSelected));
      button.tabIndex = isSelected ? 0 : -1;
    });
    reportDrillPanels.forEach((panel) => {
      panel.hidden = panel.dataset.fairbenchReportDrillPanel !== selectedDimension;
    });
    if (focus) selectedButton.focus();
  };

  reportDrillButtons.forEach((button, index) => {
    button.addEventListener("click", () => activateReportDrill(button));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const nextIndex = event.key === "Home"
        ? 0
        : event.key === "End"
          ? reportDrillButtons.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + reportDrillButtons.length) % reportDrillButtons.length;
      activateReportDrill(reportDrillButtons[nextIndex], { focus: true });
    });
  });

  const activateValidationConfidence = (selectedButton, { focus = false } = {}) => {
    if (!selectedButton) return;
    validationConfidenceButtons.forEach((button) => {
      const isSelected = button === selectedButton;
      button.classList.toggle("is-active", isSelected);
      button.setAttribute("aria-selected", String(isSelected));
      button.tabIndex = isSelected ? 0 : -1;
    });
    if (validationConfidencePanel) validationConfidencePanel.setAttribute("aria-labelledby", selectedButton.id);
    replaceLeadingText(validationLevel, selectedButton.dataset.level || "");
    if (validationLevelZh) validationLevelZh.textContent = selectedButton.dataset.levelZh || "";
    if (validationTitle) validationTitle.textContent = selectedButton.dataset.title || "";
    if (validationTitleZh) validationTitleZh.textContent = selectedButton.dataset.titleZh || "";
    replaceLeadingText(validationCan, selectedButton.dataset.can || "");
    if (validationCanZh) validationCanZh.textContent = selectedButton.dataset.canZh || "";
    replaceLeadingText(validationCannot, selectedButton.dataset.cannot || "");
    if (validationCannotZh) validationCannotZh.textContent = selectedButton.dataset.cannotZh || "";
    replaceLeadingText(validationNext, selectedButton.dataset.next || "");
    if (validationNextZh) validationNextZh.textContent = selectedButton.dataset.nextZh || "";
    if (focus) selectedButton.focus();
  };

  validationConfidenceButtons.forEach((button, index) => {
    button.addEventListener("click", () => activateValidationConfidence(button));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const isNext = ["ArrowRight", "ArrowDown"].includes(event.key);
      const nextIndex = event.key === "Home"
        ? 0
        : event.key === "End"
          ? validationConfidenceButtons.length - 1
          : (index + (isNext ? 1 : -1) + validationConfidenceButtons.length) % validationConfidenceButtons.length;
      activateValidationConfidence(validationConfidenceButtons[nextIndex], { focus: true });
    });
  });

  const activateGovernanceStage = (selectedButton, { focus = false } = {}) => {
    if (!selectedButton) return;
    governanceStageButtons.forEach((button) => {
      const isSelected = button === selectedButton;
      button.classList.toggle("is-active", isSelected);
      button.setAttribute("aria-selected", String(isSelected));
      button.tabIndex = isSelected ? 0 : -1;
    });
    if (governanceLoopPanel) governanceLoopPanel.setAttribute("aria-labelledby", selectedButton.id);
    replaceLeadingText(governanceKicker, selectedButton.dataset.kicker || "");
    if (governanceKickerZh) governanceKickerZh.textContent = selectedButton.dataset.kickerZh || "";
    if (governanceTitle) governanceTitle.textContent = selectedButton.dataset.title || "";
    if (governanceTitleZh) governanceTitleZh.textContent = selectedButton.dataset.titleZh || "";
    replaceLeadingText(governanceTrigger, selectedButton.dataset.trigger || "");
    if (governanceTriggerZh) governanceTriggerZh.textContent = selectedButton.dataset.triggerZh || "";
    replaceLeadingText(governanceAction, selectedButton.dataset.action || "");
    if (governanceActionZh) governanceActionZh.textContent = selectedButton.dataset.actionZh || "";
    replaceLeadingText(governanceOutput, selectedButton.dataset.output || "");
    if (governanceOutputZh) governanceOutputZh.textContent = selectedButton.dataset.outputZh || "";
    replaceLeadingText(governanceCurrent, selectedButton.dataset.current || "");
    if (governanceCurrentZh) governanceCurrentZh.textContent = selectedButton.dataset.currentZh || "";
    if (focus) selectedButton.focus();
  };

  governanceStageButtons.forEach((button, index) => {
    button.addEventListener("click", () => activateGovernanceStage(button));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const isNext = ["ArrowRight", "ArrowDown"].includes(event.key);
      const nextIndex = event.key === "Home"
        ? 0
        : event.key === "End"
          ? governanceStageButtons.length - 1
          : (index + (isNext ? 1 : -1) + governanceStageButtons.length) % governanceStageButtons.length;
      activateGovernanceStage(governanceStageButtons[nextIndex], { focus: true });
    });
  });

  const activateRoadmap = (selectedButton, { focus = false } = {}) => {
    if (!selectedButton) return;
    roadmapButtons.forEach((button) => {
      const isSelected = button === selectedButton;
      button.classList.toggle("is-active", isSelected);
      button.setAttribute("aria-selected", String(isSelected));
      button.tabIndex = isSelected ? 0 : -1;
    });
    if (roadmapPanel) roadmapPanel.setAttribute("aria-labelledby", selectedButton.id);
    replaceLeadingText(roadmapPhase, selectedButton.dataset.phase || "");
    if (roadmapPhaseZh) roadmapPhaseZh.textContent = selectedButton.dataset.phaseZh || "";
    if (roadmapTitle) roadmapTitle.textContent = selectedButton.dataset.title || "";
    if (roadmapTitleZh) roadmapTitleZh.textContent = selectedButton.dataset.titleZh || "";
    replaceRoadmapPoints(roadmapOutcome, selectedButton.dataset.outcome, selectedButton.dataset.outcomeZh);
    replaceRoadmapPoints(roadmapBuild, selectedButton.dataset.build, selectedButton.dataset.buildZh);
    replaceRoadmapPoints(roadmapBoundary, selectedButton.dataset.boundary, selectedButton.dataset.boundaryZh);
    if (focus) selectedButton.focus();
  };

  roadmapButtons.forEach((button, index) => {
    button.addEventListener("click", () => activateRoadmap(button));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const isNext = ["ArrowRight", "ArrowDown"].includes(event.key);
      const nextIndex = event.key === "Home"
        ? 0
        : event.key === "End"
          ? roadmapButtons.length - 1
          : (index + (isNext ? 1 : -1) + roadmapButtons.length) % roadmapButtons.length;
      activateRoadmap(roadmapButtons[nextIndex], { focus: true });
    });
  });

  const setContextCardState = (toggle, expanded) => {
    const detailsId = toggle.getAttribute("aria-controls");
    const details = detailsId ? document.getElementById(detailsId) : null;
    const card = toggle.closest(".fairbench-context-card");
    toggle.setAttribute("aria-expanded", String(expanded));
    if (details) details.hidden = !expanded;
    if (card) card.classList.toggle("is-expanded", expanded);
  };

  contextToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const shouldExpand = toggle.getAttribute("aria-expanded") !== "true";
      setContextCardState(toggle, shouldExpand);
    });
  });

  nativeDisclosureSummaries.forEach((summary) => {
    summary.addEventListener("click", (event) => {
      if (event.detail > 0) requestAnimationFrame(() => summary.blur());
    });
  });

  const setDisclosureState = (toggle, expanded, cardSelector) => {
    const detailsId = toggle.getAttribute("aria-controls");
    const details = detailsId ? document.getElementById(detailsId) : null;
    const card = toggle.closest(cardSelector);
    toggle.setAttribute("aria-expanded", String(expanded));
    if (details) details.hidden = !expanded;
    if (card) card.classList.toggle("is-expanded", expanded);
  };

  obligationToggles.forEach((toggle) => {
    toggle.addEventListener("click", (event) => {
      setDisclosureState(toggle, toggle.getAttribute("aria-expanded") !== "true", ".fairbench-obligation-card");
      if (event.detail > 0) toggle.blur();
    });
  });

  obligationCards.forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("[data-fairbench-obligation-toggle], .fairbench-obligation-details")) return;
      const toggle = card.querySelector("[data-fairbench-obligation-toggle]");
      if (toggle) setDisclosureState(toggle, toggle.getAttribute("aria-expanded") !== "true", ".fairbench-obligation-card");
    });
  });

  modelToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const shouldExpand = toggle.getAttribute("aria-expanded") !== "true";
      setDisclosureState(toggle, shouldExpand, ".fairbench-model-card");
      // Closing with a mouse click should restore the resting card instead of
      // retaining the :focus-within highlight from the toggle button.
      if (!shouldExpand) toggle.blur();
    });
  });

  riskToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const shouldExpand = toggle.getAttribute("aria-expanded") !== "true";
      setDisclosureState(toggle, shouldExpand, ".fairbench-risk-states li");
      // A closed outcome must return to its resting visual state. Removing
      // focus here also prevents the focus treatment from looking selected.
      if (!shouldExpand) toggle.blur();
    });
  });

  const activatePipelineStep = (selectedStep, { focus = false } = {}) => {
    if (!selectedStep) return;
    const selectedId = selectedStep.dataset.fairbenchPipelineStep;
    pipelineSteps.forEach((step) => {
      const isSelected = step === selectedStep;
      step.classList.toggle("is-active", isSelected);
      step.setAttribute("aria-selected", String(isSelected));
      step.tabIndex = isSelected ? 0 : -1;
    });
    pipelinePanels.forEach((panel) => {
      panel.hidden = panel.dataset.fairbenchPipelinePanel !== selectedId;
    });
    if (focus) selectedStep.focus();
  };

  pipelineSteps.forEach((step, index) => {
    step.addEventListener("click", () => activatePipelineStep(step));
    step.addEventListener("keydown", (event) => {
      const isNext = ["ArrowRight", "ArrowDown"].includes(event.key);
      const isPrevious = ["ArrowLeft", "ArrowUp"].includes(event.key);
      if (!isNext && !isPrevious && !["Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const nextIndex = event.key === "Home"
        ? 0
        : event.key === "End"
          ? pipelineSteps.length - 1
          : (index + (isNext ? 1 : -1) + pipelineSteps.length) % pipelineSteps.length;
      activatePipelineStep(pipelineSteps[nextIndex], { focus: true });
    });
  });

  const updateRiskScore = () => {
    if (!riskScoreboard || !riskScoreInputs.length) return;

    const score = riskScoreInputs.reduce((total, input) => {
      const signal = Number(input.value) || 0;
      const weight = Number(input.dataset.weight) || 0;
      const dimension = input.closest(".fairbench-risk-dimension");
      const signalOutput = dimension?.querySelector("[data-fairbench-risk-signal]");
      const contributionOutput = dimension?.querySelector("[data-fairbench-risk-contribution]");
      if (signalOutput) signalOutput.textContent = String(signal);
      if (contributionOutput) contributionOutput.textContent = (signal * weight / 100).toFixed(1);
      return total + (signal * weight / 100);
    }, 0);

    const roundedScore = Math.round(score);
    const band = roundedScore >= 60 ? "high" : roundedScore >= 30 ? "medium" : "low";
    const bandCopy = {
      low: ["Low", "低风险 · 证据完整后可进入人工签署"],
      medium: ["Medium", "中风险 · 暂停准入并检查主要风险来源"],
      high: ["High", "高风险 · 阻止准入并升级至责任人"],
    };

    riskScoreboard.style.setProperty("--fairbench-risk-score", `${Math.min(100, Math.max(0, score))}%`);
    riskScoreboard.dataset.riskBand = band;
    if (riskScoreTotal) riskScoreTotal.textContent = String(roundedScore);
    if (riskScoreBand) riskScoreBand.textContent = bandCopy[band][0];
    if (riskScoreBandZh) riskScoreBandZh.textContent = bandCopy[band][1];
    riskMeterBands.forEach((meterBand) => {
      meterBand.classList.toggle("is-active", meterBand.dataset.fairbenchRiskMeterBand === band);
    });
    riskLevelCards.forEach((card) => {
      const isCurrent = card.dataset.fairbenchRiskLevel === band;
      card.classList.toggle("is-current", isCurrent);
      if (isCurrent) card.setAttribute("aria-current", "true");
      else card.removeAttribute("aria-current");
    });
  };

  riskScoreInputs.forEach((input) => {
    input.addEventListener("click", (event) => event.stopPropagation());
    input.addEventListener("input", updateRiskScore);
  });

  riskInfoToggles.forEach((toggle) => {
    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const summary = toggle.closest(".fairbench-risk-dimension-summary");
      if (!summary) return;
      const isOpen = !summary.classList.contains("is-info-open");
      summary.classList.remove("is-info-hovered");
      summary.classList.toggle("is-info-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  });

  riskInfoHeadings.forEach((heading) => {
    const summary = heading.closest(".fairbench-risk-dimension-summary");
    if (!summary) return;
    heading.addEventListener("pointerenter", () => summary.classList.add("is-info-hovered"));
    heading.addEventListener("pointerleave", () => summary.classList.remove("is-info-hovered"));
  });

  validationStressDetails.forEach((details) => {
    details.addEventListener("mouseenter", () => {
      if (!validationStressSupportsHover.matches || details.open) return;
      details.dataset.hoverOpen = "true";
      details.open = true;
    });

    details.addEventListener("mouseleave", () => {
      if (details.dataset.hoverOpen !== "true") return;
      delete details.dataset.hoverOpen;
      details.open = false;
    });

    details.addEventListener("click", (event) => {
      if (!event.target.closest("summary") || details.dataset.hoverOpen !== "true") return;
      event.preventDefault();
      delete details.dataset.hoverOpen;
      details.dataset.pinnedOpen = "true";
      details.open = true;
    });

    details.addEventListener("toggle", () => {
      if (!details.open) {
        delete details.dataset.hoverOpen;
        delete details.dataset.pinnedOpen;
      }
    });
  });

  const moduleFromHash = () => {
    const match = window.location.hash.match(/^#fairbench-chapter-(0[1-8])$/);
    if (!match) return null;
    return moduleButtons.find((button) => button.dataset.index === match[1]) || null;
  };

  const initialModule = moduleFromHash();
  if (initialModule) {
    activateModule(initialModule, {
      scrollToStage: true,
      scrollBehavior: "auto",
      updateHistory: false,
    });
  }

  window.addEventListener("hashchange", () => {
    const selectedModule = moduleFromHash();
    if (!selectedModule) return;
    activateModule(selectedModule, { scrollToStage: true, updateHistory: false });
  });

  activateOverviewStep(overviewSteps.find((step) => step.classList.contains("is-active")));
  activatePipelineStep(pipelineSteps.find((step) => step.classList.contains("is-active")) || pipelineSteps[0]);
  activateReportStep(reportSteps.find((step) => step.classList.contains("is-active")) || reportSteps[0]);
  activateReportDrill(reportDrillButtons.find((button) => button.classList.contains("is-active")) || reportDrillButtons[0]);
  activateValidationConfidence(validationConfidenceButtons.find((button) => button.classList.contains("is-active")) || validationConfidenceButtons[0]);
  activateGovernanceStage(governanceStageButtons.find((button) => button.classList.contains("is-active")) || governanceStageButtons[0]);
  activateRoadmap(roadmapButtons.find((button) => button.classList.contains("is-active")) || roadmapButtons[0]);
  updateRiskScore();

  window.requestAnimationFrame(syncSheetTabs);
  queueStageArtHeight();
  window.addEventListener("resize", syncSheetTabs, { passive: true });
  window.addEventListener("resize", queueStageArtHeight, { passive: true });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(queueStageArtHeight);
  }
})();
