import { auth } from "@clerk/nextjs/server";

export default async function page() {
  const { getToken } = await auth();
  const token = await getToken();
  const header = {
    Authorization: `Bearer ${token}`,
  };

  const resProduct = await fetch("http://localhost:8000/test", {
    headers: header,
  });
  const dataProduct = await resProduct.json();
  console.log(dataProduct);

  const resOrder = await fetch("http://localhost:8001/test", {
    headers: header,
  });
  const dataOrder = await resOrder.json();
  console.log(dataOrder);

  const resPayment = await fetch("http://localhost:8002/test", {
    headers: header,
  });
  const dataPayment = await resPayment.json();
  console.log(dataPayment);
  console.log(token)
  return (
    <div>
      <h1>test</h1>
    </div>
  );
}
