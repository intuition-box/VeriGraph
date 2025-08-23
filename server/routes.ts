import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertAtomSchema, 
  insertTransactionSchema, 
  insertContractEventSchema,
  insertStakingPositionSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Atom routes
  app.get("/api/atoms", async (req, res) => {
    try {
      const atoms = await storage.getAtoms();
      res.json(atoms);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch atoms" });
    }
  });

  app.get("/api/atoms/:id", async (req, res) => {
    try {
      const atom = await storage.getAtom(req.params.id);
      if (!atom) {
        return res.status(404).json({ error: "Atom not found" });
      }
      res.json(atom);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch atom" });
    }
  });

  app.post("/api/atoms", async (req, res) => {
    try {
      const validatedData = insertAtomSchema.parse(req.body);
      const atom = await storage.createAtom(validatedData);
      res.status(201).json(atom);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid atom data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create atom" });
    }
  });

  app.put("/api/atoms/:id", async (req, res) => {
    try {
      const atom = await storage.updateAtom(req.params.id, req.body);
      if (!atom) {
        return res.status(404).json({ error: "Atom not found" });
      }
      res.json(atom);
    } catch (error) {
      res.status(500).json({ error: "Failed to update atom" });
    }
  });

  // Transaction routes
  app.get("/api/transactions", async (req, res) => {
    try {
      const transactions = await storage.getTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.get("/api/transactions/:hash", async (req, res) => {
    try {
      const transaction = await storage.getTransaction(req.params.hash);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transaction" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid transaction data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create transaction" });
    }
  });

  app.put("/api/transactions/:hash", async (req, res) => {
    try {
      const transaction = await storage.updateTransaction(req.params.hash, req.body);
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Failed to update transaction" });
    }
  });

  // Contract event routes
  app.get("/api/contract-events", async (req, res) => {
    try {
      const events = await storage.getContractEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contract events" });
    }
  });

  app.post("/api/contract-events", async (req, res) => {
    try {
      const validatedData = insertContractEventSchema.parse(req.body);
      const event = await storage.createContractEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid event data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create contract event" });
    }
  });

  // Staking position routes
  app.get("/api/staking-positions", async (req, res) => {
    try {
      const { user, atom } = req.query;
      let positions;
      
      if (user) {
        positions = await storage.getStakingPositionsByUser(user as string);
      } else if (atom) {
        positions = await storage.getStakingPositionsByAtom(atom as string);
      } else {
        positions = await storage.getStakingPositions();
      }
      
      res.json(positions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch staking positions" });
    }
  });

  app.post("/api/staking-positions", async (req, res) => {
    try {
      const validatedData = insertStakingPositionSchema.parse(req.body);
      const position = await storage.createStakingPosition(validatedData);
      res.status(201).json(position);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid staking position data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create staking position" });
    }
  });

  // Statistics route
  app.get("/api/stats", async (req, res) => {
    try {
      const atoms = await storage.getAtoms();
      const stakingPositions = await storage.getStakingPositions();
      
      const totalAtoms = atoms.length;
      const totalStaked = stakingPositions.reduce((sum, position) => {
        const amount = parseFloat(position.amount) / Math.pow(10, 18); // Convert from wei to ETH
        return sum + amount;
      }, 0);

      res.json({
        totalAtoms,
        totalStaked: totalStaked.toFixed(2)
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
