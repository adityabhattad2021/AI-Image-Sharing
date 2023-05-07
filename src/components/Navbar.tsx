import { useState } from "react";
import { SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

type Props = {
    isInside:boolean,
    isCreate:boolean
}

const Navbar = (props:Props) => {

    const { isSignedIn } = useUser();

    const [toggleDrawer, setToggleDrawer] = useState(false);

    return (
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        <nav className={`ease-in-out duration-300 md:m-7 px-4 md:rounded-3xl ${!props.isCreate && "sticky top-0 md:top-2 z-10 bg-black backdrop-filter backdrop-blur-xl"} ${props.isInside ? "bg-opacity-20" :"bg-opacity-30"}  md:border-black ${!props.isInside && "shadow-[rgba(_0,_0,_0,_0.9)_0px_20px_35px]"}`}>
            <div className="w-full mx-auto px-4">
                <div className="flex items-center justify-between h-24">
                    <Link href="/"><span className="text-3xl text-gray-900 font-bold font-Nota cursor-pointer">PixelMind</span></Link>
                    <div className="hidden space-x-4 text-gray-900 md:flex ease-in-out duration-300">
                        <div className="ease-in-out duration-300  text-black  font-semibold hover:text-white py-4 px-6 m-[-15px] border-black cursor-pointer hover:border-transparent rounded-[18px] font-Nota  text-xl">{isSignedIn && <Link href="/user/collection">Your Collection</Link>}</div>
                        <div className="ease-in-out duration-300  text-black  font-semibold hover:text-white py-4 px-6 m-[-15px]  border-black cursor-pointer hover:border-transparent rounded-[18px] font-Nota  text-xl">{isSignedIn && <Link href="/user/create">Create</Link>}</div>
                        <div className="ease-in-out duration-300  text-black  font-semibold hover:text-white py-4 px-6 m-[-15px]  border-black cursor-pointer hover:border-transparent rounded-[18px]  text-xl font-Nota">{!isSignedIn ? <Link href="/sign-in">Sign In</Link> : <SignOutButton />}</div>
                    </div>
                    <div className="ease-in-out duration-300 inline-flex items-center p-2 ml-3 text-sm text-black rounded-lg md:hidden focus:ring-2 focus:ring-gray-200 hover:bg-black hover:text-white" onClick={() => setToggleDrawer((toggleDrawer) => !toggleDrawer)}>
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                    </div>
                </div>
            </div>
            <div className={`sm:hidden absolute m-5 p-4 flex flex-col gap-3 rounded-2xl top-[105px] right-0 left-0  bg-black backdrop-filter backdrop-blur-lg bg-opacity-30 z-10  py-4 ${!toggleDrawer ? "-translate-y-[100vw]" : "translate-y-0"
                } transition-all duration-700`}>
                <div className="ease-in-out duration-300  flex justify-center backdrop-blur-lg hover:text-black bg-black font-semibold hover:bg-white  text-white font-Nota py-2 px-4  border-black cursor-pointer hover:border-transparent rounded-[20px] text-xl">{isSignedIn && <Link href="/user/collection">Your Collection</Link>}</div>
                <div className="ease-in-out duration-300  flex justify-center backdrop-blur-lg hover:text-black bg-black font-semibold hover:bg-white  text-white font-Nota py-2 px-4  border-black cursor-pointer hover:border-transparent rounded-[20px] text-xl">{isSignedIn && <Link href="/user/create">Create</Link>}</div>
                <div className="ease-in-out duration-300  flex justify-center backdrop-blur-lg hover:text-black bg-black font-semibold hover:bg-white  text-white font-Nota py-2 px-4  border-black cursor-pointer hover:border-transparent rounded-[20px] text-xl">{!isSignedIn ? <Link href="/sign-in">Sign In</Link> : <SignOutButton />}</div>
            </div>
        </nav>
    )
}

export default Navbar;