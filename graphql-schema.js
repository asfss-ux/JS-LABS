const { buildSchema } = require('graphql');
const { Author, Title } = require('./models/Author');



const schema = buildSchema(`
    type Author {
        id: ID!
        name: String!
        lastname: String!
        title: [Title]
    }

    type Title {
        id: ID!
        title: String!
    }

    type Query {
        szukajAuthora(name: String, lastname: String): [Author]
        szukanieAuthorowPrzezAutorow(id: ID!): [Author]
        wszyscyAutorzy: [Author]
    }

    type Mutation {
        dodajAutora(name: String!, lastname: String!, titleName: String): Author
        usunAutora(id: ID!): String
        aktualizacjaAutora(id: ID!, name: String, lastname: String, titleName: String): Author
    }
`);

const root = {

    szukajAuthora: async ({ name, lastname }) => {
        try {
            const query = {};
            if (name) query.name = name;
            if (lastname) query.lastname = lastname;
           
            
            const authors = await Author.find(query).populate('title');
            if (authors.length === 0) {
                throw new Error('Nie znaleziono autorów o podanych kryteriach');
            }
            return authors;
        } catch (err) {
            throw new Error(`Błąd: ${err.message}`);
        }
    },

   
    szukanieAuthorowPrzezAutorow: async ({ id }) => { 
    try {
        const author = await Author.findById(id).populate('title');
        return author ? [author] : [];
    } catch (err) {
        throw new Error(`Błąd wyszukiwania po id ${err.message}`);
    }
},


    wszyscyAutorzy: async () => {
        try {
        const authors = await Author.find().populate('title');
        return authors;
    } catch (err) {
        throw new Error(`Błąd pobierania: ${err.message}`);
    }
    },


    dodajAutora: async ({ name, lastname, titleName }) => {
        try {
            let author = await Author.findOne({ name, lastname });
            
            if (author) {
                if (titleName) {
                    const newTitle = new Title({ title: titleName });
                    const savedTitle = await newTitle.save();
                    author.title.push(savedTitle._id);
                    await author.save();
                }
                return author.populate('title');
            } else {
                const newAuthor = new Author({
                    name,
                    lastname,
                    title: []
                });

                if (titleName) {
                    const newTitle = new Title({ title: titleName });
                    const savedTitle = await newTitle.save();
                    newAuthor.title.push(savedTitle._id);
                }

                const savedAuthor = await newAuthor.save();
                return savedAuthor.populate('title');
            }
        } catch (err) {
            throw new Error(`Błąd dodawania: ${err.message}`);
        }
    },

    usunAutora: async ({ id }) => {
        try {
            const deletedAuthor = await Author.findByIdAndDelete(id);
            if (!deletedAuthor) {
                throw new Error('Autor nie znaleziony');
            }
            return `Autor ${deletedAuthor.name} ${deletedAuthor.lastname} został usunięty`;
        } catch (err) {
            throw new Error(`Błąd usuwania autora: ${err.message}`);
        }
    },

    aktualizacjaAutora: async ({ id, name, lastname, titleName }) => {
        try {
            const updateData = {};
            if (name) updateData.name = name;
            if (lastname) updateData.lastname = lastname;

            const updatedAuthor = await Author.findByIdAndUpdate(
                id,
                updateData,
                { new: true }
            ).populate('title');

            if (!updatedAuthor) {
                throw new Error('Autor nie znaleziony');
            }

            if (titleName) {
                const newTitle = new Title({ title: titleName });
                const savedTitle = await newTitle.save();
                updatedAuthor.title.push(savedTitle._id);
                await updatedAuthor.save();
            }

            return updatedAuthor.populate('title');
        } catch (err) {
            throw new Error(`Błąd aktualizacji autora: ${err.message}`);
        }
    }
};

module.exports = { schema, root };
