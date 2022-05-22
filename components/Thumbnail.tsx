import Image from "next/image"
import { baseUrlThumbnail } from "../constants/movie"
import { Movie } from "../typings"

interface Props {
  movie: Movie
}

function Thumbnail({movie}: Props) {
  return (
    <div className="relative h-28 min-w-[180px] cursor-pointer transition duration-200
    ease-out md:h-36 md:min-w-[286px] md:hover:scale-105">
      <Image src={`${baseUrlThumbnail}${movie?.backdrop_path || movie?.poster_path}`}
      className="rounded-sm object-cover md:rounded"  layout="fill"/>
    </div>
  )
}

export default Thumbnail