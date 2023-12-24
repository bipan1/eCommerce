import axios from 'axios'
import { uploadFileToS3 } from 'utils/generateAwsUrl'

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
