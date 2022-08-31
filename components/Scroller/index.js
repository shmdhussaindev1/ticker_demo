//no need to modify this file as this will take care of the running ticker

import styles from "./Scroller.module.scss";
import { useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";
import PropTypes from "prop-types";
/* eslint-disable @next/next/no-img-element */
export default function Scroller({
	children,
	speed = 50,
	mouseEnterInScrollerForParent,
	mouseLeaveInScrollerForParent,
	setScrollerOverflowStateInParent,
	animStateFromPlayPauseBtn,
	noOfDataRefresh,
}) {
	const [duration, setDuration] = useState(0);
	const [tickerCanPlay, setTickerCanPlay] = useState(false);
	const [mouseOver, setMouseOver] = useState(false);
	const [finePointerSupported, setFinePointerSupported] = useState(null);
	// const [isMounted, setIsMounted] = useState(false)
	//pre commit hook
	const containerRef = useRef(null);
	const marqueeRef = useRef(null);

	const mouseEnterCallback = () => {
		if (finePointerSupported) {
			setMouseOver(true);
			mouseEnterInScrollerForParent();
		}
	};
	const mouseLeaveCallback = () => {
		if (finePointerSupported) {
			setMouseOver(false);
			mouseLeaveInScrollerForParent();
		}
	};
	useEffect(() => {
		const finePointerMq = window.matchMedia(
			"screen and (any-pointer: fine) and (any-hover: hover) and (min-width: 1024px)"
		);
		setFinePointerSupported(finePointerMq.matches);
	}, []);
	useEffect(() => {
		let resetAnimTimerId;
		let timerIdToCheckCompIsRenderedProperly;
		const calculateWidth = () => {
			let containerWidth;
			let scrollerWidth;
			resetAnimTimerId && window.clearTimeout(resetAnimTimerId);
			timerIdToCheckCompIsRenderedProperly &&
				window.clearTimeout(timerIdToCheckCompIsRenderedProperly);
			// console.log(`noof data refresh: ${noOfDataRefresh}`)
			// Find width of container and width of marquee

			/*START: check the comp is rendered properly by checking the marquees display property is flex*/
			const displayOfMarqueeEl =
				marqueeRef?.current &&
				window.getComputedStyle(marqueeRef.current)?.["display"];
			if (displayOfMarqueeEl !== "flex") {
				timerIdToCheckCompIsRenderedProperly = setTimeout(() => {
					// console.log(
					//     `ticker::: still unablet o find display so poll until u get dispaky flex width ${
					//         marqueeRef.current.getBoundingClientRect().width
					//     }`
					// )
					calculateWidth();
				}, 200);
				return;
			}
			/*END: check the comp is rendered properly by checking the marquees display property is flex*/

			if (marqueeRef.current && containerRef.current) {
				containerWidth = containerRef.current.getBoundingClientRect().width;
				scrollerWidth = marqueeRef.current.getBoundingClientRect().width;
			}
			// console.log(`ticker:::scrollerWidth:::${scrollerWidth}`)
			// console.log(`ticker:::speed:::${speed}`)
			const scrollerAnimationTime = scrollerWidth / speed;
			// console.log(`ticker:::scrollerWidth / speed:::${scrollerWidth / speed}`)

			setDuration(scrollerAnimationTime);

			setTickerCanPlay(false);

			/*START: always scroller width > container width as we have latest news 20 items always greater than container width*/
			// resetAnimTimerId = setTimeout(() => {
			//     setTickerCanPlay(true)
			// }, 100)
			// setScrollerOverflowStateInParent(true)
			if (scrollerWidth > containerWidth) {
				// console.log(`tttt: scrollerWidth: ${scrollerWidth}`)
				// console.log(`tttt: containerWidth: ${containerWidth}`)
				// console.log('tttt: ticker can play')
				resetAnimTimerId = setTimeout(() => {
					setTickerCanPlay(true);
				}, 100);
				setScrollerOverflowStateInParent(true);
			} else {
				// console.log(`tttt: scrollerWidth: ${scrollerWidth}`)
				// console.log(`tttt: containerWidth: ${containerWidth}`)
				// console.log('tttt: ticker can pause')
				setTickerCanPlay(false);
				setScrollerOverflowStateInParent(false);
			}
			/*END: always scroller width > container width as we have latest news 20 items always greater than container width*/
		};
		calculateWidth();
		// Rerender on window resize
		const debouncedResizeCallback = debounce(calculateWidth, 300);
		window.addEventListener("resize", debouncedResizeCallback);
		return () => {
			// console.log(`going to removed, the ticker elem`)
			resetAnimTimerId && window.clearTimeout(resetAnimTimerId);
			timerIdToCheckCompIsRenderedProperly &&
				window.clearTimeout(timerIdToCheckCompIsRenderedProperly);
			window.removeEventListener("resize", debouncedResizeCallback);
		};
	}, [speed, setScrollerOverflowStateInParent, noOfDataRefresh]);

	const animationPlayState = () => {
		if (!tickerCanPlay) {
			return "paused";
		}
		if (animStateFromPlayPauseBtn) {
			if (animStateFromPlayPauseBtn === "paused") {
				return "paused";
			} else {
				if (mouseOver) {
					return "paused";
				} else {
					return "running";
				}
			}
		} else {
			if (mouseOver) {
				return "paused";
			} else {
				return "running";
			}
		}
	};

	return (
		<div
			ref={containerRef}
			onMouseEnter={mouseEnterCallback}
			onMouseLeave={mouseLeaveCallback}
			className={`${styles.scroller_cont}`}
		>
			<div
				ref={marqueeRef}
				style={{
					animationDuration: `${duration}s`,
					animationPlayState: animationPlayState(),
				}}
				className={`${styles.scroller_inner_cont} ${
					!tickerCanPlay ? styles.no_anim : ""
				}`}
			>
				{children}
			</div>
			<div
				style={{
					animationDuration: `${duration}s`,
					animationPlayState: animationPlayState(),
				}}
				className={`${styles.scroller_inner_cont} ${
					!tickerCanPlay ? styles.no_anim : ""
				}`}
			>
				{children}
			</div>
		</div>
	);
}
/*START: PropTypes For the component*/
Scroller.propTypes = {
	children: PropTypes.array,
	speed: PropTypes.number,
	mouseEnterInScrollerForParent: PropTypes.func,
	mouseLeaveInScrollerForParent: PropTypes.func,
	setScrollerOverflowStateInParent: PropTypes.func,
	animStateFromPlayPauseBtn: PropTypes.string,
	noOfDataRefresh: PropTypes.number,
};
/*END: PropTypes For the component*/
