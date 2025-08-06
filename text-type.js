class TextType {
  constructor(element, options = {}) {
    this.element = element;
    this.text = options.text || '';
    this.typingSpeed = options.typingSpeed || 50;
    this.pauseDuration = options.pauseDuration || 2000;
    this.showCursor = options.showCursor !== false;
    this.cursorCharacter = options.cursorCharacter || '|';
    this.cursorBlinkDuration = options.cursorBlinkDuration || 0.5;
    this.loop = options.loop !== false;
    this.initialDelay = options.initialDelay || 0;
    
    this.currentIndex = 0;
    this.isTyping = false;
    this.cursorElement = null;
    
    this.init();
  }
  
  init() {
    // Clear the element
    this.element.innerHTML = '';
    
    // Create text container
    this.textContainer = document.createElement('span');
    this.textContainer.className = 'text-type__content';
    this.element.appendChild(this.textContainer);
    
    // Create cursor if needed
    if (this.showCursor) {
      this.cursorElement = document.createElement('span');
      this.cursorElement.className = 'text-type__cursor';
      this.cursorElement.textContent = this.cursorCharacter;
      this.element.appendChild(this.cursorElement);
      
      // Start cursor blinking
      this.startCursorBlink();
    }
    
    // Start typing
    setTimeout(() => {
      this.startTyping();
    }, this.initialDelay);
  }
  
  startCursorBlink() {
    let opacity = 1;
    const blink = () => {
      opacity = opacity === 1 ? 0 : 1;
      this.cursorElement.style.opacity = opacity;
      setTimeout(blink, this.cursorBlinkDuration * 1000);
    };
    blink();
  }
  
  startTyping() {
    this.isTyping = true;
    this.typeCharacter();
  }
  
  typeCharacter() {
    if (this.currentIndex < this.text.length) {
      this.textContainer.textContent += this.text[this.currentIndex];
      this.currentIndex++;
      setTimeout(() => {
        this.typeCharacter();
      }, this.typingSpeed);
    } else {
      // Finished typing
      this.isTyping = false;
      
      if (this.loop) {
        // Wait, then start over
        setTimeout(() => {
          this.reset();
        }, this.pauseDuration);
      }
    }
  }
  
  reset() {
    this.currentIndex = 0;
    this.textContainer.textContent = '';
    this.startTyping();
  }
  
  // Public method to change text
  setText(newText) {
    this.text = newText;
    this.reset();
  }
}

// Export for use in other files
window.TextType = TextType; 