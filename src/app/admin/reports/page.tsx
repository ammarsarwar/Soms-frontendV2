import GeneratePdfComponent from "@/components/reports/generate-pdf-component";

const ReportsPage = async () => {
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
            <p className="text-muted-foreground">
              Here&apos;s you can generate reports based on terms, years for
              students!
            </p>
          </div>
        </div>
        <div className="mb-12">
          <GeneratePdfComponent />
          {/* <PDFViewer width="100%" height="500">
            <GeneratePdfComponent />
          </PDFViewer> */}
        </div>
      </div>
    </>
  );
};

export default ReportsPage;
