import Link from "next/link";

async function page({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string | undefined }>;
}) {
  const session_id = await (await searchParams).session_id;
  if (!session_id) {
    return <div>No session id</div>;
  }
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/session/${session_id}`,
  );
  const session = await res.json();

  return (
    <div className="">
      {session.payment_status === "paid" && (
        <>
          <h1 className="text-2xl font-bold">Thank you for your order</h1>
          <p className="mt-2">
            Status: <span className="font-bold">{session.status}</span>
          </p>
          <p className="mt-2">
            Payment Status:{" "}
            <span className="text-green-500 font-bold">
              {session.payment_status}
            </span>
          </p>
          <Link
            href="/orders"
            className="mt-4 bg-black text-white py-2 px-4 rounded inline-block"
          >
            Orders
          </Link>
        </>
      )}
      {session.payment_status === "unpaid" && <h1>Your payment is unpaid</h1>}
    </div>
  );
}

export default page;
