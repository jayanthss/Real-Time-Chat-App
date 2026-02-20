export default function BaseInput({ type , ...props }) {
  return <input type={type} {...props} />;
}
