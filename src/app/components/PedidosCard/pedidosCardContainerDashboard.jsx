"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import PedidosCardDashboard from "./pedidoscardDashboard";
import styles from "./pedidoscontainer.module.css";
import Modal from "react-modal";
import Etiquetas from "../etiquetasEnvio/page";

function PedidosContainerDashboard() {
  const [orders, setOrders] = useState([]);
  const [isPDFVisible, setPDFVisible] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`/api/order`);
        if (response.status === 200) {
          setOrders(response.data);
        }
        console.log("Orders:", response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleOpenPDF = () => {
    setPDFVisible(true);
  };
  return (
    <div className={styles.container}>
      <button onClick={handleOpenPDF}>Imprimir Datos de Envio</button>

      <Modal
        isOpen={isPDFVisible}
        onRequestClose={() => setPDFVisible(false)}
        // el estilo de tu modal...
      >
        <Etiquetas
          orders={orders.filter((order) => order.status === "En proceso")}
        />
      </Modal>

      {orders.map((order) => (
        <PedidosCardDashboard
          key={order.id}
          orderId={order.id}
          {...order}
          className={styles.separacion}
        />
      ))}
    </div>
  );
}

export default PedidosContainerDashboard;
