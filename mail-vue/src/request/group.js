import http from '@/axios/index.js';

export function groupList(params) {
    return http.get('/group/list', {params: {...params}})
}

export function groupAdd(data) {
    return http.post('/group/add', data)
}

export function groupUpdate(data) {
    return http.post('/group/update', data)
}

export function groupDelete(data) {
    return http.post('/group/delete', data)
}
