"use client";

import React, { useEffect, useRef, useState } from "react";

type MessageEntry = {
  role: "user" | "assistant";
  content: string;
};

const PROMPT_LABEL_USER = "junhao@cli";
const PROMPT_LABEL_ASSISTANT = "assistant";

const TerminalWindow: React.FC = () => {
  const [history, setHistory] = useState<MessageEntry[]>([]);
  const [streamingText, setStreamingText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentInput, setCurrentInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalRef.current?.focus();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [history, streamingText, error]);

  const renderLinePrefix = (role: MessageEntry["role"]) => (
    <span className="text-emerald-400 mr-3 select-none">
      {role === "user" ? PROMPT_LABEL_USER : PROMPT_LABEL_ASSISTANT}
    </span>
  );

  const appendToHistory = (entry: MessageEntry) => {
    setHistory((prev) => [...prev, entry]);
  };

  const sendPrompt = async (prompt: string) => {
    const trimmed = prompt.trim();
    if (!trimmed || isLoading) return;

    appendToHistory({ role: "user", content: trimmed });
    setCurrentInput("");
    setStreamingText("");
    setError(null);
    setIsLoading(true);
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(null);

    try {
      const response = await fetch("/api/ai-cli", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [...history, { role: "user", content: trimmed }] }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Request failed, please try again later.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        assistantMessage += decoder.decode(value, { stream: true });
        setStreamingText(assistantMessage);
      }

      appendToHistory({ role: "assistant", content: assistantMessage.trim() });
      setStreamingText("");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while processing your request. Please try again."
      );
    } finally {
      setIsLoading(false);
      terminalRef.current?.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.metaKey || event.ctrlKey) {
      return; // allow copy/paste etc.
    }

    if (isLoading && event.key === "Enter") {
      event.preventDefault();
      return;
    }

    if (event.key === "Backspace") {
      event.preventDefault();
      setCurrentInput((prev) => prev.slice(0, -1));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      sendPrompt(currentInput);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setCurrentInput("");
      setHistoryIndex(null);
      setCommandHistory([]);
      setHistory([]);
      setStreamingText("");
      setError(null);
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      setCurrentInput((prev) => prev + "  ");
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (commandHistory.length === 0) return;
      setHistoryIndex((idx) => {
        const nextIdx = idx === null ? commandHistory.length - 1 : Math.max(0, idx - 1);
        setCurrentInput(commandHistory[nextIdx] ?? "");
        return nextIdx;
      });
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (commandHistory.length === 0) return;
      setHistoryIndex((idx) => {
        if (idx === null) return idx;
        const nextIdx = idx + 1;
        if (nextIdx >= commandHistory.length) {
          setCurrentInput("");
          return null;
        }
        setCurrentInput(commandHistory[nextIdx] ?? "");
        return nextIdx;
      });
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      return;
    }

    if (event.key.length === 1) {
      event.preventDefault();
      setCurrentInput((prev) => prev + event.key);
    }
  };

  return (
    <div
      className="absolute inset-0 flex flex-col bg-[#04050c] text-[13px] font-mono text-emerald-200 focus:outline-none"
      tabIndex={0}
      ref={terminalRef}
      onKeyDown={handleKeyDown}
      onClick={() => terminalRef.current?.focus()}
    >
      <div className="flex items-center justify-between border-b border-emerald-900/40 bg-[#05070f] px-5 py-3">
        <div className="text-sm text-emerald-300">Junhao CLI · Knowledge Base Assistant</div>
        <div className="text-xs text-emerald-600">Esc: clear · ↑↓: history</div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {history.map((entry, index) => (
          <div key={index} className="whitespace-pre-wrap leading-relaxed">
            {renderLinePrefix(entry.role)}
            <span className="text-slate-100">{entry.content}</span>
          </div>
        ))}

        {streamingText && (
          <div className="whitespace-pre-wrap leading-relaxed">
            {renderLinePrefix("assistant")}
            <span className="text-slate-100">{streamingText}</span>
            <span className="animate-pulse text-emerald-400">▌</span>
          </div>
        )}

        {error && (
          <div className="whitespace-pre-wrap leading-relaxed text-red-400">
            {renderLinePrefix("assistant")}
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="border-t border-emerald-900/40 bg-[#05070f] px-5 py-4">
        <div className="flex items-start">
          <span className="text-emerald-500 mr-3 select-none">{PROMPT_LABEL_USER}</span>
          <div className="flex-1 whitespace-pre-wrap text-emerald-100">
            {currentInput || (!isLoading && "ask any question here")}
            {!isLoading && <span className="animate-pulse text-emerald-400">▌</span>}
          </div>
        </div>
        {isLoading && (
          <div className="mt-2 text-xs text-emerald-500">Thinking with the knowledge base…</div>
        )}
      </div>
    </div>
  );
};

export default TerminalWindow;
