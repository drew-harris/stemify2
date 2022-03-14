import { createContext, useState } from "react";
import HomeButton from "../HomeButton";
import LibraryQueue from "../LibraryQueue";

export const queueContext = createContext<any>({
  queueSongs: [],
  setQueueSongs: () => {},
  setIsUploading: () => {},
  isUploading: false,
});

export default function Layout({ children }: any) {
  const [queueSongs, setQueueSongs] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const value = {
    queueSongs,
    setQueueSongs,
    isUploading,
    setIsUploading,
  };
  return (
    <div>
      <HomeButton></HomeButton>
      <queueContext.Provider value={value}>
        <div className="sm:grid grid-cols-1  sm:grid-cols-[1fr_350px] sm:pr-9">
          <div className=" shrink">{children}</div>
          <LibraryQueue />
        </div>
      </queueContext.Provider>
    </div>
  );
}
