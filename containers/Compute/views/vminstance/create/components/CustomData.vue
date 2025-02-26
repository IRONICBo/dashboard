<template>
  <a-form-item :label="$t('compute.custom_data')" :extra="form.fd.custom_data_type ? customDataExtra : ''">
    <a-radio-group v-decorator="decorators.custom_data_type" class="mb-2" @change="handleTypeChange">
      <a-radio-button value="">{{ $t('compute.text_116') }}</a-radio-button>
      <a-radio-button value="input">{{ $t('compute.custom_data_input') }}</a-radio-button>
      <a-radio-button value="file">{{ $t('compute.custom_data_file') }}</a-radio-button>
    </a-radio-group>
    <div style="max-width: 800px" class="mt-2">
      <code-mirror v-if="form.fd.custom_data_type === 'input'" v-model="codeMirrorData" :options="cmOptions" @input="handleCodeInput" />
    </div>
    <div style="max-width: 800px" class="mt-2 mb-2">
      <a-upload-dragger
        v-if="form.fd.custom_data_type === 'file'"
        list-type="text"
        :beforeUpload="beforeUpload"
        :remove="handleRemove"
        :fileList="fileList"
        :accept="accept">
        <div class="pt-3 pb-3">
          <p class="ant-upload-drag-icon"><a-icon type="inbox" /></p>
          <p class="ant-upload-text">{{$t('system.text_505')}}</p>
          <p class="ant-upload-hint">{{$t('compute.custom_data_file_limit')}}</p>
        </div>
      </a-upload-dragger>
    </div>
    <div v-if="errorTip" class="err-tip">
      {{errorTip}}
    </div>
  </a-form-item>
</template>

<script>
import 'codemirror/theme/material.css'
import 'codemirror/addon/edit/matchbrackets'
// import yaml from 'js-yaml'
import * as R from 'ramda'

export default {
  props: {
    decorators: Object,
    form: Object,
  },
  data () {
    return {
      cmOptions: {
        tabSize: 2,
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        theme: 'material',
        mode: 'application/json',
        lint: true,
        matchBrackets: true,
      },
      fileList: [],
      errorTip: '',
      codeMirrorData: '',
      customData: [],
      accept: '.sh,.json,.yaml',
    }
  },
  computed: {
    isKvm () {
      return this.form.fd.hypervisor === 'kvm'
    },
    customDataExtra () {
      return this.isKvm ? this.$t('compute.custom_data_temp') : this.$t('compute.custom_data.extra')
    },
  },
  methods: {
    handleRemove (file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    beforeUpload (file) {
      if (file.size > 32768) {
        this.$message.error(this.$t('compute.custom_data_file_limit'))
        return false
      }
      var reader = new FileReader()// 这里是核心！！！读取操作就是由它完成的。
      reader.readAsText(file)// 读取文件的内容

      reader.onload = (info) => {
        const result = info.target.result

        if (this.isKvm) {
          const isRight = this.checkFileData(result)
          if (!isRight) {
            file.status = 'error'
            this.$message.error(this.$t('compute.custom_data_error1'))
          } else {
            this.fileList = [file]
            this.customData = result
          }
        } else {
          this.fileList = [file]
          this.customData = result
        }
      }
      return false
    },
    checkFileData (val) {
      let isRight = true
      let result = {}
      try {
        result = JSON.parse(val)
      } catch (error) {
        result = val
      }
      if (R.is(Array, result)) {
        result.map(item => {
          if (!item.path || !item.content || !item.action) {
            isRight = false
          }
        })
      } else {
        return false
      }
      return isRight
    },
    handleTypeChange () {
      this.errorTip = ''
      this.fileList = []
      this.codeMirrorData = ''
      this.customData = []
    },
    async handleInputChange (e) {
      await this.$nextTick()
      const { _value } = e.target
      try {
        const vstr = JSON.stringify(_value)
        const isRight = this.checkFileData(vstr)
        if (isRight) {
          this.customData = vstr
          this.errorTip = ''
        } else {
          this.errorTip = '格式错误'
        }
      } catch (err) {
        console.error('解析失败')
      }
    },
    handleCodeInput (_value) {
      if (this.isKvm) {
        this.doCheck(_value)
      } else {
        this.customData = _value
      }
    },
    doCheck (_value) {
      try {
        if (!_value) {
          this.customData = []
          this.errorTip = ''
          return
        }
        const isRight = this.checkFileData(_value)
        if (isRight) {
          this.customData = _value
          this.errorTip = ''
        } else {
          this.errorTip = this.$t('compute.custom_data_error1')
        }
      } catch (err) {
        this.errorTip = this.$t('compute.custom_data_error1')
      }
    },
  },
}
</script>

<style lang="less" scoped>
.err-tip {
  color: red;
}
</style>
