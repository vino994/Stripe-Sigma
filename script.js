gsap.registerPlugin(ScrollTrigger);

const cardsRow = document.getElementById("cardsRow");
const tabs = document.querySelectorAll(".tab");
const helperText = document.getElementById("helperText");

const groups = [
  {
    color: "purple",
    helper: "Business teams use Stripe Sigma to run their company more efficiently.",
    cards: [
      "What percentage of disputes did we contest?",
      "What was our charge volume in February?",
      "Which customers have not paid their invoices?",
      "Which charges reconcile with our latest bank payout?",
      "Refund trends over time?",
      "Top dispute reasons?",
      "What is our average transaction value?",
      "How many failed payments occurred this month?",
      "Which payment methods are most popular?"
    ]
  },
  {
    color: "violet",
    helper: "Finance teams use Stripe Sigma to close the books faster.",
    cards: [
      "Which charges reconcile with our latest bank payout?",
      "How much does cash flow change month to month?",
      "What is our company's daily balance?",
      "How many active customers do we have?",
      "Why do customers dispute payments?",
      "Net revenue trends?",
      "What are our outstanding invoices?",
      "Monthly revenue breakdown by region?",
      "Tax collected per jurisdiction?"
    ]
  },
  {
    color: "blue",
    helper: "Data teams use Stripe Sigma to analyse everything from ARPU to churn.",
    cards: [
      "How many active customers do we have?",
      "Why do customers dispute payments?",
      "What are our most popular subscription plans?",
      "How many payments are made with each card brand?",
      "What is our customer churn rate?",
      "Average revenue per user trends?",
      "Customer lifetime value analysis?",
      "Conversion rate by payment method?",
      "Cohort analysis for subscriptions?"
    ]
  },
  {
    color: "navy",
    helper: "Product teams use Stripe Sigma to find new business opportunities.",
    cards: [
      "What are our most popular subscription plans?",
      "How much revenue comes from different channels?",
      "Which features drive the most upgrades?"
    ]
  }
];

// Build slider
let positions = [];
let x = 0;

function getCardWidth() {
  const screenWidth = window.innerWidth;
  if (screenWidth >= 768) {
    return (screenWidth - 96 - 96) / 4.5;
  } else if (screenWidth >= 480) {
    return 280;
  } else {
    return 260;
  }
}

function getContainerOffset() {
  const container = document.querySelector('.container');
  const containerRect = container.getBoundingClientRect();
  return containerRect.left;
}

groups.forEach((group, groupIndex) => {
  if (groupIndex === 0) {
    const offset = getContainerOffset();
    x = offset;
  }
  
  positions.push(x);
  group.cards.forEach((text, cardIndex) => {
    const card = document.createElement("div");
    card.className = `card ${group.color}`;
    card.innerHTML = `<p>${text}</p><span>Show query →</span>`;
    cardsRow.appendChild(card);
    
    // GSAP hover animation for cards
    card.addEventListener("mouseenter", function() {
      gsap.to(this, {
        scale: 1.08,
        duration: 0.4,
        ease: "back.out(1.7)"
      });
      gsap.to(this.querySelector("::after"), {
        background: "rgba(0, 0, 0, 0.4)",
        duration: 0.3
      });
    });
    
    card.addEventListener("mouseleave", function() {
      gsap.to(this, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    });
    
    const cardWidth = getCardWidth();
    x += cardWidth + 24;
  });
  
  if (groupIndex === groups.length - 1) {
    const paddingSpace = document.createElement("div");
    paddingSpace.style.minWidth = `calc(100vw - ${getCardWidth() * 3}px - 96px - 72px)`;
    paddingSpace.style.flexShrink = "0";
    cardsRow.appendChild(paddingSpace);
  }
});

// Reset scroll position
window.addEventListener('load', () => {
  cardsRow.scrollLeft = 0;
});

// Tabs → scroll with GSAP
tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    // GSAP scroll animation
    gsap.to(cardsRow, {
      scrollLeft: positions[i],
      duration: 0.8,
      ease: "power2.inOut"
    });

    // GSAP text animation
    gsap.to(helperText, {
      opacity: 0,
      y: 10,
      duration: 0.2,
      onComplete: () => {
        helperText.textContent = groups[i].helper;
        gsap.to(helperText, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out"
        });
      }
    });
  });
});

// Scroll → auto tab
let scrollTimeout;
cardsRow.addEventListener("scroll", () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    const scrollX = cardsRow.scrollLeft;
    let active = 0;

    positions.forEach((pos, i) => {
      if (scrollX >= pos - 200) active = i;
    });

    const wasActive = Array.from(tabs).findIndex(t => t.classList.contains("active"));
    
    if (wasActive !== active) {
      tabs.forEach(t => t.classList.remove("active"));
      tabs[active].classList.add("active");
      
      gsap.to(helperText, {
        opacity: 0,
        y: 10,
        duration: 0.2,
        onComplete: () => {
          helperText.textContent = groups[active].helper;
          gsap.to(helperText, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out"
          });
        }
      });
    }
  }, 100);
});

// ===== EDGE SCROLL WITH GSAP =====
let isDown = false;
let startX;
let scrollLeft;
let scrollTween = null;

const scrollTriggerLeft = document.getElementById('scrollTriggerLeft');
const scrollTriggerRight = document.getElementById('scrollTriggerRight');

// Drag
cardsRow.addEventListener("mousedown", (e) => {
  isDown = true;
  startX = e.pageX;
  scrollLeft = cardsRow.scrollLeft;
  cardsRow.style.cursor = 'grabbing';
  if (scrollTween) scrollTween.kill();
});

cardsRow.addEventListener("mouseup", () => {
  isDown = false;
  cardsRow.style.cursor = 'grab';
});

cardsRow.addEventListener("mouseleave", () => {
  isDown = false;
  cardsRow.style.cursor = 'grab';
});

cardsRow.addEventListener("mousemove", (e) => {
  if (isDown) {
    e.preventDefault();
    const walk = (e.pageX - startX) * 2;
    cardsRow.scrollLeft = scrollLeft - walk;
  }
});

// Left scroll trigger
scrollTriggerLeft.addEventListener("mouseenter", () => {
  scrollTween = gsap.to(cardsRow, {
    scrollLeft: "-=2000",
    duration: 3,
    ease: "none",
    overwrite: true
  });
});

scrollTriggerLeft.addEventListener("mouseleave", () => {
  if (scrollTween) scrollTween.kill();
});

// Right scroll trigger
scrollTriggerRight.addEventListener("mouseenter", () => {
  scrollTween = gsap.to(cardsRow, {
    scrollLeft: "+=2000",
    duration: 3,
    ease: "none",
    overwrite: true
  });
});

scrollTriggerRight.addEventListener("mouseleave", () => {
  if (scrollTween) scrollTween.kill();
});

// Wheel scroll
cardsRow.addEventListener("wheel", (e) => {
  e.preventDefault();
  gsap.to(cardsRow, {
    scrollLeft: cardsRow.scrollLeft + e.deltaY * 2,
    duration: 0.5,
    ease: "power2.out"
  });
}, { passive: false });

// ===== TESTIMONIAL SLIDER WITH GSAP =====
const testimonialTrack = document.getElementById("testimonialTrack");
const allTestimonialDots = document.querySelectorAll(".testimonial-dot");
let currentTestimonial = 0;
let testimonialAutoPlay;

function showTestimonial(index) {
  currentTestimonial = index;
  
  // GSAP animation for testimonial slide
  gsap.to(testimonialTrack, {
    x: `-${index * 100}%`,
    duration: 0.8,
    ease: "power3.inOut"
  });
  
  // Update dots
  allTestimonialDots.forEach((dot, i) => {
    const slideIndex = parseInt(dot.getAttribute('data-slide'));
    dot.classList.toggle("active", slideIndex === index);
  });
}

function nextTestimonial() {
  currentTestimonial = (currentTestimonial + 1) % 4;
  showTestimonial(currentTestimonial);
}

function prevTestimonial() {
  currentTestimonial = (currentTestimonial - 1 + 4) % 4;
  showTestimonial(currentTestimonial);
}

function startTestimonialAutoPlay() {
  stopTestimonialAutoPlay();
  testimonialAutoPlay = setInterval(nextTestimonial, 6000);
}

function stopTestimonialAutoPlay() {
  if (testimonialAutoPlay) {
    clearInterval(testimonialAutoPlay);
  }
}

// Dot click handlers
allTestimonialDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const slideIndex = parseInt(dot.getAttribute('data-slide'));
    showTestimonial(slideIndex);
    stopTestimonialAutoPlay();
    startTestimonialAutoPlay();
  });
});

// Start autoplay
startTestimonialAutoPlay();

// Pause on hover
const testimonialSection = document.querySelector(".testimonial-slider");
testimonialSection.addEventListener("mouseenter", stopTestimonialAutoPlay);
testimonialSection.addEventListener("mouseleave", startTestimonialAutoPlay);

// Touch swipe support
let touchStartX = 0;
let touchEndX = 0;

testimonialSection.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
  stopTestimonialAutoPlay();
}, { passive: true });

testimonialSection.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
  startTestimonialAutoPlay();
}, { passive: true });

function handleSwipe() {
  const swipeThreshold = 50;
  if (touchStartX - touchEndX > swipeThreshold) {
    nextTestimonial();
  } else if (touchEndX - touchStartX > swipeThreshold) {
    prevTestimonial();
  }
}

// Entrance animations with GSAP
gsap.from(".label", {
  opacity: 0,
  y: 20,
  duration: 0.6,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".label",
    start: "top 80%"
  }
});

gsap.from("h2", {
  opacity: 0,
  y: 30,
  duration: 0.8,
  ease: "power2.out",
  scrollTrigger: {
    trigger: "h2",
    start: "top 80%"
  }
});

gsap.from(".desc", {
  opacity: 0,
  y: 20,
  duration: 0.6,
  delay: 0.2,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".desc",
    start: "top 80%"
  }
});

gsap.from(".tab", {
  opacity: 0,
  y: 20,
  duration: 0.4,
  stagger: 0.1,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".tabs",
    start: "top 80%"
  }
});

gsap.from(".card", {
  opacity: 0,
  y: 30,
  duration: 0.6,
  stagger: 0.08,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".cards-row",
    start: "top 80%"
  }
});