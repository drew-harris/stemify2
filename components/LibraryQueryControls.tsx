export default function LibraryQueryControls({ config, setConfig }: any) {
  const setQueryType = (queryType: string) => {
    setConfig({
      ...config,
      fetchType: queryType,
    });
  };

  return (
    <div className="flex justify-between py-3 mt-4 ">
      <div className="flex gap-4 switcher">
        <button
          className={`p-1 px-2 font-semibold text-white transition-transform rounded-lg ${
            config.fetchType == "songs" ? "bg-tan-400" : "bg-tan-300"
          } hover:shadow-md`}
          onClick={() => setQueryType("songs")}
        >
          Songs
        </button>
        <button
          className={`p-1 px-2 font-semibold text-white transition-transform rounded-lg ${
            config.fetchType == "albums"
              ? "bg-tan-400"
              : "bg-tan-100 text-black"
          } hover:shadow-md`}
          onClick={() => setQueryType("albums")}
        >
          Albums
        </button>
      </div>
    </div>
  );
}
