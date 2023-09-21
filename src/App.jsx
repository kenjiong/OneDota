import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import NavBar from "./components/Nav/NavBar";
import Watchlist from "./components/Watchlist/Watchlist";
// import Portfolio from "./components/Portfolio/Portfolio";
import Enter from "./pages/Enter/Enter";
import HomePage from "./pages/HomePage/HomePage";
import CoinsListPage from "./pages/Coins/CoinsListPage";
import CoinPage from "./pages/Coins/CoinPage";
import ConverterPage from "./pages/CoinConverter/ConverterPage";

function App() {
  const [coins, setCoins] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  // const [portfolio, setPortfolio] = useState([]);
  const [fiat, setFiat] = useState("USD");

  const fetchWatchlist = async () => {
    try {
      const url = "https://api.airtable.com/v0/apprApIcqcI5oHlTI/Watchlist";
      const token =
        "patMCS33ZnaCOmRwz.e6010bc1518019b727914ee0c305944a0e1164e73625a18ef29d64d8d04cbb83";
      const response = await fetch(`${url}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const jsonData = await response.json();
      const airtableData = jsonData.records.map((data) => ({
        ...data.fields,
        id: data.id,
      }));
      setWatchlist(airtableData);
    } catch (error) {
      log(error);
    }
  };

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const url = `https://api.coinstats.app/public/v1/coins?currency=${fiat}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not OK");
        }
        const data = await response.json();
        setCoins(data.coins);
      } catch (error) {
        log(error);
      }
    };
    fetchCoins();
  }, [fiat]);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const changeFiat = (newFiat) => {
    setFiat(newFiat);
  };

  return (
    <>
      <div className="grid">
        <header className="p-2 g-col-12 text-center">
          <Header />
        </header>
        <nav
          className="p-2 g-col-12 navbar bg-dark border-bottom border-body"
          data-bs-theme="dark"
        >
          <NavBar fiat={fiat} changeFiat={changeFiat} />
        </nav>
      </div>
      <br />
      <div className="container">
        <div className="row">
          <section className="col-9 text-light border-end border-secondary">
            <Routes>
              <Route path="/" element={<Enter />} />
              <Route path="/main" element={<HomePage />} />
              <Route
                path="/coins"
                element={<CoinsListPage coins={coins} fiat={fiat} />}
              />
              <Route path="/coins/:coinId" element={<CoinPage fiat={fiat} />} />
              <Route
                path="/converter"
                element={<ConverterPage coins={coins} />}
              />
            </Routes>
          </section>
          <aside className="col-3">
            <Watchlist
              watchlist={watchlist}
              fetchWatchlist={fetchWatchlist}
              coins={coins}
            />
            {/* <div>
          <Portfolio portfolio={portfolio} />
        </div> */}
          </aside>
        </div>
      </div>
      <hr className="text-white text-opacity-75" />
      <footer className="text-center text-white text-opacity-50">
        <small>
          Cryptomania (est 2023) - powered by the{" "}
          <a
            className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
            href="https://documenter.getpostman.com/view/5734027/RzZ6Hzr3"
          >
            CoinStats API
          </a>
          <br />A project by{" "}
          <a
            className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
            href="https://github.com/kenjiong"
          >
            Kenji Ong
          </a>
        </small>
      </footer>
      <br />
    </>
  );
}

export default App;
