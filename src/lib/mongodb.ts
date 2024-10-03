import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI;
const cached: {
  connection?: typeof mongoose;
  promise?: Promise<typeof mongoose>;
} = {};

async function connectMongoDB() {
  if (!MONGO_URI) {
    throw new Error(
      "Please define the MONGO_URI environment variable inside .env.local"
    );
  }
  if (cached.connection) {
    return cached.connection;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
    };
    cached.promise = mongoose.connect(MONGO_URI, opts);
  }
  try {
    cached.connection = await cached.promise;
    await initializeCounter();
  } catch (e) {
    cached.promise = undefined;
    throw e;
  }
  return cached.connection;
}

export { connectMongoDB };
import Counter from "@/schemas/counter";

export async function initializeCounter() {
  const counterId = "orderCustomId"; // ID único para el contador

  // Verifica si el contador ya existe
  const existingCounter = await Counter.findById(counterId);

  if (!existingCounter) {
    // Si no existe, crea uno nuevo
    const newCounter = new Counter({
      _id: counterId,
      sequence_value: 0, // Inicia en 0
    });

    await newCounter.save(); // Guarda el nuevo contador
    console.log("Counter initialized:", newCounter);
  } else {
    console.log("Counter initialized:", existingCounter);
  }
}
