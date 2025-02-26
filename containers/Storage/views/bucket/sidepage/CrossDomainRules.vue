<template>
  <div>
    <a-alert banner v-if="!isQcloud">
      <template #message>
        <p>{{$t('storage.text_148')}}</p>
        <p>{{$t('storage.text_234')}}</p>
      </template>
    </a-alert>
    <page-list
      v-else
      :list="list"
      :showSearchbox="false"
      :columns="columns"
      :group-actions="groupActions"
      :single-actions="singleActions" />
  </div>
</template>

<script>
import WindowsMixin from '@/mixins/windows'
import ListMixin from '@/mixins/list'
import { HYPERVISORS_MAP } from '@/constants'

export default {
  name: 'BucketCrossDomainRuleList',
  mixins: [WindowsMixin, ListMixin],
  props: {
    id: String,
    resId: String,
    getParams: {
      type: [Function, Object],
    },
    data: {
      type: Object,
    },
  },
  data () {
    const isQcloud = this.data.provider === HYPERVISORS_MAP.qcloud.provider
    return {
      list: this.$list.createList(this, {
        id: 'BucketCrossDomainRuleList',
        resource: 'cors',
        ctx: [['buckets', this.resId]],
        getParams: this.getParam,
      }),
      groupActions: [
        {
          label: this.$t('storage.text_31'),
          permission: 'cors_create',
          action: () => {
            this.createDialog('CreateCorsDialog', {
              title: this.$t('storage.text_31'),
              bucketID: this.resId,
              onManager: this.onManager,
              refresh: this.refresh,
            })
          },
          meta: () => {
            if (this.$store.getters.scope === 'project' && this.data.tenant_id !== this.$store.getters.auth.tenant) {
              return {
                buttonType: 'primary',
                validate: false,
                tooltip: this.$t('storage.text_257'),
              }
            }
            return {
              buttonType: 'primary',
              ...this.$isOwner(this.data),
            }
          },
        },
        {
          label: this.$t('storage.text_36'),
          permission: 'cors_delete',
          action: () => {
            this.createDialog('DeleteCorsDialog', {
              title: this.$t('storage.text_36'),
              name: this.$t('storage.text_211'),
              data: this.list.selectedItems,
              bucketID: this.resId,
              columns: this.columns,
              refresh: this.refresh,
            })
          },
          meta: () => {
            if (this.list.selectedItems.length === 0) return { validate: false }
            if (this.$store.getters.scope === 'project' && this.data.tenant_id !== this.$store.getters.auth.tenant) {
              return {
                validate: false,
                tooltip: this.$t('storage.text_257'),
              }
            }
            return this.$isOwner(this.data)
          },
        },
      ],
      singleActions: [
        {
          label: this.$t('storage.text_212'),
          permission: 'cors_create',
          action: (row) => {
            this.createDialog('CreateCorsDialog', {
              data: [row],
              bucketID: this.resId,
              columns: this.columns,
              refresh: this.refresh,
            })
          },
          meta: () => {
            if (this.$store.getters.scope === 'project' && this.data.tenant_id !== this.$store.getters.auth.tenant) {
              return {
                validate: false,
                tooltip: this.$t('storage.text_257'),
              }
            }
            return this.$isOwner(this.data)
          },
        },
        {
          label: this.$t('storage.text_36'),
          permission: 'cors_delete',
          action: (row) => {
            this.createDialog('DeleteCorsDialog', {
              title: this.$t('storage.text_36'),
              name: this.$t('storage.text_211'),
              data: [row],
              bucketID: this.resId,
              columns: this.columns,
              refresh: this.refresh,
            })
          },
          meta: () => {
            if (this.$store.getters.scope === 'project' && this.data.tenant_id !== this.$store.getters.auth.tenant) {
              return {
                validate: false,
                tooltip: this.$t('storage.text_257'),
              }
            }
            return this.$isOwner(this.data)
          },
        },
      ],
      columns: [
        {
          field: 'allowed_origins',
          title: this.$t('storage.text_194'),
          slots: {
            default: ({ row }) => {
              const allowed_origins = row.allowed_origins || []
              return allowed_origins.map(item => {
                return (<list-body-cell-wrap hideField copy title={ item } message={ item }>
                  <span>{ item }</span>
                </list-body-cell-wrap>)
              })
            },
          },
        },
        {
          field: 'allowed_methods',
          title: this.$t('storage.text_196'),
          formatter: ({ row }) => {
            return row.allowed_methods.join(',')
          },
        },
        {
          field: 'allowed_headers',
          title: this.$t('storage.text_197'),
          slots: {
            default: ({ row }) => {
              const allowed_headers = row.allowed_headers || []
              return allowed_headers.map(item => {
                return (<list-body-cell-wrap hideField copy title={ item } message={ item }>
                  <span>{ item }</span>
                </list-body-cell-wrap>)
              })
            },
          },
        },
        {
          field: 'expose_headers',
          title: this.$t('storage.text_198'),
          slots: {
            default: ({ row }) => {
              const expose_headers = row.expose_headers || []
              return expose_headers.map(item => {
                return (<list-body-cell-wrap hideField copy title={ item } message={ item }>
                  <span>{ item }</span>
                </list-body-cell-wrap>)
              })
            },
          },
        },
        {
          field: 'max_age_seconds',
          title: this.$t('storage.text_199'),
        },
      ],
      isQcloud,
    }
  },
  created () {
    if (this.data.provider === HYPERVISORS_MAP.qcloud.provider) {
      this.list.fetchData()
    }
  },
}
</script>
