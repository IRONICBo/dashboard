<template>
  <page-list
    :list="list"
    :columns="filterColumns"
    :group-actions="groupActions"
    :single-actions="!hiddenSingleActions && singleActions"
    :export-data-options="exportDataOptions" />
</template>

<script>
// import { mapGetters } from 'vuex'
import * as R from 'ramda'
import {
  getStatusFilter,
  getTenantFilter,
  getDescriptionFilter,
  getCreatedAtFilter,
} from '@/utils/common/tableFilter'
import WindowsMixin from '@/mixins/windows'
import ListMixin from '@/mixins/list'
import SingleActionsMixin from '../mixins/singleActions'
import ColumnsMixin from '../mixins/columns'
// import expectStatus from '@/constants/expectStatus'

export default {
  name: 'ScheduledtasksList',
  mixins: [WindowsMixin, ListMixin, ColumnsMixin, SingleActionsMixin],
  props: {
    id: String,
    getParams: {
      type: Function || Object,
      default: {},
    },
    hiddenColumns: {
      type: Array,
      default: () => { return [] },
    },
    hiddenSingleActions: Boolean,
  },
  data () {
    return {
      list: this.$list.createList(this, {
        id: this.id,
        apiVersion: 'v1',
        resource: 'scheduledtasks',
        getParams: this.getParam,
        filterOptions: {
          name: {
            label: this.$t('cloudenv.text_95'),
            filter: true,
            formatter: val => {
              return `name.contains("${val}")`
            },
          },
          description: getDescriptionFilter(),
          enabled: {
            label: this.$t('cloudenv.text_97'),
            dropdown: true,
            items: [
              { label: this.$t('cloudenv.text_334'), key: true },
              { label: this.$t('cloudenv.text_335'), key: false },
            ],
          },
          status: getStatusFilter('scheduledtask'),
          operation: {
            label: this.$t('cloudenv.text_425'),
            dropdown: true,
            items: Object.keys(this.$t('cloudenvScheduledtaskRuleAction')).map((k) => {
              return {
                label: this.$t('cloudenvScheduledtaskRuleAction')[k],
                key: k,
              }
            }),
          },
          projects: getTenantFilter(),
          created_at: getCreatedAtFilter(),
        },
        hiddenColumns: ['resource_type', 'created_at'],
      }),
      exportDataOptions: {
        items: [
          { label: 'ID', key: 'id' },
          { label: this.$t('cloudenv.text_95'), key: 'name' },
          { label: this.$t('cloudenv.text_97'), key: 'enabled' },
          { label: this.$t('cloudenv.text_98'), key: 'status' },
          { label: this.$t('cloudenv.text_425'), key: 'operation' },
          { label: this.$t('cloudenv.text_426'), key: 'label_type' },
          { label: this.$t('cloudenv.text_427'), key: 'timer_desc' },
          { label: this.$t('cloudenv.text_428'), key: 'created_at' },
          { label: this.$t('dictionary.project'), key: 'tenant' },
        ],
      },
      groupActions: [
        {
          label: this.$t('cloudenv.text_104'),
          permission: 'scheduledtasks_create',
          action: () => {
            this.$router.push({
              path: '/scheduledtask/create',
            })
          },
          meta: () => {
            return {
              buttonType: 'primary',
            }
          },
        },
        {
          label: this.$t('common.batchAction'),
          actions: () => {
            return [
              {
                label: this.$t('cloudenv.text_334'),
                permission: 'scheduledtasks_perform_enable',
                action: () => {
                  this.list.batchPerformAction('enable', null, this.list.steadyStatus)
                },
                meta: () => {
                  const validate = this.list.selectedItems.length && this.list.selectedItems.every(item => !item.enabled)
                  return {
                    validate,
                    tooltip: !validate ? this.$t('cloudenv.text_429') : '',
                  }
                },
              },
              {
                label: this.$t('cloudenv.text_335'),
                permission: 'scheduledtasks_perform_disable',
                action: () => {
                  this.createDialog('ScheduledtaskDisabledDialog', {
                    columns: this.columns,
                    data: this.list.selectedItems,
                    onManager: this.onManager,
                  })
                },
                meta: () => {
                  const validate = this.list.selectedItems.length && this.list.selectedItems.every(item => item.enabled)
                  return {
                    validate,
                    tooltip: !validate ? this.$t('cloudenv.text_430') : '',
                  }
                },
              },
              {
                label: this.$t('cloudenv.text_108'),
                permission: 'scheduledtasks_delete',
                action: () => {
                  this.createDialog('DeleteResDialog', {
                    vm: this,
                    data: this.list.selectedItems,
                    columns: this.columns,
                    title: this.$t('cloudenv.text_108'),
                    name: this.$t('cloudenv.text_431'),
                    onManager: this.onManager,
                  })
                },
                meta: () => {
                  return {
                    validate: this.list.allowDelete(),
                  }
                },
              },
            ]
          },
        },
      ],
    }
  },
  computed: {
    filterColumns () {
      return this.columns.filter(item => !this.hiddenColumns.includes(item.field))
    },
  },
  created () {
    this.initSidePageTab('scheduledtask-detail')
    this.list.fetchData()
    this.$bus.$on('ScheduledtasksListSingleRefresh', args => {
      this.list.singleRefresh(...args)
    }, this)
  },
  methods: {
    handleOpenSidepage (row) {
      // this.initSidePageTab(initSidePageTab)
      this.sidePageTriggerHandle(this, 'ScheduledtaskSidePage', {
        id: row.id,
        apiVersion: 'v1',
        resource: 'scheduledtasks',
        getParams: { details: true },
      }, {
        list: this.list,
      })
    },
    getParam () {
      return {
        details: true,
        utc_offset: this.$moment().utcOffset() / 60,
        ...(R.is(Function, this.getParams) ? this.getParams() : this.getParams),
      }
    },
  },
}
</script>
