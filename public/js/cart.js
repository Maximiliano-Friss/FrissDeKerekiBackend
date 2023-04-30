const socket = io();

const userEmail = document.getElementById('userEmail').value;

socket.emit('userEmail', userEmail);

function renderCart (data) {
    const htmlList = data.map(prod => {
        return(`
        <tr>
        <td>${prod.nombre}</td>
        <td>${prod.precio}</td>
        <td><img src="${prod.foto}" width="200px" alt="Icono ${prod.nombre}"></td>
        <td>${prod.cantidad}</td>
        <td><button class="btn removeFromCart-btn btn-warning" data-id="${prod.id}">Eliminar una unidad</button></td>
        </tr>
        `)
    }).join('')
    const htmlTable = 
        `
            <table class="table table-success" id="table2">
                <tr class="h3"> <th>Nombre</th> <th>Precio</th> <th>Foto</th> <th>Cantidad</th> <th></th> </tr>
                ${htmlList}
            </table>
        `
    document.getElementById('prodList').innerHTML = htmlTable

    const removeFromCartBtns = document.querySelectorAll(".removeFromCart-btn")
    removeFromCartBtns.forEach(button => {
        button.addEventListener('click', event => {
            const prodId = event.target.getAttribute('data-id');
            socket.emit('removedProduct', prodId)
        });
    });
}

socket.on('productsInCart', function(data) {
    renderCart(data)
})

function emptyCart () {
    document.getElementById('prodList').innerHTML = `<h2>Compra realizada con éxito!</h2>`
    document.getElementById('btn-container').innerHTML = `
    <input type="button" class='btn btn-warning' onclick="location.href='/api/ecommerce';" value="Volver al inicio" />`
}

socket.on('emptyCart', function(data) {
    emptyCart()
})

const makeOrderBtn = document.getElementById("makeOrder-btn")

makeOrderBtn.addEventListener('click', () => {
    document.getElementById("loading-gif").hidden = false
    socket.emit('newOrder')
})