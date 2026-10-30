import { useEffect, useRef, useState, type FormEvent } from 'react';

import styles from './ChatBot.module.scss';

import { sendMessage } from '../../api/chat';
import type { PhoneDetails } from '../../types';
import { CatalogCard } from '../CatalogCard';

type Message = {
  id: number;
  author: 'user' | 'bot';
  text: string;
  products?: PhoneDetails[];
};

export const ChatBot = () => {
  // lista de mensagens da conversa
  const [messages, setMessages] = useState<Message[]>([]);
  // texto que a pessoa está digitando
  const [input, setInput] = useState('');
  // true enquanto espera a resposta da IA
  const [isLoading, setIsLoading] = useState(false);

  // referência para rolar a conversa até a última mensagem
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (event: FormEvent) => {
    // impede o navegador de recarregar a página ao enviar o formulário
    event.preventDefault();

    const text = input.trim();

    if (!text || isLoading) {
      return;
    }

    // mostra a mensagem da pessoa na hora
    setMessages(prev => [...prev, { id: Date.now(), author: 'user', text }]);
    setInput('');
    setIsLoading(true);

    try {
      const { reply, products } = await sendMessage(text);

      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, author: 'bot', text: reply, products },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          author: 'bot',
          text: 'Não consegui responder agora. Tente de novo.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={styles.chat}>
      <h2 className={styles.chat__title}>Phone Advisor</h2>

      <div className={styles.chat__messages}>
        {messages.length === 0 && (
          <p className={styles.chat__hint}>
            Diga o que você procura. Ex.: &quot;quero um com muita bateria&quot;
            ou &quot;o mais barato com boa câmera&quot;.
          </p>
        )}

        {messages.map(message => (
          <div
            key={message.id}
            className={`${styles.chat__message} ${styles[`chat__message--${message.author}`]}`}
          >
            <p
              className={`${styles.chat__bubble} ${styles[`chat__bubble--${message.author}`]}`}
            >
              {message.text}
            </p>

            {message.products && message.products.length > 0 && (
              <div className={styles.chat__products}>
                {message.products.map(product => (
                  <CatalogCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <p
            className={`${styles.chat__bubble} ${styles['chat__bubble--bot']}`}
          >
            Pensando...
          </p>
        )}

        <div ref={endRef} />
      </div>

      <form className={styles.chat__form} onSubmit={handleSubmit}>
        <input
          className={styles.chat__input}
          type="text"
          value={input}
          onChange={event => setInput(event.target.value)}
          placeholder="O que você procura em um celular?"
        />

        <button
          className={styles.chat__button}
          type="submit"
          disabled={isLoading}
        >
          Enviar
        </button>
      </form>
    </section>
  );
};
