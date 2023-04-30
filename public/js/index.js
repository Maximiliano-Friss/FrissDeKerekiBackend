const socket = io();

//PRODUCTOS

const addToCartBtns = document.querySelectorAll(".addToCart-btn")
addToCartBtns.forEach(button => {
    button.addEventListener('click', event => {
        const productId = event.target.getAttribute('data-item');
        fetch('/api/ecommerce', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                item: productId
            })
        })
        .then(response => {
            console.log('Product Id enviado al server')
        })
        .catch(error => {
            console.log(error)
        });
    });
});


//MENSAJES

const schemaAuthor = new normalizr.schema.Entity('author', {}, {idAttribute:'email'})
const schemaSingleMessage = new normalizr.schema.Entity('singleMessage',{
    author: schemaAuthor
})
const schemaMessages = [schemaSingleMessage];

const form2 = document.getElementById('form2')

form2.addEventListener('submit', () => {
    const newMessage = {
        createdAt: (new Date()).toLocaleString('en-GB'),
        mensaje: document.getElementById('mensaje').value,
        author: {
            email: document.getElementById('email').value,
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            edad: document.getElementById('edad').value,
            alias: document.getElementById('alias').value,
            avatar: document.getElementById('avatar').value,
        }
    }
    socket.emit('newMessage', newMessage)
})

function renderMessages (data) {
    const denormObj = normalizr.denormalize(data.result, schemaMessages, data.entities)
    const htmlMsg = denormObj.map(element => {
        return(`
        <div class='mensaje-box'>
        <img src=${element.author.avatar} width=50>
        <p><span class='email'>${element.author.email}</span> <span class='date'>${element.createdAt}:</span> <span class='mensaje'>${element.mensaje}</span></p>
        </div>
        `)
    }).join('');
    document.getElementById('msg').innerHTML = htmlMsg
}

socket.on('totalMessages', function(data) {renderMessages(data);})
