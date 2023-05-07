import type { ImagesResponseDataInner } from "openai"
import { useState } from "react"
import { AiOutlineCloseCircle } from "react-icons/ai"
import { api } from "~/utils/api"
import {toast} from "react-hot-toast"

type Props = {
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    generatedImages: ImagesResponseDataInner[]
    prompt:string
}

const Modal = ({ setModalOpen, generatedImages,prompt }: Props) => {

    const [selectedImages, setSelectedImages] = useState<ImagesResponseDataInner[]>([])
    const { mutate,} = api.images.create.useMutation({
        onSuccess: () => {
            toast.success("Images saved successfully!")
            setModalOpen(false);
        }
    })

    const handleImageClick = (image: ImagesResponseDataInner) => {
        if (selectedImages.includes(image)) {
            setSelectedImages(selectedImages.filter((selectedImage) => selectedImage !== image))
        } else {
            setSelectedImages([...selectedImages, image])
        }
    }


    const handleDownload = () => {
        selectedImages.forEach((image) => {
            const url = `${image.url || ""}`;
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("target", "_blank");
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    const handleSaveToCollection = () => {
        const imageUrls:string[] = selectedImages.map((image) => image.url || "");
        mutate({ images: imageUrls,prompt:prompt });
    }

    return (
        <div className="w-full h-screen z-50 backdrop-blur-sm flex justify-center items-center absolute inset-0 ">
            <div className="w-[90%] md:w-[70%] h-[90%] md:h-[70%] bg-white rounded-xl shadow-xl flex flex-col justify-center items-center gap-4 p-4 relative">
                <h1 className="text-2xl md:text-4xl font-Nota font-bold">Select the Images you like...</h1>
                <button className="absolute top-4 right-4" onClick={() => setModalOpen(false)}><AiOutlineCloseCircle size={30} /></button>
                <div className="w-full h-[80%] flex flex-col md:flex-row  overflow-y-auto md:overflow-y-hidden gap-6 p-10">
                    {generatedImages.map((image, index) => (
                        <div key={index} className="w-[95%] md:w-[24%] h-[250px] md:h-[95%] bg-black rounded-2xl shadow-xl flex justify-center items-center" onClick={() => handleImageClick(image)}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={image.url || ""} alt="Generated Image" className={`w-full h-full object-cover rounded-2xl outline-4 ${selectedImages.includes(image) ? "border-blue-500 border-8" : ''} `} style={{ aspectRatio: 1 / 1 }} />
                        </div>
                    ))}
                </div>
                <div className="w-[94%] flex flex-row justify-between mb-7">
                    <button
                        className="w-[45%] h-[60px] bg-black text-white rounded-xl px-4 py-2 hover:bg-white hover:text-black transition duration-300 ease-in-out font-bold font-Nota"
                        onClick={handleSaveToCollection}
                    >Save to Collection</button>
                    <button
                        className="w-[45%] bg-black text-white rounded-xl px-4 py-2 hover:bg-white hover:text-black transition duration-300 ease-in-out font-bold font-Nota"
                        onClick={handleDownload}
                    >Download</button>
                </div>
            </div>
        </div>
    )
}

export default Modal;