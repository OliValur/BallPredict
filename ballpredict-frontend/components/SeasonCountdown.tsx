import Countdown from "react-countdown";
//TODO: Change the date and timezone to the actual NFL season start date
export default function SeasonCountdown() {
  return (
    <Countdown
      date={new Date(2025, 8, 4, 14, 30, 0)}
      renderer={NFLCountdownRenderer}
    />
  );
}

//TODO: update renderer, add ts type for props
const NFLCountdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return <span style={{ color: "#0b6623" }}>🏈 Enjoy the season! 🏈</span>;
  }

  return (
    <div>
      <div className="bg-nflblue text-white flex flex-row items-center justify-evenly rounded-lg shadow-lg ">
        ⏱️ Kickoff in:
        <div className="flex flex-row ml-7">
          <div>
            <strong>{days}</strong>
            <div>DAYS</div>
          </div>
          <div>
            <strong>{hours}</strong>
            <div>HRS</div>
          </div>
          <div>
            <strong>{minutes}</strong>
            <div>MIN</div>
          </div>
          <div>
            <strong>{seconds}</strong>
            <div>SEC</div>
          </div>
        </div>
      </div>
    </div>
  );
};
