const fs = require("fs");
const path = require("path");
const https = require("https");
const archiver = require("archiver");
const dotenv = require("dotenv");
const express = require("express");
const multer = require("multer");
const { Web3Storage, getFilesFromPath } = require("web3.storage");

dotenv.config();

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./tmp/");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).single("myFile");

const app = express();
const port = process.env.PORT || 80;

app.use("/static", express.static(path.join(__dirname, "public")));

const indexRoutes = require("./routes/index");
const aboutRoutes = require("./routes/about");
const communityRoutes = require("./routes/community");
const contactRoutes = require("./routes/contact");
const housesRoutes = require("./routes/houses");
const documentsRoutes = require("./routes/documents");
const adminRoutes = require("./routes/admin");
const technologyRoutes = require("./routes/technology");

app.use("/", indexRoutes);
app.use("/about", aboutRoutes);
app.use("/community", communityRoutes);
app.use("/contact", contactRoutes);
app.use("/houses", housesRoutes);
app.use("/documents", documentsRoutes);
app.use("/admin", adminRoutes);
app.use("/technology", technologyRoutes);

app.post("/upload", function (req, res, next) {
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
    } else {
      (async () => {
        console.log(req);
        
        const filename = req.file.filename;
        const filepath = path.join(__dirname, "tmp", filename);
        
        const cid = await storeFiles(filepath);
        
        fs.unlinkSync(filepath);
        
        res.status(200).send(`<span x-ref="response">${cid}</span>`);
      })();
    }
  });
});

app.get("/download", (req, res) => {
  console.log("creating archive");
  
  const files = [
    {
      name: "articles-of-incorporation",
      hash: "QmYRPSGau6KVwSvwYqBSYs7vrLJdSUs8cDf5cFeC93gGuZ",
    },
    {
      name: "member-by-laws",
      hash: "bafybeich5lo4x4y7ld7c6mtjqleui3icuagajvdkl6aen6iv55c7mm3ilm",
    },
    { name: "lenders",
      hash: "bafkreihne5jxznydrzpdp5b2kbhmzfz66qoa3qyanaeccclupx3m3qoegi",
    },
    {
      name: "membership-application",
      hash: "bafkreiffixgbvf3sidcano537zxxvel7y7h7mi2fxz2jntgqle32xzgbce",
    },
    {
      name: "membership-approval-policy",
      hash: "bafkreifot6edtg7dscokii65aqbxnets64flhharsn4fse6qhijpzczffa",
    },
    {
      name: "membership-information",
      hash: "QmPxtEd57sXPa7w7X1tXzXbwav2BC6QHSSk9bnJmxoLHgx",
    },
    {
      name: "procedures-for-purchasing",
      hash: "bafkreidrzdt5vsp7eodgj52tokxsuloi5nc7ya7oflcpxfbfy7a64s7tvy",
    },
    {
      name: "rules-and-regulations",
      hash: "bafybeif656xwtqany672nmtwscxxjdhfyjcon6ri7dp5im4fjl5wmm6cee",
    },
    {
      name: "schedule-of-fees",
      hash: "QmQuBaVoWeM5jRNUrVrMbHZsQfDFzDyanN6bbTgw4E7T9f",
    },
    {
      name: "promoter",
      hash: "QmeWofFTqULFSYzwqGdAuwf5SnVUxoXn5dCHU55v36FoQJ",
    },
    {
      name: "charles-county-recycling-calendar",
      hash: "QmPw6tViVrpv4prA2g7LUTtdP51ZEUB39cJxPt76HXpVJs",
    },
  ];

  const output = fs.createWriteStream(
    path.join(__dirname, "public", "files", "buyers-package.zip")
  );
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  output.on("close", function () {
    for (let i = 0; i < files.length; i++) {
      fs.unlinkSync(path.join(__dirname, `${files[i].name}.pdf`));
    }

    res.redirect("/static/files/buyers-package.zip");
  });

  archive.pipe(output);

  (async () => {
    await getFiles(files).then(() => {
      for (let i = 0; i < files.length; i++) {
        archive.append(fs.createReadStream(`${files[i].name}.pdf`), {
          name: `${files[i].name}.pdf`,
        });

        if (i === files.length - 1) {
          archive.finalize();
        }
      }
    });
  })();
});

app.get("*", function (req, res) {
  res.status(404).sendFile(path.join(process.cwd(), "views", "404.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function getFiles(files) {
  return new Promise(async (resolve) => {
    for (let i = 0; i < files.length; i++) {
      await getFile(files[i].hash, files[i].name);

      if (i === files.length - 1) {
        resolve();
      }
    }
  });
}

async function getFile(hash, fileName) {
  return new Promise((resolve) => {
    let f = fs.createWriteStream(`${fileName}.pdf`);

    https.get(`https://ipfs.io/ipfs/${hash}`, (response) => {
      response.pipe(f);

      f.on("finish", () => {
        f.close();

        resolve();
      });
    });
  });
}

async function storeFiles(path) {
  const files = await getFilesFromPath(path);
  
  const client = new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN });
  
  return await client.put(files, {
    wrapWithDirectory: false,
  });
}
