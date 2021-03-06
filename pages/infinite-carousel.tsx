import { useRef, useEffect, RefObject } from 'react';

function InfiniteCarousel() {
  /* Ref 선언 및 초기화 */
  const carouselImgContainerRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const carouselImgRefs: RefObject<HTMLDivElement>[] = Array(7).fill(null);
  for (let i = 0; i < carouselImgRefs.length; i++) {
    carouselImgRefs[i] = useRef<HTMLDivElement>(null);
  }

  /* 캐러셀 관련 지역 변수 선언 */
  let carouselImgContainer: HTMLDivElement;
  let carouselImgTotalWidth: number = 0;
  let initialMouseX: number;
  let initialTranslateX: number;

  function handleDragStart(e: Event): void {
    e = (e || window.event) as Event;
    e.preventDefault();

    if (e.type === 'touchstart') {
      initialMouseX = (e as TouchEvent).touches[0].pageX;

      /* Activate handling for move and end */
      carouselImgContainer.addEventListener('touchmove', handleDragOver);
      carouselImgContainer.addEventListener('touchend', handleDragEnd);
    }
    else {
      initialMouseX = (e as DragEvent).pageX;

      /* Activate handling for move and end */
      document.onmousemove = handleDragOver;
      document.onmouseup = handleDragEnd;
    }

    initialTranslateX = Number(carouselImgContainer.style.transform.replace(/translateX\((-?.+)px\)/g, '$1'));

    /* Lock another touch or click until the end of this touch or click */
    carouselImgContainer.removeEventListener('touchstart', handleDragStart);
    carouselImgContainer.removeEventListener('mousedown', handleDragStart);
  }

  function handleDragOver(e: Event): void {
    e = (e || window.event) as Event;

    let newMouseX;
    let newTranslateX;

    if (e.type === 'touchmove') newMouseX = (e as TouchEvent).touches[0].pageX;
    else newMouseX = (e as DragEvent).pageX;
    newTranslateX = initialTranslateX - (initialMouseX - newMouseX);

    /* For infinite loop */
    if (newTranslateX <= 2 * -carouselImgTotalWidth || newTranslateX >= 0) {
      carouselImgContainer.style.transform = `translateX(-${carouselImgTotalWidth}px)`;

      /* Update as if drag started at this time */
      initialMouseX = newMouseX;
      initialTranslateX = -carouselImgTotalWidth;
    }
    else {
      carouselImgContainer.style.transform = `translateX(${newTranslateX}px)`;
    }
  }

  function handleDragEnd(): void {
    /* Deactivate handling for move and end */
    carouselImgContainer.removeEventListener('touchmove', handleDragOver);
    carouselImgContainer.removeEventListener('touchend', handleDragEnd);
    document.onmousemove = null;
    document.onmouseup = null;

    /* Unlock another touch or click */
    carouselImgContainer.addEventListener('mousedown', handleDragStart);
    carouselImgContainer.addEventListener('touchstart', handleDragStart);
  }

  useEffect(() => {
    const carouselImgsToBePrepended = [];
    const carouselImgsToBeAppended = [];

    carouselImgContainer = carouselImgContainerRef.current as HTMLDivElement;

    let carouselImg;
    for (let i = 0; i < carouselImgRefs.length; i++) {
      carouselImg = carouselImgRefs[i].current as HTMLDivElement;
      carouselImgsToBePrepended.push(carouselImg.cloneNode(true));
      carouselImgsToBeAppended.push(carouselImg.cloneNode(true));
      carouselImgTotalWidth += carouselImg.offsetWidth;
    }

    /* Clone and insert images after and before existing images */
    carouselImgContainer.prepend(...carouselImgsToBePrepended);
    carouselImgContainer.append(...carouselImgsToBeAppended);

    /* Adjust position of existing images to the center */
    carouselImgContainer.style.transform = `translateX(-${carouselImgTotalWidth}px)`;

    /* Add drag start event listeners */
    carouselImgContainer.addEventListener('touchstart', handleDragStart);
    carouselImgContainer.addEventListener('mousedown', handleDragStart);
  }, [])

  return (
    <>
      <div className="container">
        <div className="carousel-wrapper">
          <div className="carousel">
            <div className="carousel-img-container" ref={carouselImgContainerRef}>
              <div className="carousel-img red" ref={carouselImgRefs[0]}></div>
              <div className="carousel-img orange" ref={carouselImgRefs[1]}></div>
              <div className="carousel-img yellow" ref={carouselImgRefs[2]}></div>
              <div className="carousel-img green" ref={carouselImgRefs[3]}></div>
              <div className="carousel-img blue" ref={carouselImgRefs[4]}></div>
              <div className="carousel-img indigo" ref={carouselImgRefs[5]}></div>
              <div className="carousel-img purple" ref={carouselImgRefs[6]}></div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .container {
          width: 100%;
          max-width: 50rem;
          padding: 0 1rem;
          margin: 2rem auto 0;
        }
        .carousel-wrapper {
          border: 4px solid #444444;
        }
        .carousel {
          overflow-x: hidden;
        }
        .carousel-img-container {
          display: flex;
          display: -webkit-box;
          display: -ms-flexbox;
          flex-wrap: nowrap;
          -ms-flex-wrap: nowrap;
          flex-wrap: nowrap;
        }
        .carousel-img {
          flex-shrink: 0;
          -ms-flex-negative: 0;
          height: 10rem;
        }
        .carousel-img.red {
          width: 7rem;
          background-color: red;
        }
        .carousel-img.orange {
          width: 9rem;
          background-color: orange;
        }
        .carousel-img.yellow {
          width: 11rem;
          background-color: yellow;
        }
        .carousel-img.green {
          width: 13rem;
          background-color: green;
        }
        .carousel-img.blue {
          width: 12rem;
          background-color: blue;
        }
        .carousel-img.indigo {
          width: 10rem;
          background-color: indigo;
        }
        .carousel-img.purple {
          width: 8rem;
          background-color: purple;
        }
      `}</style>
    </>
  );
}

export default InfiniteCarousel;
