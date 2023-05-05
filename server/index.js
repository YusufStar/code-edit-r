import express from "express";
import { config } from "dotenv";
config();
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";
import bodyParser from "body-parser";
import Mongoose from "mongoose"
const FilesSchema = new Mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  lang: {
    type: String,
    required: true
  },
  Ispublic: {
    type: Boolean,
    required: true,
    default: false
  }
});

const UserSchema = new Mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  files: [FilesSchema]
});

const User = Mongoose.model("user", UserSchema);
import multer from "multer";
import { spawn } from "child_process";
import {NodeVM} from "vm2"
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const connectDB = async () => {
  await Mongoose.connect(process.env.MONGO_URL, {
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
app.use(bodyParser.urlencoded({ extended: true }));
const vm = new NodeVM();


app.get("/", (req, res) => {
  res.send("api calisiyor!");
});

app.post("/create-code", async (req, res) => {
  const { text, lang } = req.body
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `sen bir kod üretme aracısın sana anlatılan kod'u yazacaksın.
        
                        ${lang} ile cevap yazacaksın!
                        kod dışında ekstra mesah olarak hiçbirşey ekleme ne olursa olsun!!!
                        
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
                        code kısmında kod dışında hiçbirşey verme.
                        code ksımına ${lang} dilindeki istediğim programın kodu dışında kendin hiçbirşey ekleme!!.
                        `,
      },
      {
        role: "user",
        content: text,
      },
    ],
  });

  res.send(JSON.stringify(completion.data.choices[0].message.content));
});

app.post("/auto-complete", async(req, res) => {
  const {text} = req.body
  const response = await openai.createEdit({
    model: "text-davinci-edit-001",
    input: text,
    instruction: "yazılan dili anla ve yazılan kod üzerinden kullanıcının yazmak istediği kodu açıklama satırlarıyla anlatarak detaylı ve optimize şekilde yaz veya tamamla. yazdığın kod bir parametre alıyorsa her zaman bir fonksiyon yazmalısın çünkü input çalışmayacaktır benim yazdığım editörde o yüzden ne olursa olsun input kullanma eğer fonskiyon yazmak istemezsen input yerine örnek bir veri ver direkt.",
    temperature: 0.7,
    top_p: 1,
  });

  res.send({res: response.data.choices[0].text});
})

app.post("/auth/signup", async (req, res) => {
  const { username, password } = req.body
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

app.post("/auth/signin", async (req, res) => {
  try {
    const { username, password } = req.body
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

app.get("/files", async (req, res) => {
  try {
    const users = await User.find({ "files.Ispublic": true });
    const files = users.flatMap(user => user.files.filter(file => file.Ispublic));
    res.send({data: files});
  } catch (err) {
    console.log(err);
    res.status(500).send("Bir hata oluştu");
  }
});


app.post("/:username/files", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).send("Kullanıcı bulunamadı");

    const { filename, code, lang } = req.body;
    user.files.push({ filename, code, lang, Ispublic: false});
    await user.save();
    res.send(user.files);
  } catch (err) {
    console.log(err);
    res.status(500).send("Bir hata oluştu");
  }
});

// Kullanıcının belirli bir dosyasını getirmek için
app.get("/:username/files/:id", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).send("Kullanıcı bulunamadı");

    const file = user.files.id(req.params.id);
    if (!file) return res.status(404).send("Dosya bulunamadı");

    res.send(file);
  } catch (err) {
    console.log(err);
    res.status(500).send("Bir hata oluştu");
  }
});

// Kullanıcının belirli bir dosyasını güncellemesi için
app.put("/:username/files/:filename", async (req, res) => {
  try {
    const authUsername = req.body.username
    const user = await User.findOne({ username: req.params.username });

    if (!user) return res.status(404).send("Kullanıcı bulunamadı");

    if (authUsername !== user.username) return res.status(401).send("Yetkiniz yok");

    const file = user.files.find((f) => f.filename === req.params.filename);
    if (!file) return res.status(404).send("Dosya bulunamadı");

    const { filename, code, lang, Ispublic } = req.body;
    if (code) file.code = code;
    if (lang) file.lang = lang;
    if (filename) file.filename = filename;
    if (Ispublic) file.Ispublic = Ispublic

    await user.save();
    res.send(user.files);
  } catch (err) {
    console.log(err);
    res.status(500).send({message: "Bir hata oluştu"});
  }
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


app.delete("/:username/files/:filename", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).send("Kullanıcı bulunamadı");

    const fileIndex = user.files.findIndex((f) => f.filename === req.params.filename);
    if (fileIndex === -1) return res.status(404).send("Dosya bulunamadı");

    user.files.splice(fileIndex, 1);
    await user.save();
    res.send(user.files);
  } catch (err) {
    console.log(err);
    res.status(500).send("Bir hata oluştu");
  }
});

app.post('/execute', (req, res) => {
  const code = req.body.code;
  const lang = req.body.lang;

  let result = '';
  let error = '';

  if (lang === 'python') {
    const process = spawn('python', ['-c', code]);

    process.stdout.on('data', (data) => {
      result += data.toString();
    });

    process.stderr.on('data', (data) => {
      error += data.toString();
    });

    process.on('close', (code) => {
      if (code !== 0) {
        res.status(500).json({ error: error });
      } else {
        res.json({ result: result });
      }
    });

  } else if (lang === 'javascript') {
    try {
      const context = {
        console: {
          log: (data) => {
            result += data.toString() + '\n';
          },
        },
      };
  
      const vm = new NodeVM({sandbox: context});
      vm.run(code);
  
      res.send({result: result});
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(400).json({ error: 'Unsupported language' });
  }
});

const PORT = process.env.PORT || 3333

app.listen(PORT, () => console.log(PORT + " portunda server çalışıyor!"));
