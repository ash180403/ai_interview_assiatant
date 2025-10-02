// --- IMPORTS ---
// We import necessary tools from React and two libraries for styling.
// `cva` (Class Variance Authority) is a powerful library for creating flexible and reusable component styles.
// `VariantProps` allows us to get the TypeScript types from our `cva` variants.
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

// We import a utility function `cn` from our lib folder, which is used to
// merge Tailwind CSS classes conditionally. It's very useful for component styling.
import { cn } from "../../lib/utils";

// --- STYLING VARIANTS with CVA ---
// This is the core of the component's styling. We define a set of styles
// that the Badge component can have.
const badgeVariants = cva(
  // These are the base classes that apply to ALL badges, no matter the variant.
  // It makes the badge an inline element, adds padding, sets text size, and more.
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    // Here we define the different "variants" the badge can have.
    // For example, you could have a "destructive" variant for errors or an "outline" one.
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    // This sets the default variant to be used if none is specified.
    defaultVariants: {
      variant: "default",
    },
  }
)

// --- COMPONENT PROPS ---
// We define the types for the props our component will accept.
// It extends the standard HTML attributes for a div, and adds our custom `variant` props.
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

// --- BADGE COMPONENT ---
// This is the actual React component.
function Badge({ className, variant, ...props }: BadgeProps) {
  // It returns a div that uses the `cn` utility to merge:
  // 1. The styles from `badgeVariants` based on the chosen `variant`.
  // 2. Any additional classes passed in via the `className` prop.
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

// --- EXPORTS ---
// We export the component and the variants so they can be used elsewhere in our app.
export { Badge, badgeVariants }
