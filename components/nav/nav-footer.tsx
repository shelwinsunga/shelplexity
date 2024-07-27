import { Settings, User } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function NavFooter() {
    return (
        <div className="flex flex-col space-y-2 mt-auto">
            <Button variant="ghost" className="w-full justify-start">
                <User className="h-5 w-5 mr-2" />
                <span>Shelwin Sunga</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start">
                <Settings className="h-5 w-5 mr-2" />
                <span>Settings</span>
            </Button>
        </div>
    );
}