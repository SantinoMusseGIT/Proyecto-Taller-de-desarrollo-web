const PRECIO_FILTRO = 120000;
const PRECIO_DOWNPIPE = 750000;
const PRECIO_DISCOS = 600000;
const CANTIDAD_MAXIMA = 99;

let envioActual = null;
let productosEnCarrito = 3;

/**
 * Lee la cantidad escrita en el campo de un producto.
 * @method obtenerCantidad
 * @param {string} id - Nombre del producto: filtro, downpipe o discos.
 * @return {number} Cantidad ingresada (0 si el campo está vacío).
 */
const obtenerCantidad = (id) => {
    return Number(document.getElementById('cantidad-' + id).value);
};

/**
 * Calcula el subtotal sumando precio por cantidad de cada producto.
 * @method calcularSubtotal
 * @return {number} Subtotal del carrito en pesos.
 */
const calcularSubtotal = () => {
    const totalFiltro = obtenerCantidad('filtro') * PRECIO_FILTRO;
    const totalDownpipe = obtenerCantidad('downpipe') * PRECIO_DOWNPIPE;
    const totalDiscos = obtenerCantidad('discos') * PRECIO_DISCOS;
    return totalFiltro + totalDownpipe + totalDiscos;
};

/**
 * Cuenta cuántas unidades hay en total en el carrito.
 * @method contarUnidades
 * @return {number} Cantidad total de unidades.
 */
const contarUnidades = () => {
    return obtenerCantidad('filtro') + obtenerCantidad('downpipe') + obtenerCantidad('discos');
};

/**
 * Muestra en pantalla el título, el contador, el subtotal, el envío y el total.
 * @method actualizarCarrito
 * @return {void}
 */
const actualizarCarrito = () => {
    const unidades = contarUnidades();
    const subtotal = calcularSubtotal();
    let costoEnvio = 0;

    if (envioActual !== null) {
        costoEnvio = envioActual;
        document.getElementById('envio').textContent = '$ ' + envioActual.toLocaleString('es-AR');
    } else {
        document.getElementById('envio').textContent = 'A calcular';
    }

    if (unidades === 1) {
        document.getElementById('titulo-carrito').textContent = 'Mi carrito (1 producto)';
    } else {
        document.getElementById('titulo-carrito').textContent = 'Mi carrito (' + unidades + ' productos)';
    }

    document.getElementById('contador-carrito').textContent = unidades;
    document.getElementById('subtotal').textContent = '$ ' + subtotal.toLocaleString('es-AR');
    document.getElementById('total').textContent = '$ ' + (subtotal + costoEnvio).toLocaleString('es-AR');

    if (productosEnCarrito === 0) {
        document.getElementById('carrito-vacio').classList.remove('oculto');
        document.getElementById('resumen').classList.add('oculto');
    }
};

/**
 * Comprueba que la cantidad sea un número entero entre 1 y 99.
 * Si no lo es, avisa con un alert y vacía el campo.
 * @method validarCantidad
 * @param {string} id - Nombre del producto: filtro, downpipe o discos.
 * @return {void}
 */
const validarCantidad = (id) => {
    const campo = document.getElementById('cantidad-' + id);
    const cantidad = Number(campo.value);
    const esNumeroLimpio = String(cantidad) === campo.value;

    if (!esNumeroLimpio || cantidad < 1 || cantidad > CANTIDAD_MAXIMA || cantidad % 1 !== 0) {
        alert('Ingresá una cantidad válida: un número entero entre 1 y ' + CANTIDAD_MAXIMA + '.');
        campo.value = '';
    }

    actualizarCarrito();
};

/**
 * Suma o resta una unidad a un producto con los botones + y -.
 * @method cambiarCantidad
 * @param {string} id - Nombre del producto: filtro, downpipe o discos.
 * @param {number} cambio - 1 para sumar, -1 para restar.
 * @return {void}
 */
const cambiarCantidad = (id, cambio) => {
    const nuevaCantidad = obtenerCantidad(id) + cambio;

    if (nuevaCantidad >= 1 && nuevaCantidad <= CANTIDAD_MAXIMA) {
        document.getElementById('cantidad-' + id).value = nuevaCantidad;
        actualizarCarrito();
    }
};

/**
 * Quita un producto del carrito si el usuario confirma.
 * @method eliminarProducto
 * @param {string} id - Nombre del producto: filtro, downpipe o discos.
 * @return {void}
 */
const eliminarProducto = (id) => {
    if (confirm('¿Querés quitar este producto del carrito?')) {
        document.getElementById('cantidad-' + id).value = 0;
        document.getElementById('item-' + id).classList.add('oculto');
        productosEnCarrito = productosEnCarrito - 1;
        actualizarCarrito();
    }
};

/**
 * Valida el código postal (4 números, de 1000 a 9999) y calcula el costo de envío.
 * Si no es válido, avisa con un alert y vacía el campo.
 * @method calcularEnvio
 * @return {void}
 */
const calcularEnvio = () => {
    const campo = document.getElementById('codigo-postal');
    const codigo = campo.value;
    const numero = Number(codigo);
    const esValido = codigo.length === 4 && String(numero) === codigo && numero >= 1000;

    if (!esValido) {
        alert('Ingresá un código postal válido de 4 números.');
        campo.value = '';
        envioActual = null;
    } else if (codigo[0] === '5') {
        envioActual = 8000;
    } else {
        envioActual = 15000;
    }

    actualizarCarrito();
};

/**
 * Revisa que el carrito tenga productos y el envío calculado, y confirma la compra.
 * @method finalizarCompra
 * @return {void}
 */
const finalizarCompra = () => {
    if (contarUnidades() === 0) {
        alert('Tu carrito está vacío.');
    } else if (envioActual === null) {
        alert('Calculá el envío con tu código postal antes de finalizar la compra.');
    } else {
        const total = calcularSubtotal() + envioActual;
        alert('¡Gracias por tu compra! Total a pagar: $ ' + total.toLocaleString('es-AR'));
    }
};