import React, { useState } from "react";

function App() {
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const startPiping = async () => {
    setOutput("");
    setIsStreaming(true);

    // --- 1️⃣ Create a ReadableStream that produces chunks ---
    const readableStream = new ReadableStream({
      start(controller) {
        const messages = [
          "Hello stream world 🌍",
          "This is a chunk of data 💾",
          "React supports browser streams ⚛️",
          "Transforming data on the fly 🔄",
          "Done! ✅",
        ];
        let i = 0;

        const interval = setInterval(() => {
          if (i < messages.length) {
            controller.enqueue(messages[i]);
            i++;
          } else {
            controller.close();
            clearInterval(interval);
          }
        }, 1000); // send chunk every second
      },
    });

    // --- 2️⃣ Create a TransformStream that modifies chunks ---
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const timestamp = new Date().toLocaleTimeString();
        const transformed = `[${timestamp}] ${chunk}\n`;
        controller.enqueue(transformed);
      },
    });

    // --- 3️⃣ Create a WritableStream to handle output ---
    const writableStream = new WritableStream({
      write(chunk) {
        setOutput((prev) => prev + chunk);
      },
      close() {
        setIsStreaming(false);
      },
    });

    // --- 4️⃣ Connect them using pipeThrough + pipeTo ---
    await readableStream
      .pipeThrough(transformStream)
      .pipeTo(writableStream);
  };

  return (
    <div style={{ fontFamily: "monospace", padding: "20px" }}>
      <h2>🔗 React Stream Piping (Readable → Transform → Writable)</h2>
      <button onClick={startPiping} disabled={isStreaming}>
        {isStreaming ? "Streaming..." : "Start Piping Stream"}
      </button>
      <pre
        style={{
          marginTop: "20px",
          background: "#f4f4f4",
          padding: "10px",
          borderRadius: "5px",
          minHeight: "180px",
          whiteSpace: "pre-wrap",
        }}
      >
        {output}
      </pre>
    </div>
  );
}

export default App;
