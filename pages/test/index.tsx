import { useEffect } from "react"
import { getPrismaPool } from "../../server_helpers/prismaPool"
import Image from "next/image"

export default function Home({songs}: any) {
  useEffect(() => {
    console.log(songs)
  }, [songs])
  const songComponents = songs.map((song:any)=> (
    <div key={song.id}>
      <h2>{song.title}</h2>
      <pre>{JSON.stringify(song, null, 2)}</pre>
      <Image src={song.metadata.albumArt} width={100} height={100} alt="Album Art" />
    </div>
  ))

  return (
    <>
    <div>Stemify 2 Soonr</div>
    {songComponents}
    </>
  )
}

export async function getServerSideProps() {
  const prisma = getPrismaPool();
  const songs = await prisma.song.findMany({
    where: {
      complete: true
    },
    orderBy: {
      createdAt: "desc"
    },
    select: {
      title: true,
      metadata: true,
    }
  })
  console.log(songs)

  return {
    props: {
      songs
    }
  }
  
}
