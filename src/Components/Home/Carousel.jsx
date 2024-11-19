import React from "react";
import { CCarousel, CCarouselItem, CImage } from "@coreui/react";
import c1 from "../../Asset/Image/c1.jpg";
import c2 from "../../Asset/Image/c2.jpg";
import c3 from "../../Asset/Image/c3.jpg";
import "@coreui/coreui/dist/css/coreui.min.css";
import style from "../../Main.module.css";
const Carousel = () => {
  return (
    <CCarousel controls interval={3000}>
      <CCarouselItem interval={3000}>
        <CImage
          className={`${style.carouselimg} d-block w-100`}
          src={c2}
          alt="slide 2"
        />
      </CCarouselItem>

      <CCarouselItem interval={3000}>
        <CImage
          className={`${style.carouselimg} d-block w-100`}
          src={c1}
          alt="slide 1"
        />
      </CCarouselItem>
      {/* <CCarouselItem interval={3000}>
        <CImage
          className={`${style.carouselimg} d-block w-100`}
          src={c3}
          alt="slide 3"
        />
      </CCarouselItem> */}
    </CCarousel>
  );
};

export default Carousel;
