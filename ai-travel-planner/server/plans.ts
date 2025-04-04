import { db } from "@/db/drizzle";
import { plans } from "@/db/schema";
import { eq } from "drizzle-orm";



export async function getPlan(id: string) {
    try {
        const [plan] =  await db.select().from(plans).where(eq(plans.id, id));
        return plan;
    } catch (error) {
        console.error(error);
        throw error;
    }
}