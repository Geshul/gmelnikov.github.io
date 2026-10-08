class MySelect extends HTMLElement {
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
    template.innerHTML = `<button class="select-button"><!--Здесь будет выбранная опция--></button><div class="select-popup"><input class="select-popup-search" placeholder="Search..." /><div class="select-popup-options"><!--Здесь будет список опций--></div></div>`;
    this.append(template.content.cloneNode(true));

    this.#selectButton = this.querySelector(".select-button");
    this.#selectPopup = this.querySelector(".select-popup");
    this.#selectPopupSearch = this.querySelector(".select-popup-search");
    this.#optionsBox = this.querySelector(".select-popup-options");
    this.#labelTemplate = this.#getLabelTemplate();
    this.#optionsArray = this.#getOptionsArray();
    this.#renderOptions();
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
