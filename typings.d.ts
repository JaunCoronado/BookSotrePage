export interface Book {
  createdAt: number | null,
  updatedAt: number | null,
  id:string | null,
  title: string,
  synopsis: string,
  cover: string,
  publishedDate: string,
  authorId: any,
  categoryId: string | null,
  userId: string | null
}

export interface User {
  books: Book[],
  createdAt: string,
  updatedAt: number,
  id: string,
  name: string,
  email: string,
  roleId: string,
}

export interface Category {
  books: Book[],
  createdAt: number,
  updatedAt: number,
  id: string,
  name: string,
}

export interface Author{
  books: Book[],
  createdAt: number,
  updatedAt: number,
  id: string,
  name: string
}
