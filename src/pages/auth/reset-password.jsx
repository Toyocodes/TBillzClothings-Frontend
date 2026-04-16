import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { resetPassword } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

const initialState = {
  password: "",
};

const resetControls = [
  {
    name: "password",
    label: "New Password",
    placeholder: "Enter new password",
    type: "password",
    componentType: "input",
  },
];

function ResetPassword() {
  const { token } = useParams();
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function onSubmit(e) {
    e.preventDefault();

    dispatch(resetPassword({ token, password: formData.password })).then(
      (data) => {
        if (data?.payload?.success) {
          toast({
            title: data.payload.message,
          });
          navigate("/auth/login");
        } else {
          toast({
            title: data.payload.message,
            variant: "destructive",
          });
        }
      }
    );
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Reset Password</h1>
      </div>

      <CommonForm
        formControls={resetControls}
        buttonText={"Reset Password"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default ResetPassword;