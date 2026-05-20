export interface Note {
  _id?: string
  content: string
  dates: string
}
export type NoteList = Note[]
export interface NoteListState {
  leftList: Note[]
  rightList: Note[]
}
