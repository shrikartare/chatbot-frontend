import React from "react";
import ChatContainer from "./components/ChatContainer";
import Purge from "./components/Purge/Purge";
import Crawl from "./components/Crawl/Crawl";
import Ingest from "./components/Ingest/Ingest";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

function App() {
  const [navOpen, setNavOpen] = React.useState(false);
  const closeNav = () => setNavOpen(false);
  return (
    <Router>
      <div className="app-layout">
        <button
          className="hamburger"
          aria-label="Open navigation"
          onClick={() => setNavOpen((v) => !v)}
        >
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
        </button>
        <nav className={`main-nav${navOpen ? " open" : ""}`} onClick={closeNav}>
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            <span className="nav-icon" role="img" aria-label="Chat">
              💬
            </span>{" "}
            Chat
          </NavLink>

          <NavLink
            to="/crawl"
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            <span className="nav-icon" role="img" aria-label="Crawl">
              🔎
            </span>{" "}
            Crawl
          </NavLink>
          <NavLink
            to="/ingest"
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            <span className="nav-icon" role="img" aria-label="Ingest">
              📥
            </span>{" "}
            Ingest
          </NavLink>
          <NavLink
            to="/purge"
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            <span className="nav-icon" role="img" aria-label="Purge">
              🗑️
            </span>{" "}
            Purge
          </NavLink>
        </nav>
        <div className="app-content" onClick={closeNav}>
          <Routes>
            <Route path="/chat" element={<ChatContainer />} />
            <Route path="/purge" element={<Purge />} />
            <Route path="/crawl" element={<Crawl />} />
            <Route path="/ingest" element={<Ingest />} />
            <Route path="*" element={<ChatContainer />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
