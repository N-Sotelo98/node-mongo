const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const expres=require("express");
const bodyParser=require("body-parser")


var app=expres()
app.use(bodyParser.json())

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'prueba';

// Create a new MongoClient
const client = new MongoClient(url);

// Use connect method to connect to the Server
client.connect(function(err) {
  assert.equal(null, err);
});

//Funciones BD
function getEstudiantes(callback)
{
     client.db(dbName).collection("estudiantes").find({}).toArray((err,data)=>{

        callback(data)

      });
    
}

function getEstudiantesPais(callback,pais)
{
  client.db(dbName).collection("estudiantes").find({country:pais}).toArray((err,data)=>{

    callback(data)
  })
}

////Funciones http
app.get("/countries",(req,res)=>{

    getEstudiantes((data)=>
    {
        res.json(data)
    })
});

app.get("/countries/:country",(req,res)=>{
  
  getEstudiantesPais((data)=>{
      res.json(data)
  },req.params.country)
});

app.delete("/countries/:country",(req,res)=>{
  let pais= req.params.country

  client.db(dbName).collection("estudiantes").deleteOne({country:pais},(err,result)=>
  {
    res.send(`El pais con el nombre ${pais} a sido eliminado`)

  })

});



app.put("/countries/:country",(req,res)=>
{
  let pais=req.params.country
  console.log(req)
  client.db(dbName).collection("estudiantes").update({country:pais},{$set:{country : req.body.country,population: req.body.population,continent : req.body.continent,lifeExpectancy : req.body.lifeExpectancy,purchasingPower : req.body.purchasingPower}},(err,result)=>{
    getEstudiantesPais((data)=>{res.send(data)},pais)
  });
});


app.post("/countries",(req,res)=>
{
  let paisNuevo ={

    country : req.body.country,
    population : req.body.population,
    continent : req.body.continent,
    lifeExpectancy : req.body.lifeExpectancy,
    purchasingPower : req.body.purchasingPower
  };
  client.db(dbName).collection("estudiantes").save(paisNuevo,(err,result)=>{
    
    res.send(`Se agrego el pais con nombre ${paisNuevo.country} a la base de datos`)

  });

});


 
  
  

    
   




app.listen(8080)
