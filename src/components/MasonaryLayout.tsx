import Masonry from "react-masonry-css";
import ImageBox from "./Image";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import useScrollPosition from "~/hooks/useScrollPosition";
import Loading from "./Loading";


const breakpoointColumnsObj = {
    default: 4,
    3000: 5,
    2000: 4,
    1200: 3,
    1000: 2,
    500: 1,
}



const MasonaryLayout = () => {

    const { data, hasNextPage, fetchNextPage, isFetching } = api.images.getAll.useInfiniteQuery({ limit: 10 }, { getNextPageParam: (lastPage) => lastPage.nextCursor })
    const scrollPosition = useScrollPosition()
    const images = data?.pages.flatMap((page) => page.images) ?? [];


    useEffect(() => {
        if (scrollPosition && scrollPosition > 95 && hasNextPage && !isFetching) {
            void fetchNextPage()
        }
    }, [scrollPosition, hasNextPage, isFetching, fetchNextPage])


    return (
        <>
            <Masonry className="flex animate-slide-fwd md:mt-[-15px] mx-2 md:mx-4" breakpointCols={breakpoointColumnsObj}>
                {images.map((image, _index) => {
                    return (
                        <ImageBox key={_index} {...image} />
                    )
                })}
            </Masonry>
            <div className="w-full flex justify-center font-bold font-Nota text-xl mb-4">
                No More Images.
            </div>
        </>
    )
}

export default MasonaryLayout