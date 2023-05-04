import Masonry from "react-masonry-css";
import ImageBox from "./Image";


const breakpoointColumnsObj = {
    default: 4,
    3000: 5,
    2000: 4,
    1200: 3,
    1000: 2,
    500: 1,
}



const MasonaryLayout = () => {

      

    return (
        <Masonry className="flex animate-slide-fwd md:mt-[-15px] mx-2 md:mx-4" breakpointCols={breakpoointColumnsObj}>
            {/* {images.map((image,_index) => {
                return(
                    <ImageBox key={_index} image={image!}/>
                )
            })} */}
        </Masonry>
    )
}

export default MasonaryLayout