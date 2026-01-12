/* eslint-disable */
/**
 * Generated data model types (stub for development)
 * These will be replaced when running `npx convex dev`
 */

export type Id<TableName extends string> = string & { __tableName: TableName };

export type Doc<TableName extends string> = 
  TableName extends "users" ? {
    _id: Id<"users">;
    _creationTime: number;
    email: string;
    name: string;
    passwordHash: string;
    createdAt: number;
  } :
  TableName extends "documents" ? {
    _id: Id<"documents">;
    _creationTime: number;
    userId: Id<"users">;
    title: string;
    content: string;
    createdAt: number;
    updatedAt: number;
  } :
  TableName extends "knowledge" ? {
    _id: Id<"knowledge">;
    _creationTime: number;
    documentId: Id<"documents">;
    title: string;
    content: string;
    createdAt: number;
  } :
  TableName extends "sessions" ? {
    _id: Id<"sessions">;
    _creationTime: number;
    userId: Id<"users">;
    token: string;
    expiresAt: number;
    createdAt: number;
  } :
  never;
