import i18n from '@/locales'

export const timeOpts = {
  [`${1}h`]: {
    key: `${1}h`,
    label: i18n.t('monitor.text00001'),
    timeFormat: 'YYYY-MM-DD HH:mm',
    timeGroupOpts: [
      { key: '1m', label: i18n.t('monitor.text00007') },
      { key: '5m', label: i18n.t('monitor.text00008') },
    ],
  },
  [`${3}h`]: {
    key: `${3}h`,
    label: i18n.t('monitor.text00002'),
    timeFormat: 'YYYY-MM-DD HH:mm',
    timeGroupOpts: [
      { key: '1m', label: i18n.t('monitor.text00007') },
      { key: '5m', label: i18n.t('monitor.text00008') },
    ],
  },
  [`${6}h`]: {
    key: `${6}h`,
    label: i18n.t('monitor.text00003'),
    timeFormat: 'YYYY-MM-DD HH:mm',
    timeGroupOpts: [
      { key: '1m', label: i18n.t('monitor.text00007') },
      { key: '5m', label: i18n.t('monitor.text00008') },
      { key: '10m', label: i18n.t('monitor.text00009') },
    ],
  },
  [`${24}h`]: {
    key: `${24}h`,
    label: i18n.t('monitor.text00004'),
    timeFormat: 'YYYY-MM-DD HH:mm',
    timeGroupOpts: [
      { key: '5m', label: i18n.t('monitor.text00008') },
      { key: '10m', label: i18n.t('monitor.text00009') },
      { key: '30m', label: i18n.t('monitor.text00010') },
      { key: '1h', label: i18n.t('monitor.text00011') },
    ],
  },
  [`${3 * 24}h`]: {
    key: `${3 * 24}h`,
    label: i18n.t('monitor.text00005'),
    timeFormat: 'YYYY-MM-DD HH:mm',
    timeGroupOpts: [
      { key: '5m', label: i18n.t('monitor.text00008') },
      { key: '10m', label: i18n.t('monitor.text00009') },
      { key: '30m', label: i18n.t('monitor.text00010') },
      { key: '1h', label: i18n.t('monitor.text00011') },
    ],
  },
  custom: {
    key: 'custom',
    hidden: true,
    label: i18n.t('monitor.text00006'),
    timeFormat: 'YYYY-MM-DD HH:mm',
    timeGroupOpts: [
      { key: '5m', label: i18n.t('monitor.text00008') },
      { key: '10m', label: i18n.t('monitor.text00009') },
      { key: '30m', label: i18n.t('monitor.text00010') },
      { key: '1h', label: i18n.t('monitor.text00011') },
      { key: '6h', label: i18n.t('monitor.text00012') },
      { key: '1d', label: i18n.t('monitor.text00013') },
    ],
  },
}

export const metricMaps = {
  cpu: {
    key: 'cpu',
    label: i18n.t('monitor.metrics_cpu'),
    metrics: {
      usage_active: {
        key: 'usage_active',
        label: i18n.t('monitor.metrics_cpu_usage_active'),
      },
    },
  },
  disk: {
    key: 'disk',
    label: i18n.t('monitor.metrics_disk'),
    metrics: {
      used_percent: {
        key: 'used_percent',
        label: i18n.t('monitor.metrics_disk_used_percent'),
      },
    },
  },
  diskio: {
    key: 'diskio',
    label: i18n.t('monitor.metrics_disk_used_percent'),
  },
  haproxy: {
    key: 'haproxy',
    label: '',
  },
  internal_agent: {
    key: 'internal_agent',
    label: '',
  },
  internal_gather: {
    key: 'internal_gather',
    label: '',
  },
  internal_http_listener: {
    key: 'internal_http_listener',
    label: '',
  },
  internal_write: {
    key: 'internal_write',
    label: '',
  },
  jenkins_node: {
    key: 'jenkins_node',
    label: '',
  },
  kernel: {
    key: 'kernel',
    label: '',
  },
  kernel_vmstat: {
    key: 'kernel_vmstat',
    label: '',
  },
  mem: {
    key: 'mem',
    label: i18n.t('monitor.metrics_mem'),
  },
  net: {
    key: 'net',
    label: i18n.t('monitor.metrics_net'),
  },
  netstat: {
    key: 'netstat',
    label: '',
  },
  nstat: {
    key: 'nstat',
    label: '',
  },
  ntpq: {
    key: 'ntpq',
    label: '',
  },
  ping: {
    key: 'ping',
    label: '',
  },
  processes: {
    key: 'processes',
    label: '',
  },
  swap: {
    key: 'swap',
    label: '',
  },
  system: {
    key: 'system',
    label: '',
  },
  usage: {
    key: 'usage',
    label: '',
  },
  vm_capacity: {
    key: 'vm_capacity',
    label: i18n.t('monitor.metrics_vm_capacity'),
    metrics: {
      disk: {
        key: 'disk',
        label: i18n.t('monitor.metrics_vm_capacity_disk'),
      },
      vcpu_count: {
        key: 'vcpu_count',
        label: i18n.t('monitor.metrics_vm_capacity_vcpu_count'),
      },
      vmem_size: {
        key: 'vmem_size',
        label: i18n.t('monitor.metrics_vm_capacity_vmem_size'),
      },
    },
  },
  vm_cpu: {
    key: 'vm_cpu',
    label: i18n.t('monitor.metrics_vm_cpu'),
    metrics: {
      cpu_count: {
        key: 'cpu_count',
        label: i18n.t('monitor.metrics_vm_cpu_cpu_count'),
      },
      usage_active: {
        key: 'usage_active',
        label: i18n.t('monitor.metrics_vm_cpu_usage_active'),
      },
    },
  },
  vm_diskio: {
    key: 'vm_diskio',
    label: i18n.t('monitor.metrics_vm_diskio'),
  },
  vm_mem: {
    key: 'vm_mem',
    label: i18n.t('monitor.metrics_vm_mem'),
  },
  vm_netio: {
    key: 'vm_netio',
    label: i18n.t('monitor.metrics_vm_netio'),
  },
}

export const DATABASE = 'telegraf'

export const tableColumnMaps = {
  vm_name: {
    title: i18n.t('common.name'),
    field: 'vm_name',
  },
  vm_ip: {
    title: 'IP',
    field: 'vm_ip',
  },
  host: {
    title: i18n.t('dictionary.host'),
    field: 'host',
  },
  cloudregion: {
    title: i18n.t('dictionary.cloudregion'),
    field: 'cloudregion',
  },
  zone: {
    title: i18n.t('dictionary.zone'),
    field: 'zone',
  },
}

// 报警通知方式，配合 a-checkbox-group 用 value 而非 key
export const channelMaps = {
  webconsole: { value: 'webconsole', label: '系统', disabled: true },
  email: { value: 'email', label: '邮件' },
  dingtalk: { value: 'dingtalk', label: '钉钉' },
  feishu: { value: 'feishu', label: '飞书' },
}

export const alertStrategyMaps = {
  avg: '平均值',
  max: '最大值',
  min: '最小值',
}

export const preiodMaps = {
  '5m': { key: '5m', label: '5分钟周期' },
  '10m': { key: '10m', label: '10分钟周期' },
  '15m': { key: '15m', label: '15分钟周期' },
  '30m': { key: '30m', label: '30分钟周期' },
  '60m': { key: '60m', label: '1小时' },
  '180m': { key: '180m', label: '3小时' },
}
