import ytpl from "ytpl";
export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    console.log("Getting youtube urls from playlist at:", req.body.url);
    const playlistId = req.body.url;
    try {
      if (playlistId) {
        const playlist = await ytpl(playlistId);
        const items = playlist.items.map((item: ytpl.Item) => {
          return item.shortUrl;
        });
        res.json(items);
        return;
      } else {
        res.status(400).json({
          message: "Please provide a playlist url",
        });
      }
    } catch (err) {
      res.status(500).json({
        message: "Something went wrong",
      });
    }
  }
}
