import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/auth";
import BookList from "@/components/BookList";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import { books, borrowRecords } from "@/database/schema";

const MyProfile = async () => {
   const session = await auth();

    const borrowedBooks = await db
    .select({
      borrowId: borrowRecords.id,
      status: borrowRecords.status,
      borrowDate: borrowRecords.borrowDate,
      dueDate: borrowRecords.dueDate,
      returnDate: borrowRecords.returnDate,
      id: books.id,
      bookId: books.id,
      title: books.title,
      author: books.author,
      genre: books.genre,
      rating: books.rating,
      coverUrl: books.coverUrl,
      coverColor: books.coverColor,
    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    .where(eq(borrowRecords.userId, session?.user?.id))
    .orderBy(borrowRecords.borrowDate)
    .limit(10);


  return (
    <>
      <form
        action={async () => {
          "use server";

          await signOut();
        }}
        className="mb-10"
      >
        <Button>Logout</Button>
      </form>

      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-expect-error */}
      <BookList title="Borrowed Books" books={borrowedBooks} />
    </>
  );
};
export default MyProfile;