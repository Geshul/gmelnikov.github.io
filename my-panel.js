class MyPanel extends HTMLElement {
  #shadow;
  #panelHeader;

  connectedCallback() {
    // Срабатывает, когда пользовательский элемент впервые добавляется в DOM.
    if (this.#shadow) {
      return;
    }
    this.#shadow = this.attachShadow({ mode: "open" });
    this.#createTemplate();
  }

  disconnectedCallback() {
    // Срабатывает, когда пользовательский элемент удаляется из DOM.
  }
  adoptedCallback() {
    // Срабатывает, когда пользовательский элемент перемещён в новый документ.
  }
  attributeChangedCallback() {
    // Срабатывает, когда пользовательскому элементу добавляют, удаляют или изменяют атрибут.
  }

  #createTemplate() {
    const template = document.createElement("template");
    template.innerHTML = `
      <style>
        :host {
          display: block;
          box-sizing: border-box;
          max-width: var(--panel-max-width, 30rem);
          font-family: var(--panel-font-family, "Inter var", "Inter", system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif);
          font-feature-settings: "cv02", "cv03", "cv04", "cv11";
          font-size: var(--panel-font-size, 1rem);
          line-height: 1.5;
          color: var(--panel-text-color, #334155);
        }
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        .panel {
          border: 1px solid var(--panel-border-color, #e2e8f0);
          border-radius: var(--panel-radius, 8px);
          background: var(--panel-background, #ffffff);
          box-shadow: var(--panel-shadow, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
        }

        .panel-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 0;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--panel-border-color, #e2e8f0);
          border-radius: var(--panel-radius, 8px) var(--panel-radius, 8px) 0 0;
          background: var(--panel-header-background, #f8fafc);
          color: var(--panel-header-color, #1e293b);
        }
        .panel-header h2 {
          margin: 0;
          font-size: var(--panel-header-font-size, 1.125rem);
          font-weight: 600;
          line-height: 1.5;
        }
        .panel-header ::slotted(*) {
          margin: 0;
          font-size: var(--panel-header-font-size, 1.125rem);
          font-weight: 600;
          line-height: 1.5;
        }

        .panel-toggle-icon {
          position: relative;
          flex: 0 0 auto;
          width: 0.6rem;
          height: 0.6rem;
          margin-left: auto;
        }
        .panel-toggle-icon::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0.55rem;
          height: 0.55rem;
          border-right: 2px solid var(--panel-icon-color, #94a3b8);
          border-bottom: 2px solid var(--panel-icon-color, #94a3b8);
          transform: translate(-50%, -50%) rotate(45deg);
          transition: transform 0.2s;
        }
        :host(:not([data-toggleable])) .panel-toggle-icon {
          display: none;
        }
        :host([data-toggleable]) .panel-header {
          cursor: pointer;
          user-select: none;
        }
        :host([data-toggleable]) .panel-header:hover {
          background: var(--panel-header-hover-background, #f1f5f9);
        }

        .panel-body {
          padding: var(--panel-body-padding, 1rem);
          border-radius: 0 0 var(--panel-radius, 8px) var(--panel-radius, 8px);
        }
        :host([collapsed]) .panel-body {
          display: none;
        }
        :host([collapsed]) .panel-header {
          border-bottom: none;
          border-radius: var(--panel-radius, 8px);
        }
        :host([collapsed]) .panel-toggle-icon::after {
          transform: translate(-50%, -50%) rotate(-45deg);
        }
      </style>
      <section class="panel">
        <header class="panel-header">
          <slot name="header"><h2>Default header</h2></slot>
          <span class="panel-toggle-icon"></span>
        </header>
        <div class="panel-body">
          <slot></slot>
        </div>
      </section>`;
    this.#shadow.append(template.content.cloneNode(true));

    this.#panelHeader = this.#shadow.querySelector(".panel-header");
    this.#panelHeader.addEventListener("click", () => this.#toggle());
  }

  #toggle() {
    if (!this.hasAttribute("data-toggleable")) {
      return;
    }
    this.toggleAttribute("collapsed");
  }
}

customElements.define(document.currentScript.dataset.name, MyPanel);
