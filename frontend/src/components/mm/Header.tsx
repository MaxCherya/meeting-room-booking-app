import GeneralInput from "@/components/ui/inputs/GeneralInput";
import GeneralButton from "@/components/ui/bnts/GeneralButton";

interface HeaderProps {
    search: string;
    onSearchChange: (value: string) => void;
    onAdd: () => void;
}

export default function Header({ search, onSearchChange, onAdd }: HeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between align-middle gap-4 mb-6">
            {/* Search */}
            <div className="flex-1">
                <GeneralInput
                    id="search"
                    label=""
                    type="search"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="mb-0"
                    debounceDelay={300}
                />
            </div>

            {/* Add button */}
            <div className="sm:w-auto">
                <GeneralButton onClick={onAdd} className="w-full sm:w-auto">
                    + Add Room
                </GeneralButton>
            </div>
        </div>
    );
}