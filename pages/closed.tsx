import * as config from "../config.json";
import Countdown from "react-countdown";
export default function Closed() {
  return (
    <div className="grid h-screen text-2xl place-items-center">
      <Countdown
        date={config.releaseDate + 3000}
        onComplete={() => location.reload()}
      />
    </div>
  );
}
