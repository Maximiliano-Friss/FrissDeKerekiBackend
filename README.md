# ECOMMERCE

> INTRO

Para el proyecto final del curso de **Backend de Coderhouse**, se implementa un servidor de una aplicación ecommerce de venta de instrumentos musicales basado en *Node.js* y *Express*.

El proyecto cuenta con dos API en la que se aplican diferentes herramientas. Las variables de entorno requeridas se ejemplifican en el archivo "**.env.example**".

El deploy del sitio se realizó en Railway:

https://frissdekerekibackend-production.up.railway.app/

En el proyecto existen cuatro tipos de bases de datos definidas con patrones de repositorio y para las cuales se emplean diferentes métodos de persistencia.

- **CARRITOS**
    MongoDB

- **USUARIOS**
    MongoDB

- **MENSAJES**
    Firebase

- **PRODUCTOS** 
    En este caso se proveen diferentes opciones según el valor de la variable NODE_ENV. Esta se define según el script que se ejecute en la línea de comandos.
    1. MongoDB - (npm run start)
    2. Firebase - (npm run prod2)
    3. Archivos (FileSystem) - (npm run dev)

---

>**API PRODUCTOS**

Puede accederse a través de la ruta "**/api/productos**".
En ella es posible interactuar con la base de datos seleccionada de PRODUCTOS aplicando las cuatro operaciones básicas de CRUD. Se indican a continuación los endpoints disponibles con sus respectivas rutas, los cuales fueron probados con el software Insomnia:

***OBTENER TODOS LOS PRODUCTOS***
GET - '/'

***OBTENER TODOS LOS PRODUCTOS SEGÚN CATEGORÍA (DEFINIDO POR QUERY PARAMS)***
GET - '?categoria'

***OBTENER PRODUCTO POR ID (DEFINIDO POR PARAMS)***
GET - '/:id'

***AGREGAR NUEVO PRODUCTO***
POST - '/'
Se incluye un objeto ejemplo en formato JSON para indicar las propiedades con las que debe contar cada producto agregado:
```
{
  "nombre": "Instrumento",
  "precio": "1000",
  "foto": "https://www.sitioweb.com/fotoInstrumento.jpg",
  "categoria": "percusion",
  "descripcion": "Para tocar canción ejemplo de intérprete ejemplo"
}
```

***ACTUALIZAR PRODUCTO POR ID (DEFINIDO EN PARAMS)***
PUT - '/:id'

***ELIMINAR PRODUCTO POR ID (DEFINIDO EN PARAMS)***
DELETE - '/:id'

---
>**API ECOMMERCE**

Puede accederse a través de la ruta "**/api/ecommerce**".
Esta API se complementa con un Frontend desarrollando las vistas con la librería de *Handlebars*. Se emplea *Bootstrap* como framework para complementar los estilos.

***AUTHENTICATION***
Se implementa un sistema de autenticación basado en passport-local con rutas de '/login' y '/register'.
Las sesiones del usuario se crean con la librería *express-session* y se alojan en una base de datos de MongoDB.
La sesión tiene un tiempo de vida de 10 minutos (recargable con cada petición) y se destruye con el logout. 

***INICIO***
En la ruta '/', una vez se haya autenticado el usuario, puede accederse a un listado de PRODUCTOS y a un chat con su listado de MENSAJES realizado con *websockets*. Los mensajes se envían normalizados desde el Servidor hacia el cliente (y viceversa) con la librería *Normalizr*

***PROFILE***
En la ruta '/profile' puede visualizarse la información del usuario.

***CART***
En la ruta '/cart' se despliega (por websockets) el CARRITO del usuario con los productos que haya incluido en el listado de productos, botones para reducir en 1 la unidad de un determinado producto, y un botón para finalizar la orden. Al accionar este último, el carrito se vacía y, mediante la librería *Nodemailer*, la cuenta definida en la variable MAIL_ADDRESS recibe la información de la orden. Además, mediante la librería *Twilio* se envían mensajes de texto y whatsapp al número definido en ADMIN_PHONE (por tratarse de una cuenta gratis de *Twilio*)

***LOGOUT***
Si se acciona el botón "Cerrar sesión", el sitio destruye la sesión activa y redirige a la ruta '/logout', la cual despide al usuario durante dos segundos antes de retornar a la ruta '/login'.

