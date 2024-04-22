import { useState, useEffect } from "react";
import "./App.css";
import styles from "./styles/page.module.css";

function App() {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  function prePage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function nextPage() {
    const lastPage = Math.ceil(allData.length / recordsPerPage);
    if (currentPage < lastPage) {
      setCurrentPage(currentPage + 1);
    }
  }

  function changePage(pageNumber: any) {
    setCurrentPage(pageNumber);
  }

  const getCards = async () => {
    try {
      const response = await fetch("https://api.pokemontcg.io/v2/cards");
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      const data = await response.json();
      setAllData(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getCards();
  }, []);

  const lastRecordIndex = currentPage * recordsPerPage;
  const firstRecordIndex = lastRecordIndex - recordsPerPage;
  const records = allData.slice(firstRecordIndex, lastRecordIndex);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(allData.length / recordsPerPage); i++) {
    pageNumbers.push(i);
  }

  const goToDetailPage = (id: string) => {
    return id;
  };

  return (
    <div className={styles.container}>
      <div className="App-header">
        <>
          <h1>POKEMON UYGULAMASI</h1>
          <div>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <>
                <table className={styles.tableContainer}>
                  <thead>
                    <tr>
                      <th>NAME</th>
                      <th>IMAGE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((data: any, index) => (
                      <tr key={index} onClick={() => goToDetailPage(data.id)}>
                        <td>{data.name}</td>
                        <td>
                          <img
                            width="50"
                            height="50"
                            src={data.set.images.symbol}
                            alt={data.name}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <nav className={styles.pagination}>
                  <div className={styles.pageItem}>
                    <button
                      className="page-link"
                      onClick={prePage}
                      disabled={currentPage === 1}
                    >
                      Prev
                    </button>
                  </div>
                  {pageNumbers.map((number) => (
                    <div
                      key={number}
                      className={`${styles.pageItem} ${
                        currentPage === number ? styles.active : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => changePage(number)}
                      >
                        {number}
                      </button>
                    </div>
                  ))}
                  <div className={styles.pageItem}>
                    <button
                      className="page-link"
                      onClick={nextPage}
                      disabled={
                        currentPage ===
                        Math.ceil(allData.length / recordsPerPage)
                      }
                    >
                      Next
                    </button>
                  </div>
                </nav>
              </>
            )}
          </div>
        </>
      </div>
    </div>
  );
}

export default App;
