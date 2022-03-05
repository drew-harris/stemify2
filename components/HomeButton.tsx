import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
export default function HomeButton() {
  return (
    <Link href="/">
      <div className="m-5 cursor-pointer">
        <FontAwesomeIcon size="lg" icon={faHouse} />
      </div>
    </Link>
  );
}
