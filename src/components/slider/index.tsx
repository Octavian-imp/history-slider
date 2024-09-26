import chevronRight from "../../assets/img/chevron-right.svg";
import cn from "clsx";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { FreeMode, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { maxYear, minYear } from "../../lib/utils";
import { HistoryItem } from "../../types/index";
import styles from "./index.module.scss";

type Props = {
  dataset: Array<Array<HistoryItem>>;
};

const HistorySlider = ({ dataset }: Props) => {
  const paginationRef = useRef<HTMLDivElement>(null);

  const startYearRef = useRef<HTMLSpanElement>(null);
  const endYearRef = useRef<HTMLSpanElement>(null);
  const slideHistoryNextRef = useRef<HTMLDivElement>(null);
  const slideHistoryPrevRef = useRef<HTMLDivElement>(null);

  const [activeId, setActiveId] = useState<number>(0);
  const [visibleData, setVisibleData] = useState<HistoryItem[]>(dataset[0]);
  const [startYear, setStartYear] = useState<number>(visibleData[0].year);
  const [endYear, setEndYear] = useState<number>(
    visibleData[visibleData.length - 1].year
  );

  function setNewDataIndex(index: number) {
    if (index === activeId) return;
    const tl = gsap.timeline();
    tl.fromTo(
      `.${styles.history_slider__wrapper}`,
      {
        opacity: 1,
      },
      {
        duration: 0.4,
        opacity: 0,
        onComplete: () => {
          setActiveId(index);
        },
      }
    )
      .to(
        `.${styles.pagination__track}`,
        {
          rotate: `-=${(360 / dataset.length) * (index - activeId)}deg`,
        },
        "<"
      )
      .to(
        `.${styles["track__bullet-btn"]}`,
        {
          rotate: `+=${(360 / dataset.length) * (index - activeId)}deg`,
          onStart: () => {
            (
              document.querySelector(
                `.${styles["track__bullet-btn-active"]}`
              ) as HTMLElement
            ).style.removeProperty("scale");
          },
          onComplete: () => {
            (
              document.querySelector(
                `.${styles["track__bullet-btn-active"]}`
              ) as HTMLElement
            ).style.scale = "2";
          },
        },
        "<"
      )
      .fromTo(
        `.${styles.history_slider__wrapper}`,
        {
          opacity: 0,
        },
        {
          duration: 0.4,
          opacity: 1,
        }
      );
  }

  useEffect(() => {
    const newMaxYear = maxYear(dataset[activeId]);
    const newMinYear = minYear(dataset[activeId]);
    setVisibleData(dataset[activeId]);
    setStartYear(newMinYear);
    setEndYear(newMaxYear);
  }, [activeId, dataset]);

  useEffect(() => {
    gsap.to(startYearRef.current, {
      innerText: startYear,
      duration: 3,
      snap: {
        innerText: 1,
      },
      ease: "power4.out",
    });
    gsap.to(endYearRef.current, {
      innerText: endYear,
      duration: 3,
      snap: {
        innerText: 1,
      },
      ease: "power4.out",
    });
  }, [activeId, startYear, endYear]);

  return (
    <>
      <div ref={paginationRef} className={styles.pagination__container}>
        <div className={styles.pagination__year}>
          <span ref={startYearRef} className={styles.year_start}>
            {startYear}
          </span>
          <span ref={endYearRef} className={styles.year_end}>
            {endYear}
          </span>
        </div>
        <div className={styles.pagination__track}>
          {dataset.map((_, index) => (
            <div
              key={index}
              className={styles.track__bullet}
              style={{
                //@ts-ignore
                "--track-indx": index + 1,
                "--track-max": dataset.length,
              }}
            >
              <button
                type="button"
                className={cn(styles["track__bullet-btn"], {
                  [styles["track__bullet-btn-active"]]: index === activeId,
                })}
                onClick={() => setNewDataIndex(index)}
              >
                <span>{index + 1}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.slider_layout}>
        <div style={{ display: "flex", gap: "40px" }}>
          <div className={styles.slider__actions}>
            <span>
              0{activeId + 1}/0{dataset.length}
            </span>
            <div className={styles.change_data__button}>
              <button
                type="button"
                className={cn(styles["change_data__button-prev"], {
                  [styles["change_data__button-disabled"]]: activeId === 0,
                })}
                onClick={() => {
                  setNewDataIndex(Math.max(activeId - 1, 0));
                }}
              ></button>
              <button
                type="button"
                className={cn(styles["change_data__button-next"], {
                  [styles["change_data__button-disabled"]]:
                    activeId === dataset.length - 1,
                })}
                onClick={() => {
                  setNewDataIndex(Math.min(activeId + 1, dataset.length - 1));
                }}
              ></button>
            </div>
          </div>
          <div className={styles.slider__thumbs}>
            {dataset.map((_, index) => (
              <span
                key={index}
                className={cn(styles.slider__thumb_dot, {
                  [styles["slider__thumb_dot--active"]]: index === activeId,
                })}
              ></span>
            ))}
          </div>
        </div>
        <div className={styles.history_slider__HOC}>
          <div
            ref={slideHistoryPrevRef}
            className={styles.slide__button}
            style={{
              position: "absolute",
              right: "calc(100% + 20px)",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <button type="button" className={styles["slide__button-prev"]}>
              <img src={chevronRight} alt="previous" width={8} height={12} />
            </button>
          </div>

          <Swiper
            modules={[Navigation, FreeMode]}
            spaceBetween={80}
            slidesPerView={3}
            navigation={{
              disabledClass: styles["slide__button-disabled"],
              nextEl: slideHistoryNextRef.current,
              prevEl: slideHistoryPrevRef.current,
            }}
            onBeforeInit={(swiper) => {
              let navOptionsInit = {};
              if (typeof swiper.params.navigation === "object") {
                navOptionsInit = { ...swiper.params.navigation };
              }
              swiper.params.navigation = {
                ...navOptionsInit,
                enabled: true,
                nextEl: slideHistoryNextRef.current,
                prevEl: slideHistoryPrevRef.current,
              };
            }}
            wrapperClass={styles.history_slider__wrapper}
            className={styles.history_slider}
            breakpoints={{
              "320": {
                slidesPerView: 2,
                spaceBetween: 25,
                navigation: {
                  enabled: false,
                },
              },
              "1920": {
                slidesPerView: 3,
                spaceBetween: 80,
                navigation: {
                  enabled: true,
                },
              },
            }}
          >
            {visibleData.map((data) => (
              <SwiperSlide key={data.id} className={styles.history_slide}>
                <h3 className={styles.slide__title}>{data.year}</h3>
                <div className={styles.slide__content}>{data.text}</div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div
            ref={slideHistoryNextRef}
            className={styles.slide__button}
            style={{ right: "-80px", width: "80px" }}
          >
            <button type="button" className={styles["slide__button-next"]}>
              <img src={chevronRight} alt="next" width={8} height={12} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HistorySlider;
