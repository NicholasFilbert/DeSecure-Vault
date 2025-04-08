import dotenv from "dotenv";
dotenv.config()

const { default: app } = await import("./src/app.js"); 

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
