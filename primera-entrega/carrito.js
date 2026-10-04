const CANTIDAD_MAXIMA = 99;
const PRECIO_ENVIO_CORDOBA = 8000;
const PRECIO_ENVIO_PAIS = 15000;

let envioActual = null;

/**
 * Convierte un número en un precio con formato argentino.
 * @method formatearPrecio
 * @param {number} valor - Monto en pesos que se quiere mostrar.
 * @return {string} Precio con símbolo $ y puntos como separador de miles.
 */
function formatearPrecio(valor) {
    return '$ ' + String(valor).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Lee la cantidad escrita en el campo de un producto.
 * @method obtenerCantidad
 * @param {string} id - Identificador del producto, por ejemplo "filtro".
 * @return {number} Cantidad ingresada, o 0 si el campo está vacío.
 */
function obtenerCantidad(id) {
    const valor = document.getElementById('cantidad-' + id).value;
    return valor === '' ? 0 : parseInt(valor, 10);
}

/**
 * Comprueba que la cantidad ingresada sea un entero entre 1 y el máximo.
 * Si no lo es, avisa con un alert y vacía el campo.
 * @method validarCantidad
 * @param {string} id - Identificador del producto, por ejemplo "filtro".
 * @return {boolean} true si la cantidad es válida, false si no lo es.
 */
function validarCantidad(id) {
    const campo = document.getElementById('cantidad-' + id);
    const valor = campo.value.trim();
    const cantidad = parseInt(valor, 10);

    if (!/^\d+$/.test(valor) || cantidad < 1 || cantidad > CANTIDAD_MAXIMA) {
        alert('Ingresá una cantidad válida: un número entero entre 1 y ' + CANTIDAD_MAXIMA + '.');
        campo.value = '';
        actualizarCarrito();
        return false;
    }

    campo.value = cantidad;
    actualizarCarrito();
    return true;
}

/**
 * Suma o resta unidades a un producto con los botones + y -.
 * @method cambiarCantidad
 * @param {string} id - Identificador del producto, por ejemplo "filtro".
 * @param {number} cambio - Unidades a sumar (1) o restar (-1).
 * @return {void} No devuelve ningún valor.
 */
function cambiarCantidad(id, cambio) {
    const nuevaCantidad = obtenerCantidad(id) + cambio;

    if (nuevaCantidad < 1) {
        return;
    }
    if (nuevaCantidad > CANTIDAD_MAXIMA) {
        alert('La cantidad máxima por producto es ' + CANTIDAD_MAXIMA + '.');
        return;
    }

    document.getElementById('cantidad-' + id).value = nuevaCantidad;
    actualizarCarrito();
}

/**
 * Calcula el subtotal multiplicando el precio de cada producto por su cantidad.
 * @method calcularSubtotal
 * @return {number} Subtotal del carrito en pesos.
 */
function calcularSubtotal() {
    const productos = document.querySelectorAll('.producto-carrito');
    let subtotal = 0;

    productos.forEach(function (producto) {
        const id = producto.id.replace('item-', '');
        subtotal += Number(producto.dataset.precio) * obtenerCantidad(id);
    });

    return subtotal;
}

/**
 * Cuenta el total de unidades que hay en el carrito.
 * @method contarUnidades
 * @return {number} Cantidad total de unidades.
 */
function contarUnidades() {
    const productos = document.querySelectorAll('.producto-carrito');
    let unidades = 0;

    productos.forEach(function (producto) {
        unidades += obtenerCantidad(producto.id.replace('item-', ''));
    });

    return unidades;
}

/**
 * Indica si algún producto tiene el campo de cantidad vacío.
 * @method hayCantidadesVacias
 * @return {boolean} true si hay al menos un campo vacío.
 */
function hayCantidadesVacias() {
    const productos = document.querySelectorAll('.producto-carrito');

    return Array.from(productos).some(function (producto) {
        return obtenerCantidad(producto.id.replace('item-', '')) === 0;
    });
}

/**
 * Actualiza en pantalla el título, el contador, el subtotal, el envío y el total.
 * @method actualizarCarrito
 * @return {void} No devuelve ningún valor.
 */
function actualizarCarrito() {
    const unidades = contarUnidades();
    const subtotal = calcularSubtotal();
    const costoEnvio = envioActual === null ? 0 : envioActual;
    const hayProductos = document.querySelectorAll('.producto-carrito').length > 0;
    const textoUnidades = unidades === 1 ? ' producto)' : ' productos)';

    document.getElementById('titulo-carrito').textContent = 'Mi carrito (' + unidades + textoUnidades;
    document.getElementById('contador-carrito').textContent = unidades;
    document.getElementById('subtotal').textContent = formatearPrecio(subtotal);
    document.getElementById('envio').textContent = envioActual === null ? 'A calcular' : formatearPrecio(envioActual);
    document.getElementById('total').textContent = formatearPrecio(subtotal + costoEnvio);
    document.getElementById('carrito-vacio').classList.toggle('oculto', hayProductos);
    document.getElementById('resumen').classList.toggle('oculto', !hayProductos);
}

/**
 * Quita un producto del carrito después de pedir confirmación.
 * @method eliminarProducto
 * @param {string} id - Identificador del producto, por ejemplo "filtro".
 * @return {void} No devuelve ningún valor.
 */
function eliminarProducto(id) {
    const producto = document.getElementById('item-' + id);

    if (producto && confirm('¿Querés quitar este producto del carrito?')) {
        producto.remove();
        actualizarCarrito();
    }
}

/**
 * Valida el código postal y calcula el costo de envío.
 * Si no son 4 números, avisa con un alert y vacía el campo.
 * @method calcularEnvio
 * @return {boolean} true si el código postal es válido, false si no lo es.
 */
function calcularEnvio() {
    const campo = document.getElementById('codigo-postal');
    const codigo = campo.value.trim();

    if (!/^\d{4}$/.test(codigo)) {
        alert('Ingresá un código postal válido de 4 números.');
        campo.value = '';
        envioActual = null;
        actualizarCarrito();
        return false;
    }

    envioActual = codigo.charAt(0) === '5' ? PRECIO_ENVIO_CORDOBA : PRECIO_ENVIO_PAIS;
    actualizarCarrito();
    return true;
}

/**
 * Verifica que el carrito esté listo y confirma la compra.
 * @method finalizarCompra
 * @return {void} No devuelve ningún valor.
 */
function finalizarCompra() {
    if (hayCantidadesVacias()) {
        alert('Revisá las cantidades: hay productos sin cantidad.');
        return;
    }
    if (calcularSubtotal() === 0) {
        alert('Tu carrito está vacío.');
        return;
    }
    if (envioActual === null) {
        alert('Calculá el envío con tu código postal antes de finalizar la compra.');
        document.getElementById('codigo-postal').focus();
        return;
    }

    alert('¡Gracias por tu compra! Total a pagar: ' + formatearPrecio(calcularSubtotal() + envioActual));
}
