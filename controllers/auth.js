const client = require("../libs/db");
const {encrypt, compare} = require("../helpers/helpers");
const { user } = require("../libs/db");

class AuthController{
    
    static getSignUpForm(req,res){
        return res.render("signup");
    }

    static async signup(req,res){
        const {name,email,password,birthday} = req.body;
        try {
            //creamos el nuevo usuario con los datos del body
            const user = await client.user.create({
                data:{
                    name,email,password:await encrypt(password),birthday:new Date(birthday),
                    orders:{
                        create:{
                            completed:false
                        }
                    }
                },
                //incluimos orders
                include:{
                    orders:true
                }
            });
            //actualizamos el usuario
            const userWithOrder = await client.user.update({
                where:{
                    id:user.id
                },
                //pasamos data con activeOrder
                data:{
                    activeOrder:user.orders[0].id
                }
            });
            //eliminamos la contraseña
            delete userWithOrder.password;

            req.session.user = {
                loggedIn : true,
                ...userWithOrder
            };
            return res.render("/"); 
        } catch (error) {
            return res.render("signup");
        }
        
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