import * as R from 'ramda'
import { keySecretFields } from '@Cloudenv/views/cloudaccount/constants'

export default {
  props: {
    provider: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      form: {
        fc: this.$form.createForm(this, {
          onValuesChange: this.handleValuesChange,
        }),
        fd: {
          domain: '',
          share_mode: 'account_domain',
        },
      },
      keySecretFieldInit: keySecretFields[this.provider.toLowerCase()],
      formLayout: {
        wrapperCol: {
          md: { span: 18 },
          xl: { span: 19 },
          xxl: { span: 21 },
        },
        labelCol: {
          md: { span: 8 },
          xl: { span: 5 },
          xxl: { span: 3 },
        },
      },
      domainProjectShow: false,
      decorators: {
        project: [
          'project',
          {
            initialValue: this.$store.getters.userInfo.projectId,
            rules: [
              { validator: this.handleProject, message: this.$t('rules.project'), trigger: 'change' },
            ],
          },
        ],
        share_mode: [
          'share_mode',
          {
            initialValue: 'account_domain',
            rules: [{ required: true }],
          },
        ],
      },
      shareModeOptions: [
        { key: 'account_domain', label: this.$t('cloudenv.text_285') },
        { key: 'provider_domain', label: this.$t('cloudenv.text_286') },
        { key: 'system', label: this.$t('cloudenv.text_287') },
      ],
    }
  },
  computed: {
    keySecretField () {
      return keySecretFields[this.provider.toLowerCase()]
    },
    isAliyun () {
      return this.provider.toLowerCase() === 'aliyun'
    },
    extra () {
      const shareModeExtra = {
        account_domain: this.$t('cloudenv.text_288', [this.$t('dictionary.cloudaccount'), this.$t('dictionary.domain'), this.$t('dictionary.project'), this.$t('dictionary.cloudaccount')]),
        provider_domain: this.$t('cloudenv.text_293', [this.$t('dictionary.domain'), this.$t('dictionary.project'), this.$t('dictionary.cloudaccount'), this.$t('dictionary.project')]),
        system: this.$t('cloudenv.text_296', [this.$t('dictionary.domain'), this.$t('dictionary.project'), this.$t('dictionary.cloudaccount')]),
      }
      return shareModeExtra[this.form.fd.share_mode]
    },
  },
  watch: {
    provider (val) {
      this.decorators = this.getDecorators()
    },
  },
  activated () { // 使 DomainProject 组件避免被缓存住
    this.domainProjectShow = true
  },
  deactivated () {
    this.domainProjectShow = false
    if (this.keepAliveFields) return
    this.form.fc.resetFields()
  },
  created () {
    this.$bus.$on('updateAutoCreate', (v) => {
      this.handleProjectChange(v)
    })
  },
  methods: {
    validateForm () {
      return new Promise((resolve, reject) => {
        this.form.fc.validateFields((err, values) => {
          if (err) {
            reject(err)
          } else {
            const params = {}
            R.forEachObjIndexed((value, key) => {
              if (R.is(String, value)) {
                params[key] = value.trim()
              } else {
                params[key] = value
              }
            }, values)
            resolve(params)
          }
        })
      })
    },
    project_change () {
      const proxySettingref = this.$refs.proxySetting
      if (proxySettingref && proxySettingref.fetchQueryProxy) {
        // 根据域获取代理列表信息
        proxySettingref.fetchQueryProxy()
      }
    },
    async handleValuesChange (vm, changedFields) {
      // await this.$nextTick()
      const fields = Object.keys(changedFields)
      if (changedFields && fields.length > 0) {
        fields.forEach(field => {
          this.form.fd[field] = changedFields[field]
          const fn = this[`${field}_change`]
          if (fn && typeof fn === 'function') {
            fn()
          }
        })
      }
    },
    handleProject (rule, value, callback) {
      const { auto_create_project } = this.form.fd

      if (auto_create_project || value?.key) {
        callback()
      } else {
        callback(Error)
      }
    },
    handleProjectChange (v) {
      this.$nextTick(() => {
        this.form.fc.validateFields(['project'], { force: true })
      })
    },
  },
}
