const { Author, Title } = require('../models/Author');


exports.getAllAuthors = async (req, res) => {    
    try {
        const authors = await Author.find().populate('title');
        res.status(200).json(authors);
    } catch(err) {
        res.status(500).json({message: err.message});
    }
};


exports.getAuthorById = async (req, res) => { 
try {
        const author = await Author.findById(req.params.id).populate('title');
        if (!author) {
            return res.status(404).json({message: 'brak danych'});
        } else {
            res.json(author);
        }

    } catch(err) {
        res.status(400).json({message: err.message});
    }
};

exports.createAuthor = async (req, res) => {
try {
        const { name, lastname, titleName } = req.body;

        let author = await Author.findOne({ name, lastname });
        const newTitle = new Title({ title: titleName });
        const savedTitle = await newTitle.save();

        if (author) {
            author.title.push(savedTitle._id);
            await author.save();

            return res.status(200).json(author);
        } else {
            const newAuthor = new Author({
                name,
                lastname,
                title: [savedTitle._id]
            });

            await newAuthor.save();
            return res.status(201).json(newAuthor);
        }

    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
};

exports.deleteAuthor = async (req, res) => { 
   try {
        await Author.findByIdAndDelete(req.params.id);
        res.status(200).json({message: 'usunieto autora'});

    } catch(err) {
        res.status(400).json({message: err.message});
    }
};

exports.updateAuthor = async (req, res) => { 
try {
        const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            lastname: req.body.lastname,
            title: req.body.title
        }, {new: true});
        if (!updatedAuthor) {
            return res.status(404).json({message: 'brak danych'});
        } else {
            res.json(updatedAuthor);
        }
    } catch(err) {
        res.status(400).json({message: err.message});
    }

};