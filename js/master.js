class TextScramble {
  static chars = 'qwertyuiopasdfghjklzxcvbn'
  constructor(el) {
    this.el = el
    this.update = this.update.bind(this)
  }
  setText(newText) {
    const oldText = this.el.innerText
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise((resolve) => this.resolve = resolve)
    this.queue = []
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ''
      const to = newText[i] || ''
      const start = i
      // Theory: golden ratio randomness between golden logarithmic growth function
      const center = Math.floor(38.2 * Math.log(start + 2))
      const margin = Math.floor(38.2 * Math.log(start + 3)) - center
      const end = Math.floor(center) + Math.floor(margin * Math.random())
      this.queue.push({
        from,
        to,
        start,
        end
      })
    }
    cancelAnimationFrame(this.frameRequest)
    this.frame = 0
    this.update()
    return promise
  }
  update() {
    let output = ''
    let complete = 0
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let {
        from,
        to,
        start,
        end,
        char
      } = this.queue[i]
      if (this.frame >= end) {
        complete++
        output += to
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.146) {
          char = this.randomChar()
          this.queue[i].char = char
        }
        output += `${char}`
      } else {
        output += from
      }
    }
    this.el.innerHTML = output
    if (complete === this.queue.length) {
      this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame++
    }
  }
  randomChar() {
    return TextScramble.chars[Math.floor(Math.random() * TextScramble.chars.length)]
  }
}

/*
var mainNavLinks = document.getElementsByClassName("button nav")
var mainSections = document.getElementsByClassName("body-section")
console.log(mainNavLinks)
console.log(mainSections)
https://css-tricks.com/sticky-smooth-active-nav/
*/
window.onload = function() {

  var scrambleparents = document.getElementsByClassName("scramble-container")
  for (let parent of scrambleparents) {
    f(parent)
  }

  function f(x) {
    var scrambles = x.getElementsByClassName("scramble")
    var scramblers = new Map()
    for (let scrambler of scrambles) {
      scramblers.set(new TextScramble(scrambler), scrambler.textContent)
    }

    x.onmouseenter = function() {
      for (let [scrambler, content] of scramblers) {
        scrambler.setText(content)
      }
    }
  }
}
