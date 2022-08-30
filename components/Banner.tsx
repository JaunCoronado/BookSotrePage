import Image from "next/image"
import { bannerBg } from "../constants/books"
import { Book } from "../typings";

interface Props {
  books: Book[];
}

function Banner({books}: Props) {

  return (
    <div className="flex flex-col items-center space-y-2 py-16 md:space-y-5 lg:h-[65vh] lg:justify-end lg:pb-1">
      <div className="absolute top-0 left-0 -z-10 h-[95vh] w-screen">
        <Image src={bannerBg}
        layout="fill" objectFit="cover"/>
      </div>
      <h1 className="text-2xl font-bold md:text-4xl lg:text-7xl text-center w-3/5">
        Explore Your Fantasy World With This Books
      </h1>
      <span className="w-full p-0.5 bg-white lg:w-1/3"></span>
      <div className="flex items-center space-x-4">
        <img src={books[1].cover} className={"w-[30%]"}/>
        <img src={books[0].cover} />
        <img src={books[2].cover} className={"w-[30%]"}/>
      </div>
    </div>
  )
}

export default Banner