import { CardActionArea } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useRecoilState } from "recoil";
import { modalState, bookState } from "../atoms/modalAtom";
import { Book } from "../typings";

interface Props {
  book: Book
}

const CardComponent = ({book}: Props) => {
  const [showModal, setShowModal] = useRecoilState(modalState);
  const [currentBook, setCurrentBook] = useRecoilState(bookState);

  const openModal = () => {
    setCurrentBook(book);
    setShowModal(true);
  }

  return (
    <Card onClick={() => openModal()} sx={{ maxWidth: 245 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="50"
          image={book.cover}
          alt="green iguana"
        />
        <CardContent className="h-28">
          <Typography gutterBottom variant="h6" component="div">
            {book.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {book.authorId?.name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default CardComponent