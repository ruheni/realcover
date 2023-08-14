"use client";
import React, { useState } from "react";
import Modal from "react-modal";
import { useEffect } from "react";
import styles from "./cupon.module.css";

function CreateCoupon({ isOpen, onRequestClose, onUserChange }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);
  const [couponData, setCouponData] = useState({
    code: "",
    discountValue: null,
    discountPercent: null,
    description: "",
    useOnce: true,
    expiryDate: "",
    minPurchaseUnits: null,
    autoGenerated: false,
  });

  const selectedUserId = users.find(
    (user) => `${user.name} ${user.lastName}` === selectedUser
  )?.id;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCouponData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Preparar datos para el envío
    const formattedData = {
      ...couponData,
      discountValue: couponData.discountValue
        ? parseFloat(couponData.discountValue)
        : null,
      discountPercent: couponData.discountPercent
        ? parseFloat(couponData.discountPercent)
        : null,
      expiryDate: couponData.expiryDate
        ? `${couponData.expiryDate}T00:00:00.000Z`
        : null,
      userId: selectedUserId, // Aquí agregas el ID del usuario
    };

    try {
      const response = await fetch("/api/admin/coupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("¡Cupón creado exitosamente!");
      } else {
        alert(result.error || "Error al crear el cupón.");
      }
    } catch (err) {
      alert("Error al enviar la solicitud: ", err.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Crear un nuevo Cupón"
      ariaHideApp={false}
      style={{
        overlay: {
          position: "fixed",
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.829)",
          zIndex: 10,
          backdropFilter: "blur(4.5px)",
        },
        content: {
          left: "40%",
          top: "15%",
          width: "fit-content",
          height: "fit-content",
          backgroundColor: "#F5F5F5",
        },
      }}
    >
      <div className={styles.Contenedor}>
        <form onSubmit={handleSubmit} className={styles.contenedorForm}>
          <h2 className={styles.titleModal}>Crear Cupón</h2>
          <br />
          <input
            className={styles.input}
            name="code"
            value={couponData.code}
            onChange={handleChange}
            placeholder="Código del Cupón"
          />
          <br />
          <input
            className={styles.input}
            name="discountValue"
            value={couponData.discountValue || ""}
            onChange={handleChange}
            placeholder="Valor de Descuento"
            type="number"
          />
          <br />
          <input
            className={styles.input}
            name="discountPercent"
            value={couponData.discountPercent || ""}
            onChange={handleChange}
            placeholder="Porcentaje de Descuento"
            type="number"
          />
          <br />
          <input
            className={styles.input}
            name="description"
            value={couponData.description}
            onChange={handleChange}
            placeholder="Descripción"
          />
          <br />
          <label>
            <label className={styles.label}>
              Usuario:
              <br />
              <input
                className={styles.inpub}
                list="users"
                value={selectedUser}
                placeholder="Escriba o seleccione un usuario"
                onChange={(e) => {
                  setSelectedUser(e.target.value);
                  onUserChange(e.target.value);
                }}
              />
              <br />
              <datalist id="users" className={styles.input}>
                {users.map((user) => (
                  <option
                    className={styles.option}
                    key={user.id}
                    value={`${user.name} ${user.lastName}`}
                  >
                    {`${user.name} ${user.lastName}`}
                  </option>
                ))}
              </datalist>
            </label>
            <br />
            <div className={styles.checkbox}>
              <h2 className={styles.label}>¿Usar una sola vez?</h2>
              <input
                className={styles.check}
                name="useOnce"
                checked={couponData.useOnce}
                onChange={(e) =>
                  setCouponData({ ...couponData, useOnce: e.target.checked })
                }
                type="checkbox"
              />
            </div>
          </label>
          <br />
          <input
            className={styles.input}
            name="expiryDate"
            value={couponData.expiryDate}
            onChange={handleChange}
            placeholder="Fecha de Expiración"
            type="date"
          />
          <br />
          <button type="submit" className={styles.button}>
            Crear Cupón
          </button>
        </form>
      </div>
    </Modal>
  );
}

export default CreateCoupon;
