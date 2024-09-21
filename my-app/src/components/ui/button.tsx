import {Slot} from "@radix-ui/react-slot";
import {cva, type VariantProps} from "class-variance-authority";
import * as React from "react";
import {twMerge} from "tailwind-merge";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded text-sm font-semibold leading-tight " +
  "ring-offset-white transition-colors focus-visible:outline-none border border-primary duration-300 " +
  "disabled:border-gray disabled:bg-gray disabled:text-light disabled:text-opacity-40 disabled:pointer-events-none" +
  " outline-none",
  {
    variants: {
      variant: {
        default: "bg-primary hover:bg-opacity-90 text-light",
        outline:
          "bg-transparent hover:bg-white/5 text-light border-white border-opacity-15",
        "secondary-outline":
          "bg-transparent hover:bg-primary text-primary hover:text-light",
        pagination:
          "border-white border-opacity-10 rounded-sm bg-dust-gray text-light text-opacity-40" +
          " hover:border-primary hover:text-primary hover:text-opacity-100 disabled:bg-dust-gray",
        "pagination-active": "bg-primary text-light",
        "hover-only":
          "bg-transparent hover:bg-primary text-light border-none justify-start",
        "with-nothing": "bg-transparent border-none",
        "input-icon":
          "border-none position absolute top-4 right-4 w-fit h-fit transparent-bg p-2 hover:bg-opacity-20",
      },
      size: {
        default: "w-full h-11 px-4 py-2",
        zero: "p-0 m-0",
        icon: "h-9 w-9 p-0",
        "input-icon": "w-fit h-fit p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({className, variant, size, asChild = false, ...props}, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={twMerge(buttonVariants({variant, size, className}))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export {Button, buttonVariants};
