import { Grid } from '@mui/material'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { modalState } from '../atoms/modalAtom'
import CardComponent from '../components/CardComponent'
import Header from '../components/Header'
import Modal from '../components/Modal'
import useAuth from '../hooks/useAuth'
import { User } from '../typings'
import requests from '../utils/requests'
import { FaBook } from "react-icons/fa"
import { Author, Book, Category } from '../typings'

interface Props {
  booksResponse: Book[]
  categories: Category[],
  authors: Author[],
}

const MyBooks = ({
  booksResponse,
  categories,
  authors
}: Props) => {
  const { loading, user } = useAuth()
  const showModal = useRecoilValue(modalState)
  const [userData, setUserData] = useState<User | null>(null)

  useEffect(() => {
    fetch(`${requests.fetchSingleUser}${user?.id}`)
      .then((res) => res.json())
      .then((data) => {
        setUserData(data)
      })
      .catch((error) => console.log(error))
  }, [])


  if (loading) return null

  return (
    <div className="relative h-screen bg-gradient-to-b lg:h-[140vh]">
      <Head>
        <title>My Books</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className='relative pl-4 pb-24 lg:space-y-24 lg:pl-16'>
        <section className="md:space-y-24 py-16">
          {userData?.books.length == 0 ?
          <div className="flex flex-col space-y-3 items-center py-16">
            <FaBook className="h-[50px] w-[50px] text-white md:h-[70px] md:w-[70px]" />
            <h1 className="text-2xl font-bold md:text-4xl lg:text-2xl">
              We Couldnt Find Any Books
            </h1>
          </div> : null}
          <Grid container spacing={2}>
            {userData?.books.map((book) => (
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

export default MyBooks

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