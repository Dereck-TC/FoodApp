function authValidation(config){
    //destructuramos config obteniendo requiredRole,excent
    const {requuredRole,excent} = config;
    return function(req, res, next){
        if(Array.isArray(excent) && excent.includes(req.path)){
            return next();
        }
        const {user} = req.session;
        if(user?.loggedIn && requuredRole == user.role){
            return next();
        }
        return res.redirect("/not_allowed");
    };
}

module.exports = authValidation;