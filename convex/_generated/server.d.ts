/* eslint-disable */
/**
 * Generated server types (stub for development)
 * These will be replaced when running `npx convex dev`
 */

import type { Id, Doc } from "./dataModel";

export type QueryCtx = {
  db: {
    get<TableName extends string>(id: Id<TableName>): Promise<Doc<TableName> | null>;
    query<TableName extends string>(tableName: TableName): {
      withIndex(indexName: string, indexRange: (q: any) => any): {
        first(): Promise<Doc<TableName> | null>;
        order(order: "asc" | "desc"): {
          collect(): Promise<Doc<TableName>[]>;
        };
        collect(): Promise<Doc<TableName>[]>;
      };
      order(order: "asc" | "desc"): {
        collect(): Promise<Doc<TableName>[]>;
      };
      collect(): Promise<Doc<TableName>[]>;
    };
  };
};

export type MutationCtx = QueryCtx & {
  db: QueryCtx["db"] & {
    insert<TableName extends string>(tableName: TableName, doc: Omit<Doc<TableName>, "_id" | "_creationTime">): Promise<Id<TableName>>;
    patch<TableName extends string>(id: Id<TableName>, patch: Partial<Doc<TableName>>): Promise<void>;
    delete(id: Id<string>): Promise<void>;
  };
};

export type ActionCtx = {
  runQuery<Args, Returns>(fn: any, args: Args): Promise<Returns>;
  runMutation<Args, Returns>(fn: any, args: Args): Promise<Returns>;
};

export function query<Args, Returns>(options: {
  args: Args;
  handler: (ctx: QueryCtx, args: any) => Promise<Returns>;
}): any;

export function mutation<Args, Returns>(options: {
  args: Args;
  handler: (ctx: MutationCtx, args: any) => Promise<Returns>;
}): any;

export function action<Args, Returns>(options: {
  args: Args;
  handler: (ctx: ActionCtx, args: any) => Promise<Returns>;
}): any;
