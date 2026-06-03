const ButtonComponent = ({ titleName, ...props }) => {
  return <button {...props}>{titleName}</button>;
};
export default ButtonComponent;
