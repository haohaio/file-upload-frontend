<template>
  <div>
    <input type="file" @change="handleFileChange" />
    <el-button type="primary" size="small" @click="handleUpload">上传</el-button>
  </div>
</template>

<script>
import { request } from '@/utils/request'

const SIZE = 10 * 1024 * 1024 // 切片大小

export default {
  data() {
    return {
      file: null,
      chunkData: []
    }
  },
  methods: {
    handleFileChange(e) {
      const [file] = e.target.files
      if (!file) return
      this.file = file
    },
    createFileChunk(file, size = SIZE) {
      const fileChunkList = []
      let cur = 0
      while (cur < file.size) {
        fileChunkList.push(file.slice(cur, cur + size))
        cur += size
      }

      return fileChunkList
    },
    async handleUpload() {
      if (!this.file) return

      const fileChunkList = this.createFileChunk(this.file)
      this.chunkData = fileChunkList.map((chunk, index) => (
        {
          chunk,
          hash: `${this.file.name}-${index}`
        }
      ))

      await this.uploadChunks()
    },
    async uploadChunks() {
      const requestList = this.chunkData.map(({ chunk, hash }) => {
        const formData = new FormData()
        formData.append('chunk', chunk)
        formData.append('hash', hash)
        formData.append('filename', this.file.name)

        return formData
      }).map(async(formData) => {
        return request({
          url: '',
          data: formData
        })
      })

      await Promise.all(requestList)
    }
  }
}
</script>
