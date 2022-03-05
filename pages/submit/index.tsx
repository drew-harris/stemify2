import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { DebounceInput } from "react-debounce-input";
import { usePalette } from "react-palette";
import { PropagateLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import BigSong from "../../components/BigSong";

export default function SubmitPage() {
  const [inputLink, setInputLink] = useState("");
  const [choices, setChoices] = useState([]);
  const [choicesLoading, setChoicesLoading] = useState(false);

  const [colors, setColors] = useState(["#FF0000", "#0000FF"]);

  const inputEl: any = useRef(null);

  const getChoices = async (url: string) => {
    try {
      setChoicesLoading(true);
      setChoices([]);
      const response = await fetch("/api/youtube", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url, limit: 1 }),
      });
      const data = await response.json();
      console.log(data);
      setChoices(data);
      setChoicesLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const submit = async () => {
    try {
      const song: any = choices[0];
      song.innerColor = colors[0];
      song.outerColor = colors[1];

      // Reset
      setChoices([]);
      setChoicesLoading(true);

      const url = inputLink;
      setInputLink("");

      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          data: song,
        }),
      });
      const data = await response.json();
      console.log(data);
      setChoicesLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <Link href="/">
        <div className="m-5 cursor-pointer">
          <FontAwesomeIcon size="lg" icon={faHouse} />
        </div>
      </Link>
      <div className="flex flex-col items-center gap-4 p-4 mt-24 text-center sm:p-9 PAGE">
        <DebounceInput
          minLength={3}
          itemRef={inputEl}
          debounceTimeout={500}
          className="px-3 py-1 disabled:bg-white text-black transition-shadow shadow-sm w-auto text-center sm:w-[26rem] accent-tan-500 rounded-xl focus:shadow-lg border-tan-500 placeholder:text-tan-200"
          placeholder="YOUTUBE LINK"
          disabled={choicesLoading}
          value={inputLink}
          onChange={(e) => {
            getChoices(e.target.value);
            setInputLink(e.target.value);
          }}
        ></DebounceInput>
        {choicesLoading && (
          <div className="mt-24">
            <PropagateLoader color={"#544738"} loading={choicesLoading} />
          </div>
        )}
        {choices.length > 0 ? (
          <div className="flex flex-row items-center justify-center gap-4 pt-8 mx-auto mb-10">
            {choices.map((choice: any) => (
              <BigSong
                songData={choice}
                setColors={setColors}
                width="auto"
                key={choice.metadata.spotTrackId}
              />
            ))}
          </div>
        ) : null}

        {choices.length > 0 ? (
          <button
            className="p-1 px-2 ml-2 font-semibold text-white rounded-xl first-letter:transition-transform bg-tan-400 hover:shadow-md hover:scale-105"
            onClick={submit}
          >
            SUBMIT
          </button>
        ) : null}
      </div>
    </div>
  );
}
