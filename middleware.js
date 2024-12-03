
const translations = {
    en: {
        pricelist: 'Price List'
        
    },
    hr: {
        pricelist: 'Cjenik pića'
    }
};
module.exports.setLanguage = (req, res, next) => {
    const lang = req.cookies.language || req.query.lang || 'hr';
    req.language = Object.keys(translations).includes(lang) ? lang : 'hr';
    
    // Set cookie before rendering
    if (req.cookies.language !== req.language) {
      res.cookie('language', req.language, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: true
      });
    }
    
    // Critical: Use res.locals.render to ensure locals are set BEFORE rendering
    const originalRender = res.render;
    res.render = function(view, options, callback) {
      this.locals.t = translations[req.language];
      this.locals.currentLang = req.language;
      originalRender.call(this, view, options, callback);
    };
    
    next();
  };