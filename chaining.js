import React, { useState } from "react";

function App() {
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const startChaining = async () => {
    setOutput("");
    setIsStreaming(true);

    // 1️⃣ ReadableStream - produces chunks of data
    const readableStream = new ReadableStream({
      start(controller) {
        const messages = [
          "react streams are powerful",
          "you can chain transforms easily",
          "no backend required",
          "browser streaming rocks",
          "done ✅"
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
        }, 1000); // 1 message per second
      },
    });

    // 2️⃣ Transform 1 - convert to uppercase
    const uppercaseTransform = new TransformStream({
      transform(chunk, controller) {
        const upper = chunk.toUpperCase();
        controller.enqueue(upper);
      },
    });

    // 3️⃣ Transform 2 - add timestamp
    const timestampTransform = new TransformStream({
      transform(chunk, controller) {
        const time = new Date().toLocaleTimeString();
        const output = `[${time}] ${chunk}\n`;
        controller.enqueue(output);
      },
    });

    // 4️⃣ WritableStream - output to UI
    const writableStream = new WritableStream({
      write(chunk) {
        setOutput((prev) => prev + chunk);
      },
      close() {
        setIsStreaming(false);
      },
    });

    // 5️⃣ Chain them together (Readable → Uppercase → Timestamp → Writable)
    await readableStream
      .pipeThrough(uppercaseTransform)
      .pipeThrough(timestampTransform)
      .pipeTo(writableStream);
  };

  return (
    <div style={{ fontFamily: "monospace", padding: "20px" }}>
      <h2>🔗 React Stream Chaining (Readable → 2×Transform → Writable)</h2>
      <button onClick={startChaining} disabled={isStreaming}>
        {isStreaming ? "Streaming..." : "Start Stream Chain"}
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
