import React, { useState } from "react";

function App() {
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  // Function to start the simulated stream
  const startStream = async () => {
    setOutput("");
    setIsStreaming(true);

    // Create a local readable stream
    const stream = new ReadableStream({
      start(controller) {
        const messages = [
          "🟢 Starting local stream...\n",
          "📦 Sending first chunk of data...\n",
          "🚀 Streaming in progress...\n",
          "✨ Almost done...\n",
          "✅ Stream complete!\n"
        ];

        let i = 0;

        // Send one message every second
        const interval = setInterval(() => {
          if (i < messages.length) {
            const chunk = new TextEncoder().encode(messages[i]);
            controller.enqueue(chunk);
            i++;
          } else {
            controller.close();
            clearInterval(interval);
          }
        }, 1000);
      },
    });

    // Read the stream
    const reader = stream.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break; // Stream finished
      const chunkText = decoder.decode(value, { stream: true });
      setOutput((prev) => prev + chunkText);
    }

    setIsStreaming(false);
  };

  return (
    <div style={{ fontFamily: "monospace", padding: "20px" }}>
      <h2>📡 React Readable Stream </h2>
      <button onClick={startStream} disabled={isStreaming}>
        {isStreaming ? "Streaming..." : "Start Stream"}
      </button>
      <pre
        style={{
          marginTop: "20px",
          background: "#f4f4f4",
          padding: "10px",
          borderRadius: "5px",
          minHeight: "150px",
          whiteSpace: "pre-wrap",
        }}
      >
        {output}
      </pre>
    </div>
  );
}

export default App;