import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import Script from "next/script";
import Head from "next/head";
export default function HomeButton() {
  return (
    <>
      <Head>
        <link
          href="https://use.fontawesome.com/releases/vVERSION/css/svg-with-js.css"
          rel="stylesheet"
        ></link>
      </Head>

      <Link href="/">
        <div className="m-5 overflow-hidden cursor-pointer max-w-9 max-h-9">
          <FontAwesomeIcon
            fontSize={10}
            size="lg"
            className="overflow-hidden w-30 h-30"
            icon={faHouse}
          />
        </div>
      </Link>
    </>
  );
}
