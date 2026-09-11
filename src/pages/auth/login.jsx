import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="my-4 flex items-center justify-center">
        <a
          href="/"
          className="flex items-center font-semibold text-muted-foreground transition-colors hover:text-primary"
        >
          <p>Go Back to Home</p>
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2 text-muted-foreground">
          Don&apos;t have an account?
          <Link
            className="ml-2 font-medium text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
      <div className="text-sm text-center">
        <Link
          to="/auth/forgot-password"
          className="font-medium text-primary hover:underline"
        >
          Forgot your password?
        </Link>
      </div>
    </div>
  );
}

export default AuthLogin;
