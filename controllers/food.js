const client = require("../libs/db");
// const multer  = require("multer");
// const upload = multer({ dest: path.join(__dirname,"uploads")});

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

    static async getFilterFood(req,res){
        const category = await client.category.findUnique({
            where:{
                id:1
            }, 
            include:{
                categories:{
                    include:{
                        food:true
                    }
                }
            }
        });
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
        //console.log(food);
        return res.render("home",{
            food,category,categories
        });
    }

    static async getAddForm(req, res){
        const categories = await client.category.findMany();
        return res.render("admin/addFood",{
            categories
        });
    }

    // static async add(req, res){
    //     try {
    //         const {name,price,description,image,categories} = req.body;
    //         const cati = Array.isArray(categories) ? categories : categories.split(",");
    //         const noCategory = cati.includes("no-category");
    //         let data = {name,description,image,price:parseFloat(price)};
    //         if(!noCategory){
    //             const categoriesNumbers = cati.map(categoryID => ({categoryID:parseInt(categoryID)}));
    //             data.categories = {create:categoriesNumbers};
    //         }
    //         const food = await client.food.create({data});
    //         await req.flash("success","Food added successfully");
    //         return res.redirect("addFood");
    //     } catch (error) {
    //         await req. flash("error","An error occurred");
    //         return res.redirect("addFood");
    //     }
    // }
    static async add(req, res){
        try {
            const {name,price,description,image,categories} = req.body;
            // const file = upload.single(image);
            const cati = Array.isArray(categories) ? categories : categories.split(",");
            const noCategory = cati.includes("no-category");
            let data = {name,description,image,price:parseFloat(price)};
            if(!noCategory){
                const categoriesNumbers = cati.map(categoryID => ({categoryID:parseInt(categoryID)}));
                data.categories = {create:categoriesNumbers};
            }
            const food = await client.food.create({data});
            await req.flash("success","Food added successfully");
            return res.redirect("addFood");
        } catch (error) {
            await req. flash("error","An error occurred");
            return res.redirect("addFood");
        }
    }

    static async getAllCategories(req,res){
        const category = await client.category.findMany();
        return res.render("admin/categories",{
            category
        });
    }

    static async addCategory(req,res){
        try {
            const category = await client.category.create({ 
                data: req.body
            });
            console.log(category);
            await req.flash("success","category added successfully");
            return res.redirect("/admin/categories");
        } catch (error) {
            console.log(error);
            await req.flash("error","Error creating");
            return res.redirect("/admin/categories");
        }
    }

    static async getEditForm(req, res){
        try {
            const food = await client.food.findUnique({
                where:{
                    id: parseInt(req.params.id)
                },
                include:{
                    categories:true
                }
            });
            console.log(food);
            const categories = await client.category.findMany();
            const error = (await req.consumeFlash("error"))[0];
            const success = (await req.consumeFlash("success"))[0];
            return res.render("admin/editFood",{
                categories,food, error, success
            })
        } catch (error) {
            console.log(error);
            return res.json({
                message:"An error occurred"
            });
        }
    }

    static async edit(req, res){
        try {
            const id = parseInt(req.params.id);
            const {name,price,description,image,categories} = req.body;
            const deletefood = await client.foodCategories.deleteMany({
                where:{
                    foodID:id
                }
            });  
            console.log(deletefood);
            let noCategory;
            let categoriesNumbers;
            let data = {
                name,
                description,
                image,
                price:parseFloat(price)
            };
            if(Array.isArray(categories)){
                noCategory = categories.includes("no-category");
                if (!noCategory){
                    categoriesNumbers = categories.map(categoryID=>({categoryID:parseInt(categoryID)}));
                    data.categories = {
                        create:categoriesNumbers
                    };
                }
            }else{
                if(categories!=="no-category"){
                    categoriesNumbers = [{
                        categoryID:parseInt(categories)
                    }];
                    data.categories = {
                        create:categoriesNumbers
                    };
                }
            }

            const updatefood = await client.food.update({
                where:{
                    id
                },
                data,
                include:{
                    categories:true
                }
            });
            console.log(updatefood);
            await req.flash("success", "Food edited successfully"); 
        } catch (error) {
            console.log(error);
            await req.flash("error", "Failed error edited");
        }finally{
            // eslint-disable-next-line no-unsafe-finally
            return res.redirect("/");
        }
    }

    static async delete(req,res){
        try {
            const id = parseInt(req.params.id);
            const dltfood = await client.food.delete({
                where:{
                    id : id
                }
            });
            console.log(dltfood);
            await req.flash("success","food deleted successfully");
        } catch (error) {
            console.log(error);
            await req.flash("error","error deleting food");
        }finally{
            res.redirect("/");
        }
    }
}

module.exports = FoodController;