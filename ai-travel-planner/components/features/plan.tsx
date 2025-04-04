import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { h1 } from "motion/react-client";


interface PlanProps {
    plan: {
        id: string;
        text: string;
    }

}


export default function Plan({ plan }: PlanProps) {
    return (
        <div className="flex flex-col gap-10 p-24 w-full items-center justify-center">
            <h1 className="text-4xl font-bold">My Trip Plan</h1>
            <div dangerouslySetInnerHTML={{ __html: plan.text }} />
            <Link href="/travel-planner">
                <Button>Create a new plan</Button>
            </Link>
        </div>
    );
}
