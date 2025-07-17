const HTTP_PORT = process.env.PORT || 8080;

const express = require("express");
const app = express();
app.use(express.static("public"));  
app.set("view engine", "ejs");      //ejs
app.use(express.urlencoded({ extended: true })); //forms
require("dotenv").config()   
require('pg');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// +++ Database connection code
// +++ TODO: Remember to add your Neon.tech connection variables to the .env file!!
const { Sequelize } = require("sequelize")
const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
  host: process.env.PGHOST,
  dialect: "postgres",
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
});

// +++  4. TODO: Define your database table

const Project = sequelize.define("Project", {
    name: Sequelize.DataTypes.TEXT,
    address: Sequelize.DataTypes.TEXT,
    category: Sequelize.DataTypes.TEXT,
    comments: Sequelize.DataTypes.TEXT,
    image: Sequelize.DataTypes.TEXT,
}, {
    createdAt: false,
    updatedAt: false,
});

// +++ 5. TODO: Define your server routes
app.get("/", async (req, res) => {    
    const ProjectMemories = await Project.findAll();
    res.render("home", {ProjectMemories});
});

app.get("/memories/add", (req, res) => {    
    res.render("add");
});

app.post("/memories/add", async (req, res) => {
    await Project.create(req.body);
    res.redirect("/");
});

app.get("/memories/delete/:id", async (req, res) => {
    await Project.destroy({ where: { id: req.params.id } });
    res.redirect("/");
});
// +++  Function to start serer
async function startServer() {
    
    try {            
        await sequelize.authenticate();        
        await sequelize.sync()

        console.log("SUCCESS connecting to database")
        console.log("STARTING Express web server")        
        
        if (process.env.NODE_ENV !== "production") {
        app.listen(HTTP_PORT, () => {     
            console.log(`server listening on: http://localhost:${HTTP_PORT}`);
            });
        }
    }    
    catch (err) {        
        console.log("ERROR: connecting to database")        
        console.log(err)
        console.log("Please resolve these errors and try again.")
    }
}

startServer()

module.exports = app;
