import { useState, useCallback, useEffect } from "react";

//component for moving items
import Scroller from "/components/Scroller";

//for style
import styles from "./Ticker.module.scss";

//ticker item element item is link so used Link El
import Link from "next/link";
import PropTypes from "prop-types";

//play and pause icon, have it any path and include
import PauseIcon from "/public/assets/svg/icons/pause.svg";
import PlayIcon from "/public/assets/svg/icons/play.svg";

//for dummy data
import dummyData from "../../dummyData/tickerData.json";

export default function Ticker({ tickerData, refreshTimeInSec = 5 }) {
	const [tickerDataForScroller, setTickerDataForScroller] =
		useState(tickerData);
	const [scrollerIsOverflown, setScrollerIsOverflown] = useState(null);
	const [mouseState, setMouseState] = useState(null);

	const [animStateFromPlayPauseBtn, setAnimStateFromPlayPauseBtn] =
		useState(null);
	const [noOfDataRefresh, setNoOfDataRefresh] = useState(0);
	const setScrollerOverflowStateInParent = useCallback(
		(scrollerOverflowStatus) => {
			if (scrollerOverflowStatus) {
				setScrollerIsOverflown(true);
			} else {
				setScrollerIsOverflown(false);
			}
		},
		[setScrollerIsOverflown]
	);

	/*START: refresh the data after the comp is mounted and passed certain time*/
	useEffect(() => {
		let timerId;
		let dataRefresh = async () => {
			/*START: fetch data from API , here  used dummy data from file system*/
			//here you can use api to fetch the data for the ticker
			// let newTickerData = await fetchTickerData();
			let newTickerData = dummyData;

			/*END: fetch data from API , here  used dummy data from file system*/

			timerId = setTimeout(dataRefresh, refreshTimeInSec * 1000);
			if (!newTickerData) {
				return;
			}

			/*START: if the data is new then update the ticker*/

			let sameDataAsPrevIteration;

			/*START: this logic is for sky news , modify the isSameData function for ur needs,
			here i am checking only the headlien from prev and new data is same*/

			let isSameData = function (arr1, arr2) {
				// Check if the arrays are the same length
				if (arr1.length !== arr2.length) return false;

				// Check if all items exist and are in the same order
				for (let i = 0; i < arr1.length; i++) {
					if (arr1[i] !== arr2[i]) return false;
				}

				// Otherwise, return true
				return true;
			};
			let oldDataContentHeadlineArray = tickerDataForScroller.contentItems.map(
				(contentItem) => contentItem.headline
			);
			let newDataContentHeadlineArray = newTickerData.contentItems.map(
				(contentItem) => contentItem.headline
			);
			sameDataAsPrevIteration = isSameData(
				newDataContentHeadlineArray,
				oldDataContentHeadlineArray
			);
			/*END: this logic is for sky news , modify the isSameData function for ur needs,
			here i am checking only the headlien from prev and new data is same*/

			if (!sameDataAsPrevIteration) {
				setTickerDataForScroller(newTickerData);
				setNoOfDataRefresh((prevNoOfDataRefresh) => {
					return prevNoOfDataRefresh + 1;
				});
			}
			/*END: if the data is new then update the ticker */
		};

		timerId = setTimeout(dataRefresh, refreshTimeInSec * 1000);

		return () => {
			window.clearTimeout(timerId);
		};
	}, [refreshTimeInSec, tickerDataForScroller]);

	/*END: refresh the data after the comp is mounted and passed certain time*/

	if (!tickerDataForScroller || tickerDataForScroller.length < 1) {
		return null;
	}

	const mouseEnterInScrollerForParent = () => {
		setMouseState("in");
	};
	const mouseLeaveInScrollerForParent = () => {
		setMouseState("out");
	};

	const togglePlayPause = () => {
		setAnimStateFromPlayPauseBtn((prevVal) => {
			if (prevVal === "paused") {
				return "running";
			} else {
				return "paused";
			}
		});
	};

	let iconToShow = () => {
		if (animStateFromPlayPauseBtn) {
			if (animStateFromPlayPauseBtn === "paused") {
				return "play";
			} else {
				if (mouseState === "in") {
					return "play";
				} else {
					return "pause";
				}
			}
		} else {
			if (mouseState === "in") {
				return "play";
			} else {
				return "pause";
			}
		}
	};
	return (
		<div
			className={`${styles.full_bg} ${
				scrollerIsOverflown
					? `${styles.scroller_overflown}`
					: `${styles.scroller_contained}`
			} `}
		>
			<div className={`${styles.cont}`}>
				<div className={`${styles.inner_cont}`}>
					<span className={`${styles.title} ${styles.isbreaking}`}>
						اقتصاد_سكاي
					</span>
					<div className={`${styles.scroller_outer_cont}`}>
						<Scroller
							mouseEnterInScrollerForParent={mouseEnterInScrollerForParent}
							mouseLeaveInScrollerForParent={mouseLeaveInScrollerForParent}
							setScrollerOverflowStateInParent={
								setScrollerOverflowStateInParent
							}
							animStateFromPlayPauseBtn={animStateFromPlayPauseBtn}
							noOfDataRefresh={noOfDataRefresh}
						>
							{tickerDataForScroller.contentItems.map((item) => {
								return (
									/*START: this is the place u need to put ur ticker item*/
									<Link key={item.id} href={item.url}>
										<a className={`${styles.item}`}>
											<span className={`${styles.text}`}>{item.headline}</span>
										</a>
									</Link>
									/*END: this is the place u need to put ur ticker item*/
								);
							})}
						</Scroller>
					</div>
					<button
						aria-label="Toggle Scroller Playing State"
						type="button"
						onClick={togglePlayPause}
						className={`${styles.ctrl_cont} ${iconToShow()}`}
					>
						{iconToShow() === "play" ? (
							<PlayIcon></PlayIcon>
						) : (
							<PauseIcon></PauseIcon>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
/*START: PropTypes For the component*/
Ticker.propTypes = {
	tickerData: PropTypes.object,
	refreshTimeInSec: PropTypes.number,
};
/*END: PropTypes For the component*/
