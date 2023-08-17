import React, { useState, useContext } from "react";
import styles from "./logIn.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Cambiado de "next/navigation" a "next/router"
import { GlobalContext } from "./../../store/layout";

import namecontact from "../../../../public/name-contact-form.svg";
import mailcontact from "../../../../public/mail-contact-form.svg";
import namecontactverde from "../../../../public/name-contact-form-verde.svg";
import mailcontactverde from "../../../../public/mail-contact-form-verde.svg";

function LogIn({ toggleForm }) {
  const { setIsAuthenticated } = useContext(GlobalContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [nombreFocused, setNombreFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.status === 200) {
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/store/fundas");
      setIsAuthenticated(true);
    } else {
      console.error(
        "Error en el inicio de sesión:",
        data.message || "Error desconocido"
      );
    }
  };

  const openModal = () => setIsModalOpen(true); // Esta función parece que necesita más contexto.

  return (
    <div className={styles.generalContainer}>
      <h1 className={styles.tlte}>Bienvenido!</h1>
      <div className={styles.inputContenedor}>
        <h2 className={styles.subtitles}>
          Inicia sesion para proseguir con la compra
        </h2>
        <span className={styles.formSubs}>Email</span>
        <div className={styles.inputContainer}>
          <input
            type="email"
            value={email}
            className={styles.input}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />
          <Image
            src={emailFocused ? mailcontactverde : mailcontact}
            alt="Email"
            className={styles.inputImagePlaceholder}
          />
        </div>
      </div>
      <div className={styles.inputContenedor}>
        <span className={styles.formSubs}>Contraseña</span>
        <div className={styles.inputContainer}>
          <input
            type="password"
            value={password}
            className={styles.input}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setNombreFocused(true)}
            onBlur={() => setNombreFocused(false)}
          />
          <Image
            src={nombreFocused ? namecontactverde : namecontact}
            alt="Nombre"
            className={styles.inputImagePlaceholder}
          />
        </div>
      </div>
      <div className={styles.botonera}>
        <button onClick={handleSubmit} className={styles.boton}>
          Iniciar Sesion
        </button>
        <button onClick={toggleForm} className={styles.boton2}>
          Crear Cuenta Nueva
        </button>
        <div className={styles.logInContainerThird}>
          {/* Aquí podrías agregar el login de Google nuevamente si es necesario */}
        </div>
        <div>
          <span className={styles.olvidaste} onClick={openModal}>
            Olvidaste la contraseña?
          </span>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
