import express from "express";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";
import bodyParser from "body-parser";

const configuration = new Configuration({
  apiKey: "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",
});

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
        content: `sen bir kod üretme aracısın sana anlatılan kod'u yazacaksın.

                şimdilik sadece python ile cevap yazacaksın
                
                çıktın şu şekilde olacak
                {
                    "lang": kodu yazdığın dil string,
                    "code": kodun kendisi sting,
                    "succes": başarılı şekilde çalıştımı bool,
                    "error": eğer hata verdiysen hatayı açıkla eğer hata yoksa error kısmını hiç verme
                }
                
                bunun dışında hiçbirşey verme çıktıyı json olarak ver.`,
      },
      { 
        role: "user",
        content: text,
      },
    ],
  });

  res.send(completion.data.choices[0].message.content);
});

app.listen(3333, () => console.log("3333 portunda server çalışıyor!"));
