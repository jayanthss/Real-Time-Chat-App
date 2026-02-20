import PrimaryButton from "../components/Button/PrimaryButton";
import IconButton from "../components/Button/IconButton";

const Buttonmap = {
  primary: PrimaryButton,
  icon:IconButton
};

export default function Buttonfactory({variant = "primary",...props}) {
  const Compoment = Buttonmap[variant]
  return <Compoment {...props}/>
}
