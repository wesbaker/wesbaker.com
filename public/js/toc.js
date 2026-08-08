// Highlights the table-of-contents entry for the section currently on screen.
document.addEventListener("DOMContentLoaded", () => {
  const links = [...document.querySelectorAll(".toc a")];
  if (links.length === 0) return;

  const blocks = [...document.querySelectorAll("article section.body > *")];
  if (blocks.length === 0) return;

  const linkForId = new Map(
    links.map((link) => [decodeURIComponent(link.hash).slice(1), link]),
  );

  // Map each block to the heading that precedes it.
  const headingForBlock = new Map();
  let currentHeading = null;
  for (const block of blocks) {
    if (block.matches("h1, h2, h3, h4")) currentHeading = block.id;
    headingForBlock.set(block, currentHeading);
  }

  const visible = new Set();

  const select = () => {
    for (const link of links) {
      link.closest("li")?.classList.remove("selected", "parent");
    }

    for (const block of blocks) {
      if (!visible.has(block)) continue;

      const link = linkForId.get(headingForBlock.get(block));
      let item = link?.closest("li");
      if (!item) continue;

      item.classList.add("selected");
      link.scrollIntoView({ block: "nearest", inline: "nearest" });

      while (item) {
        item.classList.add("parent");
        item = item.parentElement?.closest("li");
      }
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      select();
    },
    { threshold: [0] },
  );

  blocks.forEach((block) => observer.observe(block));
});
