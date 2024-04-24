import AssessmentComponent from "@/TeacherComponents/grading/assessment/assessment-component";

const CreateAssessmentPage = async () => {
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Assessments</h2>
            <p className="text-muted-foreground">
              Here you can create, view and edit student.
            </p>
          </div>
        </div>
        <div>
          <AssessmentComponent />
        </div>
      </div>
    </>
  );
};

export default CreateAssessmentPage;
