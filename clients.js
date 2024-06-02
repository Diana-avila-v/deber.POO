class Cliente {
    static nextId = 1;
    constructor(nombre, apellido, dni, tipo) {
        this.id = Cliente.nextId++; // Asignar el siguiente ID y luego incrementar el contador
        this.nombre = nombre;
        this.apellido = apellido;
        this.dni = dni;
        this.tipo = tipo; // Agregar el tipo de cliente (Regular o VIP)
    }
}

class ClienteManager {
    constructor() {
        this.clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    }

    agregarCliente(cliente) {
        this.clientes.push(cliente);
        localStorage.setItem('clientes', JSON.stringify(this.clientes));
    }

    obtenerClientes() {
        return this.clientes;
    }
}

function handleSubmit(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const dni = document.getElementById('dni').value;

    if (nombre.trim() === '' || apellido.trim() === '' || dni.trim() === '') {
        alert('Por favor, complete todos los campos.');
        return;
    }

    const letrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/; // Expresión regular para validar solo letras y espacios
    if (!letrasRegex.test(nombre) || !letrasRegex.test(apellido)) {
        alert('Por favor, ingrese solo letras en los campos de nombre y apellido.');
        return;
    }
    // Validar que la cédula comience con "09"
    if (!dni.startsWith('09') || dni.length !== 10) {
        alert('Por favor, ingrese una cédula válida que comience con "09" y tenga 10 dígitos.');
        return;
    }
    // Obtener clientes del localStorage
    let clientes = JSON.parse(localStorage.getItem('clientes')) || [];

    // Validar que no exista otro cliente con la misma cédula
    const clienteExistente = clientes.find(cliente => cliente.dni === dni);
    if (clienteExistente) {
        alert('Ya existe un cliente con la misma cédula.');
        return;
    }

    // Determinar si el cliente es Regular o VIP
    const tipoCliente = document.getElementById('tipo-cliente').value;

    // Confirmar antes de guardar los cambios
    const confirmacion = confirm('¿Está seguro de guardar los cambios?');
    if (!confirmacion) {
        return;
    }
    // Crear el objeto cliente con el tipo correspondiente
    const nuevoCliente = new Cliente(nombre, apellido, dni, tipoCliente);
    clienteManager.agregarCliente(nuevoCliente);
    formCliente.reset();
    mostrarClientes();
    alert('Cliente agregado exitosamente.');
}

// Función para mostrar el modal de edición
function mostrarModalEditar(cliente) {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';

    // Mostrar los datos del cliente en el formulario de edición
    document.getElementById('nombre-editar').value = cliente.nombre;
    document.getElementById('apellido-editar').value = cliente.apellido;
    document.getElementById('dni-editar').value = cliente.dni;
    
    // Agregar evento al botón de guardar cambios
    const formEditarCliente = document.getElementById('form-editar-cliente');
    formEditarCliente.addEventListener('submit', (event) => {
        event.preventDefault();

        // Recopilar los datos actualizados del formulario
        const nombre = document.getElementById('nombre-editar').value;
        const apellido = document.getElementById('apellido-editar').value;
        const dni = document.getElementById('dni-editar').value;

        // Validar que el nombre y el apellido no estén vacíos
        if (nombre.trim() === '' || apellido.trim() === '') {
            alert('Por favor, complete los campos de nombre y apellido.');
            return;
        }

        // Validar que el nombre y el apellido contengan solo letras
        const letrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/; // Expresión regular para validar solo letras y espacios
        if (!letrasRegex.test(nombre) || !letrasRegex.test(apellido)) {
            alert('Por favor, ingrese solo letras en los campos de nombre y apellido.');
            return;
        }

        // Validar que la cédula tenga 10 dígitos y comience con "09"
        if (dni.length !== 10 || !dni.startsWith('09')) {
            alert('Por favor, ingrese una cédula válida que comience con "09" y tenga 10 dígitos.');
            return;
        }

        // Verificar que no exista otro cliente con la misma cédula
        const clientes = clienteManager.obtenerClientes();
        const clienteExistente = clientes.find(c => c.dni === dni && c.dni !== cliente.dni); // Excluir al cliente actual
        if (clienteExistente) {
            alert('Ya existe un cliente con la misma cédula.');
            return;
        }
         // Confirmar antes de guardar los cambios
         const confirmacion = confirm('¿Está seguro de guardar los cambios?');
         if (!confirmacion) {
             return;
         } 

        // Encontrar el cliente correspondiente en la lista de clientes
        const clienteActualizado = clientes.find(c => c.dni === cliente.dni);
        // Actualizar los datos del cliente
        clienteActualizado.nombre = nombre;
        clienteActualizado.apellido = apellido;
        clienteActualizado.dni = dni;
        // Actualizar la lista de clientes en el almacenamiento local
        localStorage.setItem('clientes', JSON.stringify(clientes));
        // Cerrar el modal después de guardar los cambios
        modal.style.display = 'none';
        // Volver a mostrar la lista de clientes con los cambios actualizados
        mostrarClientes();
        // Mostrar un mensaje de éxito
        alert('Cambios guardados exitosamente.');
    });

    // Agregar evento al botón de cerrar el modal
    const closeButton = document.querySelector('.close');
    closeButton.addEventListener('click', cerrarModal);
}

// Función para cerrar el modal al hacer clic en la 'x'
function cerrarModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// Función para eliminar un cliente con confirmación
function eliminarCliente(cliente) {
    // Mostrar mensaje de confirmación
    const confirmacion = confirm(`¿Estás seguro de eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`);
    
    // Si el usuario confirma la eliminación
    if (confirmacion) {
        // Encontrar el índice del cliente en la lista de clientes
        const indice = clienteManager.obtenerClientes().findIndex(c => c.dni === cliente.dni);
        if (indice !== -1) {
            // Eliminar el cliente de la lista
            clienteManager.obtenerClientes().splice(indice, 1);
            // Actualizar la lista de clientes en el almacenamiento local
            localStorage.setItem('clientes', JSON.stringify(clienteManager.obtenerClientes()));
            // Volver a mostrar la lista de clientes con el cliente eliminado
            mostrarClientes();
            // Mostrar un mensaje de éxito
            alert('Cliente eliminado exitosamente.');
        } else {
            // Si no se encuentra el cliente, mostrar un mensaje de error
            alert('Error: Cliente no encontrado.');
        }
    }
}

// Función para mostrar los clientes con botón de editar
function mostrarClientes() {
    const listaClientes = document.getElementById('lista-clientes');
    listaClientes.innerHTML = '';

    clienteManager.obtenerClientes().forEach(cliente => {
        const div = document.createElement('div');
        div.classList.add('cliente-item');
        
        const span = document.createElement('span');
        span.textContent = `ID: ${cliente.id} - ${cliente.nombre} ${cliente.apellido} - DNI: ${cliente.dni} - Tipo: ${cliente.tipo}`;
        div.appendChild(span);

        // Botón de editar
        const editarButton = document.createElement('button');
        editarButton.textContent = 'Editar';
        editarButton.classList.add('Editar'); // Agregar la clase 'Editar'
        editarButton.addEventListener('click', () => mostrarModalEditar(cliente)); // Llamar a la función mostrarModalEditar
        div.appendChild(editarButton);

        // Botón de eliminar
        const eliminarButton = document.createElement('button');
        eliminarButton.textContent = 'Eliminar';
        eliminarButton.classList.add('Eliminar'); // Agregar la clase 'Eliminar'
        eliminarButton.addEventListener('click', () => eliminarCliente(cliente));
        div.appendChild(eliminarButton);

        listaClientes.appendChild(div);
    });
}
const clienteManager = new ClienteManager();
const formCliente = document.getElementById('form-ingresar-cliente');
formCliente.addEventListener('submit', handleSubmit);

mostrarClientes();





// // Función para manejar el envío del formulario
// function handleSubmit(event) {
//     event.preventDefault(); // Evitar el envío del formulario por defecto

//     // Obtener los valores ingresados por el usuario
//     const nombre = document.getElementById('nombre').value;
//     const apellido = document.getElementById('apellido').value;
//     const dni = document.getElementById('dni').value;

//     // Validar que se ingresen valores en todos los campos
//     if (nombre.trim() === '' || apellido.trim() === '' || dni.trim() === '') {
//         // Mostrar un mensaje de error si algún campo está vacío
//         alert('Por favor, complete todos los campos.');
//         return; // Salir de la función si hay campos vacíos
//     }

//     // Crear un objeto cliente con los datos ingresados
//     const cliente = {
//         nombre: nombre,
//         apellido: apellido,
//         dni: dni
//     };

//     // Obtener el arreglo de clientes del almacenamiento local (si existe)
//     let clientes = JSON.parse(localStorage.getItem('clientes')) || [];

//     // Agregar el nuevo cliente al arreglo
//     clientes.push(cliente);

//     // Guardar el arreglo actualizado en el almacenamiento local
//     localStorage.setItem('clientes', JSON.stringify(clientes));

//     // Limpiar el formulario después de guardar el cliente
//     formCliente.reset();

//     // Mostrar el listado actualizado de clientes
//     mostrarClientes();

//     // Opcional: Mostrar un mensaje de éxito al usuario
//     alert('Cliente agregado exitosamente.');
// }

// // Función para mostrar el listado de clientes
// function mostrarClientes() {
//     // Obtener el elemento ul donde se mostrarán los clientes
//     const listaClientes = document.getElementById('lista-clientes');

//     // Obtener los clientes del localStorage
//     const clientes = JSON.parse(localStorage.getItem('clientes')) || [];

//     // Limpiar la lista antes de agregar los clientes
//     listaClientes.innerHTML = '';

//     // Recorrer la lista de clientes y agregar cada uno como un elemento de lista
//     clientes.forEach(cliente => {
//         const li = document.createElement('li');
//         li.textContent = `${cliente.nombre} ${cliente.apellido} - DNI: ${cliente.dni}`;
//         listaClientes.appendChild(li);
//     });
// }

// // Llamar a la función para mostrar los clientes al cargar la página
// mostrarClientes();

// // Agregar un event listener al formulario para manejar su envío
// const formCliente = document.getElementById('form-ingresar-cliente');
// formCliente.addEventListener('submit', handleSubmit);