import http from '@/axios/index.js';

export function allEmailList(params) {
    return http.get('/allEmail/list', {params: {...params}})
}

export function allEmailDelete(emailIds) {
    return http.delete('/allEmail/delete?emailIds=' + emailIds)
}

export function allEmailBatchDelete(params) {
    return http.delete('/allEmail/batchDelete', {params: params} )
}

export function allEmailLatest(emailId) {
	return http.get('/allEmail/latest', {params: {emailId}, noMsg: true, timeout: 35 * 1000})
}

// 分配弹窗的可选用户清单
export function assignUserList(params) {
    return http.get('/allEmail/assignUsers', {params: {...params}})
}

// 将邮件分配给指定用户（assignUserId=0 表示取消分配）
export function assignEmail(data) {
	return http.post('/allEmail/assign', data)
}

// 我的邮件：列出分配给当前登录用户的邮件
export function myEmailList(params) {
	return http.get('/allEmail/myList', {params: {...params}})
}
