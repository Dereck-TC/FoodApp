const client = require("../libs/db");

class FoodController{
    
    static async getAll(req,res){
        const food = await client.food.findMany({
            include:{
                categories:{
                    include:{
                        category:true
                    }
                }
            }
        });
        const categories = await client.category.findMany();
        console.log(food);
        return res.render("home",{
            food,categories
        });
    }

    static async getAddForm(req, res){
        return res.render("admin/addFood");
    }

    static async add(req, res){

    }

    static async addCategory(req,res){

    }

    static async getEditForm(req, res){
    
    }

    static async edit(req, res){
    
    }

    static async delete(req,res){

    }
}

module.exports = FoodController;