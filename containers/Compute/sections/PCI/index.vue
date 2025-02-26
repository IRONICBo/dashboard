<template>
  <div>
    <a-tooltip v-if="isPciEmpty" :title="$t('compute.text_146')">
      <span><a-switch :checkedChildren="$t('compute.text_115')" :unCheckedChildren="$t('compute.text_116')" :value="pciEnable" :disabled="true" /></span>
    </a-tooltip>
    <a-form-item class="mb-2" v-else>
      <a-switch :checkedChildren="$t('compute.text_115')" :unCheckedChildren="$t('compute.text_116')" v-decorator="decorators.pciEnable" @change="change" />
    </a-form-item>
    <template v-if="pciEnable">
      <a-form-item v-for="(k, index) in pciForm.fc.getFieldValue('keys')" :key="k">
        <a-row :gutter="[8,0]">
          <a-col :span="4">
            <a-form-item>
              <base-select v-decorator="decorators.pciDevType(k)" :options="realPciDevTypeOptions" @change="(val) => onChangeDevType(val, k)" />
            </a-form-item>
          </a-col>
          <a-col :span="9">
            <a-form-item>
              <base-select v-decorator="decorators.pciModel(k)" :options="realPciOptions" @change="(val) => onChangeModel(val, k)"
                :selectProps="{ placeholder: $t('compute.text_147') }" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="[8,0]">
          <a-col :span="11">
            <a-form-item class="mb-0">
              <a-radio-group v-decorator="decorators.pciCount(k)" @change="(e) => onChangeCount(e, k)">
                <a-radio-button
                  v-for="item in pciCountOptions"
                  :value="item.key"
                  :key="item.key">{{ item.label }}</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-button v-if="index > 0" shape="circle" icon="minus" size="small" @click="remove(k)" />
          </a-col>
        </a-row>
      </a-form-item>
      <div class="d-flex align-items-center mb-2">
        <a-button type="primary" shape="circle" icon="plus" size="small" @click="add" />
        <a-button type="link" @click="add">{{ $t('compute.pci.add_transparent_device') }}</a-button>
      </div>
    </template>
  </div>
</template>

<script>
import { GPU_COUNT_OPTIONS, GPU_DEV_TYPE_OPTION_MAP } from '@Compute/constants'

let id = 0
export default {
  name: 'Pci',
  props: {
    form: {
      type: Object,
      require: true,
    },
    decorators: {
      type: Object,
      validator: val => val.pciEnable && val.pciDevType && val.pciModel && val.pciCount,
    },
    pciDevTypeOptions: {
      type: Array,
      default: () => [],
    },
    pciOptions: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      pciEnable: false,
      pciCountOptions: GPU_COUNT_OPTIONS,
      curPciDevType: '',
    }
  },
  computed: {
    isPciEmpty () {
      return this.pciOptions && this.pciOptions.length === 0
    },
    realPciDevTypeOptions () {
      return this.pciDevTypeOptions.map(item => {
        const vgpuVal = GPU_DEV_TYPE_OPTION_MAP.VGPU.value
        const dev_type = item.dev_type.endsWith(`-${vgpuVal}`) ? vgpuVal : item.dev_type
        return {
          key: dev_type,
          label: GPU_DEV_TYPE_OPTION_MAP[dev_type]?.label || dev_type,
        }
      })
    },
    realPciOptions () {
      return this.pciOptions.filter(item => item.dev_type.endsWith(this.curPciDevType))
    },
  },
  watch: {
    pciEnable (val) {
      if (val) {
        this.init()
      } else {
        const keys = this.pciForm.fc.getFieldValue('keys')
        keys.forEach(key => {
          this.$delete(this.form.fd, `pciDevType[${key}]`)
          this.$delete(this.form.fd, `pciModel[${key}]`)
          this.$delete(this.form.fd, `pciCount[${key}]`)
        })
      }
    },
  },
  beforeCreate () {
    this.pciForm = {}
    this.pciForm.fc = this.$form.createForm(this, { name: 'gpu_form' })
    this.pciForm.fc.getFieldDecorator('keys', { initialValue: [id], preserve: true })
  },
  methods: {
    init () {
      this.initialValue()
    },
    initialValue (id = 0) {
      this.$nextTick(() => {
        this.form.fc.setFieldsValue({
          [`pciDevType[${id}]`]: this.realPciDevTypeOptions[0]?.key,
          [`pciModel[${id}]`]: this.realPciOptions[0]?.key,
          [`pciCount[${id}]`]: 1,
        })
      })
    },
    removeValue (id) {
      this.$delete(this.form.fd, `pciDevType[${id}]`)
      this.$delete(this.form.fd, `pciModel[${id}]`)
      this.$delete(this.form.fd, `pciCount[${id}]`)
    },
    change (val) {
      this.pciEnable = val
      this.$emit('change', val)
    },
    onChangeDevType (val, key) {
      this.curPciDevType = val
      this.form.fc.setFieldsValue({
        [`pciDevType[${key}]`]: val,
        [`pciModel[${key}]`]: this.realPciOptions[0].key,
      })
    },
    onChangeModel (val, key) {
      this.form.fc.setFieldsValue({
        [`pciModel[${key}]`]: val,
      })
    },
    onChangeCount (e, key) {
      this.form.fc.setFieldsValue({
        [`pciCount[${key}]`]: e.target.value,
      })
    },
    add () {
      const { pciForm } = this
      const keys = pciForm.fc.getFieldValue('keys')
      const nextKey = ++id
      const nextKeys = keys.concat(nextKey)
      pciForm.fc.setFieldsValue({ keys: nextKeys })
      this.initialValue(nextKey)
    },
    remove (k) {
      const { pciForm } = this
      const keys = pciForm.fc.getFieldValue('keys')

      if (keys.length === 1) {
        return
      }
      pciForm.fc.setFieldsValue({
        keys: keys.filter(key => key !== k),
      })
      this.removeValue(k)
    },
  },
}
</script>
