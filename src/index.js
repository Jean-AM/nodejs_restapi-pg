import express from "express"
import { PORT } from "./config.js"
import userRoutes from "./routes/users.routes.js"
import bookRoutes from "./routes/books.routes.js"
import authorRoutes from "./routes/authors.routes.js"
import categorieRoutes from "./routes/categories.routes.js"
import bookAuthorsRoutes from "./routes/bookAuthors.routes.js"
import bookCategoriesRoutes from "./routes/bookCategories.routes.js"
import morgan from 'morgan'

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(userRoutes);
app.use(bookRoutes);
app.use(authorRoutes);
app.use(categorieRoutes);
app.use(bookAuthorsRoutes);
app.use(bookCategoriesRoutes);

app.listen(PORT)
console.log("Server on port", PORT)