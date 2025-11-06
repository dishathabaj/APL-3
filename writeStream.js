import React, { useState } from "react";

function App() {
  const [output, setOutput] = useState("");
  const [isWriting, setIsWriting] = useState(false);

  const startWritableStream = async () => {
    setOutput("");
    setIsWriting(true);

   
    let collectedText = "";

    const writableStream = new WritableStream({
      write(chunk) {
        const text = new TextDecoder().decode(chunk);
        collectedText += text;
        setOutput((prev) => prev + text);
      },
      close() {
        console.log("✅ WritableStream closed");
        setIsWriting(false);
      },
    });

    
    const writer = writableStream.getWriter();
    const encoder = new TextEncoder();

    const messages = [
      "✏️ Writing to stream...\n",
      "🧩 Chunk 1 written.\n",
      "📦 Chunk 2 written.\n",
      "🚀 Finishing up...\n",
      "✅ Stream writing complete!\n",
    ];

    for (let i = 0; i < messages.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); 
      await writer.write(encoder.encode(messages[i]));
    }

   
    await writer.close();
  };

  return (
    <div style={{ fontFamily: "monospace", padding: "20px" }}>
      <h2>✍️ React Writable Stream </h2>
      <button onClick={startWritableStream} disabled={isWriting}>
        {isWriting ? "Writing..." : "Start Writing Stream"}
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
