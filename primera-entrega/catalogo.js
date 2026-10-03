const selectorCategoria = document.getElementById("categoria");
const campoBusqueda = document.getElementById("busqueda-producto");
const productos = document.querySelectorAll(".producto");
const contadorResultados = document.getElementById("cantidad-resultados");

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
};