export default function WelcomeMessage({
    title = "Iniciar sesión",
    subtitle = "Introduce tus datos de acceso para iniciar sesión",
}) {
    return (
        <div className="login-bienvenida">
            <h1>{title}</h1>
            <p>{subtitle}</p>
        </div>
    );
}