// import { ReactComponent as UploadIconSvg } from 'src/assets/upload-icon.svg';
import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import useProjectUploadQuery from "./hooks/useUploadProjectQuery";

const chunkSize = 1048576 * 3; // 3MB

const ImportProject = ({ url, token }) => {
  const { uploadChunkQuery } = useProjectUploadQuery();
  const [isDragging, setDraggingStatus] = useState(false);
  const [fileToUpload, setFileToUpload] = useState();
  const [chunkCount, setChunkCount] = useState(0);
  const [uploadUrl, setUploadUrl] = useState(url);
  const counterRef = useRef(0);

  const fileUploadInputRef = useRef(null);
  const onClickUploadFiles = () => fileUploadInputRef.current?.click();
  const onInputClick = (event) => {
    const element = event.target;
    element.value = "";
  };

  const preventEventBubbling = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDragEnter = (e) => {
    preventEventBubbling(e);
    setDraggingStatus(true);
  };

  const onDragLeave = (e) => {
    preventEventBubbling(e);
    setDraggingStatus(false);
  };

  const onDragOver = (e) => {
    preventEventBubbling(e);
    setDraggingStatus(true);
    return false;
  };

  const onDrop = (e) => {
    preventEventBubbling(e);
    setDraggingStatus(false);
    const { files } = e.dataTransfer;
    if (files.length && files.length === 1) {
      onSelectFile(files[0]);
      return;
    }
  };

  const onSelectFile = (file) => {
    const splitName = file.name.split(".");
    const fileExtension = splitName[splitName.length - 1];
    if (fileExtension !== "rmsproj") {
      console.log("Only files of rmsproj type are supported.");
      return;
    }
    const totalCountOfChunk =
      file.size % chunkSize === 0
        ? file.size / chunkSize
        : Math.floor(file.size / chunkSize) + 1;
    setChunkCount(totalCountOfChunk);
    setFileToUpload(file);
    setUploadUrl(url);
  };

  const uploadChunk = async (chunk, chunkNumber) => {
    try {
      const data = await uploadChunkQuery(
        uploadUrl,
        chunkNumber,
        chunk,
        chunkCount,
        token
      );
      if (data.IsSuccess) {
        counterRef.current += 1;
        if (counterRef.current === chunkCount) {
          if (chunkCount === 1) {
            return;
          }
        }
      }
    } catch (error) {
      console.log("File upload failed.");
    }
  };

  useEffect(() => {
    if (uploadUrl && fileToUpload) {
      for (
        let offset = 0, chunkNumber = 1;
        offset < fileToUpload.size;
        offset += chunkSize, chunkNumber += 1
      ) {
        const chunk = fileToUpload.slice(offset, offset + chunkSize);
        uploadChunk(chunk, chunkNumber);
      }
    }
  }, [uploadUrl, fileToUpload]);

  return (
    <Box
      aria-hidden="true"
      sx={{
        border: "1px dashed ",
        cursor: "pointer",
        width: "50%",
        margin: "auto",
        py: 4,
        px: 0,
        backgroundColor: isDragging ? "#fff" : "#bcbcbc",
        mt: 6,
        userSelect: "none",
        borderRadius: 2,
        flexDirection: "column",
        textAlign: "center",
      }}
      onClick={onClickUploadFiles}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <Box
        sx={{
          fontSize: "14px",
          lineHeight: "19.6px",
          color: "secondary.700",
          textAlign: "center",
          mt: 3,
        }}
      >
        <span>Drag and drop a file of rmsproj type.</span>
      </Box>
      <input
        sx={{ display: "none !important" }}
        ref={fileUploadInputRef}
        onChange={(e) => e.target.files && onSelectFile(e.target.files[0])}
        onClick={onInputClick}
        type="file"
        multiple={false}
        accept=".rmsproj"
      />
    </Box>
  );
};

export default ImportProject;
