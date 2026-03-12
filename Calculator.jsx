import "./styles.css";

import { useState, useCallback } from "react";

const buttons = [
  ["AC", "+/-", "%", "mod"],
  ["mod", "abs", "sqrt", "÷"],
  ["7", "8", "9", "x"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["0", ".", "="],
];

export default function App() {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState(null);
  const [op, setOp] = useState(null);
  const [fresh, setFresh] = useState(true);
  const [expr, setExpr] = useState("");

  const calculate = (a, b, operator) => {
    switch (operator) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "x":
        return a * b;
      case "÷":
        return b !== 0 ? a / b : "Error";
      case "mod":
        return a % b;
      case "abs":
        return Math.abs(a);
      case "sqrt":
        return Math.sqrt(a);
      case "pow":
        return Math.pow(a, b);
      default:
        return b;
    }
  };

  const fmt = (n) => {
    if (n === "Error") return n;
    const s = parseFloat(n.toPrecision(10)).toString();
    return s.length > 12 ? parseFloat(n.toExponential(5)).toString() : s;
  };

  const handle = useCallback(
    (val) => {
      if ("0123456789".includes(val)) {
        if (fresh) {
          setDisplay(val);
          setFresh(false);
        } else {
          setDisplay((d) => (d.length < 12 ? (d === "0" ? val : d + val) : d));
        }
      } else if (val === ".") {
        if (fresh) {
          setDisplay("0.");
          setFresh(false);
        } else if (!display.includes(".")) setDisplay((d) => d + ".");
      } else if (val === "AC") {
        setDisplay("0");
        setPrev(null);
        setOp(null);
        setFresh(true);
        setExpr("");
      } else if (val === "+/-") {
        setDisplay((d) =>
          d === "0" ? "0" : d.startsWith("-") ? d.slice(1) : "-" + d
        );
      } else if (val === "abs") {
        setDisplay((d) => (d.startsWith("-") ? d.slice(1) : d));
        setExpr("abs(" + display + ")");
      } else if (val === "%") {
        setDisplay((d) => fmt(parseFloat(d) / 100));
      } else if (["+", "-", "x", "÷", "mod", "sqrt", "pow"].includes(val)) {
        const cur = parseFloat(display);
        if (prev !== null && !fresh) {
          const res = calculate(prev, cur, op);
          setDisplay(fmt(res));
          setPrev(typeof res === "number" ? res : cur);
        } else {
          setPrev(cur);
        }
        setOp(val);
        if (val === "sqrt") {
          setExpr("sqrt(" + display + ")");
        } else if (val === "pow") {
          setExpr(display + " ^ ");
        } else {
          setExpr(display + " " + val);
        }
        setFresh(true);
      } else if (val === "=") {
        if (op && prev !== null) {
          const cur = parseFloat(display);
          const res = calculate(prev, cur, op);
          if (op === "sqrt") {
            setExpr("sqrt(" + prev + ")");
          } else if (op === "pow") {
            setExpr(prev + " ^ " + display);
          } else {
            setExpr(prev + " " + op + " " + display);
          }
          setDisplay(fmt(res));
          setPrev(null);
          setOp(null);
          setFresh(true);
        }
      }
    },
    [display, prev, op, fresh]
  );

  const isOp = (v) =>
    ["+", "-", "x", "÷", "mod", "abs", "sqrt", "pow"].includes(v);

  return (
    <div className="main">
      <div className="calc">
        <div className="label">Calculator</div>
        <div className="display-wrap">
          <div className="expr">{expr || ""}</div>
          <div className="display-num">{display}</div>
        </div>
        <div className="grid">
          {buttons.flat().map((btn, i) => (
            <button
              key={i}
              className={[
                "btn",
                btn === "0" ? "zero" : "",
                isOp(btn) ? "op" : "",
                btn === "AC" ? "ac" : "",
                btn === op && !fresh ? "active-op" : "",
              ].join(" ")}
              onClick={() => handle(btn)}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
