import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import Axios from "npm:axios";

type Book = {
  title: string;
  description: string;
  published: string;
  pages: number;
  cover: string;
  author: {
    name: string;
    id: string;
  };
};

export const handler: Handlers = {
  GET: async (_req: Request, ctx: FreshContext) => {
    try {
      const { id } = ctx.params;
      const apiURL = await Axios.get(`https://openlibrary.org/works/${id}.json`);
      const response = apiURL.data;

      const authorKey = response.authors[0].author.key;
      const authorId = authorKey.replace("/authors/", "");

      const authorResponse = await Axios.get(`https://openlibrary.org${authorKey}.json`);
      const authorData = authorResponse.data;

      const book: Book = {
        title: response.title,
        description: response.description,
        published: response.created.value,
        pages: response.pagination,
        cover: `https://covers.openlibrary.org/b/id/${response.covers[0]}-L.jpg`,
        author: {
          name: authorData.name,
          id: authorId,
        },
      };

      return ctx.render({ dataBooks: book });
    } catch (err) {
      console.log(err);
      return new Response("Error en la pagina de Book ID");
    }
  },
};

const Page = (props: PageProps) => {
  const book = props.data.dataBooks;

  return (
    <div>
      <h1>{book.title}</h1>
      <img src={book.cover} />
      <p>
        <strong>DESCRIPCION:</strong>
        {book.description}
      </p>
      <p>
        <strong>FECHA:</strong> {book.published}
      </p>
      <p>
        <strong>PAGINAS</strong> {book.pages}
      </p>
      <p>
        Autor: <a href={`/author/${book.author.id}`}>{book.author.name}</a>
      </p>
    </div>
  );
};

export default Page;
