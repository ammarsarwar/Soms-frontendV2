import { useForm } from "react-hook-form";
import { LessonUpdateSchema, TLessonSchema } from "@/schemas";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Icons } from "../../ui/icons";
import { toast } from "sonner";
import { useTransition } from "react";
import { updateLesson } from "@/server/lessonManagement/lesson/action";

const EditLessonForm = ({
  setOpen,
  lesson,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  lesson: TLessonSchema;
}) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<LessonUpdateSchema>({
    defaultValues: {
      title: lesson.title,
      // max_grade: lesson.max_grade,
    },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isLoading, errors },
  } = form;

  const onSubmit = async (values: LessonUpdateSchema) => {
    startTransition(() => {
      updateLesson(values, lesson.id).then((data) => {
        if (data.success) {
          toast.success(data.success);
          reset();
          setOpen(false);
        } else {
          toast.error(data.error);
        }
      });
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-8 mt-3">
        <div className="grid gap-2">
          <Label htmlFor="first_name">First Name</Label>
          <div className="flex flex-col gap-2">
            <Input
              id="first_name"
              placeholder="Enter the lesson title"
              type="text"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              {...register("title")}
              disabled={isLoading || isSubmitting || isPending}
            />
            {errors.title && (
              <small className="text-red-500 font-bold">
                {errors.title?.message}
              </small>
            )}
          </div>
        </div>
        {/* <div className="grid gap-2">
          <Label htmlFor="last_name">Max Grade</Label>
          <div className="flex flex-col gap-2">
            <Input
              id="last_name"
              placeholder="Enter the max grade"
              type="text"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              {...register("max_grade")}
              disabled={isLoading || isSubmitting || isPending}
            />
            {errors.max_grade && (
              <small className="text-red-500 font-bold">
                {errors.max_grade?.message}
              </small>
            )}
          </div>
        </div> */}
      </div>
      <div className="w-full flex justify-end mt-8">
        <Button disabled={isLoading || isSubmitting} type="submit">
          {isLoading ||
            isPending ||
            (isSubmitting && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ))}
          Update
        </Button>
      </div>
    </form>
  );
};

export default EditLessonForm;
