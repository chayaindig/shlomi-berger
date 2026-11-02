// Glues the last two words of every text block with a non-breaking space,
// so no heading or paragraph ever ends with a single word on its own line.
const SELECTOR = 'h1, h2, h3, h4, p, li, blockquote, dd, summary, figcaption';
const NBSP = ' ';

function glueLastGap(el: Element) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) nodes.push(n as Text);

  let seenWord = false;
  for (let i = nodes.length - 1; i >= 0; i--) {
    const text = nodes[i].nodeValue ?? '';
    for (let j = text.length - 1; j >= 0; j--) {
      const ch = text[j];
      if (ch === NBSP) {
        if (seenWord) return; // already glued
        continue;
      }
      if (/\s/.test(ch)) {
        if (seenWord) {
          nodes[i].nodeValue = text.slice(0, j) + NBSP + text.slice(j + 1);
          return;
        }
      } else {
        seenWord = true;
      }
    }
  }
}

export function glueOrphans(root: ParentNode = document) {
  root.querySelectorAll(SELECTOR).forEach(el => {
    // Skip blocks whose last line is a short label (one or two words in total)
    if ((el.textContent ?? '').trim().split(/\s+/).length < 3) return;
    glueLastGap(el);
  });
}

/**
 * Glue now, after fonts load, and again whenever React re-renders text later
 * (tabs, accordions, data that arrives late, hot reload). Returns a cleanup function.
 */
export function watchOrphans(root: HTMLElement = document.body) {
  let queued = false;
  const run = () => {
    queued = false;
    observer.disconnect();
    glueOrphans(root);
    observer.observe(root, { childList: true, subtree: true, characterData: true });
  };
  const observer = new MutationObserver(() => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(run);
    }
  });
  run();
  document.fonts?.ready.then(run);
  return () => observer.disconnect();
}
