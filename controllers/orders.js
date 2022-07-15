const client = require("../libs/db");

class OrdersController{

    static async getActualOrder(req, res){
        const {activeOrder} = req.session.user;
        const order = await client.order.findUnique({
            where:{
                id: activeOrder
            },
            include:{
                food:{
                    include:{
                        food:true
                    }
                }
            }
        });
        // order.food.forEach(order => {
        const food = await client.food.findMany();
        // console.log(order);
        // console.log(food);
        return res.render("order",{
            order,food
        });
    }

    static async getDetailOrder(req,res){
        try {
            const order = await client.order.findUnique({
                where:{
                    id:parseInt(req.params.id)
                },
                include:{
                    food:{
                        include:{
                            food:true
                        }
                    }
                }
            });
            const food = await client.food.findMany();
            return res.render("order_details",{
                order,food
            });
           
        } catch (error) {
            
        }
    }

    static async getCompletedOrders(req, res){
        const {id} = req.session.user;
        const orders = await client.order.findMany({
            where:{
                userID:id,
                completed: true
            },
            include:{
                food:{
                    include:{
                        food:true
                    }
                }
            }
        });

        return res.render("orders",{
            orders
        });
    }

    static async makeOrderCompleted(req, res){
        //destructuramos el activeOrder y el id de req.session.user
        const { activeOrder,id,email } = req.session.user;  
        //consulta update
        const sql = await client.order.update({
            //where id:activeOrder
            where:{
                id: activeOrder    
            },
            //data:{completed:true}
            data:{
                completed:true
            }
            
        });
        console.log(sql);

        //creamos la nueva orden con create
        const newOrder = await client.order.create({
            //&pasando data:{completed:false,user:{connect:{id}}}
            data:{
                completed:false,
                user:{
                    connect:{
                        id
                    }
                }
            }
        });
            
        //actualizamos data:{activeOrder:newOrder.id}
        const updateOrder = await client.user.update({
            data:{
                activeOrder:newOrder.id
            },
            where:{
                id
            }
        });
        console.log(updateOrder);
        //luego en el req.session.user.activeOrder = newOrder.id
        req.session.user.activeOrder = newOrder.id;
        //redireccionamos a "/orders"
        return res.redirect("/orders");
    }

    static async addFood(req, res){
        try {
            //requerimos el activeOrder de la sesion
            const {activeOrder} = req.session.user;
            console.log(activeOrder);
            //requerimos el idFood
            const {idFood} = req.params;
            console.log(idFood);
            //creamos la consulta para actualizar la orden donde el id es el activeOrder del usuario
            const sql = await client.order.update({
                where:{
                    id:activeOrder
                },
                data:{
                    food:{
                        create:{
                            food:{
                                connect:{
                                    id:parseInt(idFood)
                                }
                            }
                        }
                    }
                }
            });
            console.log(sql);
            // console.log(data);
            //pasamos en data:food:create (creamos el nuevo id de foodID) 
            //redireccionamos a /orders
            await req.flash("success","food add successfuly");
            return res.redirect("/orders");
        } catch (error) {
            console.log(error);
            await req.flash("error","An ocurred error");
            return res.redirect("/orders");
        }
    }

    static async deleteFood(req, res){
        //requerimos el activeOrder de la sesion
        const {activeOrder} = req.session.user;
        //requerimos el idFood
        const {idFood} = req.params;
        //creamos la consulta para actualizar la orden donde el id es el activeOrder del usuario
        const sql = await client.order.update({
            where:{
                id:activeOrder
            },
            data:{
                food:{
                    delete:{
                        food:{
                            connect:{
                                id:parseInt(idFood)
                            }
                        }
                    }
                }
            }
        });
        console.log(sql);
        //pasamos en data:food:create (creamos el nuevo id de foodID) 
        //redireccionamos a /orders
        return res.redirect("/orders");
    }
}

module.exports = OrdersController;