import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  occupation: text("occupation").notNull(),
  age: integer("age").notNull(),
  salary: integer("salary").notNull(),
  state: text("state").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const schemes = pgTable("schemes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  benefit: text("benefit").notNull(),
  deadline: text("deadline"),
  eligibility: jsonb("eligibility").notNull(), // Array of strings
  maxIncome: integer("max_income"),
  minAge: integer("min_age"),
  maxAge: integer("max_age"),
  states: jsonb("states"), // Array of applicable states
  occupations: jsonb("occupations"), // Array of applicable occupations
  isActive: boolean("is_active").default(true),
});

export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  schemeId: varchar("scheme_id").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected, under_review
  appliedAt: timestamp("applied_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertSchemeSchema = createInsertSchema(schemes).omit({
  id: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  appliedAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertScheme = z.infer<typeof insertSchemeSchema>;
export type Scheme = typeof schemes.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;

export type ApplicationWithScheme = Application & {
  scheme: Scheme;
};

export type SchemeWithMatch = Scheme & {
  matchPercentage: number;
};
