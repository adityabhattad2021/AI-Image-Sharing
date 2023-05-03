import {useState} from "react";
import { MdDownloadForOffline } from 'react-icons/md';
import Image from "next/image";

type Props = {
    image:string;
}

const ImageBox = (props:Props) => {
    const [postHovered,setPostHovered] = useState(false);
    
   
    

    return (
        <div className="m-5 ">
            <div
                onMouseEnter={()=>setPostHovered(true)}
                onMouseLeave={()=>setPostHovered(false)}
                className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-3xl overflow-hidden transition-all duration-500 ease-in-out"
            >
                <Image
                    src = {props.image}
                    alt="awesome phote"
                    width={400}
                    height={50}
                    
                />
                {
                    postHovered && (
                        <div className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50" style={{height:
                        "100%"}}>
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    <div className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none">
                                        <MdDownloadForOffline/>
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


export default ImageBox;