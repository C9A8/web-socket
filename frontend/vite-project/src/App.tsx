import React, { useState, useEffect, useRef } from 'react';

type MessageData =
  | { type: 'system'; message: string }
  | { type: 'message'; from: string; content: string };

const ChatApp: React.FC = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [room, setRoom] = useState('');
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState<string[]>([]);

  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (joined) {
      const ws = new WebSocket('ws://localhost:3000');

      ws.onopen = () => {
        ws.send(JSON.stringify({ type: 'join', room }));
      };

      ws.onmessage = (event: MessageEvent) => {
        try {
          const data: MessageData = JSON.parse(event.data);

          if (data.type === 'system') {
            setChatLog(prev => [...prev, `[System]: ${data.message}`]);
          } else if (data.type === 'message') {
            setChatLog(prev => [...prev, `[${data.from}]: ${data.content}`]);
          }
        } catch (err) {
          console.error('Invalid message from server:', event.data);
        }
      };

      ws.onclose = () => {
        setChatLog(prev => [...prev, '[System]: Disconnected from server']);
      };

      setSocket(ws);

      return () => {
        ws.close();
      };
    }
  }, [joined, room]);

  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.send(JSON.stringify({ type: 'message', content: message }));
      setMessage('');
    }
  };

  const handleJoin = () => {
    if (room.trim()) {
      setJoined(true);
    }
  };

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [chatLog]);

  return (
    <div style={styles.container}>
      {!joined ? (
        <div style={styles.joinBox}>
          <h2>Join a Room</h2>
          <input
            type="text"
            placeholder="Enter room name"
            value={room}
            onChange={e => setRoom(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleJoin} style={styles.button}>Join</button>
        </div>
      ) : (
        <div style={styles.chatBox}>
          <h2>Room: {room}</h2>
          <div style={styles.messages} ref={chatRef}>
            {chatLog.map((msg, i) => (
              <div key={i} style={styles.message}>{msg}</div>
            ))}
          </div>
          <div style={styles.inputRow}>
            <input
              type="text"
              placeholder="Type a message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              style={styles.input}
            />
            <button onClick={sendMessage} style={styles.button}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: 20,
    fontFamily: 'sans-serif',
    maxWidth: 600,
    margin: 'auto',
  },
  joinBox: {
    textAlign: 'center',
  },
  chatBox: {
    border: '1px solid #ccc',
    padding: 10,
    borderRadius: 8,
  },
  messages: {
    height: 300,
    overflowY: 'auto',
    background: '#f4f4f4',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  message: {
    marginBottom: 5,
  },
  inputRow: {
    display: 'flex',
    gap: 10,
  },
  input: {
    flex: 1,
    padding: 8,
    borderRadius: 4,
    border: '1px solid #ccc',
  },
  button: {
    padding: '8px 16px',
    borderRadius: 4,
    border: 'none',
    background: '#007bff',
    color: 'white',
    cursor: 'pointer',
  },
};

export default ChatApp;
