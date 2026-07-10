import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function ImageSwiper({
  images = [],
  autoplayDelay = 3000,
  effect = "fade",
  className = "",
}) {
  const pagination = {
    clickable: true,
    renderBullet: function (className) {
      return `<span class="${className} custom-bullet"></span>`;
    },
  };

  const handleSlideChange = (swiper) => {
    const bullets = document.querySelectorAll(
      ".swiper-pagination .custom-bullet",
    );

    bullets.forEach((el) => {
      el.classList.remove("swiper-slide-active");
    });

    if (bullets[swiper.realIndex]) {
      bullets[swiper.realIndex].classList.add("swiper-slide-active");
    }
  };

  return (
    <>
      <style>
        {`
          .swiper-pagination {
            bottom: 12px !important;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 5px;
          }

          .custom-bullet {
            width: 16px;
            height: 4px;
            background: rgba(255,255,255,0.5);
            border-radius: 999px;
            transition: all .3s ease;
          }

          .swiper-slide-active.custom-bullet {
            width: 32px;
            background: white;
          }
          .hide-bullet .swiper-pagination {
            display: none !important;
          }
        `}
      </style>

      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        slidesPerView={1}
        spaceBetween={0}
        effect={effect}
        loop
        autoplay={{
          delay: autoplayDelay,
          disableOnInteraction: false,
        }}
        pagination={pagination}
        onSlideChange={handleSlideChange}
        className={`h-full w-full ${className}`}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image.src}
              alt={image.alt || `Slide ${index + 1}`}
              className="h-full w-full sm:object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
