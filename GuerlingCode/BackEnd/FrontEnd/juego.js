/*Login*/

function login()
{
    let user = document.getElementById("user").value;
    let pass = document.getElementById("password").value;

    if(user=="administrador" && pass=="12345") 
    {
        window.location="index.html";
        alert("Has iniciado sesión correctamente como " + user);
    }
    else
    {
        alert("Datos incorrectos, intente nuevamente.");
    }
}
function registrar()
{
    let user = document.getElementById("user").value;
    let pass = document.getElementById("password").value;
    window.location="index.html";
        alert("Te registraste como: " + user);
}

/*///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

/*Juego*/


let palabra = document.getElementById("palabra").innerText; //Obtiene la palabra que el jugador debe adivinar desde el HTML.
let intentosRestantes = 6; //Establece el número total de intentos que el jugador tiene para adivinar la palabra.
const filas = document.querySelectorAll('.row');  // Selecciona todas las filas del tablero de juego.
const casillas = document.querySelectorAll('.square'); //Selecciona todas las casillas individuales del tablero de juego.
const botonesTeclado = document.querySelectorAll(".filaTeclado button"); //Selecciona todos los botones del teclado virtual.
const btnPista = document.getElementById('btnPista'); //Selecciona el botón que revela la pista.
const textoPista = document.getElementById('textoPista'); //Selecciona el lugar donde se muestra la pista.
let filaActual = 0; //Mantiene un registro de la fila en la que el jugador está actualmente escribiendo.


//Funcion para configurar las casillas

//Esta función pasa por todas las filas y casillas del juego.
//Desactiva todas las casillas que no estén en la fila actual (para evitar que el jugador escriba en ellas).
//Si una casilla está en la fila actual, se asegura de que esté vacía.
function configurarCasillas() {
    for (let i = 0; i < filas.length; i++) {
        const casillasFila = filas[i].querySelectorAll('.square');
        casillasFila.forEach(casilla => {
            casilla.disabled = (i !== filaActual);
            if (i === filaActual) {
                casilla.value = '';
            }
        });
    }
}

// Llamar esta función al inicio para establecer el estado inicial
configurarCasillas();


// Función para borrar la última letra ingresada

//Obtiene todas las casillas de la fila en la que está trabajando el jugador.
//Comienza desde el final de la fila y se desplaza hacia atrás hasta encontrar la primera casilla que no esté vacía.
//Borra el valor de esa casilla y la establece como el punto activo (focus) para futuras entradas.
function borrarUltimaLetra() {
    const casillasFila = filas[filaActual].querySelectorAll('.square');
    for (let i = casillasFila.length - 1; i >= 0; i--) {
        if (casillasFila[i].value) {
            casillasFila[i].value = '';
            casillasFila[i].focus();
            return;
        }
    }
}


// Función para manejar la entrada de letras

//Toma una letra como argumento.
//Pasa por todas las casillas de la fila en la que está trabajando el jugador.
//Busca la primera casilla vacía y establece su valor como la letra dada.
//Si esa casilla no es la última de la fila, mueve el focus a la siguiente casilla.
function manejarLetra(letra) {
    const casillasFila = filas[filaActual].querySelectorAll('.square');
    for (let casilla of casillasFila) {
        if (!casilla.value) {
            casilla.value = letra;
            return; // Sale de la función una vez que ingresa una letra
        }
    }
}



document.addEventListener('keyup', function(event) {
    const key = event.key.toLowerCase();
    if (key.length === 1 && key.match(/[a-zñ]/i)) {
        manejarLetra(key);
    } else if (key === "backspace" || key === "delete") {
        borrarUltimaLetra();
    } else if (key === "enter") {
        revisarIntento();
    }
});

//Funcion para manejar los intentos de adivinar del jugador

//Obtiene el intento actual del jugador juntando todas las letras de la fila en la que está trabajando.
//Comprueba cada letra del intento contra la palabra objetivo.
//Colorea las casillas según si la letra está en la posición correcta, si la letra está en la palabra pero no en la posición correcta, o si la letra no está en la palabra en absoluto.
//Si el jugador ha adivinado correctamente la palabra, o si ha utilizado todos sus intentos, muestra la descripción de la palabra. Si no, pasa al siguiente intento (fila).
function revisarIntento() {
    const casillasFila = filas[filaActual].querySelectorAll('.square');
    const intento = [...casillasFila].map(casilla => casilla.value.toLowerCase()).join('');
    let aciertos = 0;

  for(let i = 0; i < palabra.length; i++) {
        if(intento[i] === palabra[i]) {
            aciertos++;
            casillasFila[i].style.backgroundColor = 'rgb(10, 163, 10)';
        } else if (palabra.includes(intento[i])) {
            casillasFila[i].style.backgroundColor = 'rgba(233, 233, 12, 0.918)';
        } else {
            casillasFila[i].style.backgroundColor = 'rgba(238, 224, 222, 0.644)';
        }
    }

    if (aciertos === palabra.length) {
        mostrarVictoryModal();
    } else if (intentosRestantes <= 0 || (filaActual === filas.length - 1 && aciertos !== palabra.length)) {
        mostrarLoseModal();  // Mostrar el modal de perder
    } else {
        intentosRestantes--;
        if (filaActual < filas.length - 1) {
            filaActual++;
            configurarCasillas(); // Asegurarse de que solo la fila actual esté habilitada
        }
    }
}

//Funcion para mostrar la descripcion de la palabra a adivinar
//Muestra un modal con la descripción de la palabra que el jugador estaba tratando de adivinar.
function mostrarVictoryModal() {
    const modal = document.getElementById('victoryModal');
    const descElement = document.getElementById("victoryDesc");
    modal.style.display = "block";
    descElement.innerText = document.getElementById("desc").innerText;
}

//Cierra el modal anterior.
function closeVictoryModal() {
    const modal = document.getElementById('victoryModal');
    modal.style.display = "none";
}

function mostrarLoseModal() {
    const modal = document.getElementById('loseModal');
    modal.style.display = "block";
}

function closeLoseModal() {
    const modal = document.getElementById('loseModal');
    modal.style.display = "none";
}

// Event listeners
botonesTeclado.forEach(btn => {
    btn.addEventListener('click', function() {
        const key = this.dataset.key;
        if (key === 'del') {
            borrarUltimaLetra();
        } else if (key !== 'enter') {
            manejarLetra(key);
        } else {
            revisarIntento();
        }
    });
});





btnPista.addEventListener('click', function() {
    textoPista.style.display = textoPista.style.display === 'block' ? 'none' : 'block'; 
});
