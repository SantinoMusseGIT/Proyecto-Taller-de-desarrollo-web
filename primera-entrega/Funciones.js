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
 * Calcula la cantidad de caracteres de la búsqueda
 * ingresada por el usuario y muestra el resultado.
 *
 * La función primero valida el contenido del campo.
 * Si el contenido es correcto, obtiene la cantidad de
 * caracteres ingresados y muestra un mensaje al usuario.
 *
 * @method realizarBusqueda
 * @return {void} No retorna ningún valor.
 */
const realizarBusqueda = () => {

    const campoBusqueda = document.getElementById("busqueda");
    const valorBusqueda = campoBusqueda.value.trim();

    // Primero comprobamos que la búsqueda sea válida
    if (!validarBusqueda()) {
        return;
    }

    // Calculamos la cantidad de caracteres
    const cantidadCaracteres = valorBusqueda.length;

    // Mostramos el resultado al usuario
    alert(
        "Búsqueda realizada: " +
        valorBusqueda +
        "\nLa búsqueda contiene " +
        cantidadCaracteres +
        " caracteres."
    );
};