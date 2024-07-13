// src/components/TreeSketch.js
import React, { useState, useRef, useEffect } from 'react';
import p5 from 'p5';

const TreeSketch = () => {
  const sketchRef = useRef();
  const [words, setWords] = useState([]);
  const [input, setInput] = useState('');

  const addWord = () => {
    if (input.trim() !== '') {
      setWords([...words, input]);
      setInput('');
    }
  };

  useEffect(() => {
    const sketch = (p) => {
      const wordArray = [...words];
      let maxDepth = words.length;

      p.setup = () => {
        p.createCanvas(600, 600);
        p.angleMode(p.DEGREES);
        p.noLoop();
      };

      p.draw = () => {
        p.background(255);
        p.translate(p.width / 2, p.height);
        drawBranch(100, 0, 0);
      };

      const drawBranch = (len, depth, angleOffset) => {
        if (depth === maxDepth) return;
        
        p.push();
        p.rotate(angleOffset);
        p.line(0, 0, 0, -len);
        p.translate(0, -len);
        if (depth < wordArray.length) {
          p.fill(0);
          p.noStroke();
          p.textSize(16);
          p.textAlign(p.CENTER, p.BOTTOM);
          p.text(wordArray[depth], 0, 0);
        }
        const newAngle = p.random(-20, 20);
        drawBranch(len * 0.67, depth + 1, newAngle);
        p.pop();
      };

      p.myCustomRedrawAccordingToNewPropsHandler = (newProps) => {
        if (newProps.words !== words) {
          maxDepth = newProps.words.length;
          p.redraw();
        }
      };
    };

    let myp5 = new p5(sketch, sketchRef.current);

    return () => myp5.remove();
  }, [words]);

  return (
    <div>
      <h1>Growing Tree</h1>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a word"
        />
        <button onClick={addWord}>Add Word</button>
      </div>
      <div ref={sketchRef}></div>
    </div>
  );
};

export default TreeSketch;
