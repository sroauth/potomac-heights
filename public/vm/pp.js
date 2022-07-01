document.addEventListener("alpine:init", () => {
  Alpine.data("app", () => ({
    init() {
      summarize();
    },
  }));
});

function summarize() {
  const sections = Array.from(document.querySelectorAll("section"));
  const linksContainer = document.getElementById("summary");

  // Create table of contents
  sections.forEach((section, index) => {
    let link = document.createElement("li");
    link.textContent = section.children[0].textContent.trim();
    link.addEventListener("click", () => {
      setTimeout(() => {
        sections[index].children[0].scrollIntoView({
          block: "center",
        });
      }, 0);
    });
    linksContainer.appendChild(link);
  });

  // Highlight current section in table of contents
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        sections.forEach((item, index) => {
          if (item === entry.target) {
            const links = Array.from(linksContainer.children);

            if (entry.isIntersecting) {
              links[index].classList.add("font-medium", "text-blue-500");
            } else {
              links[index].classList.remove("font-medium", "text-blue-500");
            }
          }
        });
      });
    },
    {
      rootMargin: "-49.9% 0px -49.9% 0px",
    }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });
}
