(() => {
  const progressBar = document.getElementById("progressBar");
  const reveals = document.querySelectorAll(".reveal");

  const hero = document.querySelector(".hero");
  const heroInner = document.querySelector(".hero-inner");
  const scrollCue = document.querySelector(".scroll-cue");

  const clamp = (value, min, max) =>
    Math.min(max, Math.max(min, value));

  const updatePage = () => {
    /* PAGE PROGRESS BAR */
    const scrollTop =
      window.scrollY || document.documentElement.scrollTop;

    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;

    const pageProgress =
      scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;

    progressBar.style.width =
      `${clamp(pageProgress, 0, 100)}%`;

    /* HERO FADE */
    if (hero && heroInner) {
      const heroHeight = hero.offsetHeight;

      const heroProgress = clamp(
        scrollTop / (heroHeight * 0.78),
        0,
        1
      );

      const opacity = 1 - heroProgress;

      const moveUp = heroProgress * 70;
      const scale = 1 - heroProgress * 0.045;

      heroInner.style.opacity = opacity;
      heroInner.style.transform =
        `translateY(calc(-2vh - ${moveUp}px)) scale(${scale})`;

      if (scrollCue) {
        const cueOpacity =
          clamp(1 - heroProgress * 2.2, 0, 1);

        scrollCue.style.opacity = cueOpacity;
      }
    }
  };

  /* REVEAL NEXT CONTENT */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -6% 0px"
    }
  );

  reveals.forEach((element) => observer.observe(element));

  let ticking = false;

  const requestUpdate = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updatePage();
        ticking = false;
      });

      ticking = true;
    }
  };

  window.addEventListener("scroll", requestUpdate, {
    passive: true
  });

  window.addEventListener("resize", requestUpdate);

  updatePage();
})();
