import Masonry from "react-masonry-css";
import ImageBox from "./Image";
import { api } from "~/utils/api";


const breakpoointColumnsObj = {
    default: 4,
    3000: 5,
    2000: 4,
    1200: 3,
    1000: 2,
    500: 1,
}



const MasonaryLayout = () => {
    const {data}=api.images.getAll.useQuery()
    
    if(!data){
        return <div>There was some problem loading...</div>
    }

    return (
        <Masonry className="flex animate-slide-fwd md:mt-[-15px] mx-2 md:mx-4" breakpointCols={breakpoointColumnsObj}>
            {data.map((image,_index) => {
                return(
                    <ImageBox key={_index} {...image}/>
                )
            })}
        </Masonry>
    )
}

export default MasonaryLayout