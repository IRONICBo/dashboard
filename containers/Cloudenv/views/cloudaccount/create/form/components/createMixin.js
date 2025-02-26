import * as R from 'ramda'
import { keySecretFields } from '@Cloudenv/views/cloudaccount/constants'
import BlockedResources from '@Cloudenv/views/cloudaccount/components/BlockedResources'

export default {
  components: {
    BlockedResources,
  },
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
            initialValue: {
              key: this.$store.getters.userInfo.projectId,
              label: this.$store.getters.userInfo.project,
            },
            rules: [
              { validator: this.handleProject, message: this.$t('rules.project'), trigger: 'change' },
            ],
          },
        ],
        isOpenBlockedResources: [
          'isOpenBlockedResources',
          {
            initialValue: false,
            valuePropName: 'checked',
          },
        ],
        blockedResources: [
          'blockedResources',
          {
            rules: [
              { required: true, message: this.$t('common.tips.select', [this.$t('cloudenv.block_resources_type')]) },
            ],
          },
        ],
      },
    }
  },
  computed: {
    keySecretField () {
      return keySecretFields[this.provider.toLowerCase()]
    },
    isAliyun () {
      return this.provider.toLowerCase() === 'aliyun'
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
    transformParams (params) {
      // 处理屏蔽同步资源
      if (params.isOpenBlockedResources) {
        params.skip_sync_resources = params.blockedResources
        delete params.isOpenBlockedResources
        delete params.blockedResources
      }
      return params
    },
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
            resolve(this.transformParams(params))
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
          this.$set(this.form.fd, field, changedFields[field])
          // this.form.fd[field] = changedFields[field]
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
