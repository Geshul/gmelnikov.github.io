class MySelect extends HTMLElement {
  #shadow;
  #selectButton;
  #selectPopup;
  #selectPopupSearch;
  #optionsBox;
  #optionsArray = [];
    #labelTemplate;

  constructor() {
    super();
    console.log("Hello World");
  }

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
          position: relative;
          display: inline-block;
          box-sizing: border-box;
          width: var(--select-width, 20rem);
          max-width: 100%;
          font-family: var(--select-font-family, "Inter var", "Inter", system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif);
          font-feature-settings: "cv02", "cv03", "cv04", "cv11";
          font-size: var(--select-font-size, 1rem);
          line-height: 1.5;
          color: var(--select-text-color, #334155);
        }
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        .select-button {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          min-height: 2.5rem;
          margin: 0;
          padding: 0.5rem 2.5rem 0.5rem 0.75rem;
          border: 1px solid var(--select-border-color, #cbd5e1);
          border-radius: var(--select-radius, 6px);
          background: var(--select-background, #ffffff);
          color: var(--select-text-color, #334155);
          font: inherit;
          text-align: left;
          cursor: pointer;
          outline: 1px solid transparent;
          transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s, outline-color 0.2s;
        }
        .select-button:empty::before {
          content: "Select options…";
          color: var(--select-muted-color, #64748b);
        }
        .select-button::after {
          content: "";
          position: absolute;
          top: 50%;
          right: 0.9rem;
          width: 0.5rem;
          height: 0.5rem;
          border-right: 2px solid var(--select-icon-color, #94a3b8);
          border-bottom: 2px solid var(--select-icon-color, #94a3b8);
          transform: translateY(-70%) rotate(45deg);
          pointer-events: none;
        }
        .select-button:hover {
          border-color: var(--select-border-hover, #94a3b8);
        }
        :host([open]) .select-button,
        :host:focus-within .select-button {
          outline: 1px solid var(--select-primary, #3b82f6);
          outline-offset: -1px;
          box-shadow: none;
          border-color: var(--select-border-hover, #94a3b8);
        }

        .select-popup {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          z-index: var(--select-z-index, 20);
          width: 100%;
          overflow: hidden;
          border: 1px solid var(--select-popup-border-color, #e2e8f0);
          border-radius: var(--select-radius, 6px);
          background: var(--select-popup-background, #ffffff);
          color: var(--select-text-color, #334155);
          box-shadow: var(--select-popup-shadow, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1));
        }
        .select-popup.open,
        :host([open]) .select-popup {
          display: block;
        }

        .select-popup-search {
          display: block;
          width: calc(100% - 1rem);
          margin: 0.5rem 0.5rem 0 0.5rem;
          padding: 0.5rem 1.75rem 0.5rem 0.75rem;
          border: 1px solid var(--select-border-color, #cbd5e1);
          border-radius: var(--select-radius, 6px);
          background-color: var(--select-background, #ffffff);
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='7'/%3E%3Cpath d='M20 20l-3.6-3.6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 0.9rem 0.9rem;
          color: var(--select-text-color, #334155);
          font: inherit;
          outline: 1px solid transparent;
          transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s, outline-color 0.2s;
        }
        .select-popup-search::placeholder {
          color: var(--select-muted-color, #64748b);
        }
        .select-popup-search:hover {
          border-color: var(--select-border-hover, #94a3b8);
        }
        .select-popup-search:focus {
          outline: 1px solid var(--select-primary, #3b82f6);
          outline-offset: -1px;
          box-shadow: none;
          border-color: var(--select-border-hover, #94a3b8);
        }

        .select-popup-options {
          max-height: var(--select-options-max-height, 15rem);
          overflow-y: auto;
          padding: 0.25rem;
          scrollbar-width: thin;
          scrollbar-color: var(--select-border-color, #cbd5e1) transparent;
        }
        .select-popup-options::-webkit-scrollbar {
          width: 8px;
        }
        .select-popup-options::-webkit-scrollbar-thumb {
          background: var(--select-border-color, #cbd5e1);
          border: 2px solid var(--select-background, #ffffff);
          border-radius: 6px;
        }
        .select-popup-options::-webkit-scrollbar-track {
          background: transparent;
        }

        .option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 2px 0;
          padding: 0.5rem 0.75rem;
          border-radius: var(--select-option-radius, 4px);
          color: var(--select-text-color, #334155);
          cursor: pointer;
          user-select: none;
          transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s, outline-color 0.2s;
        }
        .option:first-child {
          margin-top: 0;
        }
        .option:hover {
          color: var(--select-option-hover-color, #1e293b);
          background: var(--select-option-hover-background, #f1f5f9);
        }
        .option:has(input:checked) {
          color: var(--select-highlight-color, #1d4ed8);
          background: var(--select-highlight-background, #eff6ff);
        }

        .option input[type="checkbox"] {
          flex: 0 0 auto;
          width: 1.25rem;
          height: 1.25rem;
          margin: 0;
          appearance: none;
          -webkit-appearance: none;
          border: 1px solid var(--select-border-color, #cbd5e1);
          border-radius: var(--select-radius, 6px);
          background-color: var(--select-background, #ffffff);
          color: var(--select-text-color, #334155);
          background-position: center;
          background-repeat: no-repeat;
          background-size: 0.875rem 0.875rem;
          cursor: pointer;
          outline: 1px solid transparent;
          transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s, outline-color 0.2s;
        }
        .option input[type="checkbox"]:hover {
          border-color: var(--select-border-hover, #94a3b8);
        }
        .option input[type="checkbox"]:checked {
          border-color: var(--select-primary, #3b82f6);
          background-color: var(--select-primary, #3b82f6);
          color: #ffffff;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 8.5l3.2 3.2L13 5'/%3E%3C/svg%3E");
        }
        .option input[type="checkbox"]:checked:hover {
          border-color: var(--select-primary-hover, #2563eb);
          background-color: var(--select-primary-hover, #2563eb);
        }
        .option input[type="checkbox"]:focus-visible {
          outline: 1px solid var(--select-primary, #3b82f6);
          outline-offset: -1px;
          box-shadow: none;
          border-color: var(--select-border-hover, #94a3b8);
        }
      </style>
      <button class="select-button"><!--Здесь будет выбранная опция--></button>
      <div class="select-popup"><input class="select-popup-search" placeholder="Search..." /><div class="select-popup-options"><!--Здесь будет список опций--></div></div>`;
    this.#shadow.append(template.content.cloneNode(true));

    this.#selectButton = this.#shadow.querySelector(".select-button");
    this.#selectPopup = this.#shadow.querySelector(".select-popup");
    this.#selectPopupSearch = this.#shadow.querySelector(".select-popup-search");
    this.#optionsBox = this.#shadow.querySelector(".select-popup-options");
    this.#labelTemplate = this.#getLabelTemplate();
    this.#optionsArray = this.#getOptionsArray();
    this.#renderOptions();

    this.#selectButton.addEventListener("click", () => this.#openPopup());
  }

  #openPopup() {
    const isOpen = this.#selectPopup.classList.toggle("open");
    this.toggleAttribute("open", isOpen);
  }


  #getLabelTemplate() {
    const labelTemplate = document.createElement("template");
    labelTemplate.innerHTML = `<label class="option"><input type='checkbox'/></label>`;
    return labelTemplate;
  }

  #renderOptions() {
    this.#deleteOptions();
    this.#optionsArray.forEach((option) => {
      const key = Object.keys(option)[0];
      const labelTemplate = this.#labelTemplate.content.cloneNode(true);
      const label = labelTemplate.querySelector('label');
      label.dataset.value = key;
      label.append(option[key])
      this.#optionsBox.append(label);
    });
  }

  #deleteOptions() {
    Array.from(this.querySelectorAll('option')).forEach((option) => option.remove())
  }

  #getOptionsArray() {
    return Array.from(this.querySelectorAll('option')).map((option) => ({
      [option.value]:option.textContent
    }));
  }
}

customElements.define(document.currentScript.dataset.name, MySelect);
