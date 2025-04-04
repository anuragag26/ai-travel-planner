"use server";

import { formSchema } from "./schemas";
import { z } from "zod";
import { db } from "../db/drizzle";
import { plans } from "../db/schema";

export async function generateTripPlan(formData: z.infer<typeof formSchema>) {
    const { startDate, endDate, budget, activities, destination } = formData;

    let prompt = `
    I am planning a trip to ${destination} from ${startDate} to ${endDate} with a budget of ${budget}.

    I want to do the following activities: ${activities.join(", ")}.

    The result should be an HTML list of days with the activities for each day. Please format the result as HTML.

    Only show the day wise Itenaries while keeping budget in mind.

    Keep the text of each day bold to keep them seprate from other content.

    `;

    if (destination) {
        prompt += `I want to go ${destination}.`;
    }

    

    // prompt += "Give me Day wise itenaries for my trip.";
    // prompt += "Give the Price for each iternary and keep the budget in mind.";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o-mini",
        }),
    });

    const data = await response.json();

    // await db.insert(plans).values({
    //     text: data.choices[0].message.content,
    // });

    const [plan] = await db
        .insert(plans)
        .values({
            text: data.choices[0].message.content,
        })
        .returning();

    // console.log(data.choices[0].message.content);

    return plan.id;
}