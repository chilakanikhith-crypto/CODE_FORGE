const response = await fetch("http://localhost:5000/api/ai", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    question: "Hello",
    campusData: [],
  }),
});

const data = await response.json();

console.log(data);