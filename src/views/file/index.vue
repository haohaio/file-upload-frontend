<template>
  <div>
    <input type="file" @change="handleFileChange" />
    <el-button type="primary" size="small" @click="handleUpload">上传</el-button>
  </div>
</template>

<script>
import { uploadChunk, mergeChunk } from '@/api/file'
const chunkSize = 1024 * 1024 * 10

export default {
  data() {
    return {
      file: null
    }
  },
  methods: {
    handleFileChange(e) {
      this.file = e.target.files[0]
    },
    async handleUpload() {
      const filename = this.file.name.slice(0, this.file.name.lastIndexOf('.'))
      const fileChunkList = this.createFileChunk(this.file)
      const fileHash = `${filename}_chunks`
      const requestList = fileChunkList.map(({ chunk, index }) => {
        const formData = new FormData()
        formData.append('chunk', chunk)
        formData.append('hash', `${this.file.name}_${index}`)
        formData.append('filename', fileHash)
        // Axios 会自动处理 Content-Type， 无需手动设置 'multipart/form-data'
        return uploadChunk(formData, {
          onUploadProgress: (progress) => {
            console.log(`${this.file.name}_${index}`, progress)
          }
        })
      })

      await Promise.all(requestList)

      this.merge({ filename: this.file.name, fileHash })
    },
    createFileChunk(file, size = chunkSize) {
      const fileChunkList = []
      let index = 0
      let start = index * size
      while ((start = index * size) < file.size) {
        fileChunkList.push({
          chunk: file.slice(start, start + size),
          index
        })
        index++
      }
      return fileChunkList
    },
    merge({ filename, fileHash }) {
      const params = { filename, fileHash, size: chunkSize }
      mergeChunk(params).then(() => {
        console.log(`上传 ${filename} 成功`)
      })
    }
  }
}
</script>
