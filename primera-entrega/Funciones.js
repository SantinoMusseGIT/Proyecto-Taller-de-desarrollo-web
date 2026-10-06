/**
 * Valida el contenido ingresado por el usuario en el buscador.
 *
 * Comprueba que el campo no esté vacío, que tenga al menos
 * tres caracteres y que no esté compuesto solamente por números.
 * Si el valor no es válido, muestra un mensaje y limpia el campo.
 *
 * @method validarBusqueda
 * @return {boolean} Retorna true si el contenido es válido
 *                   y false si contiene un valor incorrecto.
 */
const validarBusqueda = () => {

    const campoBusqueda = document.getElementById("busqueda");
    const valorBusqueda = campoBusqueda.value.trim();

    // Comprobar si el campo está vacío
    if (valorBusqueda === "") {
        alert("Por favor, ingresá un producto, marca o auto para buscar.");
        campoBusqueda.value = "";
        return false;
    }

    // Comprobar que tenga al menos 3 caracteres
    if (valorBusqueda.length < 3) {
        alert("La búsqueda debe tener al menos 3 caracteres.");
        campoBusqueda.value = "";
        return false;
    }

    // Comprobar que no esté formado solamente por números
    if (!isNaN(valorBusqueda)) {
        alert("La búsqueda no puede estar formada solamente por números.");
        campoBusqueda.value = "";
        return false;
    }

    return true;
};


/**
 * Valida la búsqueda y envía el texto al catálogo.
 * @method realizarBusqueda
 * @return {void} No retorna ningún valor.
 */
const realizarBusqueda = () => {
    const campoBusqueda = document.getElementById("busqueda");
    const valorBusqueda = campoBusqueda.value.trim();

    if (!validarBusqueda()) {
        return;
    }

    const busquedaCodificada =
        encodeURIComponent(valorBusqueda);

    window.location.href =
        `catalogo.html?busqueda=${busquedaCodificada}`;
};

/**
 * Muestra en el encabezado la cantidad guardada en el carrito.
 * @method actualizarContadorGlobal
 * @return {void} No retorna ningún valor.
 */
const actualizarContadorGlobal = () => {
    const carritoGuardado =
        localStorage.getItem("escapeLibreCarrito");

    const carrito =
        carritoGuardado === null
            ? []
            : JSON.parse(carritoGuardado);

    const cantidad = carrito.reduce(
        (total, producto) =>
            total + producto.cantidad,
        0
    );

    const contador =
        document.getElementById("contador-carrito");

    if (contador !== null) {
        contador.textContent = cantidad;
    }
};