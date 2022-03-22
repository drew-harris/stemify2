export default function Song({ data, limit }: any) {
  // Generate random string from length
  let letter = "a";
  let title = letter.repeat(Math.random() * 10 + 5);
  let album = letter.repeat(Math.random() * 10 + 9);
  return (
    <div className="flex flex-row items-center justify-between p-2 overflow-hidden transition-shadow bg-white shadow-sm sm:4 rounded-xl hover:shadow-md">
      <div className="flex flex-row ">
        <div className="relative w-8 h-8 mr-2 overflow-hidden bg-gray-200 sm:w-12 sm:h-12 shrink-0 rounded-2xl sm:mr-4"></div>
        <div className="">
          <div className="font-semibold text-transparent bg-gray-200 rounded-md w-min ">
            {title}
          </div>
          <div className="font-semibold text-transparent bg-gray-200 rounded-md w-min ">
            {album}
          </div>
        </div>
      </div>
    </div>
  );
}
