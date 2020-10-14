import React from "react";
import Immutable from "immutable";
import jsPDF from "jspdf";
import "jspdf/dist/polyfills.es.js";

import html2canvas from "html2canvas";

import "./DrawArea.css";

var doc = new jsPDF();

class DrawArea extends React.Component {
  constructor() {
    super();

    this.state = {
      lines: new Immutable.List(),
      isDrawing: false,
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mouseup", this.handleMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleMouseUp);
  }

  handleMouseDown(mouseEvent) {
    if (mouseEvent.button !== 0) {
      return;
    }

    const point = this.relativeCoordinatesForEvent(mouseEvent);

    this.setState((prevState) => ({
      lines: prevState.lines.push(new Immutable.List([point])),
      isDrawing: true,
    }));
  }

  handleMouseMove(mouseEvent) {
    if (!this.state.isDrawing) {
      return;
    }

    const point = this.relativeCoordinatesForEvent(mouseEvent);

    this.setState((prevState) => ({
      lines: prevState.lines.updateIn([prevState.lines.size - 1], (line) =>
        line.push(point)
      ),
    }));
  }

  handleMouseUp() {
    this.setState({ isDrawing: false });
  }

  relativeCoordinatesForEvent(mouseEvent) {
    const boundingRect = this.refs.drawArea.getBoundingClientRect();
    return new Immutable.Map({
      x: mouseEvent.clientX - boundingRect.left,
      y: mouseEvent.clientY - boundingRect.top,
    });
  }

  // doc = React.createRef()

  changeColor = (c) => {
    this.setState({ color: c });
  };

  saveDiv = () => {
    const input = document.getElementById("drawit");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "JPEG", 50, 50);
      // pdf.output('dataurlnewwindow');
      pdf.save("download.pdf");
    });
  };

  render() {
    console.log(doc, "iamdoc");
    return (
      <>
        <div className="colors">
          <button
            className="colors__selection"
            style={{ border: "2px solid red" }}
            onClick={() => {
              this.changeColor("red");
              // color = "red";
            }}
          ></button>
          <button
            className="colors__selection"
            style={{ border: "2px solid blue" }}
            onClick={() => {
              this.changeColor("blue");
              // color = "blue";
            }}
          ></button>
          <button
            className="colors__selection"
            style={{ border: "2px solid green" }}
            onClick={() => {
              this.changeColor("green");
              // color = "green";
            }}
          ></button>
          <button
            className="colors__selection"
            style={{ border: "2px solid violet" }}
            onClick={() => {
              this.changeColor("violet");
            }}
          ></button>
        </div>
        <div
          className="drawArea"
          ref="drawArea"
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          id="drawit"
        >
          <Drawing lines={this.state.lines} color={this.state.color} />
        </div>
        <div style={{margin:"20px auto", display:"flex", justifyContent:"center"}} > 
          <button onClick={()=>this.saveDiv("drawit", "draw")}>Download</button>
        </div>
      </>
    );
  }
}

function Drawing({ lines, color }) {
  return (
    <svg className="drawing">
      {lines.map((line, index) => (
        <DrawingLine key={index} line={line} color={color} />
      ))}
    </svg>
  );
}

function DrawingLine({ line, color }) {
  const pathData =
    "M " +
    line
      .map((p) => {
        return `${p.get("x")} ${p.get("y")}`;
      })
      .join(" L ");

  return <path className="path" style={{ stroke: color }} d={pathData} />;
}

export default DrawArea;