/* eslint-disable react/prop-types */
import { Loader2 } from "lucide-react";

function Spinner({ className = "h-4 w-4" }) {
  return <Loader2 className={`animate-spin ${className}`} />;
}

export default Spinner;
