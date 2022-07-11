const client = require("../libs/db");
const {encrypt, compare} = require("../helpers/helpers");

class AuthController{
    
    static getSignUpForm(req,res){
        return res.render("signup");
    }

    static async signup(req,res){

    }

    static getLoginForm(req,res){
        return res.render("login");
    }

    static async login(req,res){
        const {email,password} = req.body;
        const user = await client.user.findUnique({
            where:{
                email
            }
        });
        if(user && await compare(password,user.password)){
            delete user.password;
            req.session.user = {
                loggedIn:true,
                ...user
            };  
            return res.redirect("/");
        }
        return res.render("/login",{
            error:true,
            message:"invalid credentials"
        });
    }

    static logout(req,res){
        req.session.destroy();
        return res.redirect("/auth/login");
    }

}

module.exports = AuthController;