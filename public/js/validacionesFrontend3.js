// Función para mostrar/ocultar campos dinámicos en el formulario
function check() {
    const sponsorField = document.querySelector('.validate-sponsor.sql');
    const sponsorIdField = document.getElementById('sponsor-id-field');
    const consignmentField = document.querySelector('.validate-type.sql');
    const dynamicField = document.getElementById('dinamic-field');

    // Manejo del campo de patrocinador
    if (sponsorField) {
        if (sponsorField.value === "Patrocinador") {
            sponsorIdField.innerHTML = `
                <label class="label dinamic-delete" for="contact-bono">ID de su patrocinador:</label>  
                <input id="contact-bono" class="sql" type="text" placeholder="Alvarez1" required>`;
        } else { sponsorIdField.innerHTML = ''; }
    }

    // Manejo de campos dinámicos según el tipo de remesa
    if (consignmentField) {
        if (consignmentField.value.includes('efectivo')) {
            dynamicField.innerHTML = `<label class="label dinamic-delete" for="remesa-direction">Dirección del beneficiario</label>
                    <textarea class="validate-address" rows="5" maxlength="100" placeholder="Municipio, Calle, #" required></textarea>`;
        } else if (consignmentField.value.includes('Transferencia')) {
            dynamicField.innerHTML = `<label class="label dinamic-delete" for="remesa-card">Tarjeta </label>
                    <input class="validate-tel" type="tel" maxlength="16" placeholder="9230045604230957 sin espacios ni '-'" required>`;
        } else { dynamicField.innerHTML = ''; }
    }
}



let formStep = 1;

const navigateSteps = (event, direction, margin, ...validateInputs) => {
    event.preventDefault();

    if (validateStep(direction, ...validateInputs)) {
        if (direction === "submit") {
            const actions = {
                "form-user-register": guardarPersona,
                "form-consignment-register": guardarRemesa,
                "login": sendLogin
            };
            actions[document.querySelector("form.validated").id]?.(event);
        } else {
            document.querySelector(".slide-page").style.marginLeft = `-${margin}%`;
            updateProgress(direction.startsWith("next") ? "add" : "remove");
        }
    }
};

const updateProgress = (action) => {
    const bullet = document.querySelectorAll(".bullet");
    const check = document.querySelectorAll(".check");
    const text = document.querySelectorAll(".step p");
    const idx = action === 'add' ? formStep - 1 : formStep - 2;

    bullet[idx]?.classList[action]("active");
    check[idx]?.classList[action]("active");
    text[idx]?.classList[action]("active");
    formStep += action === 'add' ? 1 : -1;
};

const validateStep = (direction, ...validateInputs) => {
    const validationConfig = {
        sqlInjectionFilter: /^[^'";]+$/,
        email: { sel: ".validate-email", regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: "Correo inválido." },
        password: { sel: ".validate-password", regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/, msg: "La clave debe tener de 8 a 12 caracteres." },
        name: { sel: ".validate-name", regex: /^[a-zA-ZÀ-ÿ\s]{1,50}$/, msg: "Nombre inválido." },
        dni: { sel: ".validate-dni", regex: /^\d{8,11}$/, msg: "DNI inválido (de 8 a 11 números)." },
        phone: { sel: ".validate-tel", regex: /^\d{8,16}$/, msg: "Entrada incompleta. Revise." },
        source: { sel: ".validate-sponsor.sql", regex: /^(Patrocinador|Remesa|Google)$/, msg: "Opción inválida." },
        type: { sel: ".validate-type.sql", regex: /^(USD efectivo|CUP efectivo|Transferencia CUP|Transferencia MLC)$/, msg: "Selección inválida." },
        amount: { sel: ".validate-number", regex: /^(?:\d{2,4})$/, msg: "Monto inválido." },
        address: { sel: ".validate-address", regex: /^[a-zA-Z0-9À-ÿ\s,#]{1,200}$/, msg: "Dirección con caracteres no permitidos." }
    };

    const container = document.querySelector(`.${direction}`);
    let allValid = true;

    validateInputs.forEach(input => {
        const { sel, regex, msg } = validationConfig[input] || {};
        const elements = container?.querySelectorAll(sel);

        elements?.forEach(element => {
            clearValidationMessages(element);

            // Permitir campo vacío solo si `action` es 'editar'
            const isEmpty = element.value.trim() === "";
            const isValid = (isEmpty && action === 'editar') || 
                            (regex.test(element.value) && 
                             (!element.classList.contains("sql") || validationConfig.sqlInjectionFilter.test(element.value)));

            if (!isValid) {
                showValidationMessage(element, msg);
                allValid = false;
            }
        });
    });

    return allValid;
};

const showValidationMessage = (inputElement, message) => {
    inputElement.style.borderColor = "var(--alert-color)";
    const errorText = document.createElement("small");
    errorText.classList.add("validation-message");
    errorText.style.color = "var(--alert-color)";
    errorText.style.fontSize = "16px";
    errorText.textContent = message;
    inputElement.insertAdjacentElement("afterend", errorText);
};

const clearValidationMessages = (inputElement) => {
    inputElement.style.borderColor = "";
    inputElement.parentElement.querySelectorAll(".validation-message").forEach(msg => msg.remove());
};