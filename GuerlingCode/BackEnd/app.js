const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port =  process.env.PORT || 3030;

const mongodbURI = process.env.MONGODB_URI; 
const dbName = 'guerling';

const client = new MongoClient(mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
let db;

// Mueve la lógica de conexión a una función asíncrona
async function connectToDb() {
    try {
        await client.connect();
        console.log("Conectado a la base de datos.");
        db = client.db(dbName);
    } catch (err) {
        console.error('Error al conectar con MongoDB:', err);
    }
}

async function init() {
    await connectToDb();
    
    app.set("view engine", "ejs");  //Establece ejs como el motor de plantillas para renderizar las vistas.
    app.set("views", __dirname + "/FrontEnd/views"); //Define la ubicación del directorio de vistas. __dirname es una variable global en Node.js que obtiene el directorio del módulo actual.
    
    app.use(express.static(__dirname + '/FrontEnd'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get('/', (req, res) => { //cuando alguien acceda a la pagina inicial, se devolvera el index.html desde el servidor
        res.sendFile(__dirname + '/../frontend/index.html');
    });

    app.get("/seleccionCategoria", (req, res) => {
        res.render("seleccionCategoria");
    });

    app.get('/juego/:cat', (req, res) => { //estamos definiendo una ruta GET con un parámetro denominado :cat. Este parámetro es dinámico, lo que significa que puede tomar cualquier valor
        const categoria = decodeURIComponent(req.params.cat);
        console.log("Categoría seleccionada:", categoria);
        getPalabraCat(categoria)
            .then(doc => {
                // Verifica si doc existe y si tiene una propiedad 'palabra'
                if (!doc || !doc.palabra) {
                    console.error('Documento no encontrado o no tiene propiedad "palabra":', doc);
                    res.status(404).send('No se encontró un documento válido para la categoría seleccionada.');
                    return;
                }
                res.render('jugar', { documento: doc }); //Si todo está en orden, utilizamos la función res.render para renderizar la vista del juego (jugar.ejs) y le pasamos el documento que contiene la palabra y su descripción
            })
            .catch(error => {
                console.error('Error en la función principal:', error);
                res.status(500).send('Hubo un error al procesar tu solicitud.');  // Añadir una respuesta al cliente
            });
    });

    async function getPalabraCat(categoria) {
        try {
            const collection = db.collection(categoria);
            const resp = await collection.aggregate([{ $sample: { size: 1 } }]).toArray();
            
            // Agrega esta línea para ver el resultado
            console.log(resp);
            
            return resp[0];
        } catch (error) {
            console.error('Error al obtener los documentos:', error);
            throw error;
        }
    }

    app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`);
    });
}

init();
