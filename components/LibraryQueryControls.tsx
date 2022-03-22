import { useRef, useState } from "react";
import { DebounceInput } from "react-debounce-input";

export default function LibraryQueryControls({ config, setConfig }: any) {
  const inputEl: any = useRef(null);
  const setQueryType = (queryType: string) => {
    setConfig({
      ...config,
      page: 0,
      fetchType: queryType,
    });
  };

  const getDisplayValue = (value: any) => {
    if (value == "date") {
      return "Recent";
    } else if (value == "poularity") {
      return "Popular";
    } else if (value == "downloads") {
      return "Downloads";
    }
  };

  const activeClass: string =
    "p-1 px-2 font-semibold text-white transition-transform rounded-lg bg-tan-400 sm:block hover:shadow-md ";

  const inactiveClass: string =
    "p-1 px-2 font-semibold text-tan-400 transition-transform rounded-lg sm:block ";

  return (
    <div className="flex flex-col justify-between gap-4 pb-3 mt-3 md:flex-row md:gap-0">
      <div className="flex flex-col md:gap-4 switcher md:flex-row">
        <button
          className={config.fetchType === "songs" ? activeClass : inactiveClass}
          onClick={() => setQueryType("songs")}
          disabled={config.fetchType === "songs"}
        >
          Songs
        </button>
        <button
          className={
            config.fetchType === "albums" ? activeClass : inactiveClass
          }
          onClick={() => setQueryType("albums")}
          disabled={config.fetchType === "albums"}
        >
          Albums
        </button>
        <button
          className={
            config.fetchType === "artists" ? activeClass : inactiveClass
          }
          onClick={() => setQueryType("artists")}
          disabled={config.fetchType === "artists"}
        >
          Artists
        </button>
      </div>
      {/* Sort */}
      <div className="flex flex-col gap-3 md:flex-row">
        <DebounceInput
          minLength={3}
          itemRef={inputEl}
          debounceTimeout={500}
          className="px-3 py-1 text-center text-black transition-shadow rounded-lg shadow-sm disabled:bg-white accent-tan-500 focus:shadow-lg border-tan-500 "
          placeholder="Search"
          onChange={(e) => {
            console.log(e.target.value);
            setConfig({
              ...config,
              query: e.target.value,
            });
          }}
        ></DebounceInput>
        <select
          className="p-1 px-2 transition-transform bg-white rounded-lg sm:block hover:shadow-md"
          onChange={() => {
            setConfig({
              ...config,
              page: 0,
              sort: (document.getElementById("sort") as HTMLSelectElement)
                .value,
            });
          }}
          id="sort"
          value={config.sort}
        >
          <option value="date">Recent</option>
          <option value="popularity">Popular</option>
          <option value="downloads">Downloads</option>
        </select>
      </div>
    </div>
  );
}
