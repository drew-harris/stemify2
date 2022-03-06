import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { config } from "@fortawesome/fontawesome-svg-core";
import Head from "next/head";
import { useEffect } from "react";
export default function HomeButton() {
  useEffect(() => {
    config.autoAddCss = false;
  }, []);
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
