import express from "express";
import fs, { read } from "fs";
import path from "path";

const app=express();
const PORT=3000; 

app.use(express.json());

const dpPath=path.join(process.cwd(),'db.json');

const readData = () =>{
    try{
        const data=fs.readFileSync('./db.json');
        return JSON.parse(data);
    }catch(error){
        console.log("error al conectarse con la Base Datos");
        return {estudiantes: [] };

    }
}
const writeDataBase=(data)=>{
    fs.writeFileSync(dpPath,JSON.stringify(data,null,2));
}

readData();

app.get("/", (req, res) => {
    res.send("Hola Mundo Como estas")
});

//Metodo GET para obtener datos
app.get('/estudiantes',(req,res)=>{

    const {estudiantes} =readData();
    res.json(estudiantes);
});

//Metodo GET para obtener por id
app.get("/estudiantes/:id",(req,res)=>{

    const id=parseInt(req.params.id);
    const bd=readData();
    const estudiante = bd.estudiantes.find(est=>est.id===id);
    
    if(estudiante){
        res.json(estudiante);
    }else{
        res.status(404).send("Estudiante No Encontrado")
    }


});

//MEtodo POST para añadir un nuevo estudiante
app.post("/estudiantes",(req,res)=>{
    const{nombre,programa,estado}=req.body;
    const db=readData();
    const longitud=db.estudiantes.length;
    const newId=longitud ? db.estudiantes[longitud-1].id + 1 : 1;
    const nuevoEstudiante={id:newId, nombre,programa,estado};
    
    db.estudiantes.push(nuevoEstudiante);
    writeDataBase(db);
    res.status(201).json(nuevoEstudiante);
});

//Metodo PUT para actualizar un estudiante ya creado
app.put("/estudiantes/:id",(req,res)=>{
    const id=parseInt(req.params.id);
    const {nombre,programa,estado}=req.body;
    const db=readData();

    const estudianteIndex =db.estudiantes.findIndex(est=>est.id === id);
    if(estudianteIndex !== -1){
        db.estudiantes[estudianteIndex]={id,nombre,programa,estado};
        writeDataBase(db);
        res.json(db.estudiantes[estudianteIndex]);

    }else{
        res.status(404).send("Estudiante No Actualizado");
    }


});




//Metodo PATCH para actualizar un estudiante ya creado pero solo un atributo
app.patch("/estudiantes/:id",(req,res)=>{
    const id=parseInt(req.params.id);
    const db=readData();

    const estudiante =db.estudiantes.find(est=>est.id === id);
    const estudianteNuevo =db.estudiantes.findIndex(est=>est.id === id);
    if(estudiante){
        estudiante.nombre =req.body.nombre||estudiante.nombre;
        estudiante.programa=req.body.programa||estudiante.programa;
        estudiante.estado=req.body.estado||estudiante.estado;

        writeDataBase(db);
        res.json(db.estudiantes[estudianteNuevo]);

    }else{
        res.status(404).send("Estudiante No Encontrado");
    }

});

//Metodo DELETE para eliminar un estudiante ya creado 
app.delete("/estudiantes/:id",(req,res)=>{
    const id=parseInt(req.params.id);
    const db=readData();

    const estudiante =db.estudiantes.find(est=>est.id === id);
    const estudianteIndex =db.estudiantes.findIndex(est=>est.id === id);

    if(estudianteIndex!==-1){
        db.estudiantes.splice(estudianteIndex,1);
        writeDataBase(db);
        res.status(204).send("Estudiante Eliminado");
        
    }else{
        res.status(404).send("Estudiante No Encontrado");
    }

});


app.listen(PORT,()=>{

    console.log("Conectado al Servidor");
});
