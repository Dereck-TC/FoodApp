const express = require("express");
const { port, sessionSecret } = require("./config/config");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const session  = require("express-session");

//Routes
const users = require("./routes/users");
const food = require("./routes/food");
const orders = require("./routes/orders");
const auth = require("./routes/auth");
const addSessionToTemplate = require("./middlewares/addSessionToTemplate");
//middlewares

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname,"static")));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: sessionSecret, saveUninitialized: false, resave: false }));
app.use(expressLayouts);
app.use(addSessionToTemplate());

// app.use("/admin/users",users);
// app.use("/auth",auth);
// app.use("/orders",orders);
// app.use("/food",food);

//viewengines
app.set("view engine","ejs");
app.set("layout","./layouts/base");

//vistas
app.get("/",(req,res)=>{
    console.log(req.session);
    return res.render("home");
});
app.get("/not_allowed",(req,res)=>{
    return res.render("not_allowed");
});

// Pagina 404
//en caso no se ingrese a ninguna de las rutas anteriores, se redirigirá a la página 404
app.get("*",(req,res)=>{
    // return res.json({
    //     message:"Not found"
    // });
    return res.render("not_found");
});
//puerto
app.listen(port,()=>{
    console.log("Listening on: http://localhost:"+port);
});




