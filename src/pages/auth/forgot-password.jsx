import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { forgotPassword } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const initialState = {
  email: "",
};

const forgotPasswordControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    type: "email",
    componentType: "input",
  },
];

function ForgotPassword() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const { toast } = useToast();

  function onSubmit(e) {
    e.preventDefault();

    dispatch(forgotPassword(formData.email)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data.payload.message,
        });
      } else {
        toast({
          title: data.payload.message || "Something went wrong",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Forgot Password</h1>
        <p className="mt-2 text-muted-foreground">
          Remember your password?
          <Link to="/auth/login" className="ml-2 font-medium text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>

      <CommonForm
        formControls={forgotPasswordControls}
        buttonText={"Send Reset Link"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}

export default ForgotPassword;