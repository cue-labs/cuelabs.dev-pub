(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // ns-hugo:/home/mvdan/src/cue/cuelabs.dev/assets/ts/widgets/base-widget.ts
  var BaseWidget = class {
    element;
    constructor(element) {
      this.element = element;
    }
    init() {
      document.addEventListener("widgetsDestroy" /* DESTROY */, (e) => {
        if (e.detail.container && e.detail.container.contains(this.element)) {
          this.destroy();
        }
      });
    }
    destroy() {
    }
  };
  __publicField(BaseWidget, "NAME");

  // ns-hugo:/home/mvdan/src/cue/cuelabs.dev/assets/ts/widgets/drawer.ts
  var _Drawer = class extends BaseWidget {
    drawerName;
    closers;
    togglers;
    isOpen = false;
    constructor(element) {
      super(element);
      this.drawerName = this.element.dataset.drawer;
      this.closers = document.querySelectorAll(`[data-drawer-close="${this.drawerName}"]`);
      this.togglers = document.querySelectorAll(`[data-drawer-toggle="${this.drawerName}"]`);
    }
    static registerWidget() {
      if (window.app !== void 0) {
        window.app.addWidget({
          name: _Drawer.NAME,
          load: _Drawer.attachWidgetToElements
        });
      }
    }
    static attachWidgetToElements(container) {
      const elements = container.querySelectorAll(`[data-${_Drawer.NAME}]`);
      elements.forEach((element) => {
        const newWidget = new _Drawer(element);
        newWidget.init();
      });
    }
    init() {
      const close = () => {
        if (this.isOpen) {
          this.close();
        }
      };
      const toggle = () => {
        if (this.isOpen) {
          this.close();
        } else {
          this.open();
        }
      };
      window.addEventListener("resize", close);
      this.closers.forEach((trigger) => {
        trigger.addEventListener("click", close);
      });
      this.togglers.forEach((trigger) => {
        trigger.addEventListener("click", toggle);
      });
    }
    open() {
      if (this.isOpen) {
        return;
      }
      this.isOpen = true;
      requestAnimationFrame(() => {
        document.body.classList.add("drawer-open");
        this.element.classList.add("is-active");
        this.togglers.forEach((trigger) => {
          trigger.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
        });
        requestAnimationFrame(() => {
          this.element.classList.add("is-open");
        });
      });
    }
    close() {
      if (!this.isOpen) {
        return;
      }
      this.isOpen = false;
      requestAnimationFrame(() => {
        document.body.classList.remove("drawer-open");
        this.element.classList.remove("is-open");
        this.togglers.forEach((trigger) => {
          trigger.classList.remove("is-open");
          trigger.setAttribute("aria-expanded", "false");
        });
        requestAnimationFrame(() => {
          setTimeout(() => {
            this.element.classList.remove("is-active");
          }, 600);
        });
      });
    }
  };
  var Drawer = _Drawer;
  __publicField(Drawer, "NAME", "drawer");
  if (document.readyState !== "loading") {
    Drawer.registerWidget();
    Drawer.attachWidgetToElements(document);
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      Drawer.registerWidget();
      Drawer.attachWidgetToElements(document);
    });
  }

  // ns-hugo:/home/mvdan/src/cue/cuelabs.dev/assets/ts/widgets/header.ts
  var _Header = class extends BaseWidget {
    updateScheduled = false;
    screenWidth;
    headerHeight;
    scrollOffset = 200;
    // hides after this amount on scroll down
    scrollingDown = true;
    scrollY = 0;
    scrollYOld = 0;
    constructor(element) {
      super(element);
      this.screenWidth = window.innerWidth;
      this.headerHeight = this.element.clientHeight;
    }
    static registerWidget() {
      if (window.app !== void 0) {
        window.app.addWidget({
          name: _Header.NAME,
          load: _Header.attachWidgetToElements
        });
      }
    }
    static attachWidgetToElements(container) {
      const elements = container.querySelectorAll(`[data-${_Header.NAME}]`);
      elements.forEach((element) => {
        const newWidget = new _Header(element);
        newWidget.init();
      });
    }
    init() {
      window.addEventListener("scroll", () => {
        this.onScroll();
      });
      window.addEventListener("resize", () => {
        this.onResize();
      });
      this.onScroll();
    }
    onScroll() {
      this.scrollY = window.scrollY;
      this.scrollingDown = this.scrollY > this.scrollYOld;
      this.scrollYOld = this.scrollY;
      if (!this.updateScheduled) {
        this.updateScheduled = true;
        requestAnimationFrame(() => {
          this.setSticky();
          this.setVisibility();
          this.updateScheduled = false;
        });
      }
    }
    onResize() {
      this.screenWidth = window.innerWidth;
      this.headerHeight = this.element.clientHeight;
    }
    setSticky() {
      if (this.scrollY > this.headerHeight + this.scrollOffset) {
        this.element.classList.add("is-sticky");
      } else {
        this.element.classList.remove("is-sticky", "is-shown");
      }
    }
    setVisibility() {
      if (this.scrollY > this.headerHeight + this.scrollOffset) {
        if (this.scrollingDown) {
          this.element.classList.remove("is-shown");
        } else {
          this.element.classList.add("is-shown");
        }
      }
    }
  };
  var Header = _Header;
  __publicField(Header, "NAME", "header");
  if (document.readyState !== "loading") {
    Header.registerWidget();
    Header.attachWidgetToElements(document);
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      Header.registerWidget();
      Header.attachWidgetToElements(document);
    });
  }

  // ns-hugo:/home/mvdan/src/cue/cuelabs.dev/assets/ts/helpers/force-focus-position.ts
  var forceFocusPosition = (element) => {
    let forced = false;
    element.focus();
    if (document.activeElement !== element) {
      forced = true;
      element.setAttribute("tabindex", "-1");
      element.focus();
    }
    requestAnimationFrame(() => {
      element.blur();
      if (forced) {
        element.removeAttribute("tabindex");
      }
    });
  };

  // ns-hugo:/home/mvdan/src/cue/cuelabs.dev/assets/ts/helpers/scroll-to.ts
  var scrollToElement = (element) => {
    if (!element) {
      return false;
    }
    const targetTop = element.getBoundingClientRect().top + window.scrollY - 80;
    window.scroll({
      top: targetTop,
      behavior: "smooth"
    });
    forceFocusPosition(element);
    return true;
  };
  var scrollToHash = (hash) => {
    const targetId = hash.replace("#", "");
    let element = document.getElementById(targetId);
    if (!element) {
      element = document.querySelector(`[name="${targetId}"]`);
    }
    return scrollToElement(element);
  };

  // <stdin>
  var App = class {
    widgets;
    widgetMap;
    constructor() {
      this.widgets = [];
      this.widgetMap = {
        [Drawer.NAME]: Drawer,
        [Header.NAME]: Header
      };
      this.initWidgets();
      requestAnimationFrame(() => {
        this.scrollTo();
        this.externalLinks();
      });
    }
    initWidgets(container) {
      const scope = container ? container : document;
      for (const key in this.widgetMap) {
        const elements = scope.querySelectorAll("[data-".concat(key).concat("]"));
        elements.forEach((element) => {
          new this.widgetMap[key](element);
        });
      }
    }
    // Add widget to widget list
    addWidget(widget) {
      if (!this.widgets.find((w) => w.name === widget.name)) {
        this.widgets.push(widget);
      }
    }
    // Load widgets in case html container is injected later, accessible via window.app.reloadWidgets
    reLoadWidgets(container) {
      for (const widget of this.widgets) {
        widget.load(container);
      }
    }
    scrollTo() {
      const hash = window.location.hash;
      const regex = /^#[a-zA-Z0-9-_]+$/;
      if (regex.test(hash)) {
        scrollToHash(hash);
      }
      document.querySelectorAll('a[href^="#"]').forEach((element) => {
        element.addEventListener("click", (e) => {
          e.preventDefault();
          const target = element.getAttribute("href");
          scrollToHash(target);
        });
      });
    }
    externalLinks() {
      const host = new RegExp(`/${window.location.host}/`);
      const anchors = Array.from(document.getElementsByTagName("a"));
      for (const anchor of anchors) {
        if (!host.test(anchor.href)) {
          anchor.setAttribute("rel", "noopener");
          anchor.setAttribute("target", "_blank");
        }
      }
    }
  };
  if (document.readyState !== "loading") {
    window.app = new App();
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      window.app = new App();
    });
  }
})();
