import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Destination } from "@shared/schema";

const searchFormSchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  checkIn: z.date({
    required_error: "Check-in date is required",
  }),
  checkOut: z.date({
    required_error: "Check-out date is required",
  }),
  travelers: z.string().min(1, "Number of travelers is required"),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

interface SearchFormProps {
  className?: string;
  variant?: "hero" | "compact";
}

export function SearchForm({ className, variant = "hero" }: SearchFormProps) {
  const [, setLocation] = useLocation();
  const [destinations, setDestinations] = useState<Destination[]>([]);

  // Fetch destinations from API
  useEffect(() => {
    fetch('/api/destinations')
      .then(response => response.json())
      .then(data => setDestinations(data))
      .catch(error => console.error('Error fetching destinations:', error));
  }, []);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      destination: "",
      travelers: "2 Adults",
    },
  });

  function onSubmit(data: SearchFormValues) {
    // In a real application, this would use the search parameters
    // For now, we'll just navigate to the destinations page
    setLocation("/destinations");
  }

  const isCompact = variant === "compact";

  return (
    <div className={cn(
      "bg-white rounded-lg shadow-lg p-2 md:p-6 w-full max-w-5xl mx-auto",
      className
    )}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={cn(
          isCompact ? "flex flex-wrap items-end gap-2" : "flex flex-row flex-wrap items-end gap-1 md:gap-2"
        )}>
          <div className={cn(
            "flex flex-row flex-wrap gap-1 md:gap-4",
            isCompact ? "md:grid-cols-5 w-full" : "w-full md:grid md:grid-cols-4"
          )}>
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem className={isCompact ? "md:col-span-2" : "w-full md:w-auto flex-1 min-w-[100px]"}>
                  <FormLabel className={cn(
                    "text-neutral-600 font-medium text-xs md:text-sm",
                    isCompact && "text-xs"
                  )}>
                    Destination
                  </FormLabel>
                  <FormControl>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full h-8 md:h-10 text-sm text-neutral-800">
                        <SelectValue placeholder="Where to?" className="text-neutral-800" />
                      </SelectTrigger>
                      <SelectContent className="text-neutral-800">
                        {destinations.map((destination) => (
                          <SelectItem 
                            key={destination.id} 
                            value={destination.name}
                            className="text-neutral-800"
                          >
                            {destination.name}, {destination.country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="checkIn"
              render={({ field }) => (
                <FormItem className="w-[120px] md:w-auto">
                  <FormLabel className={cn(
                    "text-neutral-600 font-medium text-xs md:text-sm",
                    isCompact && "text-xs"
                  )}>
                    Check-in
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-2 text-left font-normal h-8 md:h-10 text-xs md:text-sm text-neutral-800",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 text-neutral-800" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="text-neutral-800"
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="checkOut"
              render={({ field }) => (
                <FormItem className="w-[120px] md:w-auto">
                  <FormLabel className={cn(
                    "text-neutral-600 font-medium text-xs md:text-sm",
                    isCompact && "text-xs"
                  )}>
                    Check-out
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-2 text-left font-normal h-8 md:h-10 text-xs md:text-sm text-neutral-800",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 text-neutral-800" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => 
                          date < (form.getValues().checkIn || new Date())
                        }
                        initialFocus
                        className="text-neutral-800"
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="travelers"
              render={({ field }) => (
                <FormItem className="w-[100px] md:w-auto">
                  <FormLabel className={cn(
                    "text-neutral-600 font-medium text-xs md:text-sm",
                    isCompact && "text-xs"
                  )}>
                    Travelers
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-8 md:h-10 text-xs md:text-sm text-neutral-800">
                        <SelectValue placeholder="Select" className="text-neutral-800" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="text-neutral-800">
                      <SelectItem value="1 Adult" className="text-neutral-800">1 Adult</SelectItem>
                      <SelectItem value="2 Adults" className="text-neutral-800">2 Adults</SelectItem>
                      <SelectItem value="2 Adults, 1 Child" className="text-neutral-800">2 Adults, 1 Child</SelectItem>
                      <SelectItem value="2 Adults, 2 Children" className="text-neutral-800">2 Adults, 2 Children</SelectItem>
                      <SelectItem value="Family Pack" className="text-neutral-800">Family Pack</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <Button 
            type="submit" 
            className={cn(
              "flex items-center text-xs md:text-sm",
              isCompact
                ? "py-1 h-8 md:h-10 md:mt-0 mt-1"
                : "px-3 md:px-8 py-2 md:py-3 bg-secondary hover:bg-secondary-dark md:w-auto h-8 md:h-10 ml-1 md:ml-0 md:mx-auto"
            )}
            size="sm"
            variant="secondary"
          >
            <Search className="md:mr-1 h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden md:inline ml-1">Search</span>
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default SearchForm;