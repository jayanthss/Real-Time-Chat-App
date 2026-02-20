import EmailInput from "../components/Input/EmailInput";
import PasswordInput from "../components/Input/Password";
import TextInput from "../components/Input/TextInput";

const InputMap = {
  email: EmailInput,
  password: PasswordInput,
  text: TextInput,
};

export default function InputFactory({ type = "text", ...props }) {
  const InputComponent = InputMap[type] || TextInput;
  return <>
  <InputComponent {...props} />
  </>
}
