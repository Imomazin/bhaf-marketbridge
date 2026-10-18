"use client";

import { useState } from "react";
import { updatePipelineStage } from "@/app/actions/pipeline";

interface MoveStageDropdownProps {
  entrepreneurId: string;
  currentStage: string;
}

export function MoveStageDropdown({ entrepreneurId, currentStage }: MoveStageDropdownProps) {
  const [isPending, setIsPending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const stages = ["SOURCING", "DILIGENCE", "TERM_SHEET", "CLOSED"];

  const handleStageChange = async (newStage: string) => {
    if (newStage === currentStage) return;
    setIsPending(true);
    setIsOpen(false);
    try {
      await updatePipelineStage(entrepreneurId, newStage as any);
    } catch (e) {
      console.error(e);
      alert("Failed to update stage");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-charcoal-600 border border-cream-200 hover:bg-cream-50 transition-colors disabled:opacity-50"
      >
        {isPending ? "Moving..." : "Move"}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 z-10 w-32 rounded-md border border-cream-200 bg-white py-1 shadow-lg">
          {stages.map((stage) => (
            <button
              key={stage}
              onClick={() => handleStageChange(stage)}
              disabled={stage === currentStage}
              className={`block w-full px-3 py-1.5 text-left text-[10px] uppercase tracking-wider ${
                stage === currentStage
                  ? "text-gold-600 bg-cream-50 font-semibold"
                  : "text-charcoal-600 hover:bg-forest-50 hover:text-forest-900"
              }`}
            >
              {stage.replace("_", " ")}
            </button>
          ))}
        </div>
      )}
      
      {/* Click outside backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsOpen(false)} 
        />
      )}
    </div>
  );
}
