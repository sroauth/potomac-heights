class Rundown {
  constructor(el, sectionsSelector, options) {
    this.el = document.querySelector(el);
    this.sections = Array.from(document.querySelectorAll(sectionsSelector));
    this.title = options && options.title ? options.title : "Table of Contents";

    this.init();
  }

  init() {
    // Create table of contents
    const title = document.createElement("p");
    title.textContent = this.title;
    this.el.appendChild(title);

    const linksContainer = document.createElement("ol");
    this.el.appendChild(linksContainer);

    this.sections.forEach((section, index) => {
      const link = document.createElement("li");
      link.textContent = section.children[0].textContent.trim();
      link.addEventListener("click", () => {
        setTimeout(() => {
          this.sections[index].children[0].scrollIntoView({
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
          this.sections.forEach((item, index) => {
            if (item === entry.target) {
              const links = Array.from(linksContainer.children);

              if (entry.isIntersecting) {
                links[index].classList.add("test");
              } else {
                links[index].removeAttribute("class");
              }
            }
          });
        });
      },
      {
        rootMargin: "-49.9% 0px -49.9% 0px",
      }
    );

    this.sections.forEach((section) => {
      observer.observe(section);
    });
  }
}
