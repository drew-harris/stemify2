import Album from "./Album";

export default function AlbumContainer({ data }: any) {
  const albumElements = data.map((song: any) => (
    <Album data={song} key={song.id} />
  ));
  return (
    <div className="grid items-stretch gap-4 lg:grid-cols-3 sm:grid-cols-2 justify-items-stretch ">
      {albumElements}
    </div>
  );
}
