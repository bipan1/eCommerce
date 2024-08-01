import axios from 'axios'
import { uploadFileToS3 } from 'utils/generateAwsUrl'

const callPreSignedUrl = async (fileName, fileType) => {
  try {
    const response = await axios.post(
      'http://localhost:3000/api/getSignedUrl',
      { fileName, fileType },
    )
    return response.data.url
  } catch (error) {
    console.error('Error getting signed URL:', error)
  }
}

export const uploadSingleFile = async (file) => {
  const { name, type } = file
  const response = await axios.post('http://localhost:3000/api/getSignedUrl', {
    fileName: name,
    fileType: type,
  })
  const { url } = response.data
  await uploadFileToS3(file, url)
  return url.split('?')[0]
}

export const uploadMultipleFiles = async (images) => {
  const presignedUrls = await Promise.all(
    images.map((file) =>
      callPreSignedUrl(file.originFileObj.name, file.originFileObj.type),
    ),
  )

  await Promise.all(
    images.map((file, index) =>
      uploadFileToS3(file.originFileObj, presignedUrls[index]),
    ),
  )
  return presignedUrls.map((url) => url.split('?')[0])
}
