# Overview

This is a full-stack blockchain application for managing "atoms" (identities) on the Intuition protocol. The application provides a Web3 dashboard where users can connect their MetaMask wallets, create atoms, stake on atoms, and track blockchain transactions. It combines a modern React frontend with an Express.js backend and integrates with smart contracts for decentralized identity management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built with **React 18** using **Vite** as the build tool and bundler. The architecture follows a component-based pattern with:

- **Routing**: Uses `wouter` for client-side routing with minimal configuration
- **State Management**: Relies on React hooks and context for local state, with TanStack Query for server state management
- **UI Framework**: Implements shadcn/ui components built on top of Radix UI primitives and styled with Tailwind CSS
- **Web3 Integration**: Custom hooks (`useWeb3`, `useIntuitionContracts`) manage wallet connections and smart contract interactions using ethers.js
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

## Backend Architecture

The backend uses **Express.js** with TypeScript in ESM mode, featuring:

- **API Structure**: RESTful endpoints for atoms, transactions, contract events, and staking positions
- **Storage Layer**: Abstracted storage interface (`IStorage`) with in-memory implementation (`MemStorage`) for development
- **Data Validation**: Zod schemas for request/response validation and type safety
- **Development Setup**: Vite integration for hot reloading in development mode

## Database Design

The application uses **PostgreSQL** with **Drizzle ORM** for database operations:

- **Schema Definition**: Centralized in `shared/schema.ts` with tables for users, atoms, transactions, contract events, and staking positions
- **Type Safety**: Drizzle-Zod integration generates TypeScript types and validation schemas
- **Migration Strategy**: Drizzle Kit handles schema migrations with PostgreSQL dialect

## Smart Contract Integration

The application interacts with Intuition protocol smart contracts:

- **Contract Abstraction**: `ContractService` class manages interactions with EthMultiVault and AtomWallet contracts
- **Web3 Service**: Handles wallet connections, network switching, and transaction management
- **Event Processing**: Tracks and stores contract events for transaction history and analytics

## Authentication & Security

Currently implements basic wallet-based authentication:

- **Wallet Connection**: MetaMask integration for user identification
- **Network Validation**: Ensures users are connected to supported networks (Intuition testnet)
- **Transaction Signing**: All blockchain interactions require wallet signature approval

# External Dependencies

## Blockchain Infrastructure

- **Neon Database**: PostgreSQL database hosting (@neondatabase/serverless)
- **Intuition Protocol**: Smart contracts for decentralized identity management
- **MetaMask**: Primary wallet provider for user authentication and transaction signing
- **Ethers.js**: Ethereum interaction library for contract calls and transaction management

## UI and Styling

- **Radix UI**: Headless component primitives for accessibility-compliant UI elements
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Lucide React**: Icon library for consistent iconography
- **shadcn/ui**: Pre-built component system combining Radix and Tailwind

## Data Management

- **TanStack Query**: Server state management with caching, background updates, and error handling
- **React Hook Form**: Form state management with performance optimization
- **Zod**: Schema validation for type-safe data handling
- **date-fns**: Date manipulation and formatting utilities

## Development Tools

- **Vite**: Fast build tool and development server with HMR
- **TypeScript**: Static type checking across the entire application
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Integration**: Development environment plugins for live coding