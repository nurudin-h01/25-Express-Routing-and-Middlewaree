const express = require("express")
const app = express()
const port = 5000

app.use(express.json())
app.use(express.urlencoded({extended: true}))

//Midleware logger untuk semua route
app.use(logger)

//Inisialisasi data
const hewan = [
    { id: 1, nama: "Snowy", spesies: "kucing" },
    { id: 2, nama: "Blacki", spesies: "anjing" },
    { id: 3, nama: "Molly", spesies: "kucing" },
    { id: 4, nama: "Milo", spesies: "kelinci" },
    { id: 5, nama: "Rere", spesies: "kucing" },
];


// Baca semua data
app.get("/hewan", (req,res)=> {
  try {
    res.json ({
      msg: "data semua hewan",
      hewan
    })
  } catch (error) {
    res.status(400).send({
      msg: "tidak ada data"
    })
  }
})

app.post("/hewan", postChecker ,(req,res) => {
  try {
    const lengthID = hewan.length
    const payload = {
      id : lengthID+1,
      nama : req.body.nama,
      spesies : req.body.spesies
    }
    hewan.push(payload)
    res.status(201).json({
      msg : "data hewan berhasil ditambahkan",
      hewan
    })
  } catch (error) {
    res.status(400)
  }
})
 
app.get ("/hewan/:id", async (req, res) => {
  const hewanbyid = hewan.find(item => item.id === Number(req.params.id))
  console.log(hewanbyid)
  if (hewanbyid !== null && hewanbyid !== undefined) {
    res.json ({
      msg : "succes get data hewan by id",
      data: hewanbyid
    })
  }else {
    res.status(400).send({
      message : "error, hewan tidak ditemukan"
    })
  }
})


app.put("/hewan/:id", (req, res) => {
  const hewanbyid = hewan.find(item => item.id === Number(req.params.id))
  if (hewanbyid !== null && hewanbyid !== undefined) {
    const payload = {
      nama: req.body.nama,
      spesies: req.body.spesies,
    };
    hewan[req.params.id - 1].nama = payload.nama;
    hewan[req.params.id - 1].spesies = payload.spesies;
    res.json({
      msg: "Data berhasil di update",
      hewan,
    });
  }else{
      res.sendStatus(400)
  }
});

app.delete("/hewan/:id", (req,res) => {
  const hewanbyid = hewan.find(item => item.id === Number(req.params.id))
  if (hewanbyid !== null && hewanbyid !== undefined) {
    hewan.splice(req.params.id - 1,1)
    res.json({
      msg : "data hewan berhasil di hapus",
      data: hewan
    })
  }else{
    res.sendStatus(400)
  }    
})

function logger(req, res, next) {
  console.log("this is logger");
  next();
}  

function postChecker(req, res, next) {
  const payload = {
    nama: req.body.nama,
    spesies: req.body.spesies,
  };
  const spesies = ["kucing","anjing","kelinci"]
  if (spesies.includes(payload.spesies)) {
    next();
  } else {
    res.status(400).send({
      message: "spesies not valid"
    });
  }
}

app.listen(port, () => {
  console.log("server is listening in port", port)
})