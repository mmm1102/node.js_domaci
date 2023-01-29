const express = require("express");
const recepti = require("./recepti.js");
const { urlencoded, json } = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;

app.use(json());
app.use(urlencoded({ extended: false }));

app.listen(port, () => {
  console.log("server je kreiran");
});

//GET metod
app.get("/api/recepti", (req, res) => {
  res.status(200).json(recepti);
});

app.get("/api/recepti/:id", (req, res) => {
  const id = req.params.id;

  if (id == undefined) {
    res.status(400).json({ poruka: "pogresan zahtev" });
  } else {
    const recept = recepti.filter((elem) => elem.id == id)[0];
    if (recept) {
      res.status(200).json(recept);
    } else {
      res.status(404).json({ poruka: "nepostojeci id" });
    }
  }
});

app.get("/api/recepti/:naziv", (req, res) => {
  const naziv = req.params.naziv;

  if (naziv == undefined) {
    res.status(400).json({ poruka: "pogresan zahtev" });
  } else {
    const recept = recepti.filter((elem) => elem.naziv == naziv)[0];
    if (recept) {
      res.status(200).json(recept);
    } else {
      res.status(404).json({ poruka: "nepostojeci naziv recepta" });
    }
  }
});

//POST metod
app.post("/api/recepti", (req, res) => {
  const { naziv, glavniSastojak, vremePripreme } = req.body;

  if (!naziv || !glavniSastojak || !vremePripreme) {
    res.status(400).json({ poruka: "greska" });
  } else {
    const noviRecept = {
      id: recepti[recepti.length - 1].id + 1,
      naziv: naziv,
      glavniSastojak: glavniSastojak,
      vremePripreme: vremePripreme,
      status: "active",
    };
    recepti.push(noviRecept);
    res.status(200).json(noviRecept);
  }
});

//PUT metod
app.put("/api/recepti/:id", (req, res) => {
  const id = req.params.id;

  const { naziv, glavniSastojak, vremePripreme } = req.body;

  if (!naziv || !glavniSastojak || !vremePripreme) {
    res.status(400).json({ poruka: "greska" });
  } else {
    recepti.forEach((elem) => {
      if (elem.id == id) {
        elem.naziv = naziv;
        elem.glavniSastojak = glavniSastojak;
        elem.vremePripreme = vremePripreme;
      }
    });
    const recept = recepti.find((elem) => elem.id == id);
    res.status(200).json(recept);
  }
});

//DELETE metod
app.delete("/api/recepti", (req, res) => {
  recepti.splice(0);
  res.status(200).json({ poruka: "obrisano je sve" });
});

app.delete("/api/recepti/:id", (req, res) => {
  const id = req.params.id;
  const receptIndex = recepti.findIndex(elem=>elem.id==id);

  if(receptIndex == -1){
    res.status(404).json({poruka:"greska"})
  }else{
    recepti.splice(receptIndex,1);
    res.status(200).json(recepti);
  }
})