export const BaseButton = ({ className = "", ...props }) => {
  const baseStyle = `${className} cursor-pointer py-[0.5rem] px-[2rem] border-none font-bold  rounded-[0.4rem] text-[1rem] uppercase mt-3`;
  return <button className={baseStyle} {...props} />;
};
