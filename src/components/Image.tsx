import {useState} from "react";
import Image from "next/image";
import { type RouterOutputs, api } from "~/utils/api";


type ImageType = RouterOutputs["images"]["getAll"]["images"][number];

const ImageBox = (props:ImageType) => {

    return (
        <div className="m-5 ">
            <div
                className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-3xl overflow-hidden transition-all duration-500 ease-in-out"
            >
                <Image
                    src = {props.imageUrl}
                    alt="awesome phote"
                    width={400}
                    height={50}
                />
            </div>
        </div>
    )
}


export default ImageBox;