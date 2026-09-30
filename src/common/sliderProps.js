  import {
    A11y,
    Autoplay,
    EffectCreative,
    EffectFade,
    Grid,
    HashNavigation,
    History,
    Keyboard,
    Mousewheel,
    Navigation,
    Pagination,
    Scrollbar,
    Thumbs,
    Virtual,
    Parallax,
    FreeMode,
    Controller,
  } from "swiper/modules";
  
  const customModules = [
    Mousewheel,
    Pagination,
    Navigation,
    EffectFade,
    Autoplay,
    Grid,
    EffectCreative,
    Virtual,
    HashNavigation,
    History,
    Thumbs,
    Scrollbar,
    Keyboard,
    A11y,
    Parallax,
    FreeMode,
    Controller,
  ]

  import "swiper/css";
  import "swiper/css/navigation";
  import "swiper/css/pagination";
  
  export const SliderProps = {
    milHeroSliderOne: {
        modules: customModules,
        slidesPerView: 1,
        speed: 800,
        effect: 'fade',
        parallax: true,
        autoplay: {
            delay: 5000,
        },
        navigation: {
            nextEl: '.mil-hero-slider-next',
            prevEl: '.mil-hero-slider-prev',
        },
        pagination: {
            el: '.mil-hero-slider-pagination',
            clickable: true,
        },
    },
    milHeroSliderTwo: {
        modules: customModules,
        slidesPerView: 1,
        speed: 800,
        effect: 'fade',
        parallax: true,
        autoplay: {
            delay: 5000,
        },
    },
  };
  