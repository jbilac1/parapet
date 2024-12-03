require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const pricelist = require('./cjenik.json');
const favicon = require('serve-favicon');
const {setLanguage} = require('./middleware');
const ejsMate = require('ejs-mate');
const app = express();
const PORT = process.env.PORT || 3001;

const translations = {
    en: {
        pricelist: 'Price List'
        
    },
    hr: {
        pricelist: 'Cjenik Pića'
    }
};

app.use(cookieParser());
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'assets')));
app.use(favicon(__dirname + '/favicon.ico'))

app.get("/", setLanguage, (req, res)=>{
    
    res.render('pages/home', {pricelist, languages: Object.keys(translations)});
})

app.get('/change-language', (req, res) => {
    const lang = req.query.lang;
    if (Object.keys(translations).includes(lang)) {
        res.cookie('language', lang, { 
            maxAge: 365 * 24 * 60 * 60 * 1000, 
            httpOnly: true 
        });
    }

    res.redirect(req.get('referer') || '/');
});

app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}"`);
})