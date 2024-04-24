"use client";

type ParamsProps = {
  params: {};
  searchParams: {
    error: string;
  };
};

function page({ searchParams }: ParamsProps) {
  console.log(searchParams);
  return (
    <div>
      <div>Opps! something went wrong!</div>
      <p>{searchParams.error}</p>
    </div>
  );
}

export default page;
