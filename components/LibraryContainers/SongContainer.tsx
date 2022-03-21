import Song from "../Songs/Song";

export default function SongContainer({ data }: any) {
  const songComponents = data.map((song: any) => (
    <Song data={song} key={song.id} />
  ));
  return (
    <div className="grid items-stretch gap-4 lg:grid-cols-3 sm:grid-cols-2 justify-items-stretch ">
      {songComponents}
    </div>
  );
}
