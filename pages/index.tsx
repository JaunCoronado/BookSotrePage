import React from 'react'
import { Grid } from '@mui/material'
import Head from 'next/head'
import { useEffect, useState, } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { booksState, bookState, modalState } from '../atoms/modalAtom'
import Banner from '../components/Banner'
import CardComponent from '../components/CardComponent'
import Header from '../components/Header'
import Modal from '../components/Modal'
import Select from '../components/Select'
import useAuth from '../hooks/useAuth'
import { Author, Book, Category } from '../typings'
import requests from '../utils/requests'

interface Props {
  booksResponse: Book[]
  categories: Category[],
  authors: Author[],
}

const Home = ({
  booksResponse,
  categories,
  authors
}: Props) => {
  const { loading, user } = useAuth()

  const [books, setBooks] = useRecoilState(booksState)
  const [showModal, setShowModal] = useRecoilState(modalState);
  const [currentBook, setCurrentBook] = useRecoilState(bookState);

  const [category, setCategory] = useState<string | null>('None')
  const [filteredBooks, setFilteredBooks] = useState<Book[] | null>(null)

  useEffect(() => {
    setBooks(booksResponse)
  }, [])

  const filterBooksByCategory = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(event.target.value)

    if (event.target.value === 'None') {
      setFilteredBooks(null)
      return
    }

    const selectedCategory = categories.filter(c => c.name === event.target.value)
    const booksReq = await fetch(requests.fetchSingleCategory, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ categoryId: selectedCategory[0].id })
    })

    if (booksReq.ok) {
      const booksRes = await booksReq.json()
      setFilteredBooks(booksRes.books)
      console.log(booksRes)
    } else {
      setCategory('None')
      setFilteredBooks(null)
    }
  }

  const addBook = () => {
    const newBook = (): Book => ({
      createdAt: null,
      updatedAt: null,
      id: null,
      title: '',
      synopsis: '',
      cover: 'http://localhost:1337/images/976cc3ab-d27c-48d3-8c2e-cf09832d0bd8.webp',
      publishedDate: '',
      authorId: null,
      categoryId: null,
      userId: null
    })

    setCurrentBook(newBook())
    setShowModal(true)
  }

  if (loading) return null

  return (
    <div className="relative h-screen bg-gradient-to-b lg:h-[140vh]">
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className='relative pl-4 pb-24 lg:space-y-24 lg:pl-16'>
        <Banner books={booksResponse}/>
        <section className="md:space-y-24">
          <div className="flex float-right mr-10">
            {user?.roleId.name == 'admin' ?
            <button type="button" disabled={loading} className='bannerBtn bg-green-500 text-white mr-5' onClick={() => addBook()}>
              Add Book
            </button> : null}
            <div className="flex-col">
              <label className="text-white">Filter by category</label>
              <Select data={categories} value={category} onChange={filterBooksByCategory} />
            </div>
          </div>
          <Grid container spacing={2}>
            {filteredBooks != null && filteredBooks.length > 0 ?
              filteredBooks.map((book) => (
                <Grid item key={book.id}>
                  <CardComponent book={book} />
                </Grid>
              )) :
              books.map((book) => (
                <Grid item key={book.id}>
                  <CardComponent book={book} />
                </Grid>
              ))}
          </Grid>
        </section>
      </main>
      {showModal && <Modal authors={authors} categories={categories} />}
    </div>
  )
}

export default Home

export const getServerSideProps = async () => {
  const [
    booksResponse,
    categories,
    authors
  ] = await Promise.all([
    fetch(requests.fetchBooks).then((res) => res.json()),
    fetch(requests.fetchCategories).then((res) => res.json()),
    fetch(requests.fetchAuthors).then((res) => res.json())
  ])

  return {
    props: {
      booksResponse: booksResponse,
      categories: categories,
      authors: authors
    },
  }
}