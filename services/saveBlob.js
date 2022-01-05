const { BlobServiceClient } = require("@azure/storage-blob");
const getStream = require("into-stream");

const ONE_MEGA_BYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGA_BYTE, maxBuffer: 10 };
const containerName = "auth-with-social-media";

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_CONNECTION_STRING
);

const generateBlobName = (fileName) => {
  const [name, extension] = fileName.split(".");
  const numberRandom = Math.floor(Math.random() * 10000);
  return `${name}-${Date.now()}-${numberRandom}.${extension}`;
};

const getUrlBlob = (blobName) => {
  return `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${containerName}/${blobName}`;
};

/**
 *
 * @param {String} fileName the original file name
 * @param {Buffer} file the file to be uploaded
 * @returns {Promise<string[String]|*[Error]>} return a promise that after resolve return an Array [URL, ERROR]
 */
const saveBlob = async (fileName, file) => {
  const blobName = generateBlobName(fileName);
  const stream = getStream(file);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  try {
    const { bufferSize, maxBuffer } = uploadOptions;
    await blockBlobClient.uploadStream(stream, bufferSize, maxBuffer);
    const blobUrl = getUrlBlob(blobName);
    return [blobUrl, null];
  } catch (err) {
    console.log({ err });
    return [null, err];
  }
};

module.exports = saveBlob;
