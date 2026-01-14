import React, { useState, useEffect } from 'react';
import { evaluate, format } from 'mathjs';

export const ScientificCalculator = ({ initialData }) => {
  const [expression, setExpression] = useState(initialData?.expression || "0");
  const [isRadians, setIsRadians] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (initialData?.expression) {
        setExpression(initialData.expression);
    }
  }, [initialData]);

  const insert = (val) => {
    if (expression === "0" || expression === "Error") {
        setExpression(val);
    } else {
        setExpression(prev => prev + val);
    }
  };

  const clear = () => setExpression("0");
  const del = () => setExpression(prev => prev.length > 1 ? prev.slice(0, -1) : "0");

  const calculate = () => {
    let raw = expression;

    // Replace visual symbols for mathjs
    raw = raw.replace(/π/g, 'pi');
    raw = raw.replace(/e/g, 'e');
    raw = raw.replace(/×/g, '*');
    raw = raw.replace(/÷/g, '/');
    raw = raw.replace(/√/g, 'sqrt');

    // Handle functions
    // Note: mathjs 'log' is natural log (ln). 'log10' is base 10.
    // Our UI buttons insert 'ln(' and 'log('
    raw = raw.replace(/ln\(/g, 'log(');
    raw = raw.replace(/log\(/g, 'log10(');

    try {
        // We override trig functions in the scope to handle degrees if needed.
        // Mathjs usually works in radians.
        const scope = {
            sin: (x) => isRadians ? Math.sin(x) : Math.sin(x * Math.PI / 180),
            cos: (x) => isRadians ? Math.cos(x) : Math.cos(x * Math.PI / 180),
            tan: (x) => isRadians ? Math.tan(x) : Math.tan(x * Math.PI / 180),
            asin: (x) => isRadians ? Math.asin(x) : Math.asin(x) * 180 / Math.PI,
            acos: (x) => isRadians ? Math.acos(x) : Math.acos(x) * 180 / Math.PI,
            atan: (x) => isRadians ? Math.atan(x) : Math.atan(x) * 180 / Math.PI,
        };

        const res = evaluate(raw, scope);

        if (typeof res !== 'number' && !res.toString) {
             throw new Error("Invalid result");
        }

        // Format to avoid long decimals
        const final = format(res, { precision: 10 });

        setExpression(final.toString());
        setHistory(prev => [`${expression} = ${final}`, ...prev].slice(0, 10));

    } catch (err) {
        console.error(err);
        setExpression("Error");
    }
  };

  return (
    <div className="bg-gemini-surface p-4 rounded-xl shadow-lg w-full max-w-lg mx-auto border border-white/5">
        <div className="bg-gemini-dark p-4 rounded-lg mb-4 text-right border border-white/10 relative">
             <div className="absolute top-2 left-2 text-xs text-gray-500 cursor-pointer flex gap-2" onClick={() => setIsRadians(!isRadians)}>
                <span className={isRadians ? "text-blue-400 font-bold" : "text-gray-600"}>RAD</span>
                <span className="text-gray-700">|</span>
                <span className={!isRadians ? "text-blue-400 font-bold" : "text-gray-600"}>DEG</span>
             </div>
             <div className="text-gray-500 text-xs h-4 overflow-hidden mb-1">{history[0]}</div>
             <div className="text-3xl font-mono text-white break-all">{expression}</div>
        </div>

        <div className="grid grid-cols-4 gap-2">
            <Btn onClick={() => insert('sin(')} secondary>sin</Btn>
            <Btn onClick={() => insert('cos(')} secondary>cos</Btn>
            <Btn onClick={() => insert('tan(')} secondary>tan</Btn>
            <Btn onClick={() => insert('π')} secondary>π</Btn>

            <Btn onClick={() => insert('ln(')} secondary>ln</Btn>
            <Btn onClick={() => insert('log(')} secondary>log</Btn>
            <Btn onClick={() => insert('e')} secondary>e</Btn>
            <Btn onClick={() => insert('√(')} secondary>√</Btn>

            <Btn onClick={() => insert('(')} secondary>(</Btn>
            <Btn onClick={() => insert(')')} secondary>)</Btn>
            <Btn onClick={() => insert('^')} secondary>xʸ</Btn>
            <Btn onClick={() => insert('!')} secondary>x!</Btn>

            <Btn onClick={clear} danger>AC</Btn>
            <Btn onClick={del} danger>DEL</Btn>
            <Btn onClick={() => insert('%')} secondary>%</Btn>
            <Btn onClick={() => insert('÷')} accent>÷</Btn>

            {[7,8,9].map(n => <Btn key={n} onClick={() => insert(n.toString())}>{n}</Btn>)}
            <Btn onClick={() => insert('×')} accent>×</Btn>

            {[4,5,6].map(n => <Btn key={n} onClick={() => insert(n.toString())}>{n}</Btn>)}
            <Btn onClick={() => insert('-')} accent>−</Btn>

            {[1,2,3].map(n => <Btn key={n} onClick={() => insert(n.toString())}>{n}</Btn>)}
            <Btn onClick={() => insert('+')} accent>+</Btn>

            <Btn onClick={() => insert('0')} className="col-span-2">0</Btn>
            <Btn onClick={() => insert('.')}>.</Btn>
            <Btn onClick={calculate} primary>=</Btn>
        </div>
    </div>
  );
};

const Btn = ({ children, onClick, className='', primary, secondary, accent, danger }) => {
    let base = "h-12 rounded-lg font-medium transition-all active:scale-95 flex items-center justify-center ";
    if (primary) base += "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20";
    else if (secondary) base += "bg-gemini-surface border border-white/10 hover:bg-white/5 text-blue-300 text-sm";
    else if (accent) base += "bg-white/5 hover:bg-white/10 text-purple-300";
    else if (danger) base += "bg-red-500/10 hover:bg-red-500/20 text-red-400";
    else base += "bg-white/5 hover:bg-white/10 text-gray-200";

    return (
        <button className={`${base} ${className}`} onClick={onClick}>
            {children}
        </button>
    );
};
