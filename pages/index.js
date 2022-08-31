import Ticker from "../components/Ticker";
import dummyData from "../dummyData/tickerData.json";
export default function IndexPage() {
	return (
		<div>
			<br></br>
			<br></br>
			<p className="ticker">Ticker Demo</p>
			<br></br>
			<br></br>
			<Ticker refreshTimeInSec={30} tickerData={dummyData}></Ticker>
		</div>
	);
}
