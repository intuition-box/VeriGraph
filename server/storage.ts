import { 
  type User, 
  type InsertUser,
  type Atom,
  type InsertAtom,
  type Transaction,
  type InsertTransaction,
  type ContractEvent,
  type InsertContractEvent,
  type StakingPosition,
  type InsertStakingPosition
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Atom methods
  getAtoms(): Promise<Atom[]>;
  getAtom(id: string): Promise<Atom | undefined>;
  getAtomByAtomId(atomId: string): Promise<Atom | undefined>;
  createAtom(atom: InsertAtom): Promise<Atom>;
  updateAtom(id: string, updates: Partial<Atom>): Promise<Atom | undefined>;
  
  // Transaction methods
  getTransactions(): Promise<Transaction[]>;
  getTransaction(hash: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(hash: string, updates: Partial<Transaction>): Promise<Transaction | undefined>;
  
  // Contract event methods
  getContractEvents(): Promise<ContractEvent[]>;
  createContractEvent(event: InsertContractEvent): Promise<ContractEvent>;
  
  // Staking position methods
  getStakingPositions(): Promise<StakingPosition[]>;
  getStakingPositionsByUser(userAddress: string): Promise<StakingPosition[]>;
  getStakingPositionsByAtom(atomId: string): Promise<StakingPosition[]>;
  createStakingPosition(position: InsertStakingPosition): Promise<StakingPosition>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private atoms: Map<string, Atom>;
  private transactions: Map<string, Transaction>;
  private contractEvents: Map<string, ContractEvent>;
  private stakingPositions: Map<string, StakingPosition>;

  constructor() {
    this.users = new Map();
    this.atoms = new Map();
    this.transactions = new Map();
    this.contractEvents = new Map();
    this.stakingPositions = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Atom methods
  async getAtoms(): Promise<Atom[]> {
    return Array.from(this.atoms.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getAtom(id: string): Promise<Atom | undefined> {
    return this.atoms.get(id);
  }

  async getAtomByAtomId(atomId: string): Promise<Atom | undefined> {
    return Array.from(this.atoms.values()).find(atom => atom.atomId === atomId);
  }

  async createAtom(insertAtom: InsertAtom): Promise<Atom> {
    const id = randomUUID();
    const atom: Atom = { 
      ...insertAtom, 
      id,
      createdAt: new Date(),
      totalStake: insertAtom.totalStake || "0",
      stakeholderCount: insertAtom.stakeholderCount || "0"
    };
    this.atoms.set(id, atom);
    return atom;
  }

  async updateAtom(id: string, updates: Partial<Atom>): Promise<Atom | undefined> {
    const atom = this.atoms.get(id);
    if (!atom) return undefined;
    
    const updatedAtom = { ...atom, ...updates };
    this.atoms.set(id, updatedAtom);
    return updatedAtom;
  }

  // Transaction methods
  async getTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).sort((a, b) => 
      new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
    );
  }

  async getTransaction(hash: string): Promise<Transaction | undefined> {
    return this.transactions.get(hash);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = { 
      ...insertTransaction, 
      id,
      timestamp: new Date()
    };
    this.transactions.set(transaction.hash, transaction);
    return transaction;
  }

  async updateTransaction(hash: string, updates: Partial<Transaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(hash);
    if (!transaction) return undefined;
    
    const updatedTransaction = { ...transaction, ...updates };
    this.transactions.set(hash, updatedTransaction);
    return updatedTransaction;
  }

  // Contract event methods
  async getContractEvents(): Promise<ContractEvent[]> {
    return Array.from(this.contractEvents.values()).sort((a, b) => 
      new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
    );
  }

  async createContractEvent(insertEvent: InsertContractEvent): Promise<ContractEvent> {
    const id = randomUUID();
    const event: ContractEvent = { 
      ...insertEvent, 
      id,
      timestamp: new Date()
    };
    this.contractEvents.set(id, event);
    return event;
  }

  // Staking position methods
  async getStakingPositions(): Promise<StakingPosition[]> {
    return Array.from(this.stakingPositions.values()).sort((a, b) => 
      new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
    );
  }

  async getStakingPositionsByUser(userAddress: string): Promise<StakingPosition[]> {
    return Array.from(this.stakingPositions.values())
      .filter(position => position.userAddress.toLowerCase() === userAddress.toLowerCase())
      .sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
  }

  async getStakingPositionsByAtom(atomId: string): Promise<StakingPosition[]> {
    return Array.from(this.stakingPositions.values())
      .filter(position => position.atomId === atomId)
      .sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
  }

  async createStakingPosition(insertPosition: InsertStakingPosition): Promise<StakingPosition> {
    const id = randomUUID();
    const position: StakingPosition = { 
      ...insertPosition, 
      id,
      timestamp: new Date()
    };
    this.stakingPositions.set(id, position);
    return position;
  }
}

export const storage = new MemStorage();
