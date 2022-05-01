function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

const isAdmin = (req, res, next) =>{
    if(req.user.roles === 'admin') {
        return next();
    }
    res.redirect('/')
};

module.exports = {
    checkNotAuthenticated,
    checkAuthenticated,
};
