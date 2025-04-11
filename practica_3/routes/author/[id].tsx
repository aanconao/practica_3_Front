import { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import Axios from "npm:axios";

type Book = {
  title: string;
  id: string;
  cover?: string;
};

type Author = {
  name: string;
  bio?: string;
  books: Book[];
};



export const handler: Handlers = {
  GET: async (_req: Request, ctx: FreshContext) => {
    try {
      const { id } = ctx.params;
      const apiURL = await Axios.get(`https://openlibrary.org/authors/${id}.json`);
      const response = apiURL.data;

      const worksURL = await Axios.get(`https://openlibrary.org/authors/${id}/works.json`);
      const works = worksURL.data.entries;

      const author: Author = {
        name: response.name,
        bio: typeof response.bio === "string" ? response.bio : response.bio?.value,
        books: works.slice(0, 6).map((item:any) => ({
          title: item.title,
          id: item.key.replace("/works/", ""),
          cover: item.covers?.[0]
            ? `https://covers.openlibrary.org/b/id/${item.covers[0]}-L.jpg`
            : undefined,
        })),
      };

      return ctx.render({ dataAuthor: author });
    } catch (err) {
      console.log(err);
      return new Response("Error en la pagina de Author ID");
    }
  },
};

const Page = (props: PageProps) => {
    const author = props.data.dataAuthor;
  
    return (
      <div>
        <h1>{author.name}</h1>
        {author.bio && <p><strong>BIOGRAFÍA:</strong> {author.bio}</p>}
        <div class="grid">
          {author.books.map((book: Book) => (
            <div class="card" key={book.id}>
              {book.cover && <img src={book.cover} alt={book.title} />}
              <h3><a href={`/book/${book.id}`}>{book.title}</a></h3>
            </div>
          ))}
        </div>
      </div>
    );
  };

  export default Page;

