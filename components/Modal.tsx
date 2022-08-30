import React from 'react'
import { XIcon } from '@heroicons/react/outline'
import { Button } from '@mui/material'
import MuiModal from '@mui/material/Modal'
import { useState } from 'react'
import { useRecoilState } from 'recoil'
import { booksState, bookState, modalState } from '../atoms/modalAtom'
import useAuth from '../hooks/useAuth'
import requests from '../utils/requests'
import { SubmitHandler, useForm } from 'react-hook-form';
import { Author, Book, Category } from '../typings'
import Select from './Select'

interface Props {
  categories: Category[],
  authors: Author[],
}

function Modal({ categories, authors }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<Book>();
  const [showModal, setShowModal] = useRecoilState(modalState)
  const [book, setBook] = useRecoilState(bookState)
  const [books, setBooks] = useRecoilState(booksState)

  const { user, token } = useAuth()

  const [category, setCategory] = useState<string | null>(book?.categoryId ? categories.filter(c => c.id === book?.categoryId)[0].name : "None")
  const [author, setAuthor] = useState<string | null>(book?.authorId?.name ? book?.authorId.name : 'None')
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null)
  const handleClose = () => {
    setShowModal(false)
  }

  const updateBook = async (body: any) => {
    const cat = categories.filter(c => c.name === category)
    const aut = authors.filter(a => a.name === author)
    const bookReq = await fetch(requests.fetchUpdateBook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (bookReq.ok) {
      const res = await bookReq.json()
      res[0].authorId = aut[0]
      const index = books.findIndex(b => b.id == book?.id)
      const booksCp = JSON.parse(JSON.stringify(books))
      booksCp[index] = res[0]
      setBook(res[0])
      setBooks(booksCp)
    }
  }

  const addBook = async (body: any) => {
    delete body.id
    console.log(body)
    const aut = authors.filter(a => a.name === author)
    const bookReq = await fetch(requests.fetchDeleteBook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (bookReq.ok) {
      const res = await bookReq.json()
      console.log(res)
      res.categoryId = res.categoryId.id
      res.authorId = aut[0]
      const booksCp = JSON.parse(JSON.stringify(books))
      booksCp.push(res)
      setBook(res)
      setBooks(booksCp)
    }
  }

  const onSubmit: SubmitHandler<Book> = async ({ title, synopsis, publishedDate }) => {
    let newCover = ''
    if (file != null) {
      const data = new FormData()
      data.append('image', file)
      const newCoverReq = await fetch(requests.fetchUploadFile, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      })

      if (newCoverReq.ok) {
        newCover = await newCoverReq.json()
        console.log(newCover)
      }
    }

    const cat = categories.filter(c => c.name === category)
    const aut = authors.filter(a => a.name === author)
    const updatedBook = {
      id: book?.id,
      title: title,
      cover: newCover == '' ? book?.cover : `http://localhost:1337/images/${newCover}`,
      synopsis: synopsis,
      publishedDate: publishedDate,
      categoryId: cat[0].id,
      authorId: aut[0].id,
      userId: book?.userId
    }

    if (book?.id == null) {
      addBook(updatedBook)
    } else {
      updateBook(updatedBook)
    }

  };

  const deleteBook = async () => {
    const bookReq = await fetch(`${requests.fetchDeleteBook}/${book?.id}`, {
      method: 'Delete',
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })

    if (bookReq.ok) {
      const index = books.findIndex(b => b.id == book?.id)
      const booksCp = JSON.parse(JSON.stringify(books))
      booksCp.splice(index, 1)
      setBooks(booksCp)
      setShowModal(false)
    }
  }


  const borrowBook = async (userId?: string) => {
    const body = {
      bookId: book?.id,
      userId: userId ? userId : user?.id,
    }

    const req = await fetch(requests.fetchBorrowBook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body)
    })

    if (req.ok) {
      const data = await req.json()
      const booksCopy = JSON.parse(JSON.stringify(books))
      const index = booksCopy.findIndex(b => b.id == book?.id)
      booksCopy[index] = data[0]
      setBooks(booksCopy)
      setBook(data[0])
    }
  }

  const returnBook = async () => {
    const body = {
      bookId: book?.id,
    }

    const req = await fetch(requests.fetchReturnBook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body)
    })

    if (req.ok) {
      const data = await req.json()
      const booksCopy = JSON.parse(JSON.stringify(books))
      const index = booksCopy.findIndex(b => b.id == book?.id)
      booksCopy[index] = data[0]
      setBooks(booksCopy)
      setBook(data[0])
    }
  }

  const changeCategory = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(event.target.value)
  }

  const changeAuthor = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor(event.target.value)
  }

  return (
    <MuiModal open={showModal} onClose={handleClose}
      className="fixed !top-7 left-0 right-0 z-50 mx-auto w-full max-w-3xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide">
      <form onSubmit={handleSubmit(onSubmit)}>
        <>
          <button
            onClick={handleClose}
            className="modalBtn absolute right-5 top-5 !z-40 h-9 w-9 border-none bg-[#181818] hover:bg-[#181818]"
          >
            <XIcon className="h-6 w-6" />
          </button>

          <div className="flex space-x-16 rounded-b-md bg-[#181818] px-10 py-8">
            <div className="space-y-6 text-lg">
              <div className="flex space-x-5 text-sm">
                <img src={book?.cover} />

                <div className="flex flex-col gap-x-10 gap-y-4 font-light md:flex-row">

                  <div className="flex flex-col space-y-3 text-sm">
                    {user?.roleId.name == 'admin' ?
                      <input type="text" placeholder='title' className='input text-2xl font-bold md:text-4xl lg:text-3xl'
                        {...register('title', { required: true })} defaultValue={book?.title} /> :
                      <h1 className="text-2xl font-bold md:text-4xl lg:text-3xl">
                        {book?.title}
                      </h1>}

                    <div>
                      <span className="text-[gray]">Category:</span>{' '}
                      {user?.roleId.name == 'admin' ?
                        <Select data={categories} value={category} onChange={changeCategory} /> :
                        category}
                    </div>

                    <div>
                      <span className="text-[gray]">Published:</span>{' '}
                      {user?.roleId.name == 'admin' ?
                        <input type="text" placeholder='Published' className='input'
                          {...register('publishedDate', { required: true })} defaultValue={book?.publishedDate} /> :
                        book?.publishedDate}
                    </div>

                    <div>
                      <span className="text-[gray]">Author:</span>{' '}
                      {user?.roleId.name == 'admin' ?
                        <Select data={authors} value={author} onChange={changeAuthor} /> :
                        book?.authorId?.name}
                    </div>

                    {book?.userId != null && book?.userId != user?.id ? <span>This book is not available.</span> : null}
                    <>

                      <div className="flex space-x-3">
                        <button type='button' disabled={book?.userId != null && book?.userId != user?.id} onClick={async () =>
                          book?.userId != null ? returnBook() : await borrowBook()} className="bannerBtn bg-white text-black">
                          {book?.userId == user?.id ? 'Return Book' : 'Borrow'}
                        </button>
                      </div>
                      {user?.roleId.name == "admin" ?
                        <div className="flex space-x-3">
                          <button disabled={loading} type="submit" className='bannerBtn bg-white text-black' onClick={() => console.log(true)}>
                            Save
                          </button>
                          {book?.id == null ? null :
                            <button type="button" disabled={loading} className='bannerBtn bg-red-500 text-white' onClick={async () => await deleteBook()}>
                              Delete
                            </button>}
                        </div> : null}
                    </>
                  </div>
                </div>
              </div>

              <div className="flex-col items-center space-y-2 text-sm">

                {user?.roleId.name == "admin" ?
                  <>
                    <p>Choose a profile picture:</p>
                    <br />
                    <input type="file" id="cover" name="cover" accept="image/png, image/jpeg, image/webp" onChange={e => setFile(e?.target?.files[0])} />
                  </> : null}

                <h1 className="text-2xl font-bold md:text-4xl lg:text-2xl">
                  Synopsis
                </h1>
                <p>{user?.roleId.name == 'admin' ?
                  <textarea cols={book?.synopsis.length} placeholder='synopsis' className='input h-48'
                    {...register('synopsis', { required: true })} defaultValue={book?.synopsis} /> :
                  book?.synopsis}</p>
              </div>
            </div>
          </div>
        </>
      </form>
    </MuiModal>
  )
}

export default Modal
