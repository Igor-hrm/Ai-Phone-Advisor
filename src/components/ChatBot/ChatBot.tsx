import styles from './ChatBot.module.scss';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useLocation } from 'react-router-dom';

import { getRecommendations } from '../../api/chat';
import type { ChatMessage } from '../../types';
import { CatalogCard } from '../CatalogCard';

const chatIconPath =
  'M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z';

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // a função no useState é para descobrir o valor inicial quando criar o estado
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const savedMessages = sessionStorage.getItem('chatMessages');

    //json sempre devolve texto, o parse faz: string -> objeto/array
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const listRef = useRef<HTMLDivElement>(null);

  const { pathname } = useLocation();

  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // stringify objeto/array -> string
    sessionStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    // fecha o chat quando troca de página, a conversa continua salva
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    // ao abrir, vai direto para a última mensagem
    if (isOpen) {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
    }
  }, [isOpen]);

  useEffect(() => {
    const list = listRef.current;

    if (!list) {
      return;
    }

    const lastMessage = messages[messages.length - 1];
    const lastElement = lastMessageRef.current;

    // resposta do bot: mostra o começo dela, para o texto não ficar acima dos cards
    if (lastMessage?.author === 'bot' && lastElement) {
      const top =
        lastElement.getBoundingClientRect().top -
        list.getBoundingClientRect().top +
        list.scrollTop;

      list.scrollTo({ top, behavior: 'smooth' });

      return;
    }

    // mensagem do usuário ou "Thinking...": vai para o fim
    list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (event: FormEvent) => {
    // não deixa o navegador recarregar a página ao enviar
    event.preventDefault();

    const text = input.trim();

    if (!text || isLoading) {
      return;
    }

    setMessages(prev => [...prev, { id: Date.now(), author: 'user', text }]);
    setInput('');
    setIsLoading(true);

    getRecommendations(text)
      .then(({ reply, products }) => {
        setMessages(prev => [
          ...prev,
          { id: Date.now(), author: 'bot', text: reply, products },
        ]);
      })
      .catch(() => {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            author: 'bot',
            text: "Sorry, I couldn't answer right now. Try again.",
          },
        ]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // botão flutuante, quando o chat está fechado
  if (!isOpen) {
    return (
      <button
        className={styles.chat__fab}
        type="button"
        aria-label="Open Phone Advisor"
        onClick={() => setIsOpen(true)}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d={chatIconPath} />
        </svg>
      </button>
    );
  }

  return (
    <section className={styles.chat__panel} aria-label="Phone Advisor">
      {/* HEADER */}
      <header className={styles.chat__header}>
        <h2 className={styles.chat__title}>Phone Advisor</h2>

        <div className={styles.chat__actions}>
          {messages.length > 0 && (
            <button
              className={styles.chat__textButton}
              type="button"
              onClick={() => setMessages([])}
            >
              Clear
            </button>
          )}

          <button
            className={styles.chat__textButton}
            type="button"
            aria-label="Close chat"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>
      </header>

      {/* MESSAGES */}
      <div className={styles.chat__messages} ref={listRef}>
        {messages.length === 0 && (
          <p className={styles.chat__hint}>
            Tell me what you are looking for. Ex.: &quot;I want the best one
            &quot; or &quot;the cheapest with a good camera&quot;.
          </p>
        )}

        {messages.map((message, index) => (
          <div
            key={message.id}
            ref={index === messages.length - 1 ? lastMessageRef : null}
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
            Thinking...
          </p>
        )}
      </div>

      {/* FORM */}
      <form className={styles.chat__form} onSubmit={handleSubmit}>
        <input
          className={styles.chat__input}
          type="text"
          value={input}
          placeholder="What are you looking for in a phone?"
          onChange={event => setInput(event.target.value)}
        />

        <button
          className={styles.chat__button}
          type="submit"
          disabled={isLoading}
        >
          Send
        </button>
      </form>
    </section>
  );
};
