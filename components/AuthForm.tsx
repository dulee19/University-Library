"use client"

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod"
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm, UseFormReturn } from "react-hook-form"
import { ZodType } from "zod"
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import FileUpload from "./FileUpload";
import { toast } from "sonner";

interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({ type, schema, defaultValues, onSubmit }: Props<T>) => {
    const isSignIn = type === "SIGN_IN";

    const form: UseFormReturn<T> = useForm({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        resolver: zodResolver(schema),
        defaultValues: defaultValues as DefaultValues<T>
    })

    const router = useRouter();

    const handleSubmit: SubmitHandler<T> = async (data) => {
        const result = await onSubmit(data);

        if(result.success) {
            toast(
                isSignIn
                ? "You have successfully signed in."
                : "You have successfully signed up."
            );
            router.push('/');
        } else {
            toast(
                `Error ${isSignIn ? 'signing-in': 'signing-up'}`
            )
        }
    }

  return (
    <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-white">
            {isSignIn ? "Welcome back to BookWise" : "Create your library"}
        </h1>

        <p className="text-light-100">
            {isSignIn
                ? "Access the vast collection of resources, and stay updated"
                : "Please complete all fields and upload a valid university ID to gain access to the library"
            }
        </p>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full space-y-6">
                {Object.keys(defaultValues).map((field) => (
                    <FormField 
                        key={field}
                        control={form.control}
                        name={field as Path<T>}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="capitalize">
                                    {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                                </FormLabel>
                                <FormControl>
                                    {field.name === "universityCard" ? (
                                        <FileUpload
                                            type="image"
                                            accept="image/*"
                                            placeholder="Upload your ID"
                                            folder="ids"
                                            variant="dark"
                                            onFileChange={field.onChange}
                                        />
                                    ) : (
                                        <Input type={FIELD_TYPES[field.name as keyof typeof FIELD_TYPES]} className="form-input" {...field} />
                                    )}
                                </FormControl>
                            </FormItem>
                        )}
                    />
                ))}

                <Button type="submit" className="form-btn">
                    {isSignIn ? "Sign In" : "Sign Up"}
                </Button>
            </form>

        </Form>

        <p className="text-center text-base font-medium">
            {isSignIn ? "New to BookWise?" : "Already have an account? "}

            <Link href={isSignIn ? "/sign-up" : "/sign-in"}>
                {isSignIn ? " Create an account": "Sign In"}
            </Link>
        </p>
    </div>
    
  )
}

export default AuthForm