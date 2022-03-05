import { createContext, useState } from "react";
import HomeButton from "../HomeButton";
import LibraryQueue from "../LibraryQueue";

export const queueContext = createContext<any>({
  queueSongs: [],
  setQueueSongs: () => {},
});

export default function Layout({ children }: any) {
  const [queueSongs, setQueueSongs] = useState([]);
  const value = {
    queueSongs,
    setQueueSongs,
  };
  return (
    <div>
      <HomeButton></HomeButton>
      <queueContext.Provider value={value}>
        <div className="grid grid-cols-[1fr_300px] pr-9">
          <div className=" shrink">{children}</div>
          <LibraryQueue />
        </div>
      </queueContext.Provider>
    </div>
  );
}
