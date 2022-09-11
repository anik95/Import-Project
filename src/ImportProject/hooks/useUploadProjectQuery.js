import axios from "axios";

const useProjectUploadQuery = () => {
  const instance = axios.create({
    withCredentials: true,
    baseURL: "BASE_URL",
  });
  const uploadChunkQuery = async (
    uploadUrl,
    chunkNumber,
    chunk,
    chunkCount,
    token
  ) => {
    const response = await instance.put(
      `${chunkCount === 1 ? uploadUrl : `${uploadUrl}/${chunkNumber}`}`,
      chunk,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const { data } = response;
    return data;
  };

  const uploadUrlQuery = async (FileId, FileName, FileSizeInBytes) => {
    const response = axios.get(`/storage/GetFileUploadUrl`, {
      params: {
        FileId,
        FileName,
        FileSizeInBytes,
      },
    });
    const { data } = await response;
    if (data.IsSuccess) {
      return data.SuccessResponse.UploadUrl;
    }
    throw new Error(data.FailedResponse);
  };

  return {
    uploadChunkQuery,
    uploadUrlQuery,
  };
};

export default useProjectUploadQuery;
