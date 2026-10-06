const CLAVE_CARRITO = "escapeLibreCarrito";
const CANTIDAD_MAXIMA = 99;

let envioActual = null;

/**
 * Obtiene los productos guardados en el carrito.
 * @method obtenerCarrito
 * @return {Array} Lista de productos almacenados.
 */
const obtenerCarrito = () => {
    const carritoGuardado = localStorage.getItem(CLAVE_CARRITO);

    if (carritoGuardado === null) {
        return [];
    }

    return JSON.parse(carritoGuardado);
};

/**
 * Guarda la lista de productos del carrito.
 * @method guardarCarrito
 * @param {Array} carrito - Productos que deben almacenarse.
 * @return {void}
 */
const guardarCarrito = (carrito) => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
};

/**
 * Genera el HTML correspondiente a un producto del carrito.
 * @method crearTarjetaProducto
 * @param {Object} producto - Producto que debe mostrarse.
 * @return {string} Estructura HTML de la tarjeta.
 */
const crearTarjetaProducto = (producto) => {
    return `
        <article
            class="producto-carrito"
            id="item-${producto.id}"
            data-precio="${producto.precio}"
        >
            <img
                src="${producto.imagen}"
                alt="${producto.nombre}"
            >

            <div class="producto-datos">
                <h3>${producto.nombre}</h3>
                <p class="producto-precio">
                    $ ${producto.precio.toLocaleString("es-AR")}
                </p>
            </div>

            <div class="cantidad">
                <button
                    type="button"
                    onclick="cambiarCantidad('${producto.id}', -1)"
                    aria-label="Restar una unidad de ${producto.nombre}"
                >
                    -
                </button>

                <label
                    class="solo-lectores"
                    for="cantidad-${producto.id}"
                >
                    Cantidad de ${producto.nombre}
                </label>

                <input
                    type="text"
                    id="cantidad-${producto.id}"
                    value="${producto.cantidad}"
                    size="2"
                    maxlength="2"
                    inputmode="numeric"
                    onchange="validarCantidad('${producto.id}')"
                >

                <button
                    type="button"
                    onclick="cambiarCantidad('${producto.id}', 1)"
                    aria-label="Sumar una unidad de ${producto.nombre}"
                >
                    +
                </button>
            </div>

            <button
                type="button"
                class="eliminar"
                onclick="eliminarProducto('${producto.id}')"
                aria-label="Eliminar ${producto.nombre} del carrito"
            >
                Eliminar
            </button>
        </article>
    `;
};

/**
 * Muestra en la página los productos guardados.
 * @method mostrarProductos
 * @param {Array} carrito - Productos que deben mostrarse.
 * @return {void}
 */
const mostrarProductos = (carrito) => {
    const listaProductos = document.getElementById("lista-productos");
    const mensajeCarritoVacio = document.getElementById("carrito-vacio");

    listaProductos
        .querySelectorAll(".producto-carrito")
        .forEach((tarjeta) => tarjeta.remove());

    carrito.forEach((producto) => {
        mensajeCarritoVacio.insertAdjacentHTML(
            "beforebegin",
            crearTarjetaProducto(producto)
        );
    });
};

/**
 * Calcula el subtotal de los productos guardados.
 * @method calcularSubtotal
 * @param {Array} carrito - Productos incluidos en el cálculo.
 * @return {number} Subtotal del carrito en pesos.
 */
const calcularSubtotal = (carrito) => {
    return carrito.reduce(
        (total, producto) =>
            total + producto.precio * producto.cantidad,
        0
    );
};

/**
 * Cuenta la cantidad total de unidades.
 * @method contarUnidades
 * @param {Array} carrito - Productos incluidos en el cálculo.
 * @return {number} Cantidad total de unidades.
 */
const contarUnidades = (carrito) => {
    return carrito.reduce(
        (total, producto) => total + producto.cantidad,
        0
    );
};

/**
 * Actualiza productos, contador, subtotal, envío y total.
 * @method actualizarCarrito
 * @return {void}
 */
const actualizarCarrito = () => {
    const carrito = obtenerCarrito();
    const unidades = contarUnidades(carrito);
    const subtotal = calcularSubtotal(carrito);
    const costoEnvio = envioActual === null ? 0 : envioActual;

    mostrarProductos(carrito);

    const palabraProducto =
        unidades === 1 ? "producto" : "productos";

    document.getElementById("titulo-carrito").textContent =
        `Mi carrito (${unidades} ${palabraProducto})`;

    document.getElementById("contador-carrito").textContent =
        unidades;

    document.getElementById("subtotal").textContent =
        `$ ${subtotal.toLocaleString("es-AR")}`;

    document.getElementById("total").textContent =
        `$ ${(subtotal + costoEnvio).toLocaleString("es-AR")}`;

    const mensajeCarritoVacio =
        document.getElementById("carrito-vacio");
    const resumen = document.getElementById("resumen");

    if (carrito.length === 0) {
        mensajeCarritoVacio.classList.remove("oculto");
        resumen.classList.add("oculto");
    } else {
        mensajeCarritoVacio.classList.add("oculto");
        resumen.classList.remove("oculto");
    }

    document.getElementById("envio").textContent =
        envioActual === null
            ? "A calcular"
            : `$ ${envioActual.toLocaleString("es-AR")}`;
};

/**
 * Valida la cantidad escrita para un producto.
 * @method validarCantidad
 * @param {string} id - Identificador del producto.
 * @return {void}
 */
const validarCantidad = (id) => {
    const campo = document.getElementById(`cantidad-${id}`);
    const cantidad = Number(campo.value);
    const esNumeroLimpio = String(cantidad) === campo.value;

    if (
        !esNumeroLimpio ||
        cantidad < 1 ||
        cantidad > CANTIDAD_MAXIMA ||
        cantidad % 1 !== 0
    ) {
        alert(
            `Ingresá una cantidad válida entre 1 y ${CANTIDAD_MAXIMA}.`
        );
        campo.value = "";
        return;
    }

    const carrito = obtenerCarrito();
    const producto = carrito.find(
        (elemento) => elemento.id === id
    );

    producto.cantidad = cantidad;
    guardarCarrito(carrito);
    actualizarCarrito();
};

/**
 * Suma o resta una unidad a un producto.
 * @method cambiarCantidad
 * @param {string} id - Identificador del producto.
 * @param {number} cambio - Cantidad que se suma o resta.
 * @return {void}
 */
const cambiarCantidad = (id, cambio) => {
    const carrito = obtenerCarrito();
    const producto = carrito.find(
        (elemento) => elemento.id === id
    );

    const nuevaCantidad = producto.cantidad + cambio;

    if (
        nuevaCantidad >= 1 &&
        nuevaCantidad <= CANTIDAD_MAXIMA
    ) {
        producto.cantidad = nuevaCantidad;
        guardarCarrito(carrito);
        actualizarCarrito();
    }
};

/**
 * Elimina un producto del carrito.
 * @method eliminarProducto
 * @param {string} id - Identificador del producto.
 * @return {void}
 */
const eliminarProducto = (id) => {
    if (confirm("¿Querés quitar este producto del carrito?")) {
        const carrito = obtenerCarrito().filter(
            (producto) => producto.id !== id
        );

        guardarCarrito(carrito);
        actualizarCarrito();
    }
};

/**
 * Valida el código postal y calcula el costo de envío.
 * @method calcularEnvio
 * @return {void}
 */
const calcularEnvio = () => {
    const campo = document.getElementById("codigo-postal");
    const codigo = campo.value;
    const numero = Number(codigo);

    const esValido =
        codigo.length === 4 &&
        String(numero) === codigo &&
        numero >= 1000;

    if (!esValido) {
        alert("Ingresá un código postal válido de 4 números.");
        campo.value = "";
        envioActual = null;
    } else if (codigo[0] === "5") {
        envioActual = 8000;
    } else {
        envioActual = 15000;
    }

    actualizarCarrito();
};

/**
 * Comprueba el carrito y confirma la compra.
 * @method finalizarCompra
 * @return {void}
 */
const finalizarCompra = () => {
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    if (envioActual === null) {
        alert(
            "Calculá el envío antes de finalizar la compra."
        );
        return;
    }

    const total = calcularSubtotal(carrito) + envioActual;

    alert(
        `¡Gracias por tu compra! Total a pagar: $ ${total.toLocaleString("es-AR")}`
    );
};