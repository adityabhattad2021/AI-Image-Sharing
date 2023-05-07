import { AiOutlineCloseCircle } from "react-icons/ai"
import { default as NextImage } from "next/image";
import { api } from "~/utils/api";
import type { ImagesResponseDataInner } from "openai";
import {toast} from "react-hot-toast"

type ConfirmModalProps = {
    image: File
    setOpenConfirmVariationModal: React.Dispatch<React.SetStateAction<boolean>>
    setImageForVariation: React.Dispatch<React.SetStateAction<File>>
    setGeneratedImages:React.Dispatch<React.SetStateAction<ImagesResponseDataInner[]>>
    setImageModal:React.Dispatch<React.SetStateAction<boolean>>
}


const ConfirmModal = (props: ConfirmModalProps) => {

    const { mutate } = api.images.generateVariations.useMutation({
        onSuccess: (data) => {
            props.setOpenConfirmVariationModal(false);
            props.setGeneratedImages(data);
            toast.success("Variations generated successfully");
            props.setImageModal(true);
        }
    })

    const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<File> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');

                    // Set the new width and height of the canvas
                    canvas.width = maxWidth;
                    canvas.height = maxHeight;

                    // Draw the uploaded image onto the canvas and resize it
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img as CanvasImageSource, 0, 0, maxWidth, maxHeight);

                    // Convert the canvas to a new resized image
                    canvas.toBlob((blob) => {
                        const newFile = new File([blob!], file.name, { type: 'image/png' });
                        resolve(newFile);
                    }, 'image/png', 0.75);
                };
            };
        });
    }

    const getResizedImage = async (file: File) => {
        const resizedImage = await resizeImage(file, 500, 500);
        return resizedImage;
    }

    const handleConfirm = async (): Promise<void> => {
        const resizedImage = await getResizedImage(props.image);
        const reader = new FileReader();
        reader.readAsDataURL(resizedImage);
        reader.onload = () => {
            const base64String = reader.result?.toString().split(",")[1];
            mutate({ imageFile: base64String });
        };
    };


    return (
        <div className="w-full h-screen z-50 backdrop-blur-sm flex justify-center items-center absolute inset-0">
            <div className="w-[80%] md:w-[40%] h-[50%] md:h-[89%] bg-white rounded-xl shadow-xl flex flex-col justify-center items-center gap-4 p-4 relative">
                <h1 className="text-2xl md:text-4xl font-Nota font-bold mt-5">Confirm</h1>
                <button className="absolute top-4 right-4" onClick={() => {
                    props.setOpenConfirmVariationModal(false)
                }}><AiOutlineCloseCircle size={30} /></button>
                <div className="w-[75%] h-[75%] mt-5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <NextImage src={URL.createObjectURL(props.image)} alt="Image for variation" width={50} height={50} className="w-full h-full rounded-2xl" style={{ aspectRatio: 1 / 1 }} />

                </div>
                <div className="w-[75%] h-[100px] flex flex-row justify-between mt-5">
                    <button className="ease-in-out duration-300 flex justify-center items-center rounded-2xl bg-black hover:bg-white text-white hover:text-black font-bold font-Nota px-5 py-3 w-[45%]" onClick={() => {
                        props.setOpenConfirmVariationModal(false)
                    }}>Cancel</button>
                    {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                    <button className="ease-in-out duration-300 flex justify-center items-center rounded-2xl bg-black hover:bg-white text-white hover:text-black font-bold font-Nota px-5 py-3 w-[45%]" onClick={() => handleConfirm()}>Confirm</button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal;