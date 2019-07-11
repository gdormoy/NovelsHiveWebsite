import axios from 'axios'

export default function (url, file, name = '') {
  if (typeof url !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof url}`)
  }

  const formData = new FormData()
  formData.append(name, file)
  const config = {
    headers: {
      'content-type': 'multipart/form-data'
    }
  }

  console.log('>> name >> ', name)
  console.log('>> typeof file >> ', typeof file)
  console.log('>> formData >> ', formData)

  return axios.post(url, formData, config)
};
