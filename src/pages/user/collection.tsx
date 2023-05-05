import { api } from "~/utils/api";import Masonry from "react-masonry-css";
import ImageBox from "~/components/Image";


const breakpoointColumnsObj = {
    default: 4,
    3000: 5,
    2000: 4,
    1200: 3,
    1000: 2,
    500: 1,
}



const CustomMasonaryLayout = () => {
    const {data}=api.images.getUserImages.useQuery()
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

const CollectionPage=()=>{
    return (
        <div className="w-full h-full flex justify-center items-center flex-col">
            <h1 className="ease-in-out duration-300 text-3xl md:text-6xl font-Nota my-16 md:my-20">Your Collection</h1>
            <CustomMasonaryLayout/>
        </div>
    )
}

export default CollectionPage;