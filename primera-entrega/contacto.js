const formularioContacto =
    document.getElementById("formulario-contacto");

const campoNombreContacto =
    document.getElementById("contacto-nombre");

const campoEmailContacto =
    document.getElementById("contacto-email");

const campoMensajeContacto =
    document.getElementById("contacto-mensaje");

/**
 * Valida los datos del formulario y confirma el envío del mensaje.
 * @method enviarMensaje
 * @return {void}
 */
const enviarMensaje = () => {
    const nombre = campoNombreContacto.value.trim();
    const email = campoEmailContacto.value.trim();
    const mensaje = campoMensajeContacto.value.trim();

    const patronNombre = /^[a-záéíóúüñ\s'-]+$/i;
    const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (nombre.length < 2 || !patronNombre.test(nombre)) {
        alert("Ingresá un nombre válido de al menos dos caracteres.");
        campoNombreContacto.value = "";
        return;
    }

    if (!patronEmail.test(email)) {
        alert("Ingresá un correo electrónico válido.");
        campoEmailContacto.value = "";
        return;
    }

    if (mensaje.length < 10) {
        alert("El mensaje debe tener al menos diez caracteres.");
        campoMensajeContacto.value = "";
        return;
    }

    alert(`Gracias, ${nombre}. Tu mensaje fue enviado correctamente.`);
    formularioContacto.reset();
};