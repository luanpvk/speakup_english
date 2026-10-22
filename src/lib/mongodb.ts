import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// Anti NoSQL injection: objetos vindos do usuário com operadores ($ne, $gt...) viram comparação literal
mongoose.set("sanitizeFilter", true);
mongoose.set("strictQuery", true);

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Serverless-safe MongoDB connection (reuses connection across invocations).
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      // Comprime o tráfego com o banco (respostas grandes, banco remoto)
      compressors: ["zlib"],
      serverSelectionTimeoutMS: 10_000,
    });
    cached.promise.catch(() => {
      cached.promise = null; // falhou: tenta conectar de novo no próximo pedido
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
