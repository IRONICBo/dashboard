<template>
  <component :is="currentComponent" v-bind="props" ref="createForm" />
</template>

<script>
import Aliyun from './components/Aliyun'
import AwsHuawei from './components/AwsHuawei'
import Azure from './components/Azure'
import Qcloud from './components/Qcloud'
import Ucloud from './components/Ucloud'
import VMware from './components/VMware'
import Proxmox from './components/Proxmox'
import OpenstackZstack from './components/OpenstackZstack'
import S3CephXsky from './components/S3CephXsky'
import Google from './components/Google'
import Apsara from './components/Apsara'
import Cloudpods from './components/Cloudpods'
import HCSO from './components/HCSO'
import HCSOP from './components/HCSOP'
import HCS from './components/HCS'
import Nutanix from './components/Nutanix'
import BingoCloud from './components/BingoCloud'
import InCloudSphere from './components/InCloudSphere'
import RemoteFile from './components/RemoteFile'
import H3C from './components/H3C'
import Ksyun from './components/Ksyun'
import BaiduCloud from './components/BaiduCloud'
import Qingcloud from './components/Qingcloud'
import ChinaUnion from './components/ChinaUnion'

export default {
  name: 'CreateCloudaccount',
  components: {
    AliyunCreate: Aliyun,
    UcloudCreate: Ucloud,
    AwsCreate: AwsHuawei,
    HuaweiCreate: AwsHuawei,
    AzureCreate: Azure,
    QcloudCreate: Qcloud,
    VMwareCreate: VMware,
    OpenstackCreate: OpenstackZstack,
    ZstackCreate: OpenstackZstack,
    DstackCreate: OpenstackZstack,
    S3Create: S3CephXsky,
    CephCreate: S3CephXsky,
    XskyCreate: S3CephXsky,
    GoogleCreate: Google,
    CtyunCreate: AwsHuawei,
    ApsaraCreate: Apsara,
    EcloudCreate: Aliyun,
    JDcloudCreate: Aliyun,
    CloudpodsCreate: Cloudpods,
    HCSOCreate: HCSO,
    HCSOPCreate: HCSOP,
    HCSCreate: HCS,
    NutanixCreate: Nutanix,
    BingoCloudCreate: BingoCloud,
    InCloudSphereCreate: InCloudSphere,
    RemoteFileCreate: RemoteFile,
    ProxmoxCreate: Proxmox,
    H3CCreate: H3C,
    KsyunCreate: Ksyun,
    BaiduCloudCreate: BaiduCloud,
    QingcloudCreate: Qingcloud,
    ChinaUnionCreate: ChinaUnion,
  },
  props: {
    currentItem: {
      type: Object,
      required: true,
    },
  },
  computed: {
    currentComponent () {
      return this.currentItem.component
    },
    props () {
      return {
        provider: this.currentItem.provider,
      }
    },
  },
}
</script>
