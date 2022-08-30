const BASE_URL = 'http://localhost:1337'

const requests = {
  fetchBooks: `${BASE_URL}/book/getBooks`,
  fetchDeleteBook: `${BASE_URL}/book`,
  fetchUpdateBook: `${BASE_URL}/book/updateBook`,
  fetchBorrowBook: `${BASE_URL}/book/borrowBook`,
  fetchReturnBook: `${BASE_URL}/book/returnBook`,
  fetchCategories: `${BASE_URL}/category/getCategories`,
  fetchSingleCategory: `${BASE_URL}/category/getCategory`,
  fetchLogin: `${BASE_URL}/login`,
  fetchSignUp: `${BASE_URL}/auth/signUp`,
  fetchCheckToken: `${BASE_URL}/checkToken`,
  fetchSingleUser: `${BASE_URL}/user/`,
  fetchAuthors: `${BASE_URL}/author`,
  fetchUploadFile: `${BASE_URL}/upload`,
}

export default requests