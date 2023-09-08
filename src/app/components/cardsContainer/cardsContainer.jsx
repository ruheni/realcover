import React, { useState, useEffect, useContext } from "react";
import styles from "./CardsContainer.module.css";
import Card from "../card/card";
import { aprevious, nextArrow } from "../../../../public/imagnes";
import Image from "next/image";
import { GlobalContext } from "../../store/layout";

function CardsContainer({}) {
  const {
    products, // Usamos directamente los productos
    isLoading,
    globalState,
    setGlobalState,
    setPage,
    page,
    totalProducts, // Nuevo: accede a totalProducts desde el contexto
  } = useContext(GlobalContext);
  const displayType = globalState.displayType;

  const itemsPerPage = 12;
  const maxPageButtons = 5;

  useEffect(() => {
    const savedDisplayType = localStorage.getItem("displayType");

    if (savedDisplayType) {
      setGlobalState((prevState) => ({
        ...prevState,
        displayType: savedDisplayType,
      }));
    }
  }, []);

  console.log("Current displayType:", displayType);

  const totalPages = totalProducts
    ? Math.ceil(totalProducts / itemsPerPage)
    : 0;

  console.log("Total products:", totalProducts);
  console.log("Total pages:", totalPages);

  const startPage = Math.max(0, page - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i);
  console.log("Current page:", page);

  return (
    <div className={styles.generalContainer}>
      <div className={styles.botoneraB}>
        <select
          className={styles.mobileSelector}
          value={displayType}
          onChange={(e) => {
            const newDisplayType = e.target.value;
            setGlobalState((prevState) => ({
              ...prevState,
              displayType: newDisplayType,
            }));
            localStorage.setItem("displayType", newDisplayType);
            setPage(0);
          }}
        >
          <option value="NEOPRENE_COVER">FUNDAS NEOPRENE</option>
          <option value="MALETINES">MALETINES</option>
          <option value="MALETINES_FULL_COLOR">FULL COLOR</option>
          <option value="TABLET_COVER">FUNDAS RIGIDAS</option>
          <option value="CUBRE_VALIJAS">CUBRE VALIJAS</option>
          <option value="CON_BOLSILLO">FUNDSA CON BOLSILLO</option>
          <option value="PORTAFOLIOS">PORTAFOLIOS</option>
        </select>
        <button
          onClick={() => {
            const newDisplayType = "NEOPRENE_COVER";
            setGlobalState((prevState) => ({
              ...prevState,
              displayType: newDisplayType,
            }));
            localStorage.setItem("displayType", newDisplayType);
            setPage(0);
          }}
          className={`${styles.botonOpciones} ${
            displayType === "NEOPRENE_COVER" ? styles.botonOpcionesActivo : ""
          }`}
        >
          FUNDAS NEOPRENE
        </button>
        <button
          onClick={() => {
            const newDisplayType = "MALETINES";
            setGlobalState((prevState) => ({
              ...prevState,
              displayType: newDisplayType,
            }));
            localStorage.setItem("displayType", newDisplayType);
            setPage(0);
          }}
          className={`${styles.botonOpciones} ${
            displayType === "MALETINES" ? styles.botonOpcionesActivo : ""
          }`}
        >
          MALETINES
        </button>
        <button
          onClick={() => {
            const newDisplayType = "MALETINES_FULL_COLOR";
            setGlobalState((prevState) => ({
              ...prevState,
              displayType: newDisplayType,
            }));
            localStorage.setItem("displayType", newDisplayType);
            setPage(0);
          }}
          className={`${styles.botonOpciones} ${
            displayType === "MALETINES_FULL_COLOR"
              ? styles.botonOpcionesActivo
              : ""
          }`}
        >
          FULL COLOR
        </button>
        <button
          onClick={() => {
            const newDisplayType = "CON_BOLSILLO";
            setGlobalState((prevState) => ({
              ...prevState,
              displayType: newDisplayType,
            }));
            localStorage.setItem("displayType", newDisplayType);
            setPage(0);
          }}
          className={`${styles.botonOpciones} ${
            displayType === "CON_BOLSILLO" ? styles.botonOpcionesActivo : ""
          }`}
        >
          FUNDAS CON BOLSILLO
        </button>
        <button
          onClick={() => {
            const newDisplayType = "PORTAFOLIOS";
            setGlobalState((prevState) => ({
              ...prevState,
              displayType: newDisplayType,
            }));
            localStorage.setItem("displayType", newDisplayType);
            setPage(0);
          }}
          className={`${styles.botonOpciones} ${
            displayType === "PORTAFOLIOS" ? styles.botonOpcionesActivo : ""
          }`}
        >
          PORTAFOLIOS
        </button>
        <button
          onClick={() => {
            const newDisplayType = "TABLET_COVER";
            setGlobalState((prevState) => ({
              ...prevState,
              displayType: newDisplayType,
            }));
            localStorage.setItem("displayType", newDisplayType);
            setPage(0);
          }}
          className={`${styles.botonOpciones} ${
            displayType === "TABLET_COVER" ? styles.botonOpcionesActivo : ""
          }`}
        >
          FUNDAS RIGIDAS{" "}
        </button>
        <button
          onClick={() => {
            const newDisplayType = "CUBRE_VALIJAS";
            setGlobalState((prevState) => ({
              ...prevState,
              displayType: newDisplayType,
            }));
            localStorage.setItem("displayType", newDisplayType);
            setPage(0);
          }}
          className={`${styles.botonOpciones} ${
            displayType === "CUBRE_VALIJAS" ? styles.botonOpcionesActivo : ""
          }`}
        >
          CUBRE VALIJAS
        </button>
      </div>

      <div className={styles.cardsContainer} key={displayType}>
        {products.map((item) => (
          <Card key={item.id} {...item} />
        ))}
      </div>
      <div className={styles.botonera}>
        {page > 0 && (
          <button
            onClick={() => setPage(page - 1)}
            className={styles.paginationButton}
          >
            <Image src={aprevious} alt="image" className={styles.previous} />
          </button>
        )}
        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={`${styles.numberButton} ${
              page === num ? styles.currentButton : ""
            }`}
          >
            {num + 1}
          </button>
        ))}
        {page < totalPages - 1 && (
          <button
            onClick={() => setPage(page + 1)}
            className={styles.paginationButton}
          >
            <Image src={nextArrow} alt="image" className={styles.previous} />
          </button>
        )}
      </div>
    </div>
  );
}

export default CardsContainer;
