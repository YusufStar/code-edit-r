import express from "express";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";
import bodyParser from "body-parser";
import Mongoose from "mongoose"
import User from "../server/Schema/User.js"
import multer from "multer";
const configuration = new Configuration({
  apiKey: "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",
});

const upload = multer({ dest: "uploads/" });

const localDB = `mongodb+srv://yusuf:Lxu77xMZT3bn3KPg@cluster0.rokuwwc.mongodb.net/codeEditor`
const connectDB = async () => {
  await Mongoose.connect(localDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log("MongoDB Connected")
}

connectDB()

const openai = new OpenAIApi(configuration);

const app = express();

app.use(cors());
app.use(bodyParser.json())

app.get("/", (req, res) => {
  res.send("api calisiyor!");
});

app.post("/create-code", async (req, res) => {
  const text = req.body.text
  console.log(text)
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `
        sana verilen texti şu şekilde kullanacaksın: "text + bu programı python ile yaz"
        sen bir kod üretme aracısın sana anlatılan kod'u yazacaksın.
        
                        şimdilik sadece python ile cevap yazacaksın
                        
                        çıktın şu şekilde olacak
                        {
                            "lang": kodu yazdığın dil string,
                            "code": kodun kendisi sting,
                            "succes": başarılı şekilde çalıştımı bool,
                            "name": dosya için bir isim yarat uzantısını yazdığın koda göre ayarla,
                            "error": eğer hata verdiysen hatayı açıkla eğer hata yoksa error kısmını hiç verme
                        }
                        ne olursa olsun asla kendin bir yazı ekleme sadece istediğim formatta bir json returnet
        
        istediğiniz python kodu gibi gereksiz şeyler ekleme yazıya.
        çıktının sadece bu olduğundan emin ol ve bu formatta yazmayı asla unutma {
                            "lang": kodu yazdığın dil string,
                            "code": kodun kendisi sting,
                            "succes": başarılı şekilde çalıştımı bool,
                            "name": dosya için bir isim yarat uzantısını yazdığın koda göre ayarla,
                            "error": eğer hata verdiysen hatayı açıkla eğer hata yoksa error kısmını hiç verme
                        }
        `,
      },
      {
        role: "user",
        content: text,
      },
    ],
  });

  res.send(completion.data.choices[0].message.content);
});

app.post("/auth/signup", async (req, res) => {
  const {username, password } = req.body
  if (password.length < 6) {
    return res.status(400).json({ message: "Password less than 6 characters" })
  }
  try {
    await User.create({
      username,
      password,
    }).then(user =>
      res.status(200).json({
        message: "User successfully created",
        user: user,
      })
    )
  } catch (err) {
    res.status(401).json({
      message: err.message,
    })
  }
})

app.post("/auth/signin", async (req, res, next) => {
  try {
    const { email, username, password } = req.body
      const user = await User.findOne({ username, password })
    if (!user) {
      res.status(401).json({
        message: "Login not successful",
        error: "User not found",
      })
    } else {
      res.status(200).json({
        message: "Login successful",
        user,
      })
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    })
  }
})

app.post("/:username/files", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).send("Kullanıcı bulunamadı");

    const { filename, code, lang } = req.body;
    user.files.push({ filename, code, lang });
    await user.save();
    res.send(user.files);
  } catch (err) {
    console.log(err);
    res.status(500).send("Bir hata oluştu");
  }
});

// Kullanıcının belirli bir dosyasını getirmek için
app.get("/:username/files/:filename", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).send("Kullanıcı bulunamadı");

    const file = user.files.find((f) => f.filename === req.params.filename);
    if (!file) return res.status(404).send("Dosya bulunamadı");

    res.send(file);
  } catch (err) {
    console.log(err);
    res.status(500).send("Bir hata oluştu");
  }
});

// Kullanıcının dosya yüklemesi için
app.post("/:username/upload", upload.single("file"), async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).send("Kullanıcı bulunamadı");

    const { originalname: filename, buffer: code } = req.file;
    const lang = req.body.lang || "text";
    user.files.push({ filename, code, lang });
    await user.save();
    res.send(user.files);
  } catch (err) {
    console.log(err);
    res.status(500).send("Bir hata oluştu");
  }
});

// Kullanıcının belirli bir dosyasını güncellemesi için
app.put("/:username/files/:filename", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).send("Kullanıcı bulunamadı");

    const file = user.files.find((f) => f.filename === req.params.filename);
    if (!file) return res.status(404).send("Dosya bulunamadı");

    const { filename, code, lang } = req.body;
    if (code) file.code = code;
    if (lang) file.lang = lang;
    if (filename) file.filename = filename;

    await user.save();
    res.send(user.files);
  } catch (err) {
    console.log(err);
    res.status(500).send("Bir hata oluştu");}
    });

app.get("/:username/files", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).send("Kullanıcı bulunamadı");

    res.send(user.files);
  } catch (err) {
    console.log(err);
    res.status(500).send("Bir hata oluştu");
  }
});

const PORT = process.env.PORT || 3333

app.listen(PORT, () => console.log(PORT + " portunda server çalışıyor!"));
