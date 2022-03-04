import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <div className="mx-auto text-center text-neutral-800 font-bold text-[28px] mt-32">
        Stemify 2
      </div>
      <div className="flex flex-row   justify-center ">
        <div className="w-24 m-3 h-24 bg-tan-50 rounded-b-md"></div>
        <div className="w-24 m-3 h-24 bg-tan-100"></div>
        <div className="w-24 m-3 h-24 bg-tan-200"></div>
        <div className="w-24 m-3 h-24 bg-tan-250"></div>
        <div className="w-24 m-3 h-24 bg-tan-300"></div>
        <div className="w-24 m-3 h-24 bg-tan-400"></div>
        <div className="w-24 m-3 h-24 bg-tan-500"></div>
        <div className="w-24 m-3 h-24 bg-tan-700"></div>
      </div>
    </>
  );
};

export default Home;
