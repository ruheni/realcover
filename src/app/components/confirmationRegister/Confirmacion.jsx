import React, { useState } from "react";
import Modal from "react-modal";
import styles from "./ForgetPasswordModal.module.css";

function Confirmacion({ isOpen, closeModal, toggleForm }) {
  const [email, setEmail] = useState("");

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.70)",
      backdropFilter: "blur(5px)", // this will add blur effect
    },
    content: {
      backgroundColor: "#232323",
      position: "absolute",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",

      transform: "translate(-50%, -50%)", // centering
      padding: "2rem",
      border: "none",
    },
  };
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.Contenedor}>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Olvidaste tu contraseña"
        style={customStyles}
      >
        <div className={styles.couponContainer}>
          <input
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Ingresa tu cupón aquí"
          />
          <button onClick={handleCouponApply}>Aplicar Cupón</button>
        </div>
      </Modal>
    </div>
  );
}

export default Confirmacion;
