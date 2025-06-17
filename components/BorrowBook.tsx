"use client"

import Image from "next/image"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { borrowBook } from "@/lib/actions/book";

interface Props {
    userId: string;
    bookId: string;
    borrowingEligibility: {
        isEligible: boolean;
        message: string;
    }
}

const BorrowBook = ({ userId, bookId, borrowingEligibility: { isEligible } }: Props) => {
    const router = useRouter();
    const [borrowing, setBorrowing] = useState<boolean>(false);

    const handleBorrowBook = async () => {
        if (!isEligible) {
            toast('Error');
        }

        setBorrowing(true);

        try {
            const result = await borrowBook({ bookId, userId });

            if (result.success) {
                toast('Book borrowed successfully');

                router.push("/my-profile");
            } else {
                toast('Error, book is already borrowed.');
            }

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
            toast("An error occurred while borrowing the book");
        } finally {
            setBorrowing(false);
        }
    }

  return (
    <Button className="book-overview_btn" onClick={handleBorrowBook} disabled={borrowing}>
        <Image 
            src="/icons/book.svg"
            alt="Book"
            width={20}
            height={20}
        />
        <p className="font-bebas-neue text-xl text-dark-100">
            {borrowing ? "Borrowing ..." : "Borrow Book"}
        </p>
    </Button>
  )
}

export default BorrowBook