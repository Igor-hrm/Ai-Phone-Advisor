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
          'Responda SEMPRE no mesmo idioma da mensagem do usuário.' +
          'Você recomenda celulares. Use SOMENTE itens deste catálogo: ' +
          JSON.stringify(catalog) +
          '. Os critérios são desempenho (processor e ram), câmera, tela e preço. ' +
          'A bateria não está no catálogo: se o usuário pedir bateria, estime pelo que você ' +
          'conhece do modelo e diga que é uma estimativa; se não tiver certeza, avise. ' +
          'Escolha até 4 ids e explique em 1 ou 2 frases. ',
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
