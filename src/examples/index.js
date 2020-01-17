import "regenerator-runtime/runtime";
import React from "react";
import {render} from "react-dom";
import "./index.scss";
import Basic from "./Basic/index";

// Change this to switch rendered example
const Example = Basic;

render(<Example/>, document.querySelector('#root'));
