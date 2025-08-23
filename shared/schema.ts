import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, numeric, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const atoms = pgTable("atoms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  chainId: numeric("chain_id").notNull(),
  atomId: text("atom_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  creator: text("creator").notNull(),
  uri: text("uri"),
  createdAt: timestamp("created_at").defaultNow(),
  totalStake: numeric("total_stake").default("0"),
  stakeholderCount: numeric("stakeholder_count").default("0"),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hash: text("hash").notNull().unique(),
  type: text("type").notNull(),
  from: text("from").notNull(),
  to: text("to"),
  value: text("value"),
  gasUsed: text("gas_used"),
  gasPrice: text("gas_price"),
  status: text("status").notNull(),
  blockNumber: numeric("block_number"),
  timestamp: timestamp("timestamp").defaultNow(),
  atomId: text("atom_id"),
});

export const contractEvents = pgTable("contract_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contractAddress: text("contract_address").notNull(),
  eventName: text("event_name").notNull(),
  blockNumber: numeric("block_number").notNull(),
  transactionHash: text("transaction_hash").notNull(),
  eventData: jsonb("event_data"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const stakingPositions = pgTable("staking_positions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userAddress: text("user_address").notNull(),
  atomId: text("atom_id").notNull(),
  amount: text("amount").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertAtomSchema = createInsertSchema(atoms).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  timestamp: true,
});

export const insertContractEventSchema = createInsertSchema(contractEvents).omit({
  id: true,
  timestamp: true,
});

export const insertStakingPositionSchema = createInsertSchema(stakingPositions).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertAtom = z.infer<typeof insertAtomSchema>;
export type Atom = typeof atoms.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertContractEvent = z.infer<typeof insertContractEventSchema>;
export type ContractEvent = typeof contractEvents.$inferSelect;
export type InsertStakingPosition = z.infer<typeof insertStakingPositionSchema>;
export type StakingPosition = typeof stakingPositions.$inferSelect;
