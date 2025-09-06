import React from "react";

import "./Newhome.css";

const Newhome = () => {
  return (
    <>
      <div>
        <div className="main-content">
          <div className="dashboard-container">
            <div className="menu-grid">
              <a className="menu-card" href="/match/4">
                <div className="menu-icon-container">
                  <img
                    src="/imgs/inplay.png"
                    alt="IN PLAY"
                    className="menu-icon"
                  />
                </div>
                <p className="menu-label">IN PLAY</p>
              </a>

              <a className="menu-card " href="/profile">
                <div className="menu-icon-container">
                  <img
                    src="/imgs/profilenew.png"
                    alt="PROFILE"
                    className="menu-icon"
                  />
                </div>
                <p className="menu-label">PROFILE</p>
              </a>
              <a className="menu-card " href="/accountstatement">
                <div className="menu-icon-container">
                  <img
                    src="/imgs/statement.png"
                    alt="STATEMENT"
                    className="menu-icon"
                  />
                </div>
                <p className="menu-label">STATEMENT</p>
              </a>
              <a className="menu-card" href="changepassword">
                <div className="menu-icon-container">
                  <img
                    src="/imgs/password.png"
                    alt="PASSWORD"
                    className="menu-icon"
                  />
                </div>
                <p className="menu-label">PASSWORD</p>
              </a>
              <a className="menu-card " href="/rules">
                <div className="menu-icon-container">
                  <img
                    src="/imgs/rules.png"
                    alt="RULES"
                    className="menu-icon"
                  />
                </div>
                <p className="menu-label">RULES</p>
              </a>
              <a className="menu-card " href="/new-accountstatement">
                <div className="menu-icon-container">
                  <img
                    src="/imgs/ledger.png"
                    alt="LEDGER"
                    className="menu-icon"
                  />
                </div>
                <p className="menu-label">LEDGER</p>
              </a>
              <a className="menu-card " href="casino-in/live-dmd">
                <div className="menu-icon-container">
                  <img
                    src="/imgs/casinon.png"
                    alt="CASINO"
                    className="menu-icon"
                  />
                </div>
                <p className="menu-label">CASINO</p>
              </a>
              <a className="menu-card " href="#">
                <div className="menu-icon-container">
                  <img
                    src="/imgs/matka.png"
                    alt="MATKA"
                    className="menu-icon"
                  />
                </div>
                <p className="menu-label">MATKA</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Newhome;
