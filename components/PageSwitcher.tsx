import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
export default function PageSwitcher({ page, setPage }: any) {
  return (
    <div className="flex justify-between mt-4 ">
      {page > 0 ? (
        <button
          className="px-4 py-2 font-bold border border-2 rounded border-tan-400 hover:text-white hover:bg-tan-400 "
          onClick={() => setPage(page - 1)}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
      ) : (
        <div></div>
      )}
      <button
        className="px-4 py-2 font-bold border border-2 rounded border-tan-400 hover:text-white hover:bg-tan-400 "
        onClick={() => setPage(page + 1)}
      >
        <FontAwesomeIcon icon={faAngleRight} />
      </button>
    </div>
  );
}
