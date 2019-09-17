import objectAssign from 'object-assign';
import React, { Children, cloneElement, createRef, isValidElement, ReactElement, useEffect, useRef } from 'react';
import { Autoplay, Navigation, Pagination, Swiper } from 'swiper/dist/js/swiper.esm';

import { ReactIdSwiperProps, SwiperInstance } from './types';
import { classNames, isModuleAvailable, isReactElement, validateChildren } from './utils';

const modules = [Autoplay, Navigation, Pagination];

Swiper.use(modules);

const ReactIdSwiperClass101 = (props: ReactIdSwiperProps) => {
  const {
    activeSlideKey,
    ContainerEl,
    children,
    containerClass,
    getSwiper,
    navigation,
    noSwiping,
    pagination,
    parallax,
    parallaxEl,
    WrapperEl,
    wrapperClass,
    rebuildOnUpdate,
    renderScrollbar,
    renderPagination,
    renderPrevButton,
    renderNextButton,
    renderParallax,
    rtl,
    scrollbar,
    shouldSwiperUpdate,
    slideClass,
    loop
  } = props;

  // Define swiper ref
  const swiperNodeRef = createRef<HTMLDivElement>();

  // Define swiper instance ref
  const swiperInstanceRef = useRef<SwiperInstance>(null);

  // Initialize modules to use with swiper

  // Get current active slide key
  const getActiveSlideIndexFromProps = () => {
    if (!activeSlideKey || !children) {
      return null;
    }

    let activeSlideId = 0;

    // In loop mode first slide index should be 1
    let id = loop ? 1 : 0;

    Children.forEach(children, (child: ReactElement) => {
      if (isValidElement(child)) {
        if (child.key === activeSlideKey) {
          activeSlideId = id;
        }
        id += 1;
      }
    });

    return activeSlideId;
  };

  // Get swiper instance
  const getSwiperInstance = (swiperInstance: SwiperInstance) => {
    if (typeof getSwiper === 'function') {
      getSwiper(swiperInstance);
    }
  };

  // Initialize swiper
  const buildSwiper = () => {
    if (swiperNodeRef.current && swiperInstanceRef.current === null) {
      swiperInstanceRef.current = new Swiper(swiperNodeRef.current, objectAssign({}, props));
      getSwiperInstance(swiperInstanceRef.current);
    }
  };

  // Destroy swiper
  const destroySwiper = () => {
    if (swiperInstanceRef.current !== null) {
      swiperInstanceRef.current.destroy(true, true);
      swiperInstanceRef.current = null;
      getSwiperInstance(swiperInstanceRef.current);
    }
  };

  // Rebuild swiper
  const rebuildSwiper = () => {
    destroySwiper();
    buildSwiper();
  };

  // Update swiper
  const updateSwiper = () => {
    if (swiperInstanceRef.current !== null) {
      swiperInstanceRef.current.update();
      getSwiperInstance(swiperInstanceRef.current);
    }
  };

  // Render slides
  const renderContent = (e: ReactElement) => {
    if (!isReactElement(e)) {
      return null;
    }

    const slideClassNames = [slideClass, e.props.className];

    if (noSwiping) {
      slideClassNames.push('swiper-no-swiping');
    }

    return cloneElement(e, {
      ...e.props,
      className: slideClassNames.join(' ').trim()
    });
  };

  // Only execute when component is mounted or unmounted
  useEffect(() => {
    buildSwiper();

    const slideToIndex = getActiveSlideIndexFromProps();

    if (swiperInstanceRef.current !== null && slideToIndex !== null) {
      swiperInstanceRef.current.slideTo(slideToIndex);
    }

    return () => destroySwiper();
  }, [buildSwiper, destroySwiper, getActiveSlideIndexFromProps]);

  // Execute each time when props are updated
  useEffect(() => {
    if (swiperInstanceRef.current !== null) {
      if (rebuildOnUpdate) {
        rebuildSwiper();
      } else if (shouldSwiperUpdate) {
        updateSwiper();

        const numSlides = swiperInstanceRef.current.slides.length;

        if (numSlides <= swiperInstanceRef.current.activeIndex) {
          const index = Math.max(numSlides - 1, 0);
          swiperInstanceRef.current.slideTo(index);
        }
      }

      const slideToIndex = getActiveSlideIndexFromProps();

      if (slideToIndex !== null) {
        swiperInstanceRef.current.slideTo(slideToIndex);
      }
    }
  });

  // No render if wrapper elements are not provided or when modules is empty
  if (!Swiper || !children || !ContainerEl || !WrapperEl) {
    return null;
  }

  // Validate children props
  if (!validateChildren(children)) {
    console.warn('Children should be react element or an array of react element!!');
    return null;
  }

  // Check modules are loaded before rendering contents
  const shouldRenderParallax = isModuleAvailable(modules, 'parallax') && parallax && parallaxEl;
  const shouldRenderPagination = isModuleAvailable(modules, 'pagination') && pagination && pagination.el;
  const shouldRenderScrollbar = isModuleAvailable(modules, 'scrollbar') && scrollbar && scrollbar.el;
  const isNavigationModuleAvailable = isModuleAvailable(modules, 'navigation');
  const shouldRenderNextButton = isNavigationModuleAvailable && navigation && navigation.nextEl;
  const shouldRenderPrevButton = isNavigationModuleAvailable && navigation && navigation.prevEl;

  return (
    <ContainerEl className={containerClass} dir={rtl && 'rtl'} ref={swiperNodeRef}>
      {shouldRenderParallax && renderParallax && renderParallax(props)}
      <WrapperEl className={wrapperClass}>{Children.map(children, renderContent)}</WrapperEl>
      {shouldRenderPagination && renderPagination && renderPagination(props)}
      {shouldRenderScrollbar && renderScrollbar && renderScrollbar(props)}
      {shouldRenderNextButton && renderNextButton && renderNextButton(props)}
      {shouldRenderPrevButton && renderPrevButton && renderPrevButton(props)}
    </ContainerEl>
  );
};

const defaultProps: Partial<ReactIdSwiperProps> = {
  containerClass: 'swiper-container',
  wrapperClass: 'swiper-wrapper',
  slideClass: 'swiper-slide',
  ContainerEl: 'div',
  WrapperEl: 'div',
  renderScrollbar: ({ scrollbar }) => (scrollbar ? <div className={classNames(scrollbar.el)} /> : null),
  renderPagination: ({ pagination }) => (pagination ? <div className={classNames(pagination.el)} /> : null),
  renderPrevButton: ({ navigation }) => (navigation ? <div className={classNames(navigation.prevEl)} /> : null),
  renderNextButton: ({ navigation }) => (navigation ? <div className={classNames(navigation.nextEl)} /> : null),
  renderParallax: ({ parallaxEl }) =>
    parallaxEl ? <div className={classNames(parallaxEl.el)} data-swiper-parallax={parallaxEl.value} /> : null
};

ReactIdSwiperClass101.defaultProps = defaultProps;

ReactIdSwiperClass101.displayName = 'ReactIdSwiperClass101';

export default ReactIdSwiperClass101;
