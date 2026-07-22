class MySelect extends HTMLElement {
  constructor(){
    super();
    console.log('Hello World');
  }
}

customElements.define(document.currentScript.dataset.name, MySelect);
