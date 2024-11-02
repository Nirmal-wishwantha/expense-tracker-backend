const { expressjwt: jwt } = require('express-jwt');

const JWT_SECRET = 'your_secret_key'; // මේ secret key එක පරිසර විචල්‍යයක් ලෙස තැබීම වඩාත් ආරක්ෂිතයි

// express-jwt middleware එකක් අත්‍යවශ්‍ය මාර්ගවලට සත්‍යාපනය කිරීම
const authMiddleware = jwt({
    secret: JWT_SECRET,
    algorithms: ['HS256'],
}).unless({
    path: ['/login', '/register'], // මෙහිදී login සහ register මාර්ග සදහා සත්‍යාපන අවශ්‍ය නැත
});

module.exports = authMiddleware;
