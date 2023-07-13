import React, { useState, useEffect } from "react";
import styles from "./logIn.module.css";
import ForgotPasswordModal from "../ForgetPasswordModal/ForgetPasswordModal";
import Modal from "react-modal";
import { Google } from "../../../../public/imagnes";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // import Firebase auth modules
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation"; // Importa esto

function LogIn({ toggleForm }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Obtiene la instancia de router
  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      try {
        const res = await fetch("/api/login-google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        });

        if (res.status === 200) {
          // Inicio de sesión exitoso. Redirigir al usuario a la página /store/fundas
          router.push("/store/fundas");
        } else {
          // El inicio de sesión falló. Mostrar un mensaje de error al usuario.
          const resData = await res.json();
          alert(resData.message);
        }
      } catch (error) {
        console.error("Error al iniciar sesión con Google:", error);
        // Mostrar un mensaje de error al usuario.
        alert(`Error al iniciar sesión con Google: ${error.message}`);
      }
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      alert(`Error al iniciar sesión con Google: ${error.message}`);
    }
  };

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
      router.push("/store/fundas");
    } else {
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <div>
        <div className={styles.inputContenedor}>
          <span className={styles.formSubs}>Email</span>
          <input
            type="email"
            placeholder="Ingrese su email"
            value={email}
            className={styles.input}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.inputContenedor}>
          <span className={styles.formSubs}>Contraseña</span>
          <input
            type="password"
            placeholder="Ingrese su contraseña"
            value={password}
            className={styles.input}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={styles.botonera}>
          <button onClick={handleSubmit} className={styles.boton}>
            Iniciar Sesion
          </button>
          <ForgotPasswordModal isOpen={isModalOpen} closeModal={closeModal} />
          <button onClick={toggleForm} className={styles.boton2}>
            Crear Cuenta Nueva
          </button>
          <div className={styles.logInContainerThird}>
            <Image src={Google} alt="image" onClick={handleGoogleLogin} />
          </div>
          <div>
            <span onClick={openModal}>Olvidaste la contraseña?</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogIn;