import { runFactory, prepareFactory } from "../src/index";
import { RootQuery, Book, User, BookQuery, RootQueryBookArgs, RootQueryBooksArgs, RootQueryUserArgs } from "../src/generated/graphql";


const run = runFactory<{ query: RootQuery }>()

const rootQuery = prepareFactory<RootQuery, {}, 'query'>('query')({})
const bookQuery = prepareFactory<Book, RootQueryBookArgs, 'book'>('book')
const booksQuery = prepareFactory<BookQuery, RootQueryBooksArgs, 'books'>('books')
const userQuery = prepareFactory<User, RootQueryUserArgs, 'user'>('user')

const t3 = rootQuery(
    bookQuery({ id: '' })(
        'authors',
        'title',
    ),
)
const t4 = run(t3)
t4.query.book.title
if (t4.query.book) {
    t4.query.book.title
}

