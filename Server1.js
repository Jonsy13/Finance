const app = require('http').createServer((req,res) => res.send('oh hi'));

const PORT = process.env.PORT;
app.listen(process.env.PORT , () => {
    console.log(`Server is listeneing on port ${PORT}`);
});


console.log(process.env.PORT);