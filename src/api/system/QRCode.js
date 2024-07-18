import request from '@/utils/request'


export function updateQrTime(id) {
  return request({
    url: '/system/wx/updateQrTime?mdId='+id,
    method: 'get',
  })
}