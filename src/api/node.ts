import service from '../request/index'
export function getNotes<T>(page: number, size: number) {
  return service.get<T>(`/note/page/${page}/${size}`) as Promise<T>
}
export function addNotes<T>(note: T) {
  return service.post<T>('/note', note)
}
export function getNoteListByContent<T>(content: string) {
  return service.get<T>(`/note/content/${content}`) as Promise<T>
}
