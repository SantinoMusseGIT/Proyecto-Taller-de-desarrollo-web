const selectorCategoria = document.getElementById("categoria");
const campoBusqueda = document.getElementById("busqueda-producto");
const productos = document.querySelectorAll(".producto");
const contadorResultados = document.getElementById("cantidad-resultados");
const mensajeSinResultados = document.getElementById("sin-resultados");
const contadorCarrito = document.getElementById("cantidad-carrito");
const contadorTotalCarrito = document.getElementById("total-carrito");
let cantidadCarrito = 0;
let totalCarrito = 0;
/**
 * Filtra los productos según la categoría y el texto ingresado.
 * @method aplicarFiltros
 * @return {void}
 */
const aplicarFiltros = () => {
    const categoriaSeleccionada = selectorCategoria.value;
    const textoBuscado = campoBusqueda.value.trim().toLowerCase();
    const patronBusqueda = /^[a-záéíóúüñ\s]*$/;
    const busquedaValida = patronBusqueda.test(textoBuscado);
    if (!busquedaValida) {
        alert("La búsqueda solo puede contener letras y espacios.");
        campoBusqueda.value = "";
        return;
    }

    let cantidadVisible = 0;

    productos.forEach((producto) => {
        const coincideCategoria =
            categoriaSeleccionada === "" ||
            producto.dataset.categoria === categoriaSeleccionada;

        const nombreProducto = producto
            .querySelector("h4")
            .textContent
            .toLowerCase();

        const coincideBusqueda =
            textoBuscado === "" ||
            nombreProducto.includes(textoBuscado);

        const debeMostrarse = coincideCategoria && coincideBusqueda;
        producto.hidden = !debeMostrarse;

        if (debeMostrarse) {
            cantidadVisible += 1;
        }
    });

    const palabraResultado =
        cantidadVisible === 1 ? "resultado" : "resultados";

    contadorResultados.textContent =
        `${cantidadVisible} ${palabraResultado}`;

    mensajeSinResultados.hidden = cantidadVisible !== 0;
};

/**
 * Agrega un producto al contador del carrito y actualiza la cantidad y el precio total.
 * @method agregarAlCarrito
 * @param {HTMLButtonElement} boton - Botón del producto seleccionado.
 * @return {void}
 */
const agregarAlCarrito = (boton) => {
    const tarjetaProducto = boton.closest(".producto");
    const nombreProducto = tarjetaProducto
        .querySelector("h4")
        .textContent
        .trim();

    const precioProducto = Number(tarjetaProducto.dataset.precio);

    cantidadCarrito += 1;
    contadorCarrito.textContent = cantidadCarrito;

    totalCarrito += precioProducto;
    contadorTotalCarrito.textContent =
        totalCarrito.toLocaleString("es-AR");

    alert(`${nombreProducto} fue agregado al carrito.`);
};