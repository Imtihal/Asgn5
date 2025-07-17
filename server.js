/********************************************************************************
* WEB322 – Assignment 05
*
* I declare that this assignment is my own work and completed based on my
* current understanding of the course concepts.
*
* The assignment was completed in accordance with:
* a. The Seneca's Academic Integrity Policy
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* b. The academic integrity policies noted in the assessment description
*
* I did NOT use generative AI tools (ChatGPT, Copilot, etc) to produce the code
* for this assessment.
*
* Name: Imtihal Uddin Student ID: 178833232
*
********************************************************************************/

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
        
        app.listen(HTTP_PORT, () => {     
            console.log(`server listening on: http://localhost:${HTTP_PORT}`) 
        })    
    }    
    catch (err) {        
        console.log("ERROR: connecting to database")        
        console.log(err)
        console.log("Please resolve these errors and try again.")
    }
}

startServer()

module.exports = app;

