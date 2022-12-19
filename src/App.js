import React from "react";
import DappContent from "components/DappContent";

function App() {
  return (
    <div>
      <h1>NET Token ICO</h1>
      <h4>Created by Abdullah Mehboob</h4>
      <br />

      <DappContent />
      <br />

      <p>Contact me </p>
      <ul style={{ paddingLeft: "1.4rem" }}>
        <li>
          {" "}
          <a
            href="https://www.linkedin.com/in/abdullah-mehboob-0012a3203/"
            target="_blank"
          >
            Linkedin
          </a>
        </li>
        <li>
          {" "}
          <a href="https://github.com/abdullahmehboob20s" target="_blank">
            Github Profile
          </a>
        </li>
      </ul>
    </div>
  );
}

export default App;
