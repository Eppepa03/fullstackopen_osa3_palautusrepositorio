const mongoose = require("mongoose")

if (process.argv.length<3) {
    console.log("give password as argument")
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://eppepa03:${password}@cluster0.ds4ar.mongodb.net/Puhelinluettelo?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set("strictQuery", false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model("Person", noteSchema)

if (process.argv[3] && process.argv[4]) {
    const note = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    note.save().then(result => {
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
        mongoose.connection.close()
    })
} else {
    Person.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(note => {
            console.log(note.name, note.number)
        })
        mongoose.connection.close()
    })
}