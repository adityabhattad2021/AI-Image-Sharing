import Image from "next/image";
import type { ImagesResponseDataInner } from "openai";
import { useState, useEffect } from "react";
import logo from "~/assets/openai.png";
import Modal from "~/components/ImageModal";
import { api } from "~/utils/api";


const Create = () => {
    const [isMobile, setIsMobile] = useState(false)
    const [what, setWhat] = useState("");
    const [description, setDescription] = useState("")
    const [generatedImages, setGeneratedImages] = useState<ImagesResponseDataInner[]>([])
    const [modalOpen, setModalOpen] = useState(false)


    const getTextInsideAngleBrackets = (str: string): string => {
        const regex = /\<(.*?)\>/g;
        const matches = str.match(regex);
        const result = matches ? matches.map((match) => match.replace(/\<|\>/g, "")) : [];
        return result.join("");
    }

    const { mutate: getPrompt, isLoading: isGettingPrompt } = api.images.generatePrompt.useMutation({
        onSuccess: (data) => {
            if (!data) {
                console.log("There was some error while fetching the suggestion string");
                return;
            }
            const cleanData = getTextInsideAngleBrackets(data)
            setDescription(cleanData);
        }
    })

    const { mutate: getImages, isLoading: isGettingImages } = api.images.generateImages.useMutation({
        onSuccess: (data) => {
            if (!data) {
                console.log("There was some error while fetching the generated images");
                
                return;
            }
            console.log(data);
            setModalOpen(true)
            setGeneratedImages(data);
        }
    })



    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768) // change the breakpoint as per your requirement
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])


    return (
        <>
            {modalOpen && <Modal setModalOpen={setModalOpen} generatedImages={generatedImages}/>}
            <div className="w-[93%] md:w-[95%] overflow-hidden h-screen  flex flex-col md:justify-center items-center gap-6 mx-4 mt-[80px] md:my-auto relative">
                <h1 className="text-5xl md:text-6xl font-Nota mt-8 md:mt-30">Create</h1>
                <div className="flex flex-col mt-4 w-full md:w-[900px] gap-6">
                    <div className="w-full flex flex-col md:flex-row gap-2">
                        <input className="placeholder-black duration-400 ease-in-out w-full md:w-[75%] h-[60px] font-Nota font-bold backdrop-filter backdrop-blur-lg bg-opacity-10 bg-black focus:ring-white focus:border-white focus:shadow-lg p-4 rounded-[20px]" value={what} onChange={(e) => setWhat(e.target.value)} placeholder="What do you want to create?" />
                        {
                            !isMobile && (
                                <>
                                    <button className="ease-in-out w-[16%] duration-300  text-white bg-black font-semibold hover:text-black hover:bg-white py-4 px-6   border-black cursor-pointer hover:border-transparent rounded-[18px]  text-xl" onClick={() => getImages({ description: description })} >Generate</button>
                                    <button className="ease-in-out duration-300 w-full md:w-[7%] h-[60px] rounded-[20px] bg-[#00A67E] hover:bg-green-400 mt-4 md:mt-0 flex justify-center items-center " onClick={() => {
                                        setDescription("Generating an awesome image description for you...")
                                        getPrompt({ what: what })
                                    }}><Image src={logo} alt="OpenAI Icon" width={45} height={45} /></button>
                                </>
                            )
                        }

                    </div>
                    <div className="w-full">
                        <textarea name="detailedDescription" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe as precisely as possible..." cols={30} rows={6} className="w-full rounded-[20px] placeholder-black transition-400 ease-in-out font-Nota font-bold backdrop-filter backdrop-blur-lg bg-opacity-10 bg-black focus:ring-white focus:border-white focus:shadow-lg p-4"></textarea>
                    </div>
                    <div className="w-full h-[70px] md:h-[350px] rounded-[30px] duration-400 ease-in-out flex justify-center items-center font-Nota font-bold backdrop-filter backdrop-blur-lg bg-opacity-10 bg-black focus:ring-white focus:border-white focus:shadow-lg p-4">
                        <label htmlFor="imagefile" className="cursor-pointer text-black font-Nota font-bold">&#x2022; Or select an existing image</label>
                        <input id="imagefile" type="file" className="hidden" />
                    </div>
                    {isMobile && <div className="w-full h-[70px] md:h-[350px] flex justify-around items-center ">
                        <button className="ease-in-out w-[45%] duration-300  text-white bg-black font-semibold hover:text-black hover:bg-white py-4 px-6   border-black cursor-pointer hover:border-transparent rounded-[18px]  text-xl">
                            Generate
                        </button>
                        <button className="ease-in-out w-[45%] duration-300  text-white bg-black font-semibold hover:text-black hover:bg-white py-4 px-6   border-black cursor-pointer hover:border-transparent rounded-[18px]  text-xl">
                            Ask?
                        </button>
                    </div>}
                </div>
            </div>
        </>
    )
}

export default Create;