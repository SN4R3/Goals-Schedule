const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);

module.exports = (req, res, next) => {
  //sanitize
  for(let key in req.body) {
    console.log(req.body[key])
    req.body[key] = DOMPurify.sanitize(req.body[key], {ALLOWED_TAGS:[]})
  }
  next()
}