const client = require("../libs/db");
const {parseDate} = require("../helpers/helpers");

class UserController{

    static async addUser(req,res){

    }

    static async getAllUsers(req,res){
        const users = await client.user.findMany();
        console.log(users);
        const error = (await req.consumeFlash("error"))[0];
        const success = (await req.consumeFlash("success"))[0];

        return res.render("admin/users",{
            users,
            error,
            success
        });
    }

    static async getUser(req,res){
        const id = req.params.id; //guardamos el id en una variable
        const user = await client.user.findUnique({ //realizamos la consulta select * from user where id = id
            where:{
                id:parseInt(id)
            }
        });
        console.log(user);
        user.birthday = parseDate(user.birthday); //convertimos la fecha consultada a formatdo de helper
        //en caso ser correcto, redirige a user_details
        return res.render("admin/user_details",{
            user
        });
    }

    static async updateUser(req,res){
        const id = req.params.id;
        //requerimo si el ususario está activo
        req.body.isActive = req.body.isActive==="on";

        const date = new Date(req.body.birthday);
        date.setDate(date.getDate()+1);
        req.body.birthday = date;

        try {
            const user = await client.user.update({ //realizamos la consulta update user set (todos los daros a actualizar)
                data: req.body, //requerimos los datos del body
                where:{
                    id:parseInt(id)
                }
            });
            console.log(user);
            await req.flash("success","user update successfully");
            return res.redirect("/admin/users");
        } catch (error) {
            console.log(error);
            await req.flash("error","failed to update user");
            return res.redirect("/admin/users");
        }
    }

    static async deleteUser(req,res){
        const id = req.params.id;
        try {
            const user = await client.user.delete({
                where:{
                    id:parseInt(id)
                }
            });
            console.log(user);
            await req.flash("success","delete user successfully");
            
        } catch (error) {
            console.log(error);
            await req.flash("error","failed delete user");
            
        }
        finally{
            return res.redirect("/admin/users");
        }
    }    
}

module.exports = UserController;