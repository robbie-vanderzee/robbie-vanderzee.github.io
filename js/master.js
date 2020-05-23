class TextScramble {
  constructor(el, chars) {
    this.el = el;
    this.update = this.update.bind(this);
    this.chars = chars;
  }

  setText() {
    setText(this.el.innerText);
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = i;
      const center = Math.floor(38.2 * Math.log(start + 2));
      const margin = Math.floor(38.2 * Math.log(start + 3)) - center;
      const end = Math.floor(center) + Math.floor(margin * Math.random());
      this.queue.push({
        from,
        to,
        start,
        end
      });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let {
        from,
        to,
        start,
        end,
        char
      } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.146) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `${char}`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}


window.onload = function() {
  console.log("loaded")
  var scrambleparents = document.getElementsByClassName("scramble-container");
  var scramble_container_map = new Map();
  var section_nav_map = new Map();

  let sections = document.getElementsByTagName('section');
  let nav = document.getElementsByClassName('button nav');
  for (let i = 0; i < sections.length; i++) {
    section_nav_map.set(sections[i], nav[i]);
  }

  for (let parent of scrambleparents) {
    let scrambles = parent.getElementsByClassName("scramble");
    let scrambles_ko = parent.getElementsByClassName("scramble-ko");
    let scramblers = new Map();
    for (let scrambler of scrambles) {
      scramblers.set(new TextScramble(scrambler, 'qwertyuiopasdfghjklzxcvbnm'), scrambler.textContent);
    }
    for (let scrambler of scrambles_ko) {
      scramblers.set(new TextScramble(scrambler, '도다것될만보노것다이신을지고력입가을의길지한보려그직하모당그는시행들오르과인길통을신강도야회너해한고는일니기키운게은'), scrambler.textContent);
    }
    scramble_container_map.set(parent, scramblers);

    parent.onmouseenter = function() {
      scramble_parent(parent);
    };
  }
  createObserver();

  function createObserver() {
    let observer;
    let options = {
      root: null,
      rootMargin: "-50% 0% -50% 0%"
    };
    observer = new IntersectionObserver(handleIntersect, options);
    for (let [section, nav] of section_nav_map) {
      observer.observe(section);
    }
  }

  function handleIntersect(entries, observer) {
    entries.forEach((entry) => {
      let nav_button = section_nav_map.get(entry.target)
      if (entry.isIntersecting) {
        nav_button.classList.add('active');
        scramble_parent(nav_button);
      } else {
        nav_button.classList.remove('active');
      }
    });
  }

  async function scramble_parent(parent) {
    for (let [scrambler, content] of scramble_container_map.get(parent)) {
      scrambler.setText(content);
    }
  }
};
