export default function SongTest({data}:any) {
  return (
    <div>
      <h2>SongTest</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}