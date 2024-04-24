import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { TAssessemntInfoSchema } from "@/schemas";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";

import { toast } from "sonner";
interface AssessmentDetailsDialogProps {
  editOpen: boolean;
  setEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  assessment: TAssessemntInfoSchema | null;
  grade: number | undefined;
}

interface AssessmentFormData {
  name: string;
  total_marks: string;
  weightage: string;
}

const AssessmentDetailsDialog: React.FC<AssessmentDetailsDialogProps> = ({
  editOpen,
  setEditOpen,
  assessment,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isLoading, errors },
  } = useForm<AssessmentFormData>({
    defaultValues: {
      name: assessment?.name,
      total_marks: assessment?.total_marks,
      weightage: assessment?.weightage,
    },
  });

  const onSubmit = (data: AssessmentFormData) => {
    console.log(data);
    // Implement the update logic here
    toast.success("Assessment updated");
    // setEditOpen(false); // Close the dialog
  };

  if (!assessment) return null;

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assessment Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div>
              <Label>Name</Label>
              <Input {...register("name")} value={assessment.name} />{" "}
              {/* No need for value prop here */}
            </div>
            <div>
              <Label>Total Marks</Label>
              <Input
                {...register("total_marks")}
                value={assessment.total_marks}
              />{" "}
              {/* No need for value prop here */}
            </div>
            <div>
              <Label>Weightage</Label>
              <Input
                {...register("weightage")}
                value={assessment.weightage}
              />{" "}
              {/* No need for value prop here */}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setEditOpen(false)}>
              Close
            </Button>
            <Button type="submit" disabled={isLoading || isSubmitting}>
              {isLoading ||
                (isSubmitting && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ))}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default AssessmentDetailsDialog;

// import React from "react";
// import { useForm } from "react-hook-form";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { TAssessemntInfoSchema } from "@/schemas";
// import { toast } from "sonner";
// import { updateAssessment } from "@/server/grading/assessment/action";
// import { useAttendenceStore } from "@/GlobalStore/attendenceStore";

// interface AssessmentDetailsDialogProps {
//   editOpen: boolean;
//   setEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   assessment: TAssessemntInfoSchema | null;
//   grade: number | undefined;
// }

// const AssessmentDetailsDialog: React.FC<AssessmentDetailsDialogProps> = ({
//   editOpen,
//   setEditOpen,
//   assessment,
//   grade,
// }) => {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm<TAssessemntInfoSchema>({
//     defaultValues: {
//       ...assessment,
//     },
//   });

//   const { setIsAssessmentRefetched } = useAttendenceStore();

//   const onSubmit = async (data: TAssessemntInfoSchema) => {
//     if (!assessment) return;

//     const response = await updateAssessment(assessment.id, data);
//     if (response.success) {
//       toast.success("Assessment updated successfully");
//       setIsAssessmentRefetched(true);
//       setEditOpen(false);
//     } else {
//       toast.error("Error updating assessment");
//     }
//   };

//   return (
//     <Dialog open={editOpen} onOpenChange={setEditOpen}>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Edit Assessment</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4 p-4">
//             <div>
//               <Label htmlFor="name">Name</Label>
//               <Input
//                 id="name"
//                 type="text"
//                 {...register("name", { required: "This field is required" })}
//                 disabled={isSubmitting}
//               />
//               {errors.name && <span>{errors.name.message}</span>}
//             </div>
//             <div>
//               <Label htmlFor="total_marks">Total Marks</Label>
//               <Input
//                 id="total_marks"
//                 type="text"
//                 {...register("total_marks", {
//                   required: "This field is required",
//                 })}
//                 disabled={isSubmitting}
//               />
//               {errors.total_marks && <span>{errors.total_marks.message}</span>}
//             </div>
//             <div>
//               <Label htmlFor="weightage">Weightage</Label>
//               <Input
//                 id="weightage"
//                 type="text"
//                 {...register("weightage", {
//                   required: "This field is required",
//                 })}
//                 disabled={isSubmitting}
//               />
//               {errors.weightage && <span>{errors.weightage.message}</span>}
//             </div>
//             <div>
//               <Label htmlFor="description">Description</Label>
//               <Input
//                 id="description"
//                 type="text"
//                 {...register("description")}
//                 disabled={isSubmitting}
//               />
//               {errors.description && <span>{errors.description.message}</span>}
//             </div>
//           </div>
//           <DialogFooter>
//             <Button
//               type="button"
//               onClick={() => setEditOpen(false)}
//               disabled={isSubmitting}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting ? "Updating..." : "Update"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </form>
//     </Dialog>
//   );
// };
