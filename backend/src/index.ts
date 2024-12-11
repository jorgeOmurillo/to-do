import { connectDatabase, initializeApp } from "./server";

const PORT = process.env.PORT || 3000;
const app = initializeApp();

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
