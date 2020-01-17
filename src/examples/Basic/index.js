import React, {Component} from "react";
import "./index.scss";
import Scroll from "../../lib/index";

export default class Basic extends Component {
  render() {
    return (
      <div className="container">
        <Scroll>
          <ol>
            {Array.from({length: 200}).map((line, index) => <li key={index}>Line</li>)}
          </ol>
        </Scroll>
      </div>
    );
  }
}
