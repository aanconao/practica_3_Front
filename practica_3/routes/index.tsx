import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import Axios from "npm:axios";

const featuredBooks = [
  "To Kill a Mockingbird",
  "1984",
  "The Great Gatsby",
  "Pride and Prejudice",
  "The Hobbit",
  "Moby-Dick",
  "Jane Eyre",
  "War and Peace",
  "The Catcher in the Rye",
  "Brave New World",
  "The Lord of the Rings",
  "Crime and Punishment",
  "The Alchemist",
  "The Picture of Dorian Gray",
  "Harry Potter and the Sorcerer's Stone",
];

type Book = {
  id: string;
  title: string;
  author: string;
  cover: string;
};

type Data = {
  books: Book[];
};

export const handler: Handlers<Data> = {
  GET: async (_req: Request, ctx: FreshContext) => {
    const books = await Promise.all(featuredBooks.map(async (title) => {
      const respobse = await Axios.get(`https://openlibrary.org/search.json?q=${title}`);
      const data = respobse.data.docs[0];
      return {
        id: data.key.replace("/works/", ""),
        title: data.title,
        author: data.author_name,
        cover: `https://covers.openlibrary.org/b/id/${data.cover_i}-L.jpg`,
      };
    }));

    return ctx.render({ books });
  },
};

const Page = (props: PageProps<Data>) => {
  const books = props.data.books;
  return (
    <>
      <h1>Libros</h1>
        <div class="grid">
        {books.map((book) => (
          <div class="card">
            <img src={book.cover} />
            <h2>
              <a href={`book/${book.id}`}>{book.title}</a>
            </h2>
            <p>{book.author}</p>
          </div>
        ))}
        </div>
    </>
  );
};

export default Page;
