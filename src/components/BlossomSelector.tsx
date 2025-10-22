import { Check, ChevronsUpDown, Cloud, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { useAppContext } from "@/hooks/useAppContext";

interface BlossomSelectorProps {
  className?: string;
}

export function BlossomSelector(props: BlossomSelectorProps) {
  const { className } = props;
  const { config, updateConfig, presetBlossomServers = [] } = useAppContext();

  const selectedServers = config.blossomServers || "";
  const setSelectedServers = (servers: string) => {
    updateConfig((current) => ({ ...current, blossomServers: servers }));
  };

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Get list of currently selected servers
  const selectedServerList = selectedServers
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  // Find matching preset for display
  const getDisplayName = () => {
    if (selectedServerList.length === 0) {
      return "Select servers...";
    }

    if (selectedServerList.length === 1) {
      const match = presetBlossomServers.find(p => p.url === selectedServerList[0]);
      return match ? match.name : selectedServerList[0].replace(/^https?:\/\//, '');
    }

    return `${selectedServerList.length} servers`;
  };

  // Function to normalize Blossom URL by adding https:// if no protocol is present
  const normalizeBlossomUrl = (url: string): string => {
    const trimmed = url.trim();
    if (!trimmed) return trimmed;

    // Check if it already has a protocol
    if (trimmed.includes('://')) {
      return trimmed;
    }

    // Add https:// prefix
    return `https://${trimmed}`;
  };

  // Handle selecting a preset or custom server
  const handleSelectServer = (url: string) => {
    const normalized = normalizeBlossomUrl(url);

    // Check if already selected
    if (selectedServerList.includes(normalized)) {
      // Remove it (toggle off)
      const newList = selectedServerList.filter(s => s !== normalized);
      setSelectedServers(newList.join(','));
    } else {
      // Add it
      const newList = [...selectedServerList, normalized];
      setSelectedServers(newList.join(','));
    }
  };

  // Handle adding a custom server
  const handleAddCustomServer = (url: string) => {
    const normalized = normalizeBlossomUrl(url);
    if (!selectedServerList.includes(normalized)) {
      const newList = [...selectedServerList, normalized];
      setSelectedServers(newList.join(','));
    }
    setInputValue("");
  };

  // Handle setting to use all preset servers
  const handleUseAllServers = () => {
    const allUrls = presetBlossomServers.map(p => p.url).join(',');
    setSelectedServers(allUrls);
    setOpen(false);
  };

  // Check if input value looks like a valid Blossom URL
  const isValidBlossomInput = (value: string): boolean => {
    const trimmed = value.trim();
    if (!trimmed) return false;

    // Basic validation - should contain at least a domain-like structure
    const normalized = normalizeBlossomUrl(trimmed);
    try {
      new URL(normalized);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
        >
          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            <span className="truncate">
              {getDisplayName()}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder="Search servers or type URL..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty>
              {inputValue && isValidBlossomInput(inputValue) ? (
                <CommandItem
                  onSelect={() => handleAddCustomServer(inputValue)}
                  className="cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="font-medium">Add custom server</span>
                    <span className="text-xs text-muted-foreground">
                      {normalizeBlossomUrl(inputValue)}
                    </span>
                  </div>
                </CommandItem>
              ) : (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  {inputValue ? "Invalid server URL" : "No server found."}
                </div>
              )}
            </CommandEmpty>
            <CommandGroup heading="Quick Actions">
              <CommandItem
                onSelect={handleUseAllServers}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedServerList.length === presetBlossomServers.length ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span className="font-medium">Use all servers</span>
                  <span className="text-xs text-muted-foreground">
                    Maximum redundancy
                  </span>
                </div>
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Blossom Servers">
              {presetBlossomServers
                .filter((option) =>
                  !inputValue ||
                  option.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                  option.url.toLowerCase().includes(inputValue.toLowerCase())
                )
                .map((option) => (
                  <CommandItem
                    key={option.url}
                    value={option.url}
                    onSelect={() => {
                      handleSelectServer(option.url);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedServerList.includes(option.url) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{option.name}</span>
                      <span className="text-xs text-muted-foreground">{option.url}</span>
                    </div>
                  </CommandItem>
                ))}
              {inputValue && isValidBlossomInput(inputValue) && (
                <CommandItem
                  onSelect={() => handleAddCustomServer(inputValue)}
                  className="cursor-pointer border-t"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="font-medium">Add custom server</span>
                    <span className="text-xs text-muted-foreground">
                      {normalizeBlossomUrl(inputValue)}
                    </span>
                  </div>
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
