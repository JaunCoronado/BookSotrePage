import { DocumentData } from 'firebase/firestore'
import { atom } from 'recoil'
import { Book } from '../typings'

export const modalState = atom({
  key: 'modalState',
  default: false,
})

export const booksState = atom<Book[]>({
  key: 'booksState',
  default: [],
})

export const bookState = atom<Book | null>({
  key: 'bookState',
  default: null,
})