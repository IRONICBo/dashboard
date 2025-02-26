<template>
  <detail
    :on-manager="onManager"
    :data="data"
    :base-info="baseInfo"
    :extra-info="extraInfo"
    resource="elasticcaches"
    statusModule="redis"
    auto-hidden-columns-key="redis_hidden_columns" />
</template>

<script>
import * as R from 'ramda'
import { NODE_TYPE, PERFORMANCE_TYPE } from '@DB/views/redis/constants'
import {
  getUserTagColumn,
  // getExtTagColumn,
} from '@/utils/common/detailColumn'
import {
  getBrandTableColumn,
  getSwitchTableColumn,
  getBillingTypeTableColumn,
} from '@/utils/common/tableColumn'
import { sizestr, sizestrWithUnit } from '@/utils/utils'
import WindowsMixin from '@/mixins/windows'

export default {
  name: 'redisDetail',
  mixins: [WindowsMixin],
  props: {
    onManager: {
      type: Function,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    columns: Array,
  },
  data () {
    return {
      baseInfo: [
        getUserTagColumn({ onManager: this.onManager, resource: 'elasticcache', columns: () => this.columns, tipName: this.$t('dictionary.elasticcache') }),
        // getExtTagColumn({ onManager: this.onManager, resource: 'elasticcache', columns: () => this.columns, tipName: this.$t('dictionary.elasticcache') }),
        getBrandTableColumn(),
        getBillingTypeTableColumn(),
        {
          field: 'zone',
          hiddenField: 'region',
          title: this.$t('db.text_133'),
          slots: {
            default: ({ row }) => {
              if (!R.isNil(row.slave_zone_infos)) {
                const sl = row.slave_zone_infos.map(v => {
                  return <div>{v.name}({this.$t('db.text_164')})</div>
                })
                return [<div>{row.zone ? row.zone + '(' + this.$t('db.text_165') + ')' : '-'}</div>, ...sl]
              }
              return row.zone || '-'
            },
          },
        },
      ],
      extraInfo: [
        {
          title: this.$t('db.text_166'),
          items: [
            {
              title: this.$t('db.text_112'),
              slots: {
                default: ({ row }) => {
                  return `${row.engine || ''} ${row.engine_version || ''}`
                },
              },
            },
            {
              title: this.$t('db.text_271'),
              slots: {
                default: ({ row }) => {
                  return NODE_TYPE[row.node_type]
                },
              },
            },
            {
              title: this.$t('db.text_272'),
              slots: {
                default: ({ row }) => {
                  return PERFORMANCE_TYPE[row.performance_type] || '-'
                },
              },
            },
            {
              title: this.$t('db.text_167'),
              slots: {
                default: ({ row }) => {
                  if (row.maintain_start_time && row.maintain_end_time) {
                    return `${row.maintain_start_time}${row.maintain_end_time ? ' ~ ' + row.maintain_end_time : ''}`
                  }
                  return '-'
                },
              },
            },
            {
              field: 'instance_type',
              title: this.$t('db.text_168'),
            },
            {
              field: 'cpu_arch',
              title: 'CPU',
              slots: {
                default: ({ row }) => {
                  return row.cpu_arch || '-'
                },
              },
            },
            {
              field: 'arch_type',
              title: this.$t('db.text_322'),
            },
            {
              field: 'capacity_mb',
              title: this.$t('db.text_132'),
              slots: {
                default: ({ row }) => {
                  return sizestr(row.capacity_mb, 'M', 1024)
                },
              },
            },
            {
              field: 'connections',
              title: this.$t('db.max_connections'),
              slots: {
                default: ({ row }) => {
                  return row.connections || '-'
                },
              },
            },
            {
              field: 'bandwidth',
              title: this.$t('db.max_ip_bandwidth'),
              slots: {
                default: ({ row }) => {
                  return row.bandwidth ? sizestrWithUnit(row.bandwidth, 'M', 1024) + '/s' : '-'
                },
              },
            },
          ],
          hidden: () => this.$isScopedPolicyMenuHidden('redis_hidden_columns.db_info'),
        },
        {
          title: this.$t('db.text_171'),
          items: [
            {
              field: 'private_ip_addr',
              title: this.$t('db.text_172'),
              slots: {
                default: ({ row }) => {
                  const pri = row.private_dns || row.private_ip_addr
                  if (pri) {
                    return `${pri}:${row.private_connect_port}`
                  }
                  return '-'
                },
              },
            },
            {
              field: 'public_ip_addr',
              title: this.$t('db.text_173'),
              slots: {
                default: ({ row }) => {
                  const pub = row.public_dns || row.public_ip_addr
                  const port = row.public_connect_port
                  const btnTxt = port ? this.$t('db.text_174') : this.$t('db.text_175')
                  const isRunning = row.status === 'running'
                  const notRunninTip = !isRunning ? this.$t('db.text_156') : null
                  let RenderSwitchBtn = null
                  if (isRunning) {
                    RenderSwitchBtn = (<a-button type="link" onClick={() => this.handleSwitchPublicAddress(!port)}>{btnTxt}</a-button>)
                  } else {
                    RenderSwitchBtn = (
                      <a-tooltip placement='top' title={notRunninTip}>
                        <a-button type="link" disabled>{btnTxt}</a-button>
                      </a-tooltip>
                    )
                  }
                  if (row.provider === 'Huawei' || row.provider === 'Qcloud') {
                    return '-'
                  }
                  return (
                    <div>
                      {pub ? `${pub}:${port}` : '-' }
                      {RenderSwitchBtn}
                    </div>
                  )
                },
              },
            },
            {
              field: 'vpc',
              title: 'VPC',
              slots: {
                default: ({ row }) => {
                  return row.vpc || '-'
                },
              },
            },
            {
              field: 'network',
              title: this.$t('db.text_176'),
              slots: {
                default: ({ row }) => {
                  return row.network || '-'
                },
              },
            },
            {
              field: 'auth_mode',
              title: this.$t('db.text_323'),
              slots: {
                default: ({ row }) => {
                  return row.auth_mode === 'on' ? this.$t('db.text_324') : this.$t('db.text_325')
                },
              },
            },
            {
              field: 'secgroups',
              title: this.$t('compute.text_105'),
              slots: {
                default: ({ row }) => {
                  if (!row.secgroups) return '-'
                  return row.secgroups.map((item) => {
                    return <list-body-cell-wrap copy hideField={true} field='name' row={item} message={item.name}>
                      <side-page-trigger permission='secgroups_get' name='SecGroupSidePage' id={item.id} vm={this}>{ item.name }</side-page-trigger>
                    </list-body-cell-wrap>
                  })
                },
              },
              hidden: () => this.data.brand !== 'Qcloud',
            },
          ],
          hidden: () => this.$isScopedPolicyMenuHidden('redis_hidden_columns.connection_info'),
        },
        {
          title: this.$t('db.text_179'),
          items: [
            getSwitchTableColumn({
              field: 'disable_delete',
              title: this.$t('common.text00076'),
              change: val => {
                this.onManager('update', {
                  id: this.data.id,
                  managerArgs: {
                    data: { disable_delete: val },
                  },
                })
              },
            }),
          ],
          hidden: () => this.$isScopedPolicyMenuHidden('redis_hidden_columns.perform_action'),
        },
      ],
    }
  },
  methods: {
    async fetchSwitchPublic (bool) {
      if (bool) {
        return this.onManager('performAction', {
          steadyStatus: 'running',
          id: this.data.id,
          managerArgs: {
            action: 'allocate-public-connection',
          },
        })
      } else {
        return this.onManager('performAction', {
          steadyStatus: 'running',
          id: this.data.id,
          managerArgs: {
            action: 'release-public-connection',
          },
        })
      }
    },
    handleSwitchPublicAddress (bool) {
      const txts = {
        true: {
          title: this.$t('db.text_180'),
          content: this.$t('db.text_326'),
        },
        false: {
          title: this.$t('db.text_181'),
          content: this.$t('db.text_182'),
        },
      }
      this.createDialog('ConfirmDialog', {
        ...txts[`${bool}`],
        onOk: () => {
          return this.fetchSwitchPublic(bool)
        },
      })
    },
  },
}
</script>
