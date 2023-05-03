import Masonry from "react-masonry-css";
import ImageBox from "./Image";


const breakpoointColumnsObj = {
    default: 4,
    3000: 5,
    2000: 4,
    1200: 3,
    1000: 2,
    500: 1,
}



const MasonaryLayout = () => {

    const imageLinks = [
        "https://images.pexels.com/photos/15415634/pexels-photo-15415634.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
        "https://images.pexels.com/photos/16067013/pexels-photo-16067013.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
        "https://images.pexels.com/photos/16090503/pexels-photo-16090503.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
        "https://images.pexels.com/photos/15415634/pexels-photo-15415634.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
      ];
      
      const size = 50;
      const images = [];
      
      for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * imageLinks.length);
        images.push(imageLinks[randomIndex]);
      }
      

    return (
        <Masonry className="flex animate-slide-fwd md:mt-[-15px] mx-2 md:mx-4" breakpointCols={breakpoointColumnsObj}>
            {images.map((image,_index) => {
                return(
                    <ImageBox key={_index} image={image!}/>
                )
            })}
        </Masonry>
    )
}

export default MasonaryLayout