import { useEffect, useRef } from "react";
import {Cloudinary} from "@cloudinary/url-gen";

const UploadWidget = () => {
  const UploadWidget = () => {
    const cloudinaryRef = useRef();
    const cld = new Cloudinary({cloud: {cloudName: 'dxcnlrsed'}});
    useEffect(() => {
    //   cloudinaryRef.current = window.cloudinary;
    }, []);
  };
};
export default UploadWidget;
