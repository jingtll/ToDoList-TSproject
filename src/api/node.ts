import service from '../request/index'
//泛型T表示调用接口时，返回的数据类型
// get<T>：内部请求用，决定返回值类型
// getNoteById<T>：给外面调用用，把类型传给内部
// 两个 T 完全一样，是传递关系
export function getNotes<T>(page: number, size: number) {
  return service.get<T>(`/note/page/${page}/${size}`) as Promise<T>
}
export function addNotes<T>(note: T) {
  return service.post<T>('/note', note)
}
export function getNoteListByContent<T>(content: string) {
  return service.get<T>(`/note/content/${content}`) as Promise<T>
}
export function UpdateNote<T>(id: string, note: T) {
  return service.put<T>(`/note/${id}`, note)
}
//根据id值获取数据
export function getNoteById<T>(id: string) {
  return service.get<T>(`/note/id/${id}`) as Promise<T>
}
//删除接口
export function deleteNote<T>(id: string) {
  return service.delete<T>(`/note/${id}`) as Promise<T>
}
