import { Settings, User } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function NavFooter() {
    return (
        <div className="flex flex-col space-y-2 mt-auto">
            <Button variant="ghost" className="w-full justify-start">
                <User className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Perplexity Interviewer</span>
                <span className="sm:hidden">Interviewer</span>
            </Button>
        </div>
    );
}