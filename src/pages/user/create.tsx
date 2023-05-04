import { useState, useEffect } from "react";

const fileTypes = ["JPG"];

const Create = () => {
    const [isMobile, setIsMobile] = useState(false)

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
        <div className="w-[93%] md:w-screen h-screen  flex flex-col md:justify-center items-center gap-6 mx-4 mt-[80px] md:my-auto">
            <h1 className="text-5xl md:text-6xl font-Nota mt-8 md:mt-30">Create</h1>
            <div className="flex flex-col mt-4 w-full md:w-[900px] gap-6">
                <div className="w-full flex flex-col md:flex-row gap-2">
                    <input className="w-full md:w-[84%] h-[60px] rounded-[20px] bg-slate-600" />
                    {
                        !isMobile && (
                            <>
                                <input className="w-full md:w-[7%] h-[60px] rounded-[20px] bg-slate-600 mt-4 md:mt-0" />
                                <input className="w-full md:w-[7%] h-[60px] rounded-[20px] bg-slate-600 mt-4 md:mt-0" />
                            </>
                        )
                    }

                </div>
                <div className="w-full">
                    <textarea name="detailedDescription" cols={30} rows={6} className="w-full rounded-[20px] bg-slate-500"></textarea>
                </div>
                <div className="w-full h-[70px] md:h-[350px] rounded-[30px] bg-slate-800 flex justify-center items-center">
                    <label htmlFor="imagefile" className="cursor-pointer text-white">Choose a file</label>
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
    )
}

export default Create;