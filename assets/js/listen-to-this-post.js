(function () {
  'use strict';

  var CONTENT_SELECTOR = '.page__content';
  var PANEL_CLASS = 'listen-to-this-post';
  var WORD_CLASS = 'listen-to-this-post__word';
  var CURRENT_CLASS = 'is-current';
  var NEXT_CLASS = 'is-next';
  var SKIP_SELECTOR = [
    '.listen-to-this-post',
    '[data-speech-skip]',
    '.speech-skip',
    'speech-skip',
    'aside',
    'figure',
    'figcaption',
    'pre',
    'code',
    'kbd',
    'samp',
    'script',
    'style',
    'noscript',
    'svg',
    'canvas',
    '.notice',
    '.toc',
    '.sidebar',
    '.sidebar__right',
    '.sidebar__left',
    '.page__share'
  ].join(', ');
  var WORD_SPLIT_REGEX = /\S+|\s+/g;
  var SEEK_DELAY_MS = 60;
  var FOLLOW_SCROLL_CLEAR_MS = 500;

  function supportsSpeechSynthesis() {
    return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function formatWordCount(index, total) {
    if (!total) {
      return '0 words';
    }

    return 'Word ' + Math.min(index + 1, total) + ' of ' + total;
  }

  function createElement(tagName, className, text) {
    var element = document.createElement(tagName);

    if (className) {
      element.className = className;
    }

    if (typeof text === 'string') {
      element.textContent = text;
    }

    return element;
  }

  function getParentElement(node) {
    if (!node) {
      return null;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      return node.parentElement;
    }

    return node;
  }

  function isSpeechNodeAllowed(node) {
    var element = getParentElement(node);

    if (!element) {
      return false;
    }

    return !element.closest(SKIP_SELECTOR);
  }

  function createWordFragment(text, controller) {
    var fragment = document.createDocumentFragment();
    var parts = text.match(WORD_SPLIT_REGEX) || [];
    var i;

    for (i = 0; i < parts.length; i += 1) {
      if (/^\s+$/.test(parts[i])) {
        fragment.appendChild(document.createTextNode(parts[i]));
        continue;
      }

      var word = createElement('span', WORD_CLASS, parts[i]);
      word.setAttribute('data-listen-word', 'true');
      controller.tokens.push({
        text: parts[i],
        span: word,
        start: 0,
        end: 0
      });
      fragment.appendChild(word);
    }

    return fragment;
  }

  function ListenToThisPost(root) {
    this.root = root;
    this.content = null;
    this.panel = null;
    this.button = null;
    this.seek = null;
    this.followButton = null;
    this.tokens = [];
    this.speechText = '';
    this.currentIndex = 0;
    this.currentUtterance = null;
    this.mode = 'idle';
    this.autoFollow = true;
    this.pendingSeekIndex = null;
    this.pendingSeekResume = false;
    this.seekFrame = null;
    this.seekTimer = null;
    this.followClearTimer = null;
    this.onWindowScroll = null;
    this.onBeforeUnload = null;
    this.onUserIntent = null;
    this.isAutoScrolling = false;
    this.destroyed = false;
  }

  ListenToThisPost.prototype.init = function () {
    if (!supportsSpeechSynthesis()) {
      return;
    }

    this.content = this.root.matches && this.root.matches(CONTENT_SELECTOR) ? this.root : this.root.querySelector(CONTENT_SELECTOR);

    if (!this.content) {
      return;
    }

    this.wrapTextNodes();
    this.buildSpeechText();
    this.insertPanel();
    this.bindEvents();
    this.refreshUI();
    this.setStatus('Ready to listen to this post.');
  };

  ListenToThisPost.prototype.collectTextNodes = function () {
    var walker = document.createTreeWalker(
      this.content,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (node) {
          if (!node || !node.nodeValue || !node.nodeValue.trim()) {
            return NodeFilter.FILTER_REJECT;
          }

          if (!isSpeechNodeAllowed(node)) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );
    var nodes = [];
    var node = walker.nextNode();

    while (node) {
      nodes.push(node);
      node = walker.nextNode();
    }

    return nodes;
  };

  ListenToThisPost.prototype.wrapTextNodes = function () {
    var nodes = this.collectTextNodes();
    var i;

    for (i = 0; i < nodes.length; i += 1) {
      var node = nodes[i];
      var parent = node.parentNode;
      var fragment;

      if (!parent) {
        continue;
      }

      fragment = createWordFragment(node.nodeValue, this);
      parent.replaceChild(fragment, node);
    }
  };

  ListenToThisPost.prototype.buildSpeechText = function () {
    var charOffset = 0;
    var i;

    for (i = 0; i < this.tokens.length; i += 1) {
      var token = this.tokens[i];

      token.start = charOffset;
      token.end = charOffset + token.text.length;
      charOffset = token.end + 1;
    }

    this.speechText = this.tokens
      .map(function (token) {
        return token.text;
      })
      .join(' ');
  };

  ListenToThisPost.prototype.insertPanel = function () {
    var panel = createElement('section', PANEL_CLASS);
    var wrap = createElement('div', PANEL_CLASS + '__panel');
    var row = createElement('div', PANEL_CLASS + '__row');
    var button = createElement('button', PANEL_CLASS + '__button', 'Play');
    var seek = createElement('input', PANEL_CLASS + '__seek');
    var followButton = createElement('button', PANEL_CLASS + '__follow', 'Follow content');

    seek.type = 'range';
    seek.min = '0';
    seek.max = String(Math.max(this.tokens.length - 1, 0));
    seek.step = '1';
    seek.value = '0';
    seek.setAttribute('aria-label', 'Speech position');
    seek.disabled = !this.tokens.length;

    button.type = 'button';
    button.setAttribute('aria-pressed', 'false');
    button.disabled = !this.tokens.length;

    followButton.type = 'button';
    followButton.hidden = true;

    row.appendChild(button);
    row.appendChild(seek);
    row.appendChild(followButton);
    wrap.appendChild(row);
    panel.appendChild(wrap);
    this.content.insertBefore(panel, this.content.firstChild);

    this.panel = panel;
    this.button = button;
    this.seek = seek;
    this.followButton = followButton;
  };

  ListenToThisPost.prototype.bindEvents = function () {
    var controller = this;

    this.button.addEventListener('click', function () {
      controller.togglePlayback();
    });

    this.seek.addEventListener('input', function (event) {
      controller.queueSeek(Number(event.target.value), controller.mode === 'playing');
    });

    this.seek.addEventListener('change', function (event) {
      controller.queueSeek(Number(event.target.value), controller.mode === 'playing');
    });

    this.followButton.addEventListener('click', function () {
      controller.setAutoFollow(true);
    });

    this.onWindowScroll = function () {
      controller.handleScroll();
    };

    this.onBeforeUnload = function () {
      controller.destroy();
    };

    this.onUserIntent = function () {
      if (controller.destroyed || !controller.autoFollow || controller.isAutoScrolling) {
        return;
      }

      controller.setAutoFollow(false);
    };

    window.addEventListener('scroll', this.onWindowScroll, { passive: true });
    document.addEventListener('scroll', this.onWindowScroll, true);
    window.addEventListener('wheel', this.onUserIntent, { passive: true });
    window.addEventListener('touchstart', this.onUserIntent, { passive: true });
    window.addEventListener('keydown', this.onUserIntent);

    window.addEventListener('beforeunload', this.onBeforeUnload);
  };

  ListenToThisPost.prototype.refreshUI = function () {
    var hasTokens = this.tokens.length > 0;
    var current = clamp(this.currentIndex, 0, Math.max(this.tokens.length - 1, 0));

    if (!hasTokens) {
      this.button.textContent = 'Play';
      this.button.disabled = true;
      this.seek.disabled = true;
      this.seek.value = '0';
      this.seek.setAttribute('aria-valuetext', 'No readable content found');
      this.followButton.hidden = true;
      return;
    }

    this.seek.value = String(current);
    this.seek.setAttribute('aria-valuetext', formatWordCount(current, this.tokens.length));
    this.button.disabled = false;
    this.followButton.hidden = this.autoFollow || this.mode === 'finished';
    this.panel.setAttribute('data-follow', this.autoFollow ? 'on' : 'off');

    if (this.mode === 'playing') {
      this.button.textContent = 'Pause';
      this.button.setAttribute('aria-pressed', 'true');
      this.panel.setAttribute('data-state', 'playing');
      return;
    }

    if (this.mode === 'paused') {
      this.button.textContent = 'Play';
      this.button.setAttribute('aria-pressed', 'false');
      this.panel.setAttribute('data-state', 'paused');
      return;
    }

    if (this.mode === 'finished') {
      this.button.textContent = 'Play again';
      this.button.setAttribute('aria-pressed', 'false');
      this.panel.setAttribute('data-state', 'finished');
      return;
    }

    this.button.textContent = 'Play';
    this.button.setAttribute('aria-pressed', 'false');
    this.panel.setAttribute('data-state', 'idle');
  };

  ListenToThisPost.prototype.setStatus = function (message) {
    if (this.panel) {
      this.panel.setAttribute('aria-label', message);
    }
  };

  ListenToThisPost.prototype.clearHighlights = function () {
    var current = this.content.querySelectorAll('.' + CURRENT_CLASS + ', .' + NEXT_CLASS);
    var i;

    for (i = 0; i < current.length; i += 1) {
      current[i].classList.remove(CURRENT_CLASS);
      current[i].classList.remove(NEXT_CLASS);
    }
  };

  ListenToThisPost.prototype.scrollCurrentTokenIntoView = function (behavior) {
    var token = this.tokens[this.currentIndex];

    if (!token || !token.span) {
      return;
    }

    this.isAutoScrolling = true;
    token.span.scrollIntoView({
      block: 'center',
      inline: 'nearest',
      behavior: behavior || 'smooth'
    });

    if (this.followClearTimer) {
      window.clearTimeout(this.followClearTimer);
    }

    var controller = this;
    this.followClearTimer = window.setTimeout(function () {
      controller.isAutoScrolling = false;
      controller.followClearTimer = null;
    }, FOLLOW_SCROLL_CLEAR_MS);
  };

  ListenToThisPost.prototype.setAutoFollow = function (enabled) {
    this.autoFollow = Boolean(enabled);

    if (this.followButton) {
      this.followButton.hidden = this.autoFollow;
    }

    if (this.autoFollow) {
      this.panel.setAttribute('data-follow', 'on');
      this.scrollCurrentTokenIntoView('smooth');
      return;
    }

    this.panel.setAttribute('data-follow', 'off');
  };

  ListenToThisPost.prototype.handleScroll = function () {
    if (this.destroyed || !this.autoFollow) {
      return;
    }

    if (this.isAutoScrolling) {
      return;
    }

    this.setAutoFollow(false);
  };

  ListenToThisPost.prototype.highlightToken = function (index, options) {
    var token = this.tokens[index];
    var nextToken = this.tokens[index + 1];
    var shouldScroll = !options || options.forceScroll !== false;

    this.clearHighlights();

    if (token && token.span) {
      token.span.classList.add(CURRENT_CLASS);

      if (this.autoFollow && shouldScroll) {
        this.scrollCurrentTokenIntoView('auto');
      }
    }

    if (nextToken && nextToken.span) {
      nextToken.span.classList.add(NEXT_CLASS);
    }
  };

  ListenToThisPost.prototype.binarySearchToken = function (charIndex) {
    var low = 0;
    var high = this.tokens.length - 1;
    var mid;

    while (low <= high) {
      mid = Math.floor((low + high) / 2);

      if (charIndex < this.tokens[mid].start) {
        high = mid - 1;
        continue;
      }

      if (charIndex >= this.tokens[mid].end) {
        low = mid + 1;
        continue;
      }

      return mid;
    }

    return clamp(low, 0, Math.max(this.tokens.length - 1, 0));
  };

  ListenToThisPost.prototype.scheduleSpeak = function (index) {
    var controller = this;
    var startIndex = clamp(index, 0, Math.max(this.tokens.length - 1, 0));
    var localTokens = this.tokens.slice(startIndex);
    var prefix = localTokens
      .map(function (token) {
        return token.text;
      })
      .join(' ');
    var prefixStarts = [];
    var prefixOffset = 0;
    var i;
    var utterance;

    if (!prefix.trim()) {
      this.finishSpeech();
      return;
    }

    for (i = 0; i < localTokens.length; i += 1) {
      prefixStarts.push(prefixOffset);
      prefixOffset += localTokens[i].text.length + 1;
    }

    utterance = new SpeechSynthesisUtterance(prefix);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onboundary = function (event) {
      var localIndex;

      if (!event || typeof event.charIndex !== 'number') {
        return;
      }

      localIndex = controller.findLocalTokenIndex(prefixStarts, event.charIndex);

      if (localIndex !== -1) {
        controller.setCurrentIndex(startIndex + localIndex, true);
      }
    };

    utterance.onend = function () {
      if (controller.currentUtterance !== utterance) {
        return;
      }

      controller.currentUtterance = null;

      if (controller.mode === 'playing') {
        controller.finishSpeech();
        return;
      }

      if (controller.mode === 'paused') {
        return;
      }
    };

    utterance.onerror = function () {
      if (controller.currentUtterance !== utterance) {
        return;
      }

      controller.currentUtterance = null;
      controller.mode = 'idle';
      controller.setStatus('Speech playback could not start in this browser.');
      controller.refreshUI();
    };

    this.currentUtterance = utterance;
    window.setTimeout(function () {
      if (controller.destroyed || controller.currentUtterance !== utterance) {
        return;
      }

      window.speechSynthesis.speak(utterance);
    }, SEEK_DELAY_MS);
  };

  ListenToThisPost.prototype.findLocalTokenIndex = function (starts, charIndex) {
    var low = 0;
    var high = starts.length - 1;
    var mid;

    while (low <= high) {
      mid = Math.floor((low + high) / 2);

      if (charIndex < starts[mid]) {
        high = mid - 1;
        continue;
      }

      if (mid + 1 < starts.length && charIndex >= starts[mid + 1]) {
        low = mid + 1;
        continue;
      }

      return mid;
    }

    return -1;
  };

  ListenToThisPost.prototype.setCurrentIndex = function (index, fromSpeech) {
    var nextIndex = clamp(index, 0, Math.max(this.tokens.length - 1, 0));

    this.currentIndex = nextIndex;
    this.highlightToken(nextIndex, { forceScroll: true });
    this.refreshUI();

    if (fromSpeech) {
      this.mode = 'playing';
      return;
    }
  };

  ListenToThisPost.prototype.startFromCurrent = function () {
    if (!this.tokens.length) {
      return;
    }

    this.setAutoFollow(true);
    this.mode = 'playing';
    this.refreshUI();

    if (window.speechSynthesis.speaking || window.speechSynthesis.paused) {
      this.currentUtterance = null;
      window.speechSynthesis.cancel();
    }

    this.scheduleSpeak(this.currentIndex);
  };

  ListenToThisPost.prototype.pausePlayback = function () {
    if (this.seekFrame) {
      window.cancelAnimationFrame(this.seekFrame);
      this.seekFrame = null;
    }

    if (this.seekTimer) {
      window.clearTimeout(this.seekTimer);
      this.seekTimer = null;
    }

    if (!window.speechSynthesis.speaking) {
      this.currentUtterance = null;
      this.mode = 'paused';
      this.refreshUI();
      return;
    }

    window.speechSynthesis.pause();
    this.mode = 'paused';
    this.refreshUI();
  };

  ListenToThisPost.prototype.resumePlayback = function () {
    this.setAutoFollow(true);

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      this.mode = 'playing';
      this.refreshUI();
      return;
    }

    this.startFromCurrent();
  };

  ListenToThisPost.prototype.togglePlayback = function () {
    if (!this.tokens.length) {
      return;
    }

    if (this.mode === 'playing') {
      this.pausePlayback();
      return;
    }

    if (this.mode === 'paused') {
      this.resumePlayback();
      return;
    }

    if (this.mode === 'finished') {
      this.currentIndex = 0;
    }

    this.startFromCurrent();
  };

  ListenToThisPost.prototype.queueSeek = function (index, resume) {
    this.pendingSeekIndex = clamp(index, 0, Math.max(this.tokens.length - 1, 0));
    this.pendingSeekResume = resume;

    if (this.seekFrame) {
      return;
    }

    var controller = this;
    this.seekFrame = window.requestAnimationFrame(function () {
      controller.seekFrame = null;
      controller.flushSeek(controller.pendingSeekIndex, controller.pendingSeekResume);
    });
  };

  ListenToThisPost.prototype.flushSeek = function (index, resume) {
    var target = clamp(index, 0, Math.max(this.tokens.length - 1, 0));
    var atEnd = target >= this.tokens.length - 1;

    this.pendingSeekIndex = null;
    this.pendingSeekResume = false;
    this.currentIndex = target;
    this.setAutoFollow(true);
    this.highlightToken(target, { forceScroll: true });

    if (this.mode === 'finished' && !atEnd) {
      this.mode = 'idle';
    }

    if (resume && this.mode !== 'finished') {
      this.mode = 'playing';
      this.refreshUI();
      if (window.speechSynthesis.speaking || window.speechSynthesis.paused) {
        this.currentUtterance = null;
        window.speechSynthesis.cancel();
      }

      if (this.seekTimer) {
        window.clearTimeout(this.seekTimer);
      }

      var controller = this;
      this.seekTimer = window.setTimeout(function () {
        controller.seekTimer = null;
        controller.scheduleSpeak(target);
      }, SEEK_DELAY_MS);
      return;
    }

    if (this.mode === 'playing' && resume) {
      return;
    }

    this.refreshUI();
  };

  ListenToThisPost.prototype.finishSpeech = function () {
    this.mode = 'finished';
    this.currentIndex = Math.max(this.tokens.length - 1, 0);
    this.autoFollow = false;
    this.clearHighlights();

    if (this.tokens.length) {
      this.tokens[this.currentIndex].span.classList.add(CURRENT_CLASS);
    }

    this.refreshUI();
    this.setStatus('Reached the end of the post.');
  };

  ListenToThisPost.prototype.destroy = function () {
    this.destroyed = true;

    if (this.seekFrame) {
      window.cancelAnimationFrame(this.seekFrame);
      this.seekFrame = null;
    }

    if (this.seekTimer) {
      window.clearTimeout(this.seekTimer);
      this.seekTimer = null;
    }

    if (this.followClearTimer) {
      window.clearTimeout(this.followClearTimer);
      this.followClearTimer = null;
    }

    if (this.onWindowScroll) {
      window.removeEventListener('scroll', this.onWindowScroll, { passive: true });
      document.removeEventListener('scroll', this.onWindowScroll, true);
      this.onWindowScroll = null;
    }

    if (this.onBeforeUnload) {
      window.removeEventListener('beforeunload', this.onBeforeUnload);
      this.onBeforeUnload = null;
    }

    if (this.onUserIntent) {
      window.removeEventListener('wheel', this.onUserIntent, { passive: true });
      window.removeEventListener('touchstart', this.onUserIntent, { passive: true });
      window.removeEventListener('keydown', this.onUserIntent);
      this.onUserIntent = null;
    }

    if (window.speechSynthesis.speaking || window.speechSynthesis.paused) {
      window.speechSynthesis.cancel();
    }

    if (this.panel && this.panel.parentNode) {
      this.panel.parentNode.removeChild(this.panel);
    }
  };

  function boot() {
    var root = document.querySelector(CONTENT_SELECTOR);

    if (!root) {
      return;
    }

    window.ListenToThisPost.create(root);
  }

  window.ListenToThisPost = {
    create: function (root) {
      var controller = new ListenToThisPost(root);

      controller.init();
      return controller;
    },
    boot: boot
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}());
