import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import Axios from "npm:axios";

type Book = {
  id: string;
  title: string;
  author: string;
  cover: string;
};

type DataBooksAPI = {
  key: string;
  title: string;
  author_name: string;
  cover_i: number;
};

type Data = {
  dataBooks: Book[];
  bookName: string;
};

export const handler: Handlers = {
  GET: async (req: Request, ctx: FreshContext) => {
    try {
      const url = new URL(req.url);
      const searchBookName = url.searchParams.get("q") || "";

      const response = await Axios.get(`https://openlibrary.org/search.json?q=${searchBookName}`);

      const books: Book[] = response.data.docs.map((book: DataBooksAPI) => ({
        id: book.key.replace("/works/", ""),
        title: book.title,
        author: book.author_name,
        cover: `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`,
      }));

      return ctx.render({ dataBooks: books, bookName: searchBookName });
    } catch (e) {
      console.log(e);
      return new Response("Error en /search");
    }
  },
};

const Page = (props: PageProps<Data>) => {
  const { dataBooks } = props.data;

  return (
    <div>
      <h1>Buscar Libros</h1>
      <form method="get">
        <input
          type="text"
          name="q"
        />
        <button type="submit">Buscar</button>
      </form>
      <div class="grid">
        {dataBooks.map((book) => (
          <div>
            <img src={book.cover} />
            <h2>
              <a href={`/book/${book.id}`}>{book.title}</a>
            </h2>
            <p>{book.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
