import { CheckIcon } from "lucide-react";

export default function CheckedItem({ bgColor, text }) {
    return (
        <div>
            <div className="flex items-center space-x-6">
                <div style={{ background: `${bgColor}` }} className="rounded-xl p-1.5">
                    <CheckIcon className="h-8 text-white" />
                </div>
                <p>{text}</p>
            </div>
        </div>
    );
}