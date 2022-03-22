import ArtistInLibrary from "../Artist";
export default function ArtistContainer({ data }: any) {
  const artistComponents = data.map((song: any) => (
    <ArtistInLibrary data={song} key={song.id} />
  ));

  // Important for switching back and forth between album, song and page
  return (
    <div className="grid items-stretch gap-4 lg:grid-cols-3 sm:grid-cols-2 justify-items-stretch ">
      {artistComponents}
    </div>
  );
}
