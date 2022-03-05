import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { DebounceInput } from "react-debounce-input";
import { usePalette } from "react-palette";
import { PropagateLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

function Choice({ songData, setColors }: any) {
  const { data, loading, error } = usePalette(songData.metadata.albumArt);
  useEffect(() => {
    if (data) {
      setColors([data.vibrant, data.darkVibrant]);
    }
  }, [data, setColors]);
  return (
    <div className="flex flex-row items-center justify-between p-4 overflow-hidden text-lg text-left transition-shadow bg-white shadow-sm text-tan-700 sm:4 rounded-xl hover:shadow-md">
      <div className="flex flex-row items-center ">
        <div className="relative w-10 h-10 mr-2 overflow-hidden rounded-lg sm:w-28 sm:h-28 shrink-0 sm:mr-4">
          <Image
            layout="fill"
            src={songData.metadata.albumArt}
            alt={"Album Art for " + songData.metadata.albumTitle}
          />
        </div>
        <div className="" style={{ color: data.darkMuted }}>
          <div className="font-semibold">{songData.title}</div>
          <div className="font-medium">{songData.metadata.artist}</div>
          <div className="font-normal ">{songData.metadata.albumTitle}</div>
          <div className="flex gap-4 mt-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: data.vibrant }}
            ></div>
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: data.darkVibrant }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
              <Choice
                songData={choice}
                key={choice.metadata.spotTrackId}
                setColors={setColors}
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
