import express from 'express';

import cors from 'cors';
import { readFileSync } from 'node:fs';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 1) Lê os celulares do arquivo
const phones = JSON.parse(readFileSync('./phones.json', 'utf-8'));

// 2) As caracteristicas q o Gemini 'enxerga' e compara
const catalog = phones.map(p => ({
  id: p.id,
  name: p.name,
  price: p.priceDiscount,
  processor: p.processor,
  ram: p.ram,
  camera: p.camera,
  screen: p.screen,
  resolution: p.resolution,
}));

console.log(
  'Tamanho do catálogo:',
  JSON.stringify(catalog).length,
  'caracteres',
);

app.get('/', (req, res) => {
  res.send('Server ON!');
});

// 3) Rota do chatbot
app.post('/api/recommend', async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: req.body.message,
      config: {
        systemInstruction:
          'LANGUAGE RULE: detect the language of the user\'s message and write the "reply" field ' +
          'in that same language (Portuguese, Spanish, English, etc.). Never default to Portuguese. ' +
          'You recommend phones. Use ONLY items from this catalog: ' +
          JSON.stringify(catalog) +
          '. The criteria are performance (processor and ram), camera, screen and price. ' +
          'Battery is not in the catalog: if the user asks about battery, estimate from what you ' +
          'know about the model and say it is an estimate; if you are not sure, say so. ' +
          'Pick up to 4 ids and explain in 1 or 2 sentences.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING },
            ids: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['reply', 'ids'],
        },
      },
    });

    // Parse para pegar a chegada em texto para obj
    const data = JSON.parse(response.text);

    // 4) Descarta ids que a IA inventou
    // acha cada celular pelo id e descarta os que não existem
    const products = data.ids
      .map(id => phones.find(p => p.id === id))
      .filter(Boolean);

    res.json({ reply: data.reply, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: 'Error talking to the AI.', products: [] });
  }
});

app.listen(3001, () => {
  console.log('Rodando em http://localhost:3001');
});
