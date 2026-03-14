import express from "express";
import { createServer as createViteServer } from "vite";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { supabase } from "./config/supabase";
import { hashPassword } from "./utils/hash";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/products.routes";
import orderRoutes from "./routes/orders.routes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedDatabase() {
  try {
    // Seed Admin if not exists
    const { data: adminExists } = await supabase
      .from("users")
      .select("*")
      .eq("email", "admin@luzesdecharme.com")
      .single();

    if (!adminExists) {
      console.log("Seeding admin user...");
      const password_hash = await hashPassword("admin123");
      await supabase.from("users").insert([
        { email: "admin@luzesdecharme.com", password_hash, role: "admin" }
      ]);
    }

    // Seed initial products if empty
    const { count } = await supabase
      .from("produtos")
      .select("*", { count: "exact", head: true });

    if (count === 0) {
      console.log("Seeding initial products...");
      const initialProducts = [
        { nome: "Nike Air Max Premium", preco: 45000, categoria: "tenis", imagem: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80", badge: "Novo" },
        { nome: "Adidas Ultra Boost", preco: 38000, categoria: "tenis", imagem: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80", badge: "Destaque" },
        { nome: "Air Jordan Retro 1", preco: 55000, categoria: "tenis", imagem: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80", badge: "Exclusivo" },
        { nome: "Vestido Silk Elegance", preco: 32000, categoria: "roupas", imagem: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80", badge: "Popular" },
        { nome: "Conjunto Casual Luxo", preco: 48500, categoria: "roupas", imagem: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80", badge: null },
        { nome: "Blusa Seda Premium", preco: 22000, categoria: "roupas", imagem: "https://images.unsplash.com/photo-1594938298603-eb8d2c81d2e0?w=800&q=80", badge: "Novo" },
        { nome: "Mala de Couro Elite", preco: 65000, categoria: "acessorios", imagem: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80", badge: "Exclusivo" },
        { nome: "Mochila Urbana Deluxe", preco: 28000, categoria: "acessorios", imagem: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80", badge: null },
        { nome: "Relógio Gold Master", preco: 120000, categoria: "acessorios", imagem: "https://images.unsplash.com/photo-1524592091214-8c97af1c0db4?w=800&q=80", badge: "Premium" }
      ];
      await supabase.from("produtos").insert(initialProducts);
    }
  } catch (error) {
    console.error("Error during database seeding:", error);
  }
}

async function startServer() {
  await seedDatabase();

  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(cors({
    origin: true,
    credentials: true
  }));
  app.use(express.json());
  app.use(cookieParser());

  // API Routes
  app.get("/api/config/status", (req, res) => {
    const status = {
      supabaseUrl: !!process.env.SUPABASE_URL,
      supabaseServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
      jwtSecret: !!process.env.JWT_SECRET,
      isConfigured: !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY && process.env.JWT_SECRET)
    };
    res.json(status);
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/orders", orderRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
