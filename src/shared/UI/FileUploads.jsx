import React, { useRef, useState, useEffect } from "react";

//COMPONENTS
import Backdrop from "./Backdrop";

//CSS
import classes from "../../styles/fileuploads.module.css";

//ICONS
import FilmIcon from "../../assets/icons/films-icon";
import FileIcon from "../../assets/icons/file-icon";
import ImageIcon from "../../assets/icons/image-icon";
import MusicIcon from "../../assets/icons/music-icon";
import AddIcon from "../../assets/icons/add-icon";
import SendIcon from "../../assets/icons/send-icon";
import AudioFileIcon from "../../assets/icons/audioFile-icon";
import AudioWaveIcon from "../../assets/icons/audioWave-icon";

// file accept types
const TYPES = {
  IMAGE: ".jpg,.png,.jpeg,.gif,.bmp,.svg",
  VIDEO: ".mp4,.mov,.wmv,.avi,.mkv,.flv",
  AUDIO: ".mp3,.wav,.m4a,.ogg,.flac",
  FILE: ".doc,.pdf,.ppt,.xls,.zip,.rar,.txt,.csv",
};

const FileUpload = (props) => {
  const filePickerRef = useRef();
  const [files, setFiles] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewURLs, setPreviewURLs] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fileType, setFileType] = useState("");

  useEffect(() => {
    if (!files.length) {
      return;
    }
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewURLs((prev) => [...prev, fileReader.result]);
      };
      fileReader.readAsDataURL(file);
    }
  }, [files]);

  useEffect(() => {
    if (previewURLs.length) {
      setShowPreview(true);
      props.close();
    }
  }, [previewURLs]);

  const pickedHandler = (event) => {
    let pickedFiles = [];
    console.log(event.target.files);
    if (event.target.files) {
      pickedFiles = Array.from(event.target.files);
      setFiles(pickedFiles);
    }
  };

  const filePickHandler = (type) => {
    setFileType(type);
    props.close();
    setTimeout(() => {
      filePickerRef.current.click();
    }, 400);
  };

  const closePreviewHandler = () => {
    setShowPreview(false);
    setPreviewURLs([]);
    setFiles([]);
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
  };

  //bytes to Mega bytes
  const getFormattedFileSize = (fileSize) => {
    const fileSizeInMB = fileSize / 1000000;
    const formattedFileSize = fileSizeInMB.toFixed(3);
    return formattedFileSize;
  };

  return (
    <>
      {showPreview && (
        <Backdrop
          onClick={closePreviewHandler}
          style={{ "background-color": "transparent" }}
        />
      )}
      <input
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        multiple
        accept={fileType}
        onChange={pickedHandler}
      />
      {showPreview && (
        <div className={classes["preview-container"]}>
          <div className={classes["preview"]}>
            {fileType === TYPES.IMAGE && (
              <img src={previewURLs[currentImageIndex]} alt="image preview" />
            )}
            {fileType === TYPES.VIDEO && (
              <video
                src={previewURLs[currentImageIndex]}
                alt="video preview"
                controls
                playsInline
                muted
              />
            )}
            {fileType === TYPES.AUDIO && (
              <div className={classes.audioPreview}>
                <h3>{files[currentImageIndex]?.name}</h3>
                <div className={classes.audioPreviewTemplate}>
                  <div className={classes.APTIcon}>
                    <AudioWaveIcon />
                  </div>
                  <h4>
                    {getFormattedFileSize(files[currentImageIndex].size)} MB
                  </h4>
                </div>
                <audio
                  src={previewURLs[currentImageIndex]}
                  alt="audio preview"
                  controls
                  muted
                />
              </div>
            )}
          </div>
          <div className={classes["preview-footer"]}>
            {previewURLs && previewURLs.length > 1 && (
              <div className={classes.smallPreview}>
                {previewURLs.map((previewURL, i) => (
                  <div
                    key={i}
                    onClick={() => handleImageClick(i)}
                    className={classes.previewToggle}
                  >
                    {fileType === TYPES.IMAGE && (
                      <img src={previewURL} alt="preview toggle" />
                    )}
                    {fileType === TYPES.VIDEO && <video src={previewURL} />}
                    {fileType === TYPES.AUDIO && (
                      <span className={classes.audioFilePreview}>
                        <AudioFileIcon />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            <span onClick={() => filePickHandler(fileType)}>
              <AddIcon />
            </span>
            <span>
              <SendIcon />
            </span>
          </div>
        </div>
      )}
      <div
        className={`${classes["upload-container"]} ${
          props.show ? classes.show : ""
        }`}
      >
        <div onClick={() => filePickHandler(TYPES.VIDEO)}>
          <FilmIcon />
        </div>
        <div onClick={() => filePickHandler(TYPES.FILE)}>
          <FileIcon />
        </div>
        <div onClick={() => filePickHandler(TYPES.IMAGE)}>
          <ImageIcon />
        </div>
        <div onClick={() => filePickHandler(TYPES.AUDIO)}>
          <MusicIcon />
        </div>
      </div>
    </>
  );
};

export default FileUpload;
