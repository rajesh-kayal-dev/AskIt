async function test() {
  try {
    const res = await fetch('http://localhost:8000/api/agent/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': '6a5cd0f99bb31c57f4dfaa80' // dummy user id
      },
      body: JSON.stringify({
        conversationId: '6a5cd0f99bb31c57f4dfaa80',
        prompt: 'hi'
      })
    });

    if (!res.body) {
      console.log("No body!");
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value, { stream: true });
      console.log("Chunk:", text);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
