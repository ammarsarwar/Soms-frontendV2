import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const ApplicationPage = ({}) => {
  return (
    <div className="flex flex-col w-full h-screen bg-[#f0f9ff]">
      <div className="flex justify-center mt-8 items-center">
        <Image src="/Logo.svg" height={150} width={150} alt="soms" />
      </div>
      <div className="flex justify-center w-full items-center h-screen">
        <Card className="w-[70%] lg:w-[60%]">
          <CardHeader>
            <CardTitle>Al fursan admission applications</CardTitle>
            <CardDescription>
              Enter correct information to submit your application
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] mb-8 overflow-scroll no-scrollbar cursor-pointer">
            <div>
              <p className="text-muted-foreground">
                Greetings, prospective parents and students! We are thrilled to
                announce that the admission application process for the upcoming
                academic year at Al fursan is now open.
              </p>
            </div>
            <div className="mt-2">
              <p className="text-sxl font-bold tracking-tight">
                About Al Fursan:
              </p>
              <p className="text-muted-foreground">
                At Al Fursan, we pride ourselves on fostering a dynamic learning
                environment that goes beyond traditional education. Our
                dedicated faculty, state-of-the-art facilities, and innovative
                curriculum create a holistic educational experience. From
                encouraging creativity to instilling a sense of responsibility,
                Our school is committed to nurturing well-rounded individuals
                who are prepared to face the challenges of the future.
              </p>
            </div>
            <div className="mt-2">
              <p className="text-sxl font-bold tracking-tight">
                Admission Deadlines:
              </p>
              <p className="text-muted-foreground">
                We understand the importance of making informed decisions about
                your child&apos;s education. To ensure a smooth application
                process, please take note of our admission deadlines. Early
                applications not only demonstrate your enthusiasm but also
                provide ample time for our admissions team to carefully review
                each submission. Don&apos;t miss the opportunity to join the Al
                fursan family <br />
                <span className="font-bold">
                  Admission Deadline: 11-02-2024
                </span>
              </p>
            </div>
            <div className="mt-2">
              <p className="text-sxl font-bold tracking-tight">How to Apply:</p>
              <p className="text-muted-foreground">
                The application process at Al fursan is straightforward and
                designed to be accessible to all prospective students. Please
                fill in the applcation form and provide all correct information.
                We encourage you to reach out to our admissions team if you have
                any questions or need assistance throughout the application
                process.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Link
              href="/application/new"
              className={cn(buttonVariants({ variant: "default" }))}
            >
              Start Application
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationPage;
