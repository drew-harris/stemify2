import AlbumInLibrary from "./AlbumInLibrary";

export default function AlbumContainer({ data }: any) {
  const albumElements = data.map((song: any) => (
    <AlbumInLibrary data={song} key={song.id} />
  ));
  if (!data[0]?.artist) {
    return null;
  }
  return (
    <div className="grid items-stretch gap-4 lg:grid-cols-3 sm:grid-cols-2 justify-items-stretch ">
      {albumElements}
    </div>
  );
}
