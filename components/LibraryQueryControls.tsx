export default function LibraryQueryControls({ config, setConfig }: any) {
  const setQueryType = (queryType: string) => {
    setConfig({
      ...config,
      page: 0,
      fetchType: queryType,
    });
  };

  const activeClass: string =
    "p-1 px-2 font-semibold text-white transition-transform rounded-lg bg-tan-400 sm:block hover:shadow-md ";

  const inactiveClass: string =
    "p-1 px-2 font-semibold text-tan-400 transition-transform rounded-lg sm:block ";

  return (
    <div className="flex justify-between pb-3 ">
      <div className="flex gap-4 switcher">
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
    </div>
  );
}
