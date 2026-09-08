const backToTopButton = document.querySelector(".back-to-top");
const footerYear = document.querySelector(".portfolio-footer-year");
if (footerYear) footerYear.textContent = String(new Date().getFullYear());

const caseAccordions = Array.from(document.querySelectorAll(".case-accordion"));
const accordionContentRoots = [
  ".overview-module",
  ".market-timeline",
  ".user-research-dashboard",
  ".product-goals-module",
  ".radar-detail-panel",
  ".ai-solution-module",
  ".cost-detail-panel",
  ".product-function-module",
  ".product-solution-module",
  ".project-implementation-module",
  ".data-review-dashboard",
  ".online-value-dashboard",
  ".risk-review-module",
].join(", ");

const crossscribeChapterHash = (accordion) => `#${accordion.id}`;

const scrollToAccordion = (accordion, behavior = "smooth") => {
  window.requestAnimationFrame(() => {
    const headerOffset = 112;
    const accordionTop = window.scrollY + accordion.getBoundingClientRect().top - headerOffset;
    window.scrollTo({ top: Math.max(0, accordionTop), behavior });
  });
};

caseAccordions.forEach((accordion, index) => {
  accordion.id = `crossscribe-chapter-${String(index + 1).padStart(2, "0")}`;
  const summary = accordion.querySelector(":scope > summary");
  const preview = accordion.querySelector(":scope > .accordion-content");
  const toggle = summary?.querySelector(".accordion-toggle");
  if (summary && preview && toggle) {
    summary.insertBefore(preview, toggle);
  }

  // Accordion bodies are hidden by <details> until a reader chooses them.
  // Keep their content ready in its final state so opening a chapter never
  // depends on a separate in-view animation or observer callback.
  accordion.querySelectorAll(accordionContentRoots).forEach((module) => {
    module.classList.add("is-visible");
  });

  accordion.addEventListener("toggle", () => {
    if (!accordion.open) {
      if (window.location.hash === crossscribeChapterHash(accordion)) {
        history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      }
      return;
    }

    caseAccordions.forEach((otherAccordion) => {
      if (otherAccordion !== accordion && otherAccordion.open) otherAccordion.open = false;
    });

    history.replaceState(null, "", crossscribeChapterHash(accordion));
    scrollToAccordion(
      accordion,
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    );
  });
});

const accordionFromHash = () => {
  const match = window.location.hash.match(/^#crossscribe-chapter-(0[1-9])$/);
  if (!match) return null;
  return document.getElementById(`crossscribe-chapter-${match[1]}`);
};

const openAccordionFromHash = (behavior = "auto") => {
  const accordion = accordionFromHash();
  if (!accordion) return;
  caseAccordions.forEach((item) => {
    item.open = item === accordion;
  });
  scrollToAccordion(accordion, behavior);
};

if (accordionFromHash()) openAccordionFromHash();
window.addEventListener("hashchange", () => openAccordionFromHash());
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);
document.querySelectorAll(".reveal-on-scroll").forEach((element) => {
  revealObserver.observe(element);
});
document.querySelectorAll(".overview-module").forEach((module) => {
  const cards = Array.from(module.querySelectorAll(".overview-info-card"));
  const scenes = Array.from(module.querySelectorAll(".visual-scene"));
  const previousButton = module.querySelector(".overview-visual-prev");
  const nextButton = module.querySelector(".overview-visual-next");

  const activateScene = (card) => {
    const selectedScene = card.dataset.scene;
    cards.forEach((item) => {
      const isSelected = item === card;
      item.classList.toggle("is-active", isSelected);
      item.setAttribute("aria-selected", String(isSelected));
    });
    scenes.forEach((scene) => {
      scene.classList.toggle("is-active", scene.dataset.scenePanel === selectedScene);
    });
  };

  cards.forEach((card, index) => {
    card.addEventListener("click", () => activateScene(card));
    card.addEventListener("keydown", (event) => {
      if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
      const nextCard = cards[(index + direction + cards.length) % cards.length];
      nextCard.focus();
      activateScene(nextCard);
    });
  });

  const moveScene = (direction) => {
    const activeIndex = cards.findIndex((card) => card.classList.contains("is-active"));
    const nextIndex = (activeIndex + direction + cards.length) % cards.length;
    activateScene(cards[nextIndex]);
  };

  previousButton?.addEventListener("click", () => moveScene(-1));
  nextButton?.addEventListener("click", () => moveScene(1));
});
document.querySelectorAll(".market-timeline").forEach((timeline) => {
  const steps = Array.from(timeline.querySelectorAll(".market-step"));

  const setExpandedState = (step, expanded) => {
    if (!step) return;
    step.classList.toggle("is-detail-open", expanded);
    step.setAttribute("aria-expanded", String(expanded));
    step
      .querySelector(".market-step-expanded")
      ?.setAttribute("aria-hidden", String(!expanded));
  };

  const toggleDetail = (step) => {
    const shouldOpen = !step.classList.contains("is-detail-open");
    setExpandedState(step, shouldOpen);
  };

  const setMarketStep = (selectedStep) => {
    steps.forEach((step) => {
      const isSelected = step === selectedStep;
      step.classList.toggle("is-active", isSelected);
      step.setAttribute("aria-pressed", String(isSelected));
    });
  };

  steps.forEach((step) => {
    step.addEventListener("pointerenter", () => {
      setMarketStep(step);
    });
    step.addEventListener("pointerleave", () => {
      if (document.activeElement !== step) setMarketStep(null);
    });
    step.addEventListener("focus", () => {
      setMarketStep(step);
    });
    step.addEventListener("blur", () => {
      setMarketStep(null);
    });
    step.addEventListener("click", () => {
      step.focus();
      setMarketStep(step);
      toggleDetail(step);
    });
    step.addEventListener("keydown", (event) => {
      if (!["Enter", " ", "ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "Enter" || event.key === " ") {
        setMarketStep(step);
        toggleDetail(step);
        return;
      }
      const currentIndex = steps.indexOf(step);
      const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
      const nextStep = steps[(currentIndex + direction + steps.length) % steps.length];
      nextStep.focus();
    });
  });
});
document.querySelectorAll(".user-research-dashboard").forEach((dashboard) => {
  const userPoints = Array.from(dashboard.querySelectorAll(".user-point"));
  const userSelectors = Array.from(dashboard.querySelectorAll(".user-segment-choice"));
  const insightBoard = dashboard.querySelector(".research-insight-board");
  const insightCards = Array.from(dashboard.querySelectorAll(".research-insight-card"));
  const priorityBubbles = Array.from(dashboard.querySelectorAll(".priority-bubble"));
  const priorityLabels = Array.from(dashboard.querySelectorAll(".priority-label"));
  const matrixInfo = dashboard.querySelector(".matrix-info");
  const segmentLabels = {
    individual: "Insights for Individual Cross-border Sellers",
    team: "Insights for Small E-commerce Operation Teams",
    startup: "Insights for Cross-border E-commerce Startups",
  };
  const userInsights = {
    individual: [
      {
        en: "Single-person operation, writing all listing and marketing copy alone",
        zh: "单人独立运营，独自撰写所有Listing和营销文案",
      },
      {
        en: "Quickly generate basic compliant copy with low cost",
        zh: "低成本快速生成基础合规文案",
      },
      {
        en: "Limited language skills, no brand system, high learning cost for new tools",
        zh: "语言能力有限，无品牌体系，新工具学习成本高",
      },
    ],
    team: [
      {
        en: "Batch writing product listings and platform marketing content",
        zh: "批量撰写商品Listing与平台营销内容",
      },
      {
        en: "Improve team efficiency and ensure consistent brand tone",
        zh: "提升团队效率，确保品牌调性统一",
      },
      {
        en: "Inconsistent writing styles, long review cycles, hard to reuse content",
        zh: "写作风格不统一，审核周期长，内容难以复用",
      },
    ],
    startup: [
      {
        en: "Cross-platform multi-market marketing copy creation and compliance review",
        zh: "跨平台多市场营销文案创作与合规审核",
      },
      {
        en: "Multi-language copy output, compliance audit, and brand asset management",
        zh: "多语言文案输出、合规审核与品牌资产管理",
      },
      {
        en: "High compliance risk, scattered brand materials, hard to scale operations",
        zh: "合规风险高，品牌资料分散，运营难以规模化",
      },
    ],
  };

  const activateUser = (selectedPoint) => {
    const selectedUser = selectedPoint.dataset.userSegment;
    userPoints.forEach((point) => {
      const isSelected = point === selectedPoint;
      point.classList.toggle("is-active", isSelected);
      point.setAttribute("aria-selected", String(isSelected));
    });
    userSelectors.forEach((selector) => {
      const isSelected = selector.dataset.userSelector === selectedUser;
      selector.classList.toggle("is-active", isSelected);
      selector.setAttribute("aria-pressed", String(isSelected));
    });

    insightBoard.dataset.user = selectedUser;
    insightBoard.setAttribute("aria-label", segmentLabels[selectedUser]);
    insightCards.forEach((card, index) => {
      card.querySelector("p").textContent = userInsights[selectedUser][index].en;
      card.querySelector(".research-insight-copy-zh").textContent =
        userInsights[selectedUser][index].zh;
    });
    insightCards.forEach((card) => card.classList.remove("is-refreshing"));
    void insightBoard.offsetWidth;
    insightCards.forEach((card) => card.classList.add("is-refreshing"));
    window.setTimeout(() => {
      insightCards.forEach((card) => card.classList.remove("is-refreshing"));
    }, 520);
  };

  userPoints.forEach((point, index) => {
    point.addEventListener("click", () => activateUser(point));
    point.addEventListener("keydown", (event) => {
      if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
      const nextPoint = userPoints[(index + direction + userPoints.length) % userPoints.length];
      nextPoint.focus();
      activateUser(nextPoint);
    });
  });

  userSelectors.forEach((selector) => {
    selector.addEventListener("click", () => {
      const matchingPoint = userPoints.find(
        (point) => point.dataset.userSegment === selector.dataset.userSelector,
      );
      if (matchingPoint) activateUser(matchingPoint);
    });
  });

  const getPriorityLabel = (bubble) =>
    priorityLabels.find((label) => label.dataset.demandLabel === bubble.dataset.demand);

  const getPriorityBubble = (label) =>
    priorityBubbles.find((bubble) => bubble.dataset.demand === label.dataset.demandLabel);

  const togglePriorityDemand = (demand) => {
    const selectedBubble = priorityBubbles.find((bubble) => bubble.dataset.demand === demand);
    const selectedLabel = priorityLabels.find((label) => label.dataset.demandLabel === demand);
    const shouldActivate = !selectedBubble?.classList.contains("is-active");

    priorityBubbles.forEach((bubble) => {
      bubble.classList.remove("is-active");
      bubble.setAttribute("aria-pressed", "false");
    });
    priorityLabels.forEach((label) => {
      label.classList.remove("is-active");
      label.setAttribute("aria-pressed", "false");
    });

    if (shouldActivate) {
      selectedBubble?.classList.add("is-active");
      selectedBubble?.setAttribute("aria-pressed", "true");
      selectedLabel?.classList.add("is-active");
      selectedLabel?.setAttribute("aria-pressed", "true");
    }
  };

  priorityBubbles.forEach((bubble) => {
    const linkedLabel = getPriorityLabel(bubble);
    bubble.addEventListener("pointerenter", () => linkedLabel?.classList.add("is-preview"));
    bubble.addEventListener("pointerleave", () => linkedLabel?.classList.remove("is-preview"));
    bubble.addEventListener("focus", () => linkedLabel?.classList.add("is-preview"));
    bubble.addEventListener("blur", () => linkedLabel?.classList.remove("is-preview"));
    bubble.addEventListener("click", () => togglePriorityDemand(bubble.dataset.demand));
  });

  priorityLabels.forEach((label) => {
    const linkedBubble = getPriorityBubble(label);
    label.addEventListener("pointerenter", () => linkedBubble?.classList.add("is-preview"));
    label.addEventListener("pointerleave", () => linkedBubble?.classList.remove("is-preview"));
    label.addEventListener("focus", () => linkedBubble?.classList.add("is-preview"));
    label.addEventListener("blur", () => linkedBubble?.classList.remove("is-preview"));
    label.addEventListener("click", () => togglePriorityDemand(label.dataset.demandLabel));
  });

  matrixInfo?.addEventListener("click", () => {
    const shouldOpen = !matrixInfo.classList.contains("is-active");
    matrixInfo.classList.toggle("is-active", shouldOpen);
    matrixInfo.classList.toggle("is-dismissed", !shouldOpen);
    matrixInfo.setAttribute("aria-pressed", String(shouldOpen));
  });
  matrixInfo?.addEventListener("pointerleave", () => matrixInfo.classList.remove("is-dismissed"));
  matrixInfo?.addEventListener("blur", () => matrixInfo.classList.remove("is-dismissed"));
});
document.querySelectorAll(".product-goals-module").forEach((module) => {
  const radarVertices = Array.from(module.querySelectorAll(".radar-vertex"));
  const radarAxes = Array.from(module.querySelectorAll(".radar-axis"));
  const kpiCards = Array.from(module.querySelectorAll(".goal-kpi-card"));
  const radarDetail = module.querySelector(".radar-detail-panel");
  const radarDetailTitle = radarDetail?.querySelector(".radar-detail-title");
  const radarDetailTitleZh = radarDetail?.querySelector(".radar-detail-title-zh");
  const radarDetailCopy = radarDetail?.querySelector(".radar-detail-copy");
  const radarDetailCopyZh = radarDetail?.querySelector(".radar-detail-copy-zh");
  const roadmapCards = Array.from(module.querySelectorAll(".goal-roadmap-card"));
  let radarFeedbackTimer;

  const getKpiCard = (dimension) =>
    kpiCards.find((card) => card.dataset.goalDimension === dimension);

  const getActiveDimension = () =>
    radarVertices.find((vertex) => vertex.classList.contains("is-active"))?.dataset
      .radarDimension;

  const renderRadarDetail = (dimension) => {
    const card = getKpiCard(dimension);
    if (
      !radarDetail ||
      !radarDetailTitle ||
      !radarDetailTitleZh ||
      !radarDetailCopy ||
      !radarDetailCopyZh
    )
      return;

    if (card) {
      radarDetailTitle.textContent = card.querySelector("strong").textContent;
      radarDetailTitleZh.textContent = card.querySelector("small").textContent;
      radarDetailCopy.textContent = card.querySelector(".goal-kpi-detail span").textContent;
      radarDetailCopyZh.textContent = card.querySelector(".goal-kpi-detail small").textContent;
      radarDetail.classList.add("is-visible");
    } else {
      radarDetailTitle.textContent = "Explore each priority";
      radarDetailTitleZh.textContent = "探索各项目标";
      radarDetailCopy.textContent =
        "Select a radar vertex to view the complete product goal";
      radarDetailCopyZh.textContent = "点击雷达顶点，查看完整产品目标";
      radarDetail.classList.remove("is-visible");
    }
  };

  const previewRadarDimension = (dimension) => {
    radarVertices.forEach((vertex) => {
      vertex.classList.toggle("is-preview", vertex.dataset.radarDimension === dimension);
    });
    radarAxes.forEach((axis) => {
      axis.classList.toggle("is-preview", axis.dataset.radarAxis === dimension);
    });
    kpiCards.forEach((card) => {
      card.classList.toggle("is-preview", card.dataset.goalDimension === dimension);
    });
  };

  const playRadarClickFeedback = () => {
    if (!radarDetail) return;
    window.clearTimeout(radarFeedbackTimer);
    radarDetail.classList.remove("is-click-feedback");
    void radarDetail.offsetWidth;
    radarDetail.classList.add("is-click-feedback");
    radarFeedbackTimer = window.setTimeout(() => {
      radarDetail.classList.remove("is-click-feedback");
    }, 760);
  };

  const toggleRadarDimension = (dimension) => {
    const selectedVertex = radarVertices.find(
      (vertex) => vertex.dataset.radarDimension === dimension,
    );
    const selectedCard = getKpiCard(dimension);
    const shouldActivate = !selectedVertex?.classList.contains("is-active");

    radarVertices.forEach((vertex) => {
      vertex.classList.remove("is-active");
      vertex.setAttribute("aria-pressed", "false");
    });
    radarAxes.forEach((axis) => axis.classList.remove("is-active"));
    kpiCards.forEach((card) => {
      card.classList.remove("is-active");
      card.setAttribute("aria-pressed", "false");
    });

    if (shouldActivate) {
      selectedVertex?.classList.add("is-active");
      selectedVertex?.setAttribute("aria-pressed", "true");
      radarAxes
        .find((axis) => axis.dataset.radarAxis === dimension)
        ?.classList.add("is-active");
      selectedCard?.classList.add("is-active");
      selectedCard?.setAttribute("aria-pressed", "true");
    }
    previewRadarDimension(null);
    renderRadarDetail(shouldActivate ? dimension : null);
    playRadarClickFeedback();
  };

  radarVertices.forEach((vertex) => {
    const dimension = vertex.dataset.radarDimension;
    vertex.addEventListener("pointerenter", () => previewRadarDimension(dimension));
    vertex.addEventListener("pointerleave", () => previewRadarDimension(getActiveDimension()));
    vertex.addEventListener("focus", () => previewRadarDimension(dimension));
    vertex.addEventListener("blur", () => previewRadarDimension(getActiveDimension()));
    vertex.addEventListener("click", () => toggleRadarDimension(dimension));
  });

  kpiCards.forEach((card) => {
    const dimension = card.dataset.goalDimension;
    card.addEventListener("pointerenter", () => previewRadarDimension(dimension));
    card.addEventListener("pointerleave", () => previewRadarDimension(getActiveDimension()));
    card.addEventListener("focus", () => previewRadarDimension(dimension));
    card.addEventListener("blur", () => previewRadarDimension(getActiveDimension()));
    card.addEventListener("click", () => toggleRadarDimension(dimension));
  });

  roadmapCards.forEach((card) => {
    const toggleRoadmap = () => {
      const isOpen = card.classList.toggle("is-open");
      card.setAttribute("aria-expanded", String(isOpen));
    };
    card.addEventListener("click", toggleRoadmap);
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggleRoadmap();
    });
  });
});
document.querySelectorAll(".ai-solution-module").forEach((module) => {
  const modelCards = Array.from(module.querySelectorAll(".model-option-card"));
  const architectureTabs = Array.from(module.querySelectorAll(".architecture-tab"));
  const architecturePanels = Array.from(module.querySelectorAll(".architecture-panel"));
  const costRows = Array.from(module.querySelectorAll(".cost-bar-row"));
  const costDetail = module.querySelector(".cost-detail-panel");
  const costDetailTitle = costDetail?.querySelector("strong");
  const costDetailTitleZh = costDetail?.querySelector(":scope > small");
  const costDetailCopy = costDetail?.querySelector("span");
  const costDetailCopyZh = costDetail?.querySelector(".cost-detail-copy-zh");

  modelCards.forEach((card) => {
    card.addEventListener("click", () => {
      const shouldOpen = !card.classList.contains("is-open");
      modelCards.forEach((item) => {
        item.classList.remove("is-open");
        item.setAttribute("aria-expanded", "false");
      });
      if (shouldOpen) {
        card.classList.add("is-open");
        card.setAttribute("aria-expanded", "true");
      }
    });
  });

  const activateArchitectureTab = (selectedTab) => {
    const selectedModule = selectedTab.dataset.architectureTab;
    architectureTabs.forEach((tab) => {
      const isSelected = tab === selectedTab;
      tab.classList.toggle("is-active", isSelected);
      tab.setAttribute("aria-selected", String(isSelected));
    });
    architecturePanels.forEach((panel) => {
      const isSelected = panel.dataset.architecturePanel === selectedModule;
      panel.classList.toggle("is-active", isSelected);
      panel.setAttribute("aria-hidden", String(!isSelected));
    });
  };

  architectureTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateArchitectureTab(tab));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
      const nextTab =
        architectureTabs[(index + direction + architectureTabs.length) % architectureTabs.length];
      nextTab.focus();
      activateArchitectureTab(nextTab);
    });
  });

  const getActiveCostOption = () =>
    costRows.find((row) => row.classList.contains("is-active"))?.dataset.costOption;

  const renderCostDetail = (option) => {
    const row = costRows.find((item) => item.dataset.costOption === option);
    if (!costDetail || !costDetailTitle || !costDetailTitleZh || !costDetailCopy || !costDetailCopyZh)
      return;

    if (row) {
      costDetailTitle.textContent = row.dataset.costTitle;
      costDetailTitleZh.textContent = row.dataset.costTitleZh;
      costDetailCopy.textContent = row.dataset.costCopy;
      costDetailCopyZh.textContent = row.dataset.costCopyZh;
      costDetail.classList.add("is-visible");
    } else {
      costDetailTitle.textContent = "Compare deployment cost";
      costDetailTitleZh.textContent = "比较部署成本";
      costDetailCopy.textContent =
        "Hover or select a cost bar to view the complete cost structure";
      costDetailCopyZh.textContent = "悬停或点击成本条，查看完整成本构成";
      costDetail.classList.remove("is-visible");
    }
  };

  const previewCostOption = (option) => {
    costRows.forEach((row) => {
      row.classList.toggle("is-preview", row.dataset.costOption === option);
    });
    renderCostDetail(option);
  };

  const toggleCostOption = (option) => {
    const selectedRow = costRows.find((row) => row.dataset.costOption === option);
    const shouldActivate = !selectedRow?.classList.contains("is-active");
    costRows.forEach((row) => {
      row.classList.remove("is-active");
      row.setAttribute("aria-pressed", "false");
    });
    if (shouldActivate) {
      selectedRow?.classList.add("is-active");
      selectedRow?.setAttribute("aria-pressed", "true");
    }
    previewCostOption(shouldActivate ? option : null);
  };

  costRows.forEach((row) => {
    const option = row.dataset.costOption;
    row.addEventListener("pointerenter", () => previewCostOption(option));
    row.addEventListener("pointerleave", () => previewCostOption(getActiveCostOption()));
    row.addEventListener("focus", () => previewCostOption(option));
    row.addEventListener("blur", () => previewCostOption(getActiveCostOption()));
    row.addEventListener("click", () => toggleCostOption(option));
  });
});
document.querySelectorAll(".product-solution-module").forEach((module) => {
  const functionItems = Array.from(module.querySelectorAll(".functional-layout-item"));
  const flowSteps = Array.from(module.querySelectorAll(".solution-flow-step"));

  const getActiveFunctionItem = () =>
    functionItems.find((item) => item.classList.contains("is-active")) || functionItems[0];

  const renderFunctionTargets = (item, isPreview = false) => {
    if (!item) return;
    const targets = new Set((item.dataset.solutionTargets || "").split(/\s+/).filter(Boolean));
    functionItems.forEach((candidate) => {
      candidate.classList.toggle("is-preview", isPreview && candidate === item);
    });
    flowSteps.forEach((step) => {
      step.classList.toggle("is-linked", targets.has(step.dataset.solutionStep));
    });
  };

  functionItems.forEach((item) => {
    item.addEventListener("pointerenter", () => renderFunctionTargets(item, true));
    item.addEventListener("pointerleave", () => renderFunctionTargets(getActiveFunctionItem()));
    item.addEventListener("focus", () => renderFunctionTargets(item, true));
    item.addEventListener("blur", () => renderFunctionTargets(getActiveFunctionItem()));
    item.addEventListener("click", () => {
      functionItems.forEach((candidate) => {
        const isActive = candidate === item;
        candidate.classList.toggle("is-active", isActive);
        candidate.classList.remove("is-preview");
        candidate.setAttribute("aria-pressed", String(isActive));
      });
      renderFunctionTargets(item);
    });
  });

  flowSteps.forEach((step) => {
    const toggleStep = () => {
      const shouldSelect = !step.classList.contains("is-selected");
      flowSteps.forEach((candidate) => {
        candidate.classList.remove("is-selected");
        candidate.setAttribute("aria-pressed", "false");
      });
      if (shouldSelect) {
        step.classList.add("is-selected");
        step.setAttribute("aria-pressed", "true");
      }
    };
    step.addEventListener("click", toggleStep);
    step.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggleStep();
    });
  });

  renderFunctionTargets(getActiveFunctionItem());
});
document.querySelectorAll(".product-function-module").forEach((module) => {
  const architectureTiers = Array.from(module.querySelectorAll(".architecture-tier"));
  const architectureDetail = module.querySelector(".architecture-tier-detail");
  const architectureDetailTitle = architectureDetail?.querySelector("strong");
  const architectureDetailTitleZh = architectureDetail?.querySelector(":scope > small");
  const architectureDetailCopy = architectureDetail?.querySelector("span");
  const architectureDetailCopyZh = architectureDetail?.querySelector(".product-insight-copy-zh");
  const functionCards = Array.from(module.querySelectorAll(".function-module-card"));
  const workflowNodes = Array.from(module.querySelectorAll(".workflow-node"));
  const riskTabs = Array.from(module.querySelectorAll(".risk-tab"));
  const riskDetail = module.querySelector(".risk-detail-panel");
  const riskDetailTitle = riskDetail?.querySelector("strong");
  const riskDetailTitleZh = riskDetail?.querySelector(":scope > small");
  const riskDetailCopy = riskDetail?.querySelector("span");
  const riskDetailCopyZh = riskDetail?.querySelector(".risk-detail-copy-zh");

  const renderArchitectureDetail = (tier) => {
    if (
      !architectureDetail ||
      !architectureDetailTitle ||
      !architectureDetailTitleZh ||
      !architectureDetailCopy ||
      !architectureDetailCopyZh
    )
      return;

    if (tier) {
      architectureDetailTitle.textContent = tier.dataset.tierTitle;
      architectureDetailTitleZh.textContent = tier.dataset.tierTitleZh;
      architectureDetailCopy.textContent = tier.dataset.tierCopy;
      architectureDetailCopyZh.textContent = tier.dataset.tierCopyZh;
      architectureDetail.classList.add("is-active");
    } else {
      architectureDetailTitle.textContent = "Select an architecture layer";
      architectureDetailTitleZh.textContent = "选择架构层级";
      architectureDetailCopy.textContent =
        "Hover to preview, then click to reveal the core components";
      architectureDetailCopyZh.textContent = "悬停预览，点击展开该层核心组件";
      architectureDetail.classList.remove("is-active");
    }
  };

  const getExpandedArchitectureTier = () =>
    architectureTiers.find((tier) => tier.classList.contains("is-expanded"));

  const previewArchitectureTier = (tierName) => {
    architectureTiers.forEach((tier) => {
      tier.classList.toggle("is-preview", tier.dataset.architectureTier === tierName);
    });
    const matchingTier = architectureTiers.find(
      (tier) => tier.dataset.architectureTier === tierName
    );
    renderArchitectureDetail(matchingTier || null);
  };

  const toggleArchitectureTier = (tierName) => {
    const matchingTiers = architectureTiers.filter(
      (tier) => tier.dataset.architectureTier === tierName
    );
    const shouldExpand = !matchingTiers.some((tier) => tier.classList.contains("is-expanded"));
    matchingTiers.forEach((tier) => {
      tier.classList.toggle("is-expanded", shouldExpand);
      tier.setAttribute("aria-expanded", String(shouldExpand));
      const mark = tier.querySelector(".tier-expand-mark");
      if (mark) mark.textContent = shouldExpand ? "−" : "+";
    });
    previewArchitectureTier(shouldExpand ? tierName : getExpandedArchitectureTier()?.dataset.architectureTier);
  };

  architectureTiers.forEach((tier) => {
    const tierName = tier.dataset.architectureTier;
    tier.addEventListener("pointerenter", () => previewArchitectureTier(tierName));
    tier.addEventListener("pointerleave", () =>
      previewArchitectureTier(getExpandedArchitectureTier()?.dataset.architectureTier)
    );
    tier.addEventListener("focus", () => previewArchitectureTier(tierName));
    tier.addEventListener("blur", () =>
      previewArchitectureTier(getExpandedArchitectureTier()?.dataset.architectureTier)
    );
    tier.addEventListener("click", () => toggleArchitectureTier(tierName));
    tier.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggleArchitectureTier(tierName);
    });
  });

  functionCards.forEach((card) => {
    card.addEventListener("click", () => {
      const shouldOpen = !card.classList.contains("is-open");
      functionCards.forEach((item) => {
        item.classList.remove("is-open");
        item.setAttribute("aria-expanded", "false");
      });
      if (shouldOpen) {
        card.classList.add("is-open");
        card.setAttribute("aria-expanded", "true");
      }
    });
  });

  workflowNodes.forEach((node) => {
    node.removeAttribute("tabindex");
    node.removeAttribute("role");
    node.removeAttribute("aria-pressed");
  });

  const activateRiskTab = (selectedTab) => {
    riskTabs.forEach((tab) => {
      const isSelected = tab === selectedTab;
      tab.classList.toggle("is-active", isSelected);
      tab.setAttribute("aria-selected", String(isSelected));
    });
    if (
      !riskDetail ||
      !riskDetailTitle ||
      !riskDetailTitleZh ||
      !riskDetailCopy ||
      !riskDetailCopyZh
    )
      return;
    riskDetailTitle.textContent = selectedTab.dataset.riskTitle;
    riskDetailTitleZh.textContent = selectedTab.dataset.riskTitleZh;
    riskDetailCopy.textContent = selectedTab.dataset.riskCopy;
    riskDetailCopyZh.textContent = selectedTab.dataset.riskCopyZh;
    riskDetail.classList.remove("is-updating");
    void riskDetail.offsetWidth;
    riskDetail.classList.add("is-updating");
  };

  riskTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateRiskTab(tab));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
      const nextTab = riskTabs[(index + direction + riskTabs.length) % riskTabs.length];
      nextTab.focus();
      activateRiskTab(nextTab);
    });
  });

  riskDetail?.addEventListener("animationend", () => {
    riskDetail.classList.remove("is-updating");
  });
});
document.querySelectorAll(".project-implementation-module").forEach((module) => {
  const milestoneStages = Array.from(module.querySelectorAll(".milestone-stage"));
  const milestoneDetail = module.querySelector(".milestone-detail");
  const milestoneTitle = milestoneDetail?.querySelector("strong");
  const milestoneTitleZh = milestoneDetail?.querySelector(":scope > small");
  const milestoneCopy = milestoneDetail?.querySelector("span");
  const milestoneCopyZh = milestoneDetail?.querySelector(".milestone-detail-copy-zh");
  let selectedMilestone =
    milestoneStages.find((stage) => stage.classList.contains("is-active")) ||
    milestoneStages[0];

  const renderMilestone = (stage) => {
    if (
      !stage ||
      !milestoneDetail ||
      !milestoneTitle ||
      !milestoneTitleZh ||
      !milestoneCopy ||
      !milestoneCopyZh
    )
      return;
    milestoneTitle.textContent = stage.dataset.milestoneTitle;
    milestoneTitleZh.textContent = stage.dataset.milestoneTitleZh;
    milestoneCopy.textContent = stage.dataset.milestoneCopy;
    milestoneCopyZh.textContent = stage.dataset.milestoneCopyZh;
  };

  const selectMilestone = (stage) => {
    selectedMilestone = stage;
    milestoneStages.forEach((item) => {
      const isSelected = item === stage;
      item.classList.toggle("is-active", isSelected);
      item.setAttribute("aria-pressed", String(isSelected));
    });
    renderMilestone(stage);
  };

  milestoneStages.forEach((stage, index) => {
    stage.addEventListener("pointerenter", () => renderMilestone(stage));
    stage.addEventListener("pointerleave", () => renderMilestone(selectedMilestone));
    stage.addEventListener("focus", () => renderMilestone(stage));
    stage.addEventListener("blur", () => renderMilestone(selectedMilestone));
    stage.addEventListener("click", () => selectMilestone(stage));
    stage.addEventListener("keydown", (event) => {
      if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
      const nextStage =
        milestoneStages[(index + direction + milestoneStages.length) % milestoneStages.length];
      nextStage.focus();
      selectMilestone(nextStage);
    });
  });

  const stageHeaders = Array.from(module.querySelectorAll(".matrix-stage-header"));
  const departmentHeaders = Array.from(module.querySelectorAll(".matrix-department-header"));
  const collaborationCells = Array.from(
    module.querySelectorAll(".collaboration-cell:not(.is-empty)"),
  );
  const matrixTargets = [...stageHeaders, ...departmentHeaders, ...collaborationCells];
  const matrixDetail = module.querySelector(".collaboration-detail");
  const matrixDetailTitle = matrixDetail?.querySelector("strong");
  const matrixDetailTitleZh = matrixDetail?.querySelector(":scope > small");
  const matrixDetailCopy = matrixDetail?.querySelector("span");
  const matrixDetailCopyZh = matrixDetail?.querySelector(
    ".collaboration-detail-copy-zh",
  );
  let selectedMatrixTarget = null;

  const renderMatrixDetail = (target) => {
    if (
      !matrixDetail ||
      !matrixDetailTitle ||
      !matrixDetailTitleZh ||
      !matrixDetailCopy ||
      !matrixDetailCopyZh
    )
      return;

    if (target) {
      matrixDetailTitle.textContent = target.dataset.detailTitle;
      matrixDetailTitleZh.textContent = target.dataset.detailTitleZh;
      matrixDetailCopy.textContent = target.dataset.detailCopy;
      matrixDetailCopyZh.textContent = target.dataset.detailCopyZh;
    } else {
      matrixDetailTitle.textContent = "Select a phase, team, or collaboration point";
      matrixDetailTitleZh.textContent = "选择项目阶段、协作部门或协作节点";
      matrixDetailCopy.textContent =
        "Click a column or row to compare ownership, or inspect a blue point for its core responsibility";
      matrixDetailCopyZh.textContent =
        "点击列或行查看协作范围，也可查看蓝色节点对应的核心职责";
    }
  };

  const clearMatrixState = (stateClass) => {
    matrixTargets.forEach((target) => target.classList.remove(stateClass));
  };

  const applyMatrixGroupState = (target, stateClass) => {
    if (!target) return;
    const stage = target.dataset.matrixStage;
    const department = target.dataset.matrixDepartment;

    if (stage) {
      stageHeaders
        .filter((header) => header.dataset.matrixStage === stage)
        .forEach((header) => header.classList.add(stateClass));
      collaborationCells
        .filter((cell) => cell.dataset.matrixStage === stage)
        .forEach((cell) => cell.classList.add(stateClass));
    }

    if (department) {
      departmentHeaders
        .filter((header) => header.dataset.matrixDepartment === department)
        .forEach((header) => header.classList.add(stateClass));
      collaborationCells
        .filter((cell) => cell.dataset.matrixDepartment === department)
        .forEach((cell) => cell.classList.add(stateClass));
    }

    target.classList.add(stateClass);
  };

  const previewMatrixTarget = (target) => {
    clearMatrixState("is-preview");
    applyMatrixGroupState(target, "is-preview");
    renderMatrixDetail(target || selectedMatrixTarget);
  };

  const restoreMatrixSelection = () => {
    clearMatrixState("is-preview");
    renderMatrixDetail(selectedMatrixTarget);
  };

  const selectMatrixTarget = (target) => {
    const shouldActivate = selectedMatrixTarget !== target;
    selectedMatrixTarget = shouldActivate ? target : null;
    clearMatrixState("is-active");
    if (selectedMatrixTarget) applyMatrixGroupState(selectedMatrixTarget, "is-active");
    matrixTargets.forEach((item) => {
      item.setAttribute("aria-pressed", String(item === selectedMatrixTarget));
    });
    renderMatrixDetail(selectedMatrixTarget);
  };

  matrixTargets.forEach((target) => {
    target.addEventListener("pointerenter", () => previewMatrixTarget(target));
    target.addEventListener("pointerleave", restoreMatrixSelection);
    target.addEventListener("focus", () => previewMatrixTarget(target));
    target.addEventListener("blur", restoreMatrixSelection);
    target.addEventListener("click", () => selectMatrixTarget(target));
  });
});
document.querySelectorAll(".online-value-dashboard").forEach((dashboard) => {
  const dimensionCards = Array.from(
    dashboard.querySelectorAll(".review-dimension-card"),
  );
  const metricsPanel = dashboard.querySelector(".linked-metrics-panel");
  const metricsList = dashboard.querySelector(".linked-metrics-list");
  let selectedDimension = "product";

  const metricSets = {
    product: [
      {
        title: "Core Feature Usage Rate",
        titleZh: "核心功能使用率",
        copy: "Usage rate among active users",
        copyZh: "活跃用户中核心功能使用率",
        value: "62%",
        valueZh: "62%",
        bar: 62,
      },
      {
        title: "7-Day User Retention",
        titleZh: "7日用户留存率",
        copy: "7-day retention rate of initial users",
        copyZh: "首批用户7日留存率",
        value: "35%",
        valueZh: "35%",
        bar: 35,
      },
      {
        title: "Average Session Duration",
        titleZh: "单次使用时长",
        copy: "Average time spent per session",
        copyZh: "用户单次会话平均使用时长",
        value: "3.2 min",
        valueZh: "3.2 分钟",
        bar: 64,
      },
      {
        title: "Feature Click-through Rate",
        titleZh: "功能入口点击率",
        copy: "Click rate of main function entrances",
        copyZh: "核心功能入口点击率",
        value: "42%",
        valueZh: "42%",
        bar: 42,
      },
    ],
    ai: [
      {
        title: "Content Accuracy",
        titleZh: "内容准确率",
        copy: "Compliance and brand alignment rate",
        copyZh: "文案合规与品牌调性匹配率",
        value: "80%",
        valueZh: "80%",
        bar: 80,
      },
      {
        title: "Average Response Speed",
        titleZh: "平均响应速度",
        copy: "Average generation response time",
        copyZh: "文案生成平均响应时间",
        value: "3.5 s",
        valueZh: "3.5 秒",
        bar: 70,
      },
      {
        title: "Compliance Error Correction Rate",
        titleZh: "合规纠错率",
        copy: "Automatic correction rate of rule violations",
        copyZh: "自动识别并修正违规内容比例",
        value: "75%",
        valueZh: "75%",
        bar: 75,
      },
    ],
    business: [
      {
        title: "Manpower Reduction",
        titleZh: "人力成本缩减",
        copy: "Reduction in manual writing time",
        copyZh: "人工撰写时间减少比例",
        beforeValue: "100% manual work",
        beforeValueZh: "100% 人工作业",
        afterValue: "50% manual work",
        afterValueZh: "50% 人工作业",
        beforeBar: 100,
        afterBar: 50,
      },
      {
        title: "Copy Creation Efficiency",
        titleZh: "文案创作效率",
        copy: "Reduction in copy creation cycle",
        copyZh: "文案创作周期缩短比例",
        beforeValue: "30 min / copy",
        beforeValueZh: "30 分钟 / 条",
        afterValue: "10.5 min / copy",
        afterValueZh: "10.5 分钟 / 条",
        beforeBar: 100,
        afterBar: 35,
      },
      {
        title: "Compliance Error Rate",
        titleZh: "合规错误率",
        copy: "Rate of non-compliant copy",
        copyZh: "文案违规错误率",
        beforeValue: "25%",
        beforeValueZh: "25%",
        afterValue: "6%",
        afterValueZh: "6%",
        beforeBar: 100,
        afterBar: 24,
      },
      {
        title: "User Satisfaction",
        titleZh: "用户满意度",
        copy: "User satisfaction score",
        copyZh: "用户反馈满意度评分",
        beforeValue: "3.3 / 5",
        beforeValueZh: "3.3 / 5",
        afterValue: "4.1 / 5",
        afterValueZh: "4.1 / 5",
        beforeBar: 66,
        afterBar: 82,
      },
    ],
  };

  const renderDimension = (dimension) => {
    if (!metricsList || !metricsPanel || !metricSets[dimension]) return;
    selectedDimension = dimension;
    dimensionCards.forEach((card) => {
      const isSelected = card.dataset.reviewDimension === dimension;
      card.classList.toggle("is-active", isSelected);
      card.setAttribute("aria-pressed", String(isSelected));
    });

    metricsPanel.classList.remove("is-empty");
    metricsList.innerHTML = metricSets[dimension]
      .map((metric) => {
        const isComparison = metric.beforeValue !== undefined;
        const visual = isComparison
          ? `
            <span class="linked-metric-comparison" aria-label="Before and after comparison">
              <span class="linked-metric-comparison-line linked-metric-comparison-line--before">
                <span class="linked-metric-comparison-label">
                  <span>Before</span>
                  <small>上线前</small>
                </span>
                <span class="linked-metric-track" aria-hidden="true">
                  <span
                    class="linked-metric-fill"
                    data-target-value="${metric.beforeBar}"
                    style="--metric-value: 0%"
                  ></span>
                </span>
                <span class="linked-metric-comparison-number">
                  <span>${metric.beforeValue}</span>
                  <small>${metric.beforeValueZh}</small>
                </span>
              </span>
              <span class="linked-metric-comparison-line linked-metric-comparison-line--after">
                <span class="linked-metric-comparison-label">
                  <span>After</span>
                  <small>上线后</small>
                </span>
                <span class="linked-metric-track" aria-hidden="true">
                  <span
                    class="linked-metric-fill"
                    data-target-value="${metric.afterBar}"
                    style="--metric-value: 0%"
                  ></span>
                </span>
                <span class="linked-metric-comparison-number">
                  <span>${metric.afterValue}</span>
                  <small>${metric.afterValueZh}</small>
                </span>
              </span>
            </span>
          `
          : `
            <span class="linked-metric-track" aria-hidden="true">
              <span
                class="linked-metric-fill"
                data-target-value="${metric.bar}"
                style="--metric-value: 0%"
              ></span>
            </span>
            <span class="linked-metric-value">
              <span>${metric.value}</span>
              <small>${metric.valueZh}</small>
            </span>
          `;

        return `
          <button class="linked-metric-row${isComparison ? " is-comparison" : ""}" type="button" aria-pressed="false">
            <span class="linked-metric-label">
              <strong>${metric.title}</strong>
              <small>${metric.titleZh}</small>
            </span>
            ${visual}
            <span class="linked-metric-detail">
              <span>${metric.copy}</span>
              <small>${metric.copyZh}</small>
            </span>
          </button>
        `;
      })
      .join("");

    const metricRows = Array.from(metricsList.querySelectorAll(".linked-metric-row"));
    metricRows.forEach((row) => {
      row.addEventListener("click", () => {
        const isActive = row.classList.toggle("is-active");
        row.setAttribute("aria-pressed", String(isActive));
      });
    });

    requestAnimationFrame(() => {
      metricsList.querySelectorAll(".linked-metric-fill").forEach((fill) => {
        fill.style.setProperty("--metric-value", `${fill.dataset.targetValue}%`);
      });
    });
  };

  dimensionCards.forEach((card) => {
    card.addEventListener("click", () => {
      const dimension = card.dataset.reviewDimension;
      if (selectedDimension !== dimension) renderDimension(dimension);
    });
  });

  renderDimension("product");
});
document.querySelectorAll(".data-review-dashboard").forEach((dashboard) => {
  const metricCards = Array.from(dashboard.querySelectorAll(".product-metric-card"));
  const audienceRows = Array.from(dashboard.querySelectorAll(".audience-bar-row"));
  const metricDetail = dashboard.querySelector(".product-metric-detail");
  const metricDetailTitle = metricDetail?.querySelector("strong");
  const metricDetailTitleZh = metricDetail?.querySelector(":scope > small");
  const metricDetailCopy = metricDetail?.querySelector("span");
  const metricDetailCopyZh = metricDetail?.querySelector(".data-detail-copy-zh");
  let activeMetricCard =
    metricCards.find((card) => card.classList.contains("is-active")) || metricCards[0];
  let activeAudienceRow = null;

  const renderMetricDetail = (card, audienceRow = null) => {
    if (
      !card ||
      !metricDetailTitle ||
      !metricDetailTitleZh ||
      !metricDetailCopy ||
      !metricDetailCopyZh
    )
      return;

    const audienceIndex = audienceRow ? audienceRows.indexOf(audienceRow) : -1;
    const audienceValue =
      audienceIndex >= 0 ? card.dataset.barValues.split(",")[audienceIndex] : "";

    metricDetailTitle.textContent = audienceRow
      ? `${card.dataset.metricTitle} · ${audienceRow.dataset.userGroup}`
      : card.dataset.metricTitle;
    metricDetailTitleZh.textContent = audienceRow
      ? `${card.dataset.metricTitleZh} · ${audienceRow.dataset.userGroupZh}`
      : card.dataset.metricTitleZh;
    metricDetailCopy.textContent = audienceRow
      ? `${card.dataset.chartCopy} · User-group value: ${audienceValue}`
      : card.dataset.chartCopy;
    metricDetailCopyZh.textContent = audienceRow
      ? `${card.dataset.chartCopyZh} · 用户群体数据：${audienceValue}`
      : card.dataset.chartCopyZh;
  };

  const activateMetricCard = (card) => {
    activeMetricCard = card;
    activeAudienceRow = null;
    metricCards.forEach((item) => {
      const isSelected = item === card;
      item.classList.toggle("is-active", isSelected);
      item.setAttribute("aria-selected", String(isSelected));
    });
    audienceRows.forEach((row) => row.classList.remove("is-active"));
    const values = card.dataset.barValues.split(",");
    audienceRows.forEach((row, index) => {
      row.querySelector(".audience-bar-fill")?.style.setProperty(
        "--bar-value",
        `${values[index]}%`,
      );
    });
    renderMetricDetail(card);
  };

  metricCards.forEach((card) => {
    card.addEventListener("click", () => activateMetricCard(card));
  });

  audienceRows.forEach((row) => {
    row.addEventListener("pointerenter", () => renderMetricDetail(activeMetricCard, row));
    row.addEventListener("pointerleave", () =>
      renderMetricDetail(activeMetricCard, activeAudienceRow),
    );
    row.addEventListener("focus", () => renderMetricDetail(activeMetricCard, row));
    row.addEventListener("blur", () => renderMetricDetail(activeMetricCard, activeAudienceRow));
    row.addEventListener("click", () => {
      activeAudienceRow = activeAudienceRow === row ? null : row;
      audienceRows.forEach((item) =>
        item.classList.toggle("is-active", item === activeAudienceRow),
      );
      renderMetricDetail(activeMetricCard, activeAudienceRow);
    });
  });

  const aiRows = Array.from(dashboard.querySelectorAll(".ai-progress-row"));
  const aiDetail = dashboard.querySelector(".ai-performance-detail");
  const aiDetailTitle = aiDetail?.querySelector("strong");
  const aiDetailTitleZh = aiDetail?.querySelector(":scope > small");
  const aiDetailCopy = aiDetail?.querySelector("span");
  const aiDetailCopyZh = aiDetail?.querySelector(".data-detail-copy-zh");
  let selectedAiRow = aiRows.find((row) => row.classList.contains("is-active")) || aiRows[0];

  const renderAiDetail = (row) => {
    if (!row || !aiDetailTitle || !aiDetailTitleZh || !aiDetailCopy || !aiDetailCopyZh)
      return;
    aiDetailTitle.textContent = row.dataset.aiTitle;
    aiDetailTitleZh.textContent = row.dataset.aiTitleZh;
    aiDetailCopy.textContent = row.dataset.aiCopy;
    aiDetailCopyZh.textContent = row.dataset.aiCopyZh;
  };

  const selectAiRow = (row) => {
    selectedAiRow = row;
    aiRows.forEach((item) => {
      const isSelected = item === row;
      item.classList.toggle("is-active", isSelected);
      item.setAttribute("aria-pressed", String(isSelected));
    });
    renderAiDetail(row);
  };

  aiRows.forEach((row) => {
    row.addEventListener("pointerenter", () => renderAiDetail(row));
    row.addEventListener("pointerleave", () => renderAiDetail(selectedAiRow));
    row.addEventListener("focus", () => renderAiDetail(row));
    row.addEventListener("blur", () => renderAiDetail(selectedAiRow));
    row.addEventListener("click", () => selectAiRow(row));
  });

  const impactRows = Array.from(dashboard.querySelectorAll(".impact-metric-row"));
  const impactDetail = dashboard.querySelector(".business-impact-detail");
  const impactDetailTitle = impactDetail?.querySelector("strong");
  const impactDetailTitleZh = impactDetail?.querySelector(":scope > small");
  const impactDetailCopy = impactDetail?.querySelector("span");
  const impactDetailCopyZh = impactDetail?.querySelector(".data-detail-copy-zh");
  let selectedImpactRow =
    impactRows.find((row) => row.classList.contains("is-active")) || impactRows[0];

  const renderImpactDetail = (row) => {
    if (
      !row ||
      !impactDetailTitle ||
      !impactDetailTitleZh ||
      !impactDetailCopy ||
      !impactDetailCopyZh
    )
      return;
    impactDetailTitle.textContent = row.dataset.impactTitle;
    impactDetailTitleZh.textContent = row.dataset.impactTitleZh;
    impactDetailCopy.textContent = row.dataset.impactCopy;
    impactDetailCopyZh.textContent = row.dataset.impactCopyZh;
  };

  const selectImpactRow = (row) => {
    selectedImpactRow = row;
    impactRows.forEach((item) => {
      const isSelected = item === row;
      item.classList.toggle("is-active", isSelected);
      item.setAttribute("aria-pressed", String(isSelected));
    });
    renderImpactDetail(row);
  };

  impactRows.forEach((row) => {
    row.addEventListener("pointerenter", () => renderImpactDetail(row));
    row.addEventListener("pointerleave", () => renderImpactDetail(selectedImpactRow));
    row.addEventListener("focus", () => renderImpactDetail(row));
    row.addEventListener("blur", () => renderImpactDetail(selectedImpactRow));
    row.addEventListener("click", () => selectImpactRow(row));
  });
});
document.querySelectorAll(".risk-review-module").forEach((module) => {
  const challengeTargets = Array.from(
    module.querySelectorAll(".challenge-card, .challenge-response-card"),
  );
  let selectedChallenge = null;

  const renderChallengePair = (pairName, stateClass) => {
    challengeTargets.forEach((target) => {
      target.classList.remove("is-active", "is-preview");
      if (target.dataset.challengeTarget === pairName) target.classList.add(stateClass);
    });
  };

  const restoreChallengePair = () => {
    renderChallengePair(selectedChallenge, selectedChallenge ? "is-active" : "");
  };

  const selectChallengePair = (pairName) => {
    selectedChallenge = selectedChallenge === pairName ? null : pairName;
    restoreChallengePair();
    challengeTargets.forEach((target) => {
      target.setAttribute(
        "aria-pressed",
        String(target.dataset.challengeTarget === selectedChallenge),
      );
    });
  };

  challengeTargets.forEach((target) => {
    target.addEventListener("pointerenter", () =>
      renderChallengePair(target.dataset.challengeTarget, "is-preview"),
    );
    target.addEventListener("pointerleave", restoreChallengePair);
    target.addEventListener("focus", () =>
      renderChallengePair(target.dataset.challengeTarget, "is-preview"),
    );
    target.addEventListener("blur", restoreChallengePair);
    target.addEventListener("click", () =>
      selectChallengePair(target.dataset.challengeTarget),
    );
  });

  const riskSteps = Array.from(module.querySelectorAll(".risk-framework-step"));
  const riskDetail = module.querySelector(".risk-framework-detail");
  const riskDetailTitle = riskDetail?.querySelector("strong");
  const riskDetailTitleZh = riskDetail?.querySelector(":scope > div > small");
  const riskDetailCopy = riskDetail?.querySelector(":scope > div:last-child > span");
  const riskDetailCopyZh = riskDetail?.querySelector(".risk-framework-detail-copy-zh");
  let selectedRiskStep = null;

  const resetRiskDetail = () => {
    riskSteps.forEach((item) => item.classList.remove("is-active", "is-preview"));
    riskDetail?.classList.add("is-empty");
    if (riskDetailTitle) riskDetailTitle.textContent = "Select a risk area";
    if (riskDetailTitleZh) riskDetailTitleZh.textContent = "请选择风险类型";
    if (riskDetailCopy)
      riskDetailCopy.textContent = "Review the corresponding mitigation approach";
    if (riskDetailCopyZh)
      riskDetailCopyZh.textContent = "查看对应的风险应对措施";
  };

  const renderRiskStep = (step, stateClass = "") => {
    if (
      !step ||
      !riskDetailTitle ||
      !riskDetailTitleZh ||
      !riskDetailCopy ||
      !riskDetailCopyZh
    )
      return;
    riskSteps.forEach((item) => item.classList.remove("is-active", "is-preview"));
    riskDetail.classList.remove("is-empty");
    if (stateClass) step.classList.add(stateClass);
    riskDetailTitle.textContent = step.dataset.riskTitle;
    riskDetailTitleZh.textContent = step.dataset.riskTitleZh;
    riskDetailCopy.textContent = step.dataset.riskCopy;
    riskDetailCopyZh.textContent = step.dataset.riskCopyZh;
  };

  const selectRiskStep = (step) => {
    selectedRiskStep = selectedRiskStep === step ? null : step;
    if (selectedRiskStep) renderRiskStep(selectedRiskStep, "is-active");
    else resetRiskDetail();
    riskSteps.forEach((item) =>
      item.setAttribute("aria-pressed", String(item === selectedRiskStep)),
    );
  };

  riskSteps.forEach((step) => {
    step.addEventListener("pointerenter", () => renderRiskStep(step, "is-preview"));
    step.addEventListener("pointerleave", () => {
      if (selectedRiskStep) renderRiskStep(selectedRiskStep, "is-active");
      else resetRiskDetail();
    });
    step.addEventListener("focus", () => renderRiskStep(step, "is-preview"));
    step.addEventListener("blur", () => {
      if (selectedRiskStep) renderRiskStep(selectedRiskStep, "is-active");
      else resetRiskDetail();
    });
    step.addEventListener("click", () => selectRiskStep(step));
  });

  const roadmapNodes = Array.from(module.querySelectorAll(".roadmap-node"));
  const roadmapBranches = Array.from(module.querySelectorAll(".roadmap-branch"));
  const roadmapDetail = module.querySelector(".roadmap-detail");
  const roadmapDetailTitle = roadmapDetail?.querySelector("strong");
  const roadmapDetailTitleZh = roadmapDetail?.querySelector(":scope > div > small");
  const roadmapDetailCopy = roadmapDetail?.querySelector(":scope > div:last-child > span");
  const roadmapDetailCopyZh = roadmapDetail?.querySelector(".roadmap-detail-copy-zh");
  let selectedRoadmapNode = null;

  const resetRoadmapDetail = () => {
    roadmapNodes.forEach((item) => item.classList.remove("is-active", "is-preview"));
    roadmapBranches.forEach((branch) => branch.classList.remove("is-active"));
    roadmapDetail?.classList.add("is-empty");
    if (roadmapDetailTitle) roadmapDetailTitle.textContent = "Select a roadmap node";
    if (roadmapDetailTitleZh) roadmapDetailTitleZh.textContent = "请选择路线节点";
    if (roadmapDetailCopy)
      roadmapDetailCopy.textContent =
        "Explore the corresponding iteration or commercialization plan";
    if (roadmapDetailCopyZh)
      roadmapDetailCopyZh.textContent = "查看对应的产品迭代或商业化规划";
  };

  const renderRoadmapNode = (node, stateClass = "") => {
    if (
      !node ||
      !roadmapDetailTitle ||
      !roadmapDetailTitleZh ||
      !roadmapDetailCopy ||
      !roadmapDetailCopyZh
    )
      return;
    roadmapNodes.forEach((item) => item.classList.remove("is-active", "is-preview"));
    roadmapDetail.classList.remove("is-empty");
    roadmapBranches.forEach((branch) =>
      branch.classList.toggle(
        "is-active",
        branch.dataset.roadmapBranch === node.dataset.roadmapBranchName,
      ),
    );
    if (stateClass) node.classList.add(stateClass);
    roadmapDetailTitle.textContent = node.dataset.roadmapTitle;
    roadmapDetailTitleZh.textContent = node.dataset.roadmapTitleZh;
    roadmapDetailCopy.textContent = node.dataset.roadmapCopy;
    roadmapDetailCopyZh.textContent = node.dataset.roadmapCopyZh;
  };

  const selectRoadmapNode = (node) => {
    selectedRoadmapNode = selectedRoadmapNode === node ? null : node;
    if (selectedRoadmapNode) renderRoadmapNode(selectedRoadmapNode, "is-active");
    else resetRoadmapDetail();
    roadmapNodes.forEach((item) =>
      item.setAttribute("aria-pressed", String(item === selectedRoadmapNode)),
    );
  };

  roadmapNodes.forEach((node) => {
    node.addEventListener("pointerenter", () => renderRoadmapNode(node, "is-preview"));
    node.addEventListener("pointerleave", () => {
      if (selectedRoadmapNode)
        renderRoadmapNode(selectedRoadmapNode, "is-active");
      else resetRoadmapDetail();
    });
    node.addEventListener("focus", () => renderRoadmapNode(node, "is-preview"));
    node.addEventListener("blur", () => {
      if (selectedRoadmapNode)
        renderRoadmapNode(selectedRoadmapNode, "is-active");
      else resetRoadmapDetail();
    });
    node.addEventListener("click", () => selectRoadmapNode(node));
  });
});
const syncBackToTopButton = () => {
  backToTopButton.classList.toggle("is-visible", window.scrollY > 360);
};
window.addEventListener("scroll", syncBackToTopButton, { passive: true });
backToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
syncBackToTopButton();
