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