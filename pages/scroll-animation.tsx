import { useRef, useEffect, RefObject } from 'react';

const ROWS = 12;
const COLUMNS = 4;

function ScrollAnimation() {
  const entryRefs: RefObject<HTMLDivElement>[][] = Array.from(Array(ROWS), () => Array(COLUMNS).fill(null));
  for (let i = 0; i < entryRefs.length; i++) {
    for (let j = 0; j < entryRefs[i].length; j++) {
      entryRefs[i][j] = useRef<HTMLDivElement>(null);
    }
  }

  function handleScroll() {
    let entry;
    let entryPosition;

    for (let i = 0; i < entryRefs.length; i++) {
      for (let j = 0; j < entryRefs[i].length; j++) {
        entry = entryRefs[i][j].current;
        if (entry) {
          entryPosition = entry.getBoundingClientRect();
          if (entryPosition.bottom >= 0 && entryPosition.top <= window.innerHeight) {
            entry.classList.add('show');
          }
        }
      }
    }
  }

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="container">
      {Array.from(Array(ROWS).keys()).map((_, rowIdx) => {
        return (
          <div key={rowIdx} className="row">
            {Array.from(Array(COLUMNS).keys()).map((_, columnIdx) => (
              <div className="entry" key={columnIdx} ref={entryRefs[rowIdx][columnIdx]}></div>
            ))}
          </div>
        );
      })}
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          width: 800px;
        }
        .row {
          display: flex;
        }
        .entry {
          flex: 1;
          margin: 0 10px 30px;
          height: 300px;
          background-color: skyblue;
          opacity: 0;
          transform: translateY(15px);
          transition: all 1s;
        }
        .entry.show {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}

export default ScrollAnimation;
