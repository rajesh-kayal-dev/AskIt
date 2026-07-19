async function test() {
  try {
    const res = await fetch('http://localhost:8002/internal/append', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId: '6a5cd0f99bb31c57f4dfaa80',
        prompt: 'hi',
        aiResponse: 'test response'
      })
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
