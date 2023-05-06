import { type RouterOutputs, api } from "~/utils/api";import Masonry from "react-masonry-css";
import { useState } from "react";
import Image from "next/image";
import { MdDeleteForever } from "react-icons/md";



type ImageType = RouterOutputs["images"]["getAll"][number];

const UserImageBox = (props:ImageType) => {
    
    const ctx = api.useContext();
    const [postHovered,setPostHovered] = useState(false);

    const {mutate}=api.images.delete.useMutation({
        onSuccess:()=>{
            void ctx.images.getUserImages.invalidate();
            console.log("Deleted")
        }
    })

    return (
        <div className="m-5 ">
            <div
                onMouseEnter={()=>setPostHovered(true)}
                onMouseLeave={()=>setPostHovered(false)}
                className="relative cursor-pointer w-auto hover:shadow-lg rounded-3xl overflow-hidden transition-all duration-500 ease-in-out"
            >
                <Image
                    src = {props.imageUrl}
                    alt="awesome phote"
                    width={400}
                    height={50}
                    
                />
                {
                    postHovered && (
                        <div className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50" style={{height:
                        "100%"}}>
                            <div className="flex items-center justify-between absolute bottom-3 right-3">
                                <div className="flex gap-2">
                                    <div className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none" onClick={()=>{
                                        mutate({id:props.id})
                                    }}>
                                        <MdDeleteForever/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}



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
                    <UserImageBox key={_index} {...image}/>
                )
            })}
        </Masonry>
    )
}

const CollectionPage=()=>{
    return (
        <div className="w-full h-full flex justify-center items-center flex-col">
            <h1 className="ease-in-out duration-300 text-4xl md:text-6xl font-Nota my-12 md:my-20">Your Collection</h1>
            <CustomMasonaryLayout/>
        </div>
    )
}

export default CollectionPage;