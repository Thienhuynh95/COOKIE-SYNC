const Helpers = {}
// Shorthand for document.querySelector
Helpers.select = (selector) => {
  return document.querySelector(selector);
}
// Shorthand for document.querySelectorAll
Helpers.selectAll = (selector) => {
  return document.querySelectorAll(selector);
}

export default Helpers