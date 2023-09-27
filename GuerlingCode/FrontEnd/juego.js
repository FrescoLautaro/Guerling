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

let palabra = 'texto';
let arrayPalabras = palabra.split('');
let longitudFila = document.querySelector('.fila');

arrayPalabras.forEach(() => {
    longitudFila.innerHTML += " <input type='text' maxLenght='1' class='cuadrado' ";
})

let cuadrados = document.querySelectorAll(".cuadrado");
cuadrados = [...cuadrados];

let palabraUsuario = []

/* cuadrados.forEach(Element => ) */